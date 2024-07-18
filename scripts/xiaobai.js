const axios = require("axios");

// Debug
// const yaml = require("js-yaml");
// const fs = require("fs");
// if (fs.existsSync("./config.yml"))
//     config = yaml.load(fs.readFileSync("./config.yml", "utf8"));

const xiaobaiAccounts = config.xiaobai;

const host = "xb.xiaobaigongju.com";
const headers = {
    thirdSession: "",
    "user-agent":
        "Mozilla/5.0 (Linux; Android 14; V2055A Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 uni-app Html5Plus/1.0 (Immersed/28.0)",
    "Content-Type": "application/json",
    Host: host,
};

async function xiaobai() {
    let result = "【小白云盘每日签到】\n";
    console.log(result);
    let accountResults = [];
    try {
        const promises = xiaobaiAccounts.map(async (account, index) => {
            let accountResult = `第${index + 1}个账号(${account.username})：`;
            accountResult += await xiaobai_sign_add(account);
            accountResults.push(accountResult);
        });

        await Promise.all(promises);
        result += accountResults.join("\n");
    } catch (error) {
        result += "运行错误";
    }
    console.log("小白云盘运行结束。");
    return result;
}

async function xiaobai_login(username, password) {
    try {
        const loginUrl = `https://${host}/v1/app/m/user/login`;
        const postData = {
            phone: username,
            password: password,
            invitedCode: "",
        };

        const response = await axios.post(loginUrl, postData, { headers });

        if (response.data && response.data.code === 200) {
            const sessionKey = response.data.data.sessionKey;
            headers.thirdSession = sessionKey;
            console.log(`登录成功：${username}`);
            return "登录成功--";
        } else {
            console.error(`登录失败：${username}`);
            return "登录失败";
        }
    } catch (error) {
        console.error(`登录帐户时出错：${username}: ${error.message}`);
        return "登录出错";
    }
}

async function xiaobai_sign_add(account) {
    try {
        let loginResult = await xiaobai_login(
            account.username,
            account.password
        );

        if (loginResult.includes("登录成功")) {
            // 签到操作
            const signUrl = `https://${host}/v1/app/m/sign/add`;
            const response = await axios.post(signUrl, {}, { headers });

            if (response.data && response.data.code === 200) {
                console.log(`签到成功：${account.username}`);
                return loginResult + "签到成功";
            } else if (
                response.data &&
                response.data.code === 500 &&
                response.data.msg === "您今日已经签到过了哦!"
            ) {
                console.log(`今日已经签到过了：${account.username}`);
                return loginResult + "今日已经签到过了";
            } else {
                console.error(`签到失败：${account.username}`);
                return loginResult + `签到失败--${response.data.msg}`;
            }
        } else {
            // 登录失败处理
            console.error(`登录失败：${account.username}, 跳过登录。`);
            return loginResult;
        }
    } catch (error) {
        console.error(`签到时出错：${account.username}: ${error.message}`);
        return "签到出错";
    }
}

// Debug
// xiaobai().then(() => {
//     console.log("\n");
//     console.log(result);
// });

module.exports = xiaobai;
