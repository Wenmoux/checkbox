const axios = require("axios");
const qs = require("qs");
const md5 = require("crypto-js").MD5;

const WWW = "https://www.66rpg.com";
const IAPI = "https://iapi.66rpg.com";
const COLLECT = "https://c.66rpg.com/collect/v1/index/runtime";
const IAPI_SIGN_SALT = "a_bvvznajmyefox9ts";

const APP_PARAMS = {
  client: 2,
  platform: 2,
  android_cur_ver: "3.11.334.0424",
  channel: "vivoDYD",
};

const UA =
  "Mozilla/5.0 (Linux; Android 12; Redmi K30 Build/SKQ1.211006.001; wv) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36";

const RUNTIME_PUBKEY =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDtsvsk/MIEI9YXvHzLfg+eEJkY3d7RmVynKBZY35T0xg3WwZgmC6GSPZqrMMcht6aiZYPJywhm9JiE6kBo/0Mvxklm5Wd35wIKeDXcq8Aqb4aQXalcwsD3f829OR1P2AqGilr14Rftv4ixyQATG/BqP2/kgft2rcq4e/E7bDWNLQIDAQAB";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeAccount(name, value) {
  if (!value || !value.uid || !value.token) return null;
  return { name: value.name || name, ...value };
}

function collectAccounts(source, defaultName) {
  if (!source) return [];
  if (Array.isArray(source)) {
    return source
      .map((value, index) => normalizeAccount(`${defaultName}${index + 1}`, value))
      .filter(Boolean);
  }
  if (source.accounts) return collectAccounts(source.accounts, defaultName);
  if (source.users) return collectAccounts(source.users, defaultName);

  const direct = normalizeAccount(defaultName, source);
  if (direct) return [direct];

  return Object.entries(source)
    .map(([name, value]) => normalizeAccount(name, value))
    .filter(Boolean);
}

function loadAccounts() {
  return collectAccounts(globalThis.config?.rpg66, "rpg66");
}

function params(account, extra = {}) {
  return {
    uid: account.uid,
    token: account.token,
    ...APP_PARAMS,
    ...extra,
  };
}

function signedIapiParams(account, extra = {}) {
  return {
    uid: account.uid,
    token: account.token,
    skey: account.skey || "",
    client: 2,
    platform: 2,
    nt: "wifi",
    ...extra,
  };
}

function iapiSign(body) {
  const text = Object.keys(body)
    .sort()
    .map((key) => `${key}=${body[key]}`)
    .join("&");
  return md5(text + IAPI_SIGN_SALT).toString();
}

async function iapiGet(account, apiPath, extra = {}) {
  const body = signedIapiParams(account, extra);
  const res = await axios.get(IAPI + apiPath, {
    params: body,
    headers: {
      "user-agent": UA,
      "x-sign": iapiSign(body),
    },
    timeout: 20000,
    validateStatus: () => true,
  });
  return res.data;
}

async function iapiPost(account, apiPath, extra = {}) {
  const body = signedIapiParams(account, extra);
  const res = await axios.post(IAPI + apiPath, qs.stringify(body), {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": UA,
      "x-sign": iapiSign(body),
    },
    timeout: 20000,
    validateStatus: () => true,
  });
  return res.data;
}

async function get(account, apiPath, extra = {}) {
  const res = await axios.get(WWW + apiPath, {
    params: params(account, extra),
    headers: {
      "user-agent": UA,
      referer: "https://m3.66rpg.com/mini/orgshop/orgfarm",
    },
    timeout: 15000,
    validateStatus: () => true,
  });
  return res.data;
}

async function postForm(account, apiPath, body = {}) {
  const res = await axios.post(WWW + apiPath, qs.stringify(params(account, body)), {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": UA,
      referer: "https://m3.66rpg.com/mini/orgshop/orgfarm",
    },
    timeout: 15000,
    validateStatus: () => true,
  });
  return res.data;
}

function webCookie(account) {
  return [
    `userid=${account.uid}`,
    `token=${account.token}`,
    "isLogin=true",
    "loginStatus=1",
  ].join("; ");
}

async function webGet(account, url, extra = {}, referer = "https://m3.66rpg.com/mini/orgshop/orgfarm") {
  const res = await axios.get(url, {
    params: params(account, extra),
    headers: {
      "user-agent": UA,
      cookie: webCookie(account),
      referer,
    },
    timeout: 15000,
    validateStatus: () => true,
  });
  return res.data;
}

async function webPostForm(account, url, body = {}, referer = "https://m3.66rpg.com/mini/orgshop/orgfarm") {
  const res = await axios.post(url, qs.stringify(params(account, body)), {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": UA,
      cookie: webCookie(account),
      referer,
    },
    timeout: 15000,
    validateStatus: () => true,
  });
  return res.data;
}

function flatTasks(treeTaskData) {
  const groups = ["day", "week", "timed", "growth"];
  return groups.flatMap((group) => {
    const list = treeTaskData?.[group]?.list || [];
    return list.map((task) => ({ ...task, group }));
  });
}

function taskLine(task) {
  return `${task.task_id} ${task.task_name} ${task.progress_bar_current}/${task.progress_bar_max} status=${task.task_status} claim=${task.claim_status}`;
}

function taskProgress(task) {
  return {
    current: Number(task.progress_bar_current || 0),
    max: Number(task.progress_bar_max || 0),
  };
}

function isTaskDone(task) {
  const progress = taskProgress(task);
  return progress.max > 0 && progress.current >= progress.max;
}

function isTaskReady(task) {
  return Number(task.task_status) === 1 && Number(task.claim_status) === 0;
}

function isTaskPending(task) {
  return !isTaskDone(task) && !isTaskReady(task);
}

function normalizeTaskText(value) {
  return String(value || "").replace(/\s+/g, "").toLowerCase();
}

function taskMatches(task, aliases) {
  const text = normalizeTaskText(`${task.task_name || ""} ${task.desc || ""} ${task.description || ""}`);
  return aliases.some((alias) => text.includes(normalizeTaskText(alias)));
}

async function getTreeTasks(account) {
  const data = await get(account, "/ActiveSystem/ptree/get_user_task_list");
  if (data.status !== 1) throw new Error(`tree task list failed: ${data.msg || data.status}`);
  return data.data;
}

async function getTreeTask(account, taskId) {
  return flatTasks(await getTreeTasks(account)).find((task) => Number(task.task_id) === Number(taskId));
}

async function signIn(account) {
  const res = await axios.post(
    `${WWW}/Ajax/Home/new_sign_in.json`,
    qs.stringify({
      token: account.token,
      mobile_uid: "",
      client: 2,
      android_cur_ver: APP_PARAMS.android_cur_ver,
    }),
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "user-agent": UA,
      },
      timeout: 15000,
      validateStatus: () => true,
    },
  );
  const data = res.data;
  if (data.status === 1) {
    const today = data.data?.today?.award_name || "ok";
    const fov = data.data?.today?.active_signin_award?.award_fov_name || "";
    return `sign ok: ${today}${fov ? `, ${fov}` : ""}`;
  }
  return `sign skip/fail: ${data.msg || data.status}`;
}

async function uploadRuntime(account, minutes = 30) {
  const seconds = minutes * 60;
  const gameIds = Array.from(
    new Set([account.readGameId, account.read_gameid, account.gameid, 1593227, 1603466].filter(Boolean)),
  );
  const logs = [];
  for (const gameId of gameIds) {
    const ts = Math.floor(Date.now() / 1000);
    const data = JSON.stringify({ run: { [gameId]: seconds } });
    const check = md5(data + account.uid + ts + RUNTIME_PUBKEY).toString();
    const body = qs.stringify({
      data,
      uid: account.uid,
      ts,
      check,
      platform: 3,
      channel_id: 0,
      online_plat: seconds,
      nonce: "b613b114-b3a8-4bb6-a444-7096b2abc5fe",
      timestamp: ts,
    });
    const res = await axios.post(COLLECT, body, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": UA,
      },
      timeout: 15000,
      validateStatus: () => true,
    });
    logs.push(`${gameId}:${res.data?.msg || res.data?.status}`);
    await sleep(300);
  }
  return `runtime ${minutes}min: ${logs.join(", ")}`;
}

