let account = config.sxmd.account;
let password = config.sxmd.password;
const iconv = require("iconv-lite");
const axios = require("axios");
let ck = null;
let formhash = null;
let result = "【书香门第】：";
var headers = {
    Host: "www.txtnovel.top",
    cookie: "  ",
    referer: "http://www.txtnovel.top/member.php?mod=logging&action=login&mobile=2",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.83 Mobile Safari/537.36",
}

function login() {
    return new Promise(async (resolve) => {
        try {
            let loginurl =
                "http://www.txtnovel.top/member.php?mod=logging&action=login&loginsubmit=yes&loginhash=&mobile=2";;
            let data = `formhash=&referer=http%3A%2F%2Fwww.txtnovel.top%2F&fastloginfield=username&cookietime=2592000&username=${account}&password=${password}&questionid=0&answer=&submit=true`;
            let res = await axios.post(loginurl, data, {
                    headers
                }
            );
            resdata = res.data
            if (resdata.match(/欢迎您回来/)) {
                result += "登陆成功  ";
                console.log("登陆成功");
                ckk = res.headers["set-cookie"];
                ck = "";
                for (i = 0; i < ckk.length; i++) {
                    ck += ckk[i].split("expires")[0];
                }
            } else {
                console.log("登陆失败");
                let message = resdata.match(
                    /<div id=\"messagetext\">.*?<p>(.+?)<\/p>/s
                );
                result += "登陆失败  ";
            }
        } catch (err) {
            console.log(err);
        }
        resolve();
    });
}

function getformhash() {
    return new Promise(async (resolve) => {
        try {
            let url = `http://www.txtnovel.top/plugin.php?id=dsu_paulsign:sign&mobile=yes`;
            let res = await axios.get(url, {
                headers
            });
            formhash = res.data.match(
                /<input type=\"hidden\" name=\"formhash\" value=\"(.+?)\" \/>/s
            )[1];
        } catch (err) {
            console.log(err);
        }
        resolve();
    });
}

function sign() {
    return new Promise(async (resolve) => {
        try {
            let url = `http://www.txtnovel.top/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes`;
            let data = `formhash=${formhash}&qdxq=kx`;
            let res = await axios.post(url, data, {
                headers
            });
            let message = res.data.match(/<div id=\"messagetext\">.*?<p>(.+?)<\/p>/s);
            if (message) {
                result += message[1] + "！  ";
            } else {
                result += "签到失败！  ";
            }
        } catch (err) {
            console.log(err);
        }
        resolve();
    });
}

function info() {
    return new Promise(async (resolve) => {
        try {
            let url = `http://www.txtnovel.top/home.php?mod=space&`;
            let res = await axios.get(url, {
                headers
            });
            let message = res.data.match(/<li><em>金币<\/em>(.+?) 枚<\/li>/);
            if (message) {
                result += "金币：" + message[1];
            }
        } catch (err) {
            console.log(err);
        }
        resolve();
    });
}
async function task() {
    await login();
    headers.cookie = ck;
    if (ck) {
        await getformhash();
        await sign();
        await info();
        console.log(result);
    } else {}
    return result;
}

//task();
module.exports = task;