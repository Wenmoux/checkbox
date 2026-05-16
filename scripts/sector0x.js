const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

let WebSocketImpl = global.WebSocket;
try {
  WebSocketImpl = require("ws");
} catch (err) {
  if (!WebSocketImpl) throw err;
}

const CONFIG = {
  clientId: "Ve5nscPYbYxiK1kzOXqdf",
  authEndpoint: "https://auth.sector0x.com/",
  resource: "https://aitown.api",
  graphqlUrl: "https://microtown-api.sector0x.com/v1/graphql",
  chatEndpoint: "wss://chat-microtown.sector0x.com",
};

const OPS = {
  getMissionList: `
    query GetMissionList {
      mission_sort(order_by: {sort_order: asc}) {
        mission { id description }
        type
      }
    }
  `,
  getActiveMissions: `
    query GetActiveMissions {
      mission_instance(
        where: {
          _or: [
            {_not: {result: {id: {_is_null: false}}}},
            {result: {finished: {_eq: false}}},
            {result: {claimed_at: {_is_null: true}}}
          ],
          canceled_at: {_is_null: true}
        }
      ) {
        id
        data
        definition { id description sort { type } }
        result { data finished finished_at claimed_at }
      }
    }
  `,
  currentMissionInstanceCount: `
    query CurrentMissionInstanceCount {
      current_mission_instance_count { count }
    }
  `,
  getConfigByKey: `
    query GetConfigByKey($key: String!) {
      config_by_pk(key: $key) { value }
    }
  `,
  claimMissionResultRewards: `
    mutation ClaimMissionResultRewards($id: bpchar!) {
      claim_mission_result_rewards(args: {instance_id: $id}) { claimed_at }
    }
  `,
  getAllMyCharacters: `
    query GetAllMyCharacters {
      user_character(where: {owned: {_eq: true}}, order_by: {updated_at: desc}) {
        id
        reference_id
        description
        private_config: private_config_view
        attributes
      }
    }
  `,
  getCharacterInMission: `
    query getCharacterInMission {
      user_character_in_mission { id }
    }
  `,
  queryUserToken: `
    query QueryUserToken($user_id: String!) {
      user_token_by_pk(user_id: $user_id) { tokens }
    }
  `,
  getMyItems: `
    query getMyItems {
      user_item {
        item_id
        count
        item { description }
      }
    }
  `,
  queryCabinLog: `
    query QueryCabinLog($before: timestamptz!, $id: uuid!, $limit: Int = 1) {
      cabin_log(
        limit: $limit,
        where: {created_at: {_lt: $before}, participants: {character_id: {_eq: $id}}},
        order_by: {created_at: desc}
      ) {
        id
        data
        summary
        created_at
      }
    }
  `,
  listCharacterPinnedMessages: `
    query ListCharacterPinnedMessages($id: uuid!, $limit: Int = 1) {
      user_character_pinned_message(
        limit: $limit,
        order_by: {created_at: desc},
        where: {character_id: {_eq: $id}}
      ) {
        id
        data
        created_at
      }
    }
  `,
};

function cfg() {
  return (global.config && global.config.sector0x) || {};
}

function resolveConfigFile() {
  const ql = process.env.QL_DIR;
  if (ql) {
    const qlConfig = path.join(path.parse(process.cwd()).root, ql, "data", "config", "config.yml");
    if (fs.existsSync(qlConfig)) return qlConfig;
  }
  return path.resolve(process.cwd(), "config.yml");
}

function readTokenFile(required = true) {
  const direct = cfg();
  if (direct.access_token || direct.refresh_token) {
    return {
      access_token: direct.access_token,
      refresh_token: direct.refresh_token,
      id_token: direct.id_token,
      expires_at: direct.expires_at || (direct.access_token ? tokenExpiresAt(direct.access_token) : 0),
    };
  }
  if (!required) return null;
  throw new Error("请在 config.yml 的 sector0x 中填写 access_token 或 refresh_token");
}

function writeTokenFile(data) {
  if (cfg().access_token || cfg().refresh_token) {
    writeTokenConfig(data);
    return;
  }
  writeTokenConfig(data);
}

function yamlValue(value) {
  if (value == null) return "";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return JSON.stringify(String(value));
}