async function fillRuntimeTasks(account, tasks) {
  const needMinutes = tasks
    .filter((task) => findPassiveTaskCoverage(task)?.handler === "fillRuntimeTasks")
    .map((task) => Math.max(0, Number(task.progress_bar_max) - Number(task.progress_bar_current)))
    .reduce((max, remain) => Math.max(max, remain), 0);

  if (!needMinutes) return "runtime tasks already done";
  return uploadRuntime(account, Math.max(30, needMinutes));
}

async function getRecommendedGame(account, action = "") {
  const data = await get(account, "/ActiveSystem/FeedDog/get_recommended_game_info", {
    c_action: action,
  });
  if (data.status !== 1 || !data.data?.gameInfo) {
    throw new Error(`recommended game failed: ${data.msg || data.status}`);
  }
  return data.data.gameInfo;
}

async function doDogNext(account, task) {
  const remain = Math.max(0, Number(task.progress_bar_max) - Number(task.progress_bar_current));
  if (!remain) return "dog next already done";

  for (let i = 0; i < remain; i++) {
    await getRecommendedGame(account, i === 0 && Number(task.progress_bar_current) === 0 ? "" : "next");
    await sleep(500);
  }
  return `dog next requested ${remain}`;
}

async function createFavorite(account, gindex, favSource) {
  const res = await axios.post(
    `${WWW}/ajax/favorite/create.json`,
    qs.stringify({
      gindex,
      android_uid: account.uid,
      platform: 2,
      fav_source: favSource,
      uid: account.uid,
      token: account.token,
      client: 2,
    }),
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": UA,
        referer: "https://m3.66rpg.com/mini/orgshop/orgdog?share_mode=1",
      },
      timeout: 15000,
      validateStatus: () => true,
    },
  );
  return res.data;
}

async function doDogFavorite(account, task) {
  if (Number(task.progress_bar_current) >= Number(task.progress_bar_max) || task.task_status === 1) {
    return "dog favorite already done";
  }

  let last;
  for (let i = 0; i < 5; i++) {
    last = await getRecommendedGame(account, i === 0 ? "" : "next");
    if (!last.is_fav) break;
  }
  if (!last?.gindex) return "dog favorite no game";

  const data = await createFavorite(account, last.gindex, "1");
  return `dog favorite ${last.gindex}: ${data.msg || data.status}`;
}

async function doGenericFavorite(account, task) {
  if (Number(task.progress_bar_current) >= Number(task.progress_bar_max) || task.task_status === 1) {
    return "favorite already done";
  }
  const gindex = account.gameid || 1603466;
  const data = await createFavorite(account, gindex, "script");
  return `favorite ${gindex}: ${data.msg || data.status}`;
}

async function doDynamicLike(account, task) {
  if (Number(task.progress_bar_current) >= Number(task.progress_bar_max) || task.task_status === 1) {
    return "dynamic like already done";
  }

  let listRes;
  let list = [];
  for (let page = 1; page <= 3 && !list.length; page++) {
    listRes = await iapiGet(account, "/dynamic/v1/dynamic/get_dynamic", { page, type: 0 });
    list = listRes.data?.list || [];
  }
  const dynamic = list.find((item) => Number(item.star_status) === 0 && String(item.user?.uid) !== String(account.uid));
  if (!dynamic?.did) return `dynamic like no target: ${listRes?.msg || listRes?.status}`;

  const likeRes = await iapiPost(account, "/dynamic/v1/dynamic/star", { did: dynamic.did });
  return `dynamic like ${dynamic.did}: ${likeRes.msg || likeRes.status}`;
}

function appBackUrl() {
  return "https://m3.66rpg.com/mini/orgshop/orgfarm";
}

async function recordBoxRunTimes(account, extra = {}) {
  const data = await iapiGet(account, "/box/v1/index/record_box_run_times.json", {
    run_time: 15,
    count_timer: 15,
    ...extra,
  });
  return `record box run times: ${data.msg || data.status || JSON.stringify(data)}`;
}

async function doSharePageBrowse(account, task) {
  if (Number(task.progress_bar_current) >= Number(task.progress_bar_max) || task.task_status === 1) {
    return "share page browse already done";
  }

  const backUrl = appBackUrl();
  await webGet(
    account,
    "https://m.66rpg.com/mini/home",
    {
      box: "box_tab",
      pushvalue: 3,
      type: 1,
      count_timer: 15,
      count_timer_url: "box/v1/index/record_box_run_times.json",
      url: backUrl,
    },
    backUrl,
  );
  const recordResult = await recordBoxRunTimes(account, {
    box: "box_tab",
    pushvalue: 3,
    type: 1,
  });
  await iapiGet(account, "/dynamic/v1/dynamic/get_dynamic", { page: 1, type: 1 });
  await sleep(16000);

  const latest = await getTreeTask(account, task.task_id);
  return `share page browse attempted: ${latest?.progress_bar_current ?? "?"}/${latest?.progress_bar_max ?? "?"} status=${latest?.task_status ?? "?"}; ${recordResult}`;
}

async function doChannelPageBrowse(account, task) {
  if (Number(task.progress_bar_current) >= Number(task.progress_bar_max) || task.task_status === 1) {
    return "channel page browse already done";
  }

  const tid = Number(task.tid || 0);
  if (!tid) return `channel page browse no tid: ${taskLine(task)}`;

  const backUrl = appBackUrl();
  await webGet(
    account,
    "https://m.66rpg.com/mini/home",
    {
      box: "box_tid",
      pushvalue: tid,
      count_timer: 15,
      count_timer_url: "box/v1/index/record_box_run_times.json",
      url: backUrl,
    },
    backUrl,
  );
  const recordResult = await recordBoxRunTimes(account, {
    box: "box_tid",
    pushvalue: tid,
    tid,
  });
  await webPostForm(account, `${WWW}/ajax/index/statistics_first_screen_cat_content`, {
    position: tid,
    id: tid,
  }, "https://m.66rpg.com/mini/home");

  const channelParams = {
    tid,
    page: 1,
    pageNum: 1,
    works_pub_time: 0,
    flag: "orgbox",
  };
  const endpoints = [
    "/ajax/channel/tag_screen_list",
    "/ajax/channel/tag_screen",
    "/ajax/Channel/third_tag_screen_list",
    "/ajax/channel/third_tag_screen",
    "/cgMini/ajax/channel/tag_screen_list",
    "/cgMini/ajax/channel/tag_screen",
  ];
  for (const endpoint of endpoints) {
    try {
      await webGet(account, `${WWW}${endpoint}`, channelParams, "https://m.66rpg.com/mini/home");
    } catch (err) {
      // Some channel endpoints are only valid for specific tag families; try the next one.
    }
    await sleep(300);
  }
  await sleep(16000);

  const latest = await getTreeTask(account, task.task_id);
  return `channel page browse attempted tid=${tid}: ${latest?.progress_bar_current ?? "?"}/${latest?.progress_bar_max ?? "?"} status=${latest?.task_status ?? "?"}; ${recordResult}`;
}

async function tryShare(account, task) {
  if (Number(task.progress_bar_current) >= Number(task.progress_bar_max) || task.task_status === 1) {
    return "share already done";
  }
  const gindex = account.gameid || 1603466;
  const data = await iapiPost(account, "/share/v1/share/share_game", {
    gindex,
    share_msg_id: "",
    share_channel: 3,
  });
  return `share game ${gindex}: ${data.msg || data.status}`;
}

