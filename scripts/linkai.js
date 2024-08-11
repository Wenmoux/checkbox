// linkai

const axios = require("axios");

let result = "";
const linkaiConfig = config.linkai;

function _log(msg) {
    console.log(msg);
    result += `${msg}\n`;
}

function login(username, password) {
    return new Promise(async (resolve) => {
        let authorization = "";
        try {
            const response = await axios.post(
                "https://link-ai.tech/api/login",
                `username=${username}&password=${password}`,
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded;charset=UTF-8",
                    },
                }
            );
            authorization = response.data.data.token;
            _log("登录成功!");
        } catch (error) {
            _log("登录失败!");
        }
        resolve(authorization);
    });
}

function signIn(authorization) {
    return new Promise(async (resolve) => {
        try {
            const response = await axios.get(
                "https://link-ai.tech/api/chat/web/app/user/sign/in",
                {
                    headers: {
                        Authorization: `Bearer ${authorization}`,
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                    },
                }
            );
            if (response.data.success) {
                _log(`签到成功，获得 ${response.data.data.score} 积分`);
            } else if (response.data.message.includes("已签到")) {
                _log(`签到成功，${response.data.message}`);
            } else {
                _log(`签到失败，原因：${response.data.message}`);
            }
        } catch (error) {
            console.log(`${error.message}`);
            _log(`签到失败, 请求错误`);
        }
        resolve();
    });
}

async function linkai() {
    _log("【linkai】:");

    let authorization = linkaiConfig.Authorization || null;
    if (!authorization) {
        authorization = await login(
            linkaiConfig.username,
            linkaiConfig.password
        );
    }

    if (authorization) {
        await signIn(authorization);
    }

    return result;
}

module.exports = linkai;
