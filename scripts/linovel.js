const axios = require("axios");
const { username,password  } = config.linovel
headers = {
    referer: "https://www.linovel.net/my/profile",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
    cookie: " "
}

function get(op, data) {
    return new Promise(async (resolve) => {
        try {
            let url = `https://www.linovel.net/my/${op}?xhr=1`;
            let res = await axios.get(url, {
                headers
            });
            if (data) res = await axios.post(op, data, {
                headers
            });
            if (res.data.code == 0) {
                msg = res.data.msg
                if (op == "qiandao") msg = `签到成功✅ 获得${res.data.data.base}墨水，连签${res.data.data.day}天`;
                if (op == "getMonthlyTicket") msg = `领取月票成功✅ 获得${res.data.data.now}月票`;

            } else {
                msg = res.data.msg
            }
            if (data) {
                ckk = res.headers["set-cookie"];
                ck = "";
                for (i = 0; i < ckk.length; i++) {
                    ck += ckk[i].split("expires")[0] + ";"
                }
                headers.cookie = ck
            }
            resolve(msg)
        } catch (err) {
            console.log(err);
            resolve("签到接口请求出错")
        }
        resolve();
    });
}

async function login(kotori) {
    let loginRes = await get("https://www.linovel.net/auth/doLogin", `_kotori=${kotori}&lgt=1&redirect=%2F&username=${username}&password=${password}`)
    console.log(loginRes)
    if (loginRes == "登录成功") gg = true
    else gg = false
    return gg
}

function getkotori() {
    return new Promise(async (resolve) => {
        try {
            let res = await axios.get("https://www.linovel.net/auth/login?lgt=1")
            let t = res.data.match(/\"_kotori\" value=\"(.+?)\"/)
            resolve(t && t[1])
        } catch (err) {
            //  console.log(err);
            resolve()
        }
        resolve();
    });
}

async function linovel() {
    r = false
    let kotori = await getkotori()
    if (kotori) r = await login(kotori)
    if (r) {
        let qdmsg = await get("qiandao")
        let ypmsg = await get("getMonthlyTicket")
        let Liresult = `【轻之文库】：\n签到:${qdmsg}\n领取月票:${ypmsg}`
        return Liresult
    } else return "【轻之文库】：登陆失败"
}
module.exports = linovel;