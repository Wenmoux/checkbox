const axios = require("axios");

const baseUrl = "https://aisearches.xyz";
const defaultCookie = "locale=zh-Hans; x-domain=aisearches.xyz; x-hostname=aisearches.xyz; x-default-title=AI%E9%A3%8E%E6%9C%88";

function getConfig() {
    return (config && config.aifengyue) || {};
}

function normalizeAuthorization(authorization) {
    if (authorization && !authorization.match(/^Bearer\s+/i)) authorization = "Bearer " + authorization;
    return authorization;
}

function getAuthorization() {
    return normalizeAuthorization(getConfig().authorization || getConfig().Authorization || getConfig().token || "");
}

function getLoginAccount() {
    const aifengyue = getConfig();
    return aifengyue.email || aifengyue.username || aifengyue.account || "";
}

function getLoginAccessToken(data) {
    if (!data) return "";
    if (typeof data === "string") return data;
    if (typeof data.token === "string") return data.token;
    if (typeof data.access_token === "string") return data.access_token;
    if (typeof data.data === "string") return data.data;
    if (data.data && typeof data.data.token === "string") return data.data.token;
    if (data.data && typeof data.data.access_token === "string") return data.data.access_token;
    return "";
}

function getResponseMessage(data) {
    if (!data) return "";
    if (typeof data === "string") return data;
    return data.msg || data.message || data.error || data.detail || "";
}

function decodeJwtPayload(authorization) {
    try {
        const token = authorization.replace(/^Bearer\s+/i, "");
        const payload = token.split(".")[1];
        if (!payload) return {};
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
    } catch (err) {
        return {};
    }
}

function getTarget(authorization) {
    const aifengyue = getConfig();
    if (aifengyue.target) return aifengyue.target;
    if (aifengyue.user_id) return aifengyue.user_id;
    return decodeJwtPayload(authorization).user_id || "";
}

function getHeaders(referer, authorization = "") {
    const headers = {
        "sec-ch-ua-full-version-list": "\"Not;A=Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"150.0.7871.13\", \"Google Chrome\";v=\"150.0.7871.13\"",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
        "x-timezone": "Asia/Shanghai",
        "sec-ch-ua-model": "\"\"",
        "sec-ch-ua-mobile": "?0",
        "x-language": "zh-Hans",
        "sec-ch-ua-arch": "\"x86\"",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
        "content-type": "application/json",
        "sec-ch-ua-platform-version": "\"19.0.0\"",
        "accept": "*/*",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "referer": referer,
        "accept-language": "zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7",
        "cookie": getConfig().cookie || defaultCookie,
        "priority": "u=1, i"
    };
    if (authorization) headers.authorization = authorization;
    return headers;
}

async function loginWithPassword() {
    const aifengyue = getConfig();
    const email = getLoginAccount();
    const password = aifengyue.password || "";
    if (!email || !password) return "";

    let res;
    try {
        res = await axios.post(baseUrl + "/console/api/login", {
            email,
            password,
            remember_me: true,
            interface_language: aifengyue.language || "zh-Hans"
        }, {
            headers: getHeaders(baseUrl + "/zh/signin"),
            timeout: Number(aifengyue.login_timeout || 5000),
            validateStatus: () => true
        });
    } catch (err) {
        if (err.code === "ECONNABORTED" || String(err.message || "").match(/timeout/i)) {
            throw new Error("账号密码登录超时，请检查账号密码或稍后重试");
        }
        throw new Error(`账号密码登录请求失败：${err.message || err}`);
    }
    const token = getLoginAccessToken(res.data);
    if (res.data && res.data.result === "success" && token) return normalizeAuthorization(token);
    const message = getResponseMessage(res.data);
    if ((res.status === 400 || res.status === 401 || res.status === 403) && !message) {
        throw new Error("账号密码登录失败：账号或密码错误");
    }
    throw new Error(`账号密码登录失败：${message || JSON.stringify(res.data) || "未知错误"}`);
}

async function resolveAuthorization() {
    const authorization = await loginWithPassword();
    if (authorization) return authorization;
    return getAuthorization();
}

async function get(url, referer, authorization) {
    const res = await axios.get(url, {
        headers: getHeaders(referer, authorization),
        timeout: 15000,
        validateStatus: () => true
    });
    return res.data;
}

async function signIn(authorization) {
    const data = await get(baseUrl + "/console/api/sign_in", baseUrl + "/zh", authorization);
    if (data && data.code === 200) {
        const reward = data.data && data.data.reward != null ? data.data.reward : "";
        return `签到成功${reward !== "" ? "，奖励：" + reward : ""}`;
    }
    if (data && data.code === 400 && data.msg && data.msg.match(/已签到/)) return data.msg;
    return `签到失败：${data && data.msg ? data.msg : JSON.stringify(data)}`;
}

async function getPoints(authorization) {
    const target = getTarget(authorization);
    if (!target) return "积分查询失败：缺少target";
    const data = await get(`${baseUrl}/go/api/account/point?target=${encodeURIComponent(target)}`, baseUrl + "/zh/checkin", authorization);
    if (data && (data.code === 100000 || data.code === 200)) {
        return `积分：${data.data && data.data.points != null ? data.data.points : "0"}`;
    }
    return `积分查询失败：${data && data.msg ? data.msg : JSON.stringify(data)}`;
}

function formatBagItem(item) {
    const name = item.name || item.prop_key || "未知";
    const quantity = item.quantity != null ? item.quantity : item.total;
    return `${name}：${quantity != null ? quantity : 0}`;
}

async function getBag(authorization) {
    const data = await get(baseUrl + "/console/api/prop/bag", baseUrl + "/zh/checkin", authorization);
    if (!data || data.code !== 200) {
        return `背包查询失败：${data && data.msg ? data.msg : JSON.stringify(data)}`;
    }
    const list = Array.isArray(data.data) ? data.data : [];
    const stardust = list.find(item => item.prop_key === "stardust" || item.name === "星尘");
    if (stardust) return formatBagItem(stardust);
    if (list.length) return list.map(formatBagItem).join("，");
    return "星尘：0";
}

async function aifengyue() {
    try {
        const authorization = await resolveAuthorization();
        if (!authorization) return "【AI风月】：authorization为空且未配置账号密码，无法签到";
        const signMsg = await signIn(authorization);
        const pointMsg = await getPoints(authorization);
        const bagMsg = await getBag(authorization);
        return `【AI风月】：${signMsg}；${pointMsg}；${bagMsg}`;
    } catch (err) {
        return `【AI风月】：请求出错：${err.message || err}`;
    }
}

module.exports = aifengyue;