async function doSendFlowers(account, task) {
  if (Number(task.progress_bar_current) >= Number(task.progress_bar_max) || task.task_status === 1) {
    return "send flowers already done";
  }
  if (!account.allowSendFlowers && !account.allow_send_flowers && !account.sendFlowers) {
    return "send flowers skipped: set allowSendFlowers: true to enable";
  }
  const remain = Math.max(0, Number(task.progress_bar_max) - Number(task.progress_bar_current));
  const gindex = account.flowerTarget || account.flower_target || account.gameid || 1603466;
  const data = await iapiPost(account, "/game/v1/pay/send_flower", {
    gindex,
    num: remain,
    flower_place: 4,
    group_id: "",
  });
  return `send flowers ${gindex} x${remain}: ${data.msg || data.status}`;
}

async function doCreateCollections(account, task) {
  if (Number(task.progress_bar_current) >= Number(task.progress_bar_max) || task.task_status === 1) {
    return "collections already done";
  }
  const remain = Math.max(0, Number(task.progress_bar_max) - Number(task.progress_bar_current));
  const logs = [];
  for (let i = 0; i < remain; i++) {
    const data = await iapiPost(account, "/Favorite/v1/Favorite/create_edit_fav_folder", {
      folder_name: `每日任务${Date.now().toString().slice(-6)}${i}`,
      folder_id: 0,
      folder_cover: "",
      folder_desc: "",
      is_public: 1,
      source: 1,
    });
    logs.push(data.msg || data.status);
    await sleep(300);
  }
  return `create collections: ${logs.join(", ")}`;
}

async function doReplyBountyShare(account, task) {
  if (Number(task.progress_bar_current) >= Number(task.progress_bar_max) || task.task_status === 1) {
    return "bounty reply already done";
  }
  const list = await iapiGet(account, "/topicPlaza/v1/home/topic_list", {
    page: 1,
    limit: 10,
    type: 0,
  });
  const topic = (list.data?.list || []).find(
    (item) => Number(item.reward_status) === 1 && String(item.uid) !== String(account.uid),
  );
  if (!topic?.topic_id) return `bounty reply no target: ${list.msg || list.status}`;

  const data = await iapiPost(account, "/topicPlaza/v1/info/reply", {
    topic_id: topic.topic_id,
    content: "mark",
    reply_id: 0,
    parent_id: 0,
  });
  return `bounty reply ${topic.topic_id}: ${data.msg || data.status}`;
}

async function doConfession(account, task) {
  if (Number(task.progress_bar_current) >= Number(task.progress_bar_max) || task.task_status === 1) {
    return "confession already done";
  }
  const gindex = account.confessionGameId || account.confession_gameid || account.gameid || 1603466;
  const roles = await iapiGet(account, "/bestman/bestman/v2/role/bestman_all_role_list", {
    gindex,
    page: 1,
    limit: 10,
  });
  const role = roles.data?.role?.[0];
  if (!role?.role_id) return `confession no role: ${roles.msg || roles.status}`;

  const data = await iapiPost(account, "/bestman/bestman/v1/vote/bestman_express_words", {
    gindex,
    role_id: role.role_id,
    role_words: 1,
  });
  return `confession ${role.role_id}: ${data.msg || data.status}`;
}