function writeTokenConfig(data) {
  const section = cfg();
  Object.assign(section, data, {
    client_id: CONFIG.clientId,
    resource: CONFIG.resource,
    updated_at: new Date().toISOString(),
  });

  const file = resolveConfigFile();
  if (!fs.existsSync(file)) return;
  const eol = fs.readFileSync(file, "utf8").includes("\r\n") ? "\r\n" : "\n";
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  let start = lines.findIndex((line) => /^sector0x:\s*(?:#.*)?$/.test(line));
  if (start === -1) {
    lines.push("", "sector0x:");
    start = lines.length - 1;
  }
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^\S/.test(lines[i]) && !/^#/.test(lines[i])) {
      end = i;
      break;
    }
  }
  const updates = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    id_token: data.id_token,
    expires_at: data.expires_at,
  };
  const insert = [];
  for (const [key, value] of Object.entries(updates)) {
    if (value == null || value === "") continue;
    const line = `  ${key}: ${yamlValue(value)}`;
    const index = lines.slice(start + 1, end).findIndex((item) => new RegExp(`^\\s+${key}:`).test(item));
    if (index >= 0) lines[start + 1 + index] = line;
    else insert.push(line);
  }
  if (insert.length > 0) lines.splice(end, 0, ...insert);
  fs.writeFileSync(file, lines.join(eol));
}

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function randomString(bytes = 32) {
  return base64Url(crypto.randomBytes(bytes));
}

function decodeJwt(token) {
  const parts = String(token || "").split(".");
  if (parts.length < 2) throw new Error("access_token 不是 JWT 格式");
  return JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
}

function tokenExpiresAt(token, fallbackSeconds = 3600) {
  try {
    const payload = decodeJwt(token);
    if (typeof payload.exp === "number") return payload.exp;
  } catch (err) {
    // fallback below
  }
  return Math.floor(Date.now() / 1000) + fallbackSeconds;
}

