//晋江小说app福利中心  抓取登陆返回的token即可 config里字段sign 懒得改了
const axios = require("axios");
const CryptoJS = require("crypto-js");

// 配置信息
const jjxconfig = {
    jjwxc: {
        token: config.jjwxc.sign,
    },
    KEY_HEX: "4b573844766d324e",
    IV_HEX: "3161653263393462",
    USER_AGENT: "Mozilla/5.0 (Linux; Android 15)",
    SM_DEVICE_ID: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    VERSION_CODE: "444"
};

function hexToWordArray(hexString) {
    return CryptoJS.enc.Hex.parse(hexString);
}
function desEncrypt(keyHex, ivHex, plaintext) {
    try {
        const key = hexToWordArray(keyHex);
        const iv = hexToWordArray(ivHex);
        const encrypted = CryptoJS.DES.encrypt(plaintext, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    } catch (error) {
        console.error("CryptoJS DES加密失败:", error);
        throw error;
    }
}

function generateSign(token) {
    const timestampMillis = Date.now();
    const timestampSeconds = Math.floor(timestampMillis / 1000);
    const bodyPayload = `${timestampMillis}:${token}`;
    const bodySign = desEncrypt(jjxconfig.KEY_HEX, jjxconfig.IV_HEX, bodyPayload);
    const headerPayload = JSON.stringify({
        token,
        time: timestampSeconds
    });
    const headerSign = desEncrypt(jjxconfig.KEY_HEX, jjxconfig.IV_HEX, headerPayload);
    return { bodySign, headerSign };
}
function decodeUnicode(str) {
    if (typeof str !== "string") return str;
    return str.replace(/\\u[\dA-Fa-f]{4}/g, match =>
        String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16))
    );
}

async function request(op, other = "", method = "get") {
    try {
        const { bodySign, headerSign } = generateSign(jjxconfig.jjwxc.token);
        const encodedBodySign = encodeURIComponent(bodySign);

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": jjxconfig.USER_AGENT,
            "sign": headerSign,
            "SMDeviceID": jjxconfig.SM_DEVICE_ID
        };

        const baseURL = `https://android.jjwxc.net/${op}`;
        const lowerMethod = method.toLowerCase();

        if (lowerMethod === "get") {
            const qs = [`versionCode=${jjxconfig.VERSION_CODE}`, `sign=${encodedBodySign}`];
            if (other) qs.push(other);
            const url = `${baseURL}?${qs.join("&")}`;
            const { data } = await axios.get(url, { headers });
            console.log("请求结果:", data);
            return data;
        }

        if (lowerMethod === "post") {
            const payload = [`versionCode=${jjxconfig.VERSION_CODE}`, `sign=${encodedBodySign}`];
            if (other) payload.push(other);
            const body = payload.join("&");
            const { data } = await axios.post(baseURL, body, { headers });
            console.log("请求结果:", data);
            return data;
        }

        throw new Error(`不支持的HTTP方法: ${method}`);
    } catch (err) {
        console.error("请求出错:", err.message);
        return { error: "签到接口请求出错", details: err.message };
    }
}

/**
 * 晋江新福利中心签到主函数
 */
async function jjwxcNewWelfare() {
    console.log("开始执行晋江签到任务...");

    let message = "";
    let balance = 0;
    let signResult = "";

    try {
        if (!jjxconfig.jjwxc.token || jjxconfig.jjwxc.token === "your_signin_token_here") {
            return "【晋江签到】：请先配置正确的SIGNIN_TOKEN";
        }

        console.log("执行分享邀请...");
        await request("androidapi/shareInvite", "", "post");

        console.log("执行福利任务...");
        for (const id of [1, 2, 3, 4]) {
            await request("newWelfareAndroid/executeGet", `welfare_task_id=${id}`);
        }

        console.log("执行签到...");
        const signRes = await request("androidapi/signin", "", "post");
        if (signRes && signRes.message) {
            signResult = decodeUnicode(signRes.message);
        } else if (signRes && signRes.error) {
            signResult = signRes.error;
        } else {
            signResult = "签到状态未知";
        }

        console.log("开始看广告任务...");
        let adCount = 0;
        for (let i = 0; i < 99; i++) {
            const res1 = await request("newWelfareAndroid/watchAdsAddLog");

            if (res1 && (res1.code == 200 || res1.code == 190011)) {
                await request("newWelfareAndroid//executeGet", "welfare_task_id=8");
                adCount++;
            } else {
                message = res1 && res1.message ? res1.message : "看广告任务结束";
                break;
            }
        }

        if (adCount > 0) {
            message += ` (共看了${adCount}个广告)`;
        }

        console.log("获取账户余额...");
        const balanceRes = await request("newWelfareAndroid/getBalance");
        if (balanceRes && balanceRes.code == 200 && balanceRes.data) {
            balance = balanceRes.data.balance || 0;
        }
    } catch (error) {
        console.error("签到过程中发生错误:", error);
        return `【晋江签到】：执行过程中发生错误 - ${error.message}`;
    }

    const result = `【晋江福利中心】：\n签到：${signResult}\n阳光值：${balance}\n看视频：${message}`;
    console.log("签到任务完成:\n", result);
    return result;
}
module.exports = jjwxcNewWelfare;