const TASK_ACTIONS = [
  {
    ids: [3],
    aliases: ["浏览频道页15s", "频道页15s", "频道页"],
    action: doChannelPageBrowse,
    note: "best-effort app timer task",
  },
  {
    ids: [12],
    aliases: ["浏览share页面15s", "浏览share页面", "share页面15s", "share页面"],
    action: doSharePageBrowse,
    note: "best-effort app timer task",
  },
  {
    ids: [13],
    aliases: ["狗橙推荐模式点击下一个", "推荐模式点击下一个", "浏览3次"],
    action: doDogNext,
  },
  {
    ids: [14],
    aliases: ["狗橙推荐模式收藏", "推荐模式收藏"],
    action: doDogFavorite,
  },
  {
    ids: [2],
    aliases: ["浏览动态页面并点赞", "动态页面并点赞", "点赞1次"],
    action: doDynamicLike,
  },
  {
    ids: [6],
    aliases: ["收藏任意一部作品", "收藏任意作品"],
    action: doGenericFavorite,
  },
  {
    ids: [5],
    aliases: ["分享任意一部作品", "分享任意作品"],
    action: tryShare,
  },
  {
    ids: [4],
    aliases: ["为任意作品送鲜花", "送鲜花"],
    action: doSendFlowers,
    note: "will spend real flowers",
  },
  {
    ids: [10],
    aliases: ["悬赏", "回帖"],
    action: doReplyBountyShare,
  },
  {
    ids: [7],
    aliases: ["告白", "表白"],
    action: doConfession,
  },
  {
    ids: [101],
    aliases: ["创建收藏夹", "创建合集"],
    action: doCreateCollections,
  },
];

const PASSIVE_TASK_COVERAGE = [
  {
    key: "runtime_read",
    ids: [1, 100],
    aliases: [
      "阅读任意作品满10min",
      "阅读任意作品满10分钟",
      "阅读任意作品10min",
      "阅读任意作品10分钟",
      "阅读任意作品",
      "阅读作品10min",
      "阅读作品10分钟",
      "阅读10min",
      "阅读10分钟",
    ],
    handler: "fillRuntimeTasks",
    detail: "handled before action loop by fillRuntimeTasks",
  },
];

const MANUAL_TASK_GUIDES = [
  {
    aliases: ["获得1朵鲜花", "获得鲜花"],
    guide: "claim a real login/activity flower first; this task is updated by server-side flower income",
  },
];

function findTaskRule(task, rules) {
  const id = Number(task.task_id);
  return rules.find((item) => (item.ids || []).includes(id) || taskMatches(task, item.aliases || []));
}

function findTaskAction(task) {
  return findTaskRule(task, TASK_ACTIONS);
}

function findPassiveTaskCoverage(task) {
  return findTaskRule(task, PASSIVE_TASK_COVERAGE);
}

function findManualTaskGuide(task) {
  return findTaskRule(task, MANUAL_TASK_GUIDES);
}

function printTaskSummary(tasks) {
  console.log("task coverage:");
  for (const task of tasks) {
    const action = findTaskAction(task);
    const passive = findPassiveTaskCoverage(task);
    const guide = findManualTaskGuide(task);
    let type = "unknown";
    let detail = "no rule";
    if (action) {
      type = "auto";
      detail = action.action.name;
      if (action.note) detail += ` (${action.note})`;
    } else if (passive) {
      type = "auto";
      detail = passive.detail;
    } else if (guide) {
      type = "manual";
      detail = guide.guide;
    }
    console.log(`  [${type}] ${taskLine(task)} -> ${detail}`);
  }
}

async function claimTreeAwards(account) {
  const taskData = await getTreeTasks(account);
  const ready = flatTasks(taskData).filter(
    (task) => Number(task.task_status) === 1 && Number(task.claim_status) === 0,
  );
  const logs = [];
  for (const task of ready) {
    const data = await postForm(account, "/ActiveSystem/ptree/claim_task_award", {
      task_id: task.task_id,
      noVer: true,
    });
    logs.push(`${task.task_id} ${task.task_name}: ${data.msg || data.status}`);
    await sleep(300);
  }
  return logs.length ? logs : ["no tree award to claim"];
}