async function discoverOidc() {
  const url = new URL("/oidc/.well-known/openid-configuration", CONFIG.authEndpoint);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OIDC discovery 失败：HTTP ${res.status}`);
  return res.json();
}

async function postToken(body) {
  const oidc = await discoverOidc();
  const res = await fetch(oidc.token_endpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    json = { raw: text };
  }
  if (!res.ok) throw new Error(`换取 token 失败：HTTP ${res.status} ${JSON.stringify(json)}`);
  return json;
}

async function refreshTokenIfNeeded(force = false) {
  const token = readTokenFile(true);
  const now = Math.floor(Date.now() / 1000);
  if (!force && token.access_token && token.expires_at && Number(token.expires_at) - 60 > now) {
    return token.access_token;
  }
  if (!token.refresh_token) {
    if (token.access_token && !force) return token.access_token;
    throw new Error("token 已过期且没有 refresh_token，请重新登录后更新 config.yml");
  }
  const refreshed = await postToken({
    client_id: CONFIG.clientId,
    grant_type: "refresh_token",
    refresh_token: token.refresh_token,
    resource: CONFIG.resource,
  });
  const expiresAt = Math.floor(Date.now() / 1000) + Number(refreshed.expires_in || 3600);
  writeTokenFile({
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token || token.refresh_token,
    id_token: refreshed.id_token || token.id_token,
    scope: refreshed.scope,
    expires_at: expiresAt,
  });
  return refreshed.access_token;
}

async function tokenInfo() {
  const before = readTokenFile(true);
  const token = await refreshTokenIfNeeded(false);
  const after = readTokenFile(true);
  const payload = decodeJwt(token);
  const exp = typeof payload.exp === "number" ? payload.exp : (after.expires_at || tokenExpiresAt(token));
  return {
    sub: payload.sub || "",
    refreshed: token !== before.access_token,
    expires_at: new Date(exp * 1000).toISOString(),
  };
}

async function graphQL(query, variables = {}, tokenInput) {
  const token = tokenInput || await refreshTokenIfNeeded(false);
  const res = await fetch(CONFIG.graphqlUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      "Expected-Role": "user",
    },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw new Error(`GraphQL 返回非 JSON：HTTP ${res.status} ${text.slice(0, 200)}`);
  }
  if (!res.ok || json.errors) {
    throw new Error(`GraphQL 失败：HTTP ${res.status} ${JSON.stringify(json.errors || json)}`);
  }
  return json.data;
}

function descriptionName(description) {
  if (!description || typeof description !== "object") return String(description || "");
  return description.name || description.title || description.text || description.caption || JSON.stringify(description);
}

function characterName(character) {
  const d = character && character.description;
  if (d && typeof d === "object") return d.name || d.title || d.nickname || character.id;
  return d || character.id;
}

function finishedAndUnclaimed(mission, now = Date.now()) {
  return Boolean(mission && mission.result && !mission.result.claimed_at && mission.result.finished_at && new Date(mission.result.finished_at).getTime() <= now);
}

function claimableMissions(activeMissions) {
  return (activeMissions || []).filter((mission) => finishedAndUnclaimed(mission));
}

function missionDisplayName(mission) {
  return descriptionName((mission.definition && mission.definition.description) || mission.description);
}

function missionSlotIds(mission) {
  return ((mission && mission.data && mission.data.slots) || []).map((slot) => slot.id || slot);
}

function missionStatus(mission) {
  if (!mission || !mission.result) return "等待结果";
  if (mission.result.claimed_at) return "已领取";
  if (finishedAndUnclaimed(mission)) return "可领取";
  if (mission.result.finished_at) return "进行中";
  return mission.result.finished ? "已完成" : "等待结果";
}

function releasedSlotIds(missions) {
  const ids = new Set();
  for (const mission of missions || []) {
    for (const slot of missionSlotIds(mission)) ids.add(slot);
  }
  return ids;
}

async function getMissionLimit() {
  const data = await graphQL(OPS.getConfigByKey, { key: "public.mission_instance_limit" });
  const n = Number(data.config_by_pk && data.config_by_pk.value);
  return Number.isFinite(n) && n > 0 ? n : 3;
}

async function getMissionState() {
  const [missions, active, count, limit, characters, busy] = await Promise.all([
    graphQL(OPS.getMissionList),
    graphQL(OPS.getActiveMissions),
    graphQL(OPS.currentMissionInstanceCount),
    getMissionLimit(),
    graphQL(OPS.getAllMyCharacters),
    graphQL(OPS.getCharacterInMission),
  ]);
  const used = Number(count.current_mission_instance_count && count.current_mission_instance_count.count || 0);
  const busyIds = new Set((busy.user_character_in_mission || []).map((item) => item.id));
  for (const item of active.mission_instance || []) {
    if (item.result && item.result.claimed_at) {
      for (const slot of missionSlotIds(item)) busyIds.delete(slot);
    }
  }
  return {
    missions: missions.mission_sort || [],
    active: active.mission_instance || [],
    used,
    limit,
    remaining: Math.max(0, limit - used),
    characters: characters.user_character || [],
    busyIds,
    claimableReleasedIds: releasedSlotIds(claimableMissions(active.mission_instance || [])),
  };
}

function resolveMission(missions, selector, index = 0) {
  if (!missions.length) throw new Error("任务列表为空");
  if (!selector) return missions[index % missions.length];
  const s = selector.toLowerCase();
  const found = missions.find((row) => {
    const mission = row.mission || {};
    const name = descriptionName(mission.description).toLowerCase();
    return String(mission.id).toLowerCase() === s || name.includes(s);
  });
  if (!found) throw new Error(`找不到任务：${selector}`);
  return found;
}

function pickSlots(state, manualSlots, count) {
  const needed = Math.max(1, Number(count || 1));
  const releasedIds = state.claimableReleasedIds || new Set();
  const isUnavailable = (id) => state.busyIds.has(id) && !releasedIds.has(id);
  const free = manualSlots && manualSlots.length
    ? manualSlots.filter((id) => !isUnavailable(id))
    : state.characters.filter((item) => !isUnavailable(item.id)).map((item) => item.id);
  if (free.length < needed) throw new Error(`空闲角色不足：需要 ${needed} 个，当前 ${free.length} 个`);
  return free.slice(0, needed);
}

function projectClaimedState(state, claimable) {
  const releasedIds = releasedSlotIds(claimable);
  const busyIds = new Set(state.busyIds);
  for (const id of releasedIds) busyIds.delete(id);
  return {
    ...state,
    busyIds,
    claimableReleasedIds: new Set([...(state.claimableReleasedIds || new Set()), ...releasedIds]),
  };
}

function createMissionPlans(state, options) {
  if (state.remaining <= 0) return [];
  const selectors = String(options.missions || "公园散步,大扫除,面包坊打工").split(",").map((s) => s.trim()).filter(Boolean);
  const manualSlots = options.slots ? String(options.slots).split(",").map((s) => s.trim()).filter(Boolean) : null;
  const slotCount = Math.max(1, Number(options.slot_count || 1));
  const maxCreate = Math.max(0, Math.min(Number(options.limit || 3), state.remaining));
  const plans = [];
  const tempBusyIds = new Set(state.busyIds);
  const tempReleasedIds = new Set(state.claimableReleasedIds || []);

  for (let i = 0; i < maxCreate; i += 1) {
    const row = resolveMission(state.missions, selectors[i % Math.max(selectors.length, 1)], i);
    const mission = row.mission || {};
    const tempState = { ...state, busyIds: tempBusyIds, claimableReleasedIds: tempReleasedIds };
    const slots = pickSlots(tempState, manualSlots, slotCount);
    for (const slot of slots) {
      tempBusyIds.add(slot);
      tempReleasedIds.delete(slot);
    }
    plans.push({ missionId: mission.id, missionName: descriptionName(mission.description), slots });
  }
  return plans;
}

async function claimMissions(missions, dryRun) {
  const claimed = [];
  for (const mission of claimableMissions(missions)) {
    if (!dryRun) await graphQL(OPS.claimMissionResultRewards, { id: mission.id });
    claimed.push({
      id: mission.id,
      name: missionDisplayName(mission),
      slots: missionSlotIds(mission),
      rewards: missionRewardItems(mission),
    });
  }
  return claimed;
}

function encodeVarInt(value) {
  const bytes = [];
  do {
    let encoded = value % 128;
    value = Math.floor(value / 128);
    if (value > 0) encoded |= 128;
    bytes.push(encoded);
  } while (value > 0);
  return Buffer.from(bytes);
}

function decodeVarInt(buffer, offset) {
  let multiplier = 1;
  let value = 0;
  let pos = offset;
  let encoded;
  do {
    if (pos >= buffer.length) throw new Error("MQTT varint 不完整");
    encoded = buffer[pos++];
    value += (encoded & 127) * multiplier;
    multiplier *= 128;
    if (multiplier > 128 * 128 * 128 * 128) throw new Error("MQTT varint 过长");
  } while ((encoded & 128) !== 0);
  return { value, bytes: pos - offset };
}

function utf8(value) {
  const data = Buffer.from(String(value), "utf8");
  const len = Buffer.alloc(2);
  len.writeUInt16BE(data.length, 0);
  return Buffer.concat([len, data]);
}

function binary(value) {
  const data = Buffer.isBuffer(value) ? value : Buffer.from(String(value), "utf8");
  const len = Buffer.alloc(2);
  len.writeUInt16BE(data.length, 0);
  return Buffer.concat([len, data]);
}

function packet(typeAndFlags, variableHeader, payload = Buffer.alloc(0)) {
  const body = Buffer.concat([variableHeader, payload]);
  return Buffer.concat([Buffer.from([typeAndFlags]), encodeVarInt(body.length), body]);
}

function readUtf8(buffer, offset) {
  const len = buffer.readUInt16BE(offset);
  const start = offset + 2;
  return { value: buffer.slice(start, start + len).toString("utf8"), offset: start + len };
}

class MqttRpcClient {
  constructor(chatEndpoint, accessToken) {
    this.url = `${chatEndpoint.replace(/\/+$/, "")}/mqtt`;
    this.accessToken = accessToken;
    this.sub = decodeJwt(accessToken).sub;
    this.packetId = 1;
    this.pendingSubs = new Map();
    this.pendingResponses = new Map();
    this.buffer = Buffer.alloc(0);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocketImpl(this.url, "mqtt");
      const timer = setTimeout(() => reject(new Error("MQTT 连接超时")), 10000);
      const cleanup = () => clearTimeout(timer);
      const onOpen = () => this.ws.send(this.connectPacket());
      const onError = (err) => {
        cleanup();
        reject(err);
      };
      const onMessage = (data) => {
        try {
          this.handleData(Buffer.from(data));
        } catch (err) {
          for (const pending of this.pendingResponses.values()) pending.reject(err);
          this.pendingResponses.clear();
        }
      };
      if (this.ws.once) {
        this.ws.once("open", onOpen);
        this.ws.once("error", onError);
        this.ws.on("message", onMessage);
        this.ws.once("close", () => this.rejectAll(new Error("MQTT 连接已关闭")));
      } else {
        this.ws.addEventListener("open", onOpen, { once: true });
        this.ws.addEventListener("error", () => onError(new Error("MQTT 连接错误")), { once: true });
        this.ws.addEventListener("message", (event) => onMessage(event.data));
        this.ws.addEventListener("close", () => this.rejectAll(new Error("MQTT 连接已关闭")), { once: true });
      }
      this.onceConnack = (reasonCode) => {
        cleanup();
        if (reasonCode === 0) resolve();
        else reject(new Error(`MQTT CONNACK reasonCode=${reasonCode}`));
      };
    });
  }

  rejectAll(err) {
    for (const pending of this.pendingResponses.values()) pending.reject(err);
    this.pendingResponses.clear();
  }

  connectPacket() {
    const flags = 0x80 | 0x40 | 0x02;
    const keepalive = Buffer.alloc(2);
    keepalive.writeUInt16BE(10, 0);
    const variable = Buffer.concat([utf8("MQTT"), Buffer.from([5, flags]), keepalive, Buffer.from([0])]);
    return packet(0x10, variable, Buffer.concat([utf8(`checkbox-sector0x-${randomString(8)}`), utf8(this.sub), binary(this.accessToken)]));
  }

  nextPacketId() {
    const id = this.packetId;
    this.packetId += 1;
    if (this.packetId > 65535) this.packetId = 1;
    return id;
  }

  subscribe(topic) {
    const id = this.nextPacketId();
    const variable = Buffer.alloc(3);
    variable.writeUInt16BE(id, 0);
    variable[2] = 0;
    this.ws.send(packet(0x82, variable, Buffer.concat([utf8(topic), Buffer.from([0])])));
    return new Promise((resolve, reject) => {
      this.pendingSubs.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pendingSubs.has(id)) {
          this.pendingSubs.delete(id);
          reject(new Error(`订阅 ${topic} 超时`));
        }
      }, 10000);
    });
  }

  publish(topic, payloadText, responseTopic) {
    const properties = Buffer.concat([Buffer.from([0x03]), utf8("application/json"), Buffer.from([0x08]), utf8(responseTopic)]);
    const variable = Buffer.concat([utf8(topic), encodeVarInt(properties.length), properties]);
    this.ws.send(packet(0x30, variable, Buffer.from(payloadText, "utf8")));
  }

  async invoke(method, params, timeoutMs = 10000) {
    const responseId = randomString(12);
    const responseTopic = `rpc_response/${this.sub}/${responseId}`;
    await this.subscribe(responseTopic);
    const topic = `user/${this.sub}/rpc/${method}`;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingResponses.delete(responseTopic);
        reject(new Error(`${method} timeout`));
      }, timeoutMs);
      this.pendingResponses.set(responseTopic, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        },
      });
      this.publish(topic, JSON.stringify(params || {}), responseTopic);
    });
  }

  handleData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 2) {
      const lenInfo = decodeVarInt(this.buffer, 1);
      const headerLen = 1 + lenInfo.bytes;
      const total = headerLen + lenInfo.value;
      if (this.buffer.length < total) return;
      const type = this.buffer[0] >> 4;
      const body = this.buffer.slice(headerLen, total);
      this.buffer = this.buffer.slice(total);
      this.handlePacket(type, body);
    }
  }

  handlePacket(type, body) {
    if (type === 2) {
      const reasonCode = body.length > 1 ? body[1] : 0;
      if (this.onceConnack) this.onceConnack(reasonCode);
      this.onceConnack = null;
      return;
    }
    if (type === 9) {
      const id = body.readUInt16BE(0);
      const pending = this.pendingSubs.get(id);
      if (pending) {
        this.pendingSubs.delete(id);
        const reason = body[body.length - 1];
        if (reason <= 2) pending.resolve();
        else pending.reject(new Error(`SUBACK reasonCode=${reason}`));
      }
      return;
    }
    if (type === 3) {
      let cursor = 0;
      const topic = readUtf8(body, cursor);
      cursor = topic.offset;
      const propLen = decodeVarInt(body, cursor);
      cursor += propLen.bytes + propLen.value;
      const payload = body.slice(cursor).toString("utf8");
      const pending = this.pendingResponses.get(topic.value);
      if (!pending) return;
      this.pendingResponses.delete(topic.value);
      let parsed;
      try {
        parsed = JSON.parse(payload);
      } catch (err) {
        pending.reject(new Error(`RPC 返回非 JSON：${payload}`));
        return;
      }
      if (parsed && parsed.ok) pending.resolve(parsed.value);
      else pending.reject(new Error(String(parsed && parsed.error || payload)));
    }
  }

  end() {
    if (!this.ws) return;
    try {
      if (this.ws.readyState === 1 || this.ws.readyState === WebSocketImpl.OPEN) {
        this.ws.send(Buffer.from([0xe0, 0x00]));
      }
      this.ws.close();
    } catch (err) {
      // ignore close errors
    }
  }
}

async function executeMissionPlans(plans) {
  if (plans.length === 0) return [];
  const token = await refreshTokenIfNeeded(false);
  const client = new MqttRpcClient(CONFIG.chatEndpoint, token);
  await client.connect();
  const created = [];
  try {
    for (const plan of plans) {
      const response = await client.invoke("mission_create", { id: plan.missionId, slots: plan.slots });
      created.push({ ...plan, response });
    }
  } finally {
    client.end();
  }
  return created;
}

function extractText(value, depth = 0) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (depth > 3) return "";
  if (Array.isArray(value)) return value.map((item) => extractText(item, depth + 1)).filter(Boolean).join(" / ");
  if (typeof value === "object") {
    for (const key of ["summary", "content", "text", "message", "messages", "memory", "note", "value", "title", "name"]) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const text = extractText(value[key], depth + 1);
        if (text) return text;
      }
    }
    return JSON.stringify(value);
  }
  return "";
}

function truncateText(value, max = 120) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}

function extractRewardItems(value, out = []) {
  if (value == null) return out;
  if (Array.isArray(value)) {
    for (const item of value) extractRewardItems(item, out);
    return out;
  }
  if (typeof value !== "object") return out;
  const itemId = value.item_id || value.itemId || value.id;
  const count = value.count ?? value.value ?? value.amount ?? value.num;
  if (itemId && (typeof count === "number" || (typeof count === "string" && count.trim() !== ""))) {
    const n = Number(count);
    if (Number.isFinite(n)) out.push({ item_id: String(itemId), count: n });
  }
  for (const key of ["rewards", "reward", "items", "item_changes", "changes", "data", "result"]) {
    if (Object.prototype.hasOwnProperty.call(value, key)) extractRewardItems(value[key], out);
  }
  return out;
}

function missionRewardItems(mission) {
  const items = extractRewardItems(mission && mission.result && mission.result.data, []);
  const merged = new Map();
  for (const item of items) merged.set(item.item_id, (merged.get(item.item_id) || 0) + item.count);
  return [...merged.entries()].map(([item_id, count]) => ({ item_id, count }));
}

async function getFanbeiCount(userId) {
  const data = await graphQL(OPS.queryUserToken, { user_id: userId });
  return Number(data.user_token_by_pk && data.user_token_by_pk.tokens || 0);
}

async function getMyItems() {
  const data = await graphQL(OPS.getMyItems);
  return (data.user_item || []).map((item) => ({
    item_id: item.item_id,
    name: descriptionName(item.item && item.item.description) || item.item_id,
    count: Number(item.count || 0),
  })).sort((a, b) => String(a.item_id).localeCompare(String(b.item_id)));
}

async function getCharacterLogs(characterId, limit) {
  const data = await graphQL(OPS.queryCabinLog, { id: characterId, before: new Date().toISOString(), limit });
  return (data.cabin_log || []).map((item) => ({
    created_at: item.created_at,
    text: truncateText(extractText(item.summary || item.data), 100),
  }));
}

async function getCharacterNotes(characterId, limit) {
  const data = await graphQL(OPS.listCharacterPinnedMessages, { id: characterId, limit });
  return (data.user_character_pinned_message || []).map((item) => ({
    created_at: item.created_at,
    text: truncateText(extractText(item.data), 100),
  }));
}

async function getCharacterReport(state, options) {
  const logLimit = Number(options.log_limit || 1);
  const noteLimit = Number(options.note_limit || 1);
  return Promise.all(state.characters.map(async (character) => {
    const item = {
      id: character.id,
      name: characterName(character),
      status: state.busyIds.has(character.id) ? "外派中" : "空闲",
      logs: [],
      notes: [],
    };
    try {
      const [logs, notes] = await Promise.all([
        getCharacterLogs(character.id, logLimit),
        getCharacterNotes(character.id, noteLimit),
      ]);
      item.logs = logs;
      item.notes = notes;
    } catch (err) {
      item.error = err.message || String(err);
    }
    return item;
  }));
}

function formatItems(items) {
  if (!items || items.length === 0) return "无";
  return items.map((item) => `${item.name || item.item_id} ${item.count}`).join("；");
}

function formatRewardItems(items) {
  if (!items || items.length === 0) return "";
  return `，奖励 ${items.map((item) => `${item.item_id} ${item.count}`).join("、")}`;
}

function formatReport(report) {
  const lines = [];
  lines.push("【Sector0x】：");
  lines.push(`  token：有效，用户 ${report.token.sub || "-"}${report.token.refreshed ? "，已刷新" : ""}`);
  lines.push(`  外派：${report.missions.used}/${report.missions.limit}，剩余 ${report.missions.remaining}`);
  for (const line of report.action_lines) lines.push(`  ${line}`);
  lines.push(`  扇贝：${report.fanbei}`);
  lines.push(`  物品：${formatItems(report.items)}`);
  lines.push("  活动外派：");
  if (report.missions.active.length === 0) lines.push("    无");
  for (const mission of report.missions.active) {
    lines.push(`    ${mission.name}：${mission.status}${mission.finished_at ? `，完成 ${mission.finished_at}` : ""}${formatRewardItems(mission.rewards)}`);
  }
  lines.push("  角色：");
  for (const character of report.characters) {
    const latestLog = character.logs && character.logs[0];
    const latestNote = character.notes && character.notes[0];
    lines.push(`    ${character.name}：${character.status}`);
    lines.push(`      见闻：${latestLog ? latestLog.text : "无"}`);
    lines.push(`      笔记：${latestNote ? latestNote.text : "无"}`);
  }
  if (report.errors.length > 0) lines.push(`  错误：${report.errors.join("；")}`);
  return lines.join("\n");
}

async function sector0xTask() {
  const options = cfg();
  const dryRun = options.dry_run === true || options.yes !== true;
  const errors = [];
  const actionLines = [];
  const token = await tokenInfo();
  const initialState = await getMissionState();
  const claimable = claimableMissions(initialState.active);
  let claimed = [];
  let planned = [];
  let created = [];
  let workingState = initialState;

  if (claimable.length > 0) {
    claimed = await claimMissions(claimable, dryRun);
    workingState = dryRun ? projectClaimedState(initialState, claimable) : projectClaimedState(await getMissionState(), claimable);
    if (dryRun) actionLines.push(`dry-run：将领取 ${claimed.length} 个外派奖励`);
    else actionLines.push(`已领取 ${claimed.length} 个外派奖励`);
    for (const item of claimed) actionLines.push(`领取：${item.name}${formatRewardItems(item.rewards)}`);
  } else {
    actionLines.push("没有可领取的外派奖励");
    if (workingState.remaining > 0) {
      try {
        planned = createMissionPlans(workingState, options);
        if (dryRun) {
          actionLines.push(`dry-run：将创建 ${planned.length} 个外派`);
        } else {
          created = await executeMissionPlans(planned);
          actionLines.push(`已创建 ${created.length} 个外派`);
        }
        for (const plan of planned) actionLines.push(`外派：${plan.missionName} -> ${plan.slots.join(", ")}`);
      } catch (err) {
        errors.push(err.message || String(err));
        actionLines.push(`无法创建新外派：${err.message || err}`);
      }
    } else {
      actionLines.push("今日外派次数已用完，不创建新外派");
    }
  }

  const finalState = dryRun ? workingState : await getMissionState();
  const [fanbei, items, characters] = await Promise.all([
    getFanbeiCount(token.sub),
    getMyItems(),
    getCharacterReport(finalState, options),
  ]);
  return {
    token,
    dry_run: dryRun,
    action_lines: actionLines,
    actions: { claimed, planned, created },
    missions: {
      used: finalState.used,
      limit: finalState.limit,
      remaining: finalState.remaining,
      active: finalState.active.map((mission) => ({
        id: mission.id,
        name: missionDisplayName(mission),
        status: missionStatus(mission),
        finished_at: mission.result && mission.result.finished_at || null,
        claimed_at: mission.result && mission.result.claimed_at || null,
        rewards: missionRewardItems(mission),
      })),
    },
    fanbei,
    items,
    characters,
    errors,
  };
}

module.exports = async function task() {
  try {
    const report = await sector0xTask();
    return formatReport(report);
  } catch (err) {
    return `【Sector0x】：失败：${err.message || err}`;
  }
};