async function claimOldActiveAwards(account) {
  const oldParams = {
    jsonCallBack: "",
    uid: account.uid,
    token: account.token,
    client: 2,
    _: Date.now(),
  };
  const listRes = await axios.get(`${WWW}/ActiveSystem/api/v1/active/get_today_task_lists`, {
    params: oldParams,
    headers: { "user-agent": UA },
    timeout: 15000,
    validateStatus: () => true,
  });
  const list = listRes.data;
  if (list.status !== 1 || !Array.isArray(list.data)) return [`old active list: ${list.msg || list.status}`];

  const ready = list.data.filter((task) => Number(task.status) === 1 && Number(task.unclaimed) > 0);
  const logs = [];
  for (const task of ready) {
    const claimRes = await axios.get(`${WWW}/ActiveSystem/api/v1/active/claimReward`, {
      params: {
        uid: account.uid,
        token: account.token,
        client: 2,
        task_type: task.task_type,
        _: Date.now(),
      },
      headers: { "user-agent": UA },
      timeout: 15000,
      validateStatus: () => true,
    });
    const data = claimRes.data;
    logs.push(`old ${task.task_type} ${task.task_name}: ${data.msg || data.status}`);
    await sleep(300);
  }
  return logs.length ? logs : ["no old active award to claim"];
}

async function runAccount(account) {
  console.log(`\n# ${account.name} uid=${account.uid}`);
  const summary = [];

  try {
    const money = await get(account, "/ActiveSystem/PtreeShop/get_user_account_money");
    console.log(`fresh orange: ${money.data?.fov_value ?? "unknown"}`);
    summary.push(`${account.name}: fresh orange ${money.data?.fov_value ?? "unknown"}`);
  } catch (err) {
    console.log(`fresh orange failed: ${err.message}`);
    summary.push(`${account.name}: fresh orange failed`);
  }

  try {
    console.log(await signIn(account));
  } catch (err) {
    console.log(`signIn failed: ${err.message}`);
  }

  let tasks = flatTasks(await getTreeTasks(account));

  try {
    console.log(await fillRuntimeTasks(account, tasks));
  } catch (err) {
    console.log(`fillRuntimeTasks failed: ${err.message}`);
  }

  tasks = flatTasks(await getTreeTasks(account));
  for (const task of tasks) console.log(`task ${taskLine(task)}`);
  printTaskSummary(tasks);

  for (const task of tasks) {
    if (!isTaskPending(task)) continue;
    const action = findTaskAction(task);
    if (!action) continue;
    try {
      console.log(`run ${action.action.name}: ${taskLine(task)}`);
      console.log(await action.action(account, task));
    } catch (err) {
      console.log(`${action.action.name} failed: ${err.message}`);
    }
    await sleep(800);
    tasks = flatTasks(await getTreeTasks(account));
  }

  const remaining = tasks.filter(isTaskPending);
  const manual = remaining
    .map((task) => ({ task, guide: findManualTaskGuide(task) }))
    .filter((item) => item.guide);
  if (manual.length) {
    console.log("manual web tasks:");
    for (const item of manual) console.log(`  ${taskLine(item.task)} -> ${item.guide.guide}`);
  }

  console.log("claim tree awards:");
  for (const line of await claimTreeAwards(account)) console.log(`  ${line}`);

  console.log("claim old active awards:");
  for (const line of await claimOldActiveAwards(account)) console.log(`  ${line}`);

  try {
    const after = await get(account, "/ActiveSystem/PtreeShop/get_user_account_money");
    const afterValue = after.data?.fov_value ?? "unknown";
    console.log(`fresh orange after: ${afterValue}`);
    summary.push(`${account.name}: fresh orange after ${afterValue}`);
  } catch (err) {
    console.log(`fresh orange after failed: ${err.message}`);
    summary.push(`${account.name}: fresh orange after failed`);
  }

  return summary.join("\n");
}

async function main() {
  const accounts = loadAccounts();
  if (!accounts.length) return "【橙光】：未配置 config.rpg66";
  const summaries = [];
  for (const account of accounts) {
    try {
      summaries.push(await runAccount(account));
    } catch (err) {
      console.log(`account ${account.name} failed: ${err.message}`);
      summaries.push(`${account.name}: failed ${err.message}`);
    }
  }
  return `【橙光】\n${summaries.filter(Boolean).join("\n")}`;
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}

module.exports = main;
