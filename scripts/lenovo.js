const CryptoJS= require('crypto-js');
const baseinfo =config.lenovo.baseinfo?config.lenovo.baseinfo:"eyJpbWVpIjoiODY1MzE1MDMxOTg1ODc4IiwicGhvbmVicmFuZCI6Imhvbm9yIiwicGhvbmVNb2RlbCI6IkZSRC1BTDEwIiwiYXBwVmVyc2lvbiI6IlY0LjIuNSIsInBob25laW5jcmVtZW50YWwiOiI1NTYoQzAwKSIsIlBhZ2VJbmZvIjoiTXlJbmZvcm1hdGlvbkFjdGlvbkltcGwiLCJwaG9uZWRpc3BsYXkiOiJGUkQtQUwxMCA4LjAuMC41NTYoQzAwKSIsInBob25lTWFudWZhY3R1cmVyIjoiSFVBV0VJIiwibGVub3ZvQ2x1YkNoYW5uZWwiOiJ5aW5neW9uZ2JhbyIsImxvZ2luTmFtZSI6IjE3NjQwNDA4NTM3IiwicGhvbmVwcm9kdWN0IjoiRlJELUFMMTAiLCJzeXN0ZW1WZXJzaW9uIjoiOC4wLjAiLCJhbmRyb2lkc2RrdmVyc2lvbiI6IjI2In0="
const $http=require("axios")
let result = "【联想延保每日签到】："
const account = config.lenovo.account
const password =config.lenovo.password
const parsedWordArray = CryptoJS.enc.Base64.parse(baseinfo);
const info=JSON.parse(parsedWordArray.toString(CryptoJS.enc.Utf8))
let deviceid = info.imei
const url = {
    "login": `https://uss.lenovomm.com/authen/1.2/tgt/user/get?msisdn=${account}`,
    "session": "https://api.club.lenovo.cn/users/getSessionID",
    "sign1": "https://api.club.lenovo.cn/common/signin/add",
    "sign2": "https://api.club.lenovo.cn/signin/v2/add"
}
let lpsutgt = ""
headers = {
    baseinfo: baseinfo,
    unique: deviceid,
    "User-Agent": "LenovoClub/4.1.2 (iPad; iOS 13.6; Scale/2.00)",
    token: "",
    //"User-Agent":"Apache-HttpClient/UNAVAILABLE (java 1.5)",
    Authorization: "",
    "itemid":"1",
    "sversion": "0",
    "X-Lenovo-APPID": "1",
    "versionCode":"1000082"
}

function lxlogin() {
    return new Promise(async (resolve) => {
        try {
            let data = `lang=zh-CN-%23Hans&source=android%3Acom.lenovo.club.app-V4.2.5&deviceidtype=mac&deviceid=${deviceid}&devicecategory=unknown&devicevendor=${info.phoneManufacturer}&devicefamily=unknown&devicemodel=${info.phoneModel}&osversion=${info.systemVersion}&osname=Android&password=${password}`
            let res = await $http.post(url["login"], data);
            let lpsutgt = res.data.match(/<Value>(.+?)<\/Value>/)
            if (lpsutgt) {
                let res2 = await $http.get(`https://uss.lenovomm.com/authen/1.2/st/get?lpsutgt=${lpsutgt[1]}&source=ios%3Alenovo%3Aclub%3A4.1.0&lang=zh-CN&realm=club.lenovo.com.cn`)
                let lpsutgt2 = res2.data.match(/<Value>(.+?)<\/Value>/)
                lpsutgt = lpsutgt2 ? lpsutgt2[1] : null
            }
            //预约游戏id
            result += "登陆成功！|| "
            console.log("login：" + lpsutgt)
            resolve(lpsutgt);
        } catch (err) {
            console.log(err.response);
            lpsutgt = null
            result += "登陆失败！ ||  "
        }
        resolve();
    });
}

function getsession(lpsutgt) {
    return new Promise(async (resolve) => {
        //  let json =""
        try {
            headers.Authorization = "Lenovosso " + lpsutgt
            headers["token"] = lpsutgt
            let s = aesEncrypto(`{"sessionid":"Lenovosso ${lpsutgt}","time":"${new Date().getTime()}"}`)
            url["session"] = url["session"] + `?s=${s}`
            let res3 = await $http.get(url["session"], {
                headers
            })
            let json = {
                lenovoid: res3.data.res.lenovoid,
                sessionid: res3.data.res.sessionid,
                token: res3.data.res.token
            }
            resolve(json)
        } catch (err) {
            console.log(err)
            console.log(decodeURI(err.response.data.res.error_CN))
            result += "获取token失败" + decodeURI(err.response.data.res.error_CN) + "\n"
        }
        resolve();
    });
}

function addsign(session) {
    return new Promise(async (resolve) => {
        try {
            headers.Authorization = "Lenovo " + session.sessionid
            headers["token"] = session.token
            headers["User-Agent"] = "Apache-HttpClient/UNAVAILABLE (java 1.5)"
            headers["Content-Type"] = "text/json"
            data = aesEncrypto(`{"uid":"${session.lenovoid}","imei":"${deviceid}","source":"0","sessionid":"Lenovo ${session.sessionid}","time":"${new Date().getTime()}"}`)
            let res = await $http.post(url["sign2"], data, {
                headers
            })
            console.log(res.data)

            if (typeof(res.data) === "object" & res.data.status == 0) {
                //  msg+=res.data.res.add_yb_tip
                if (!res.data.res.success) {
                    result += "今天已经签到过啦！  "
                    console.log("今天已经签到过啦")
                } else {
                    result += "签到成功||" + res.data.res.rewardTips.replace(/\\n/g," || ") + " || 连续签到" + res.data.res.continueCount + "天"
                    console.log("签到成功    " + res.data.res.rewardTips + "连续签到" + res.data.res.continueCount + "天")

                }

            }
            //  console.log(res.data)
            // console.log(typeof(res.data)=="object"&&res.data.status==0)
        } catch (err) {
            //    console.log(err)
            //    console.log(decodeURI(err.response.data.res.error_CN))
            result += "签到失败" + decodeURI(err.response.data.res.error_CN)
        }
        resolve();
    });
}

function aesEncrypto(text) {
    key = CryptoJS.enc.Utf8.parse('nihao_liu#zh*9@7');
    iv = CryptoJS.enc.Utf8.parse('A*8@Stii_jin)*%6');
    var encrypto =  CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypto.ciphertext.toString()
}

async function lxyb() {
    console.log("任务开始")
    lpsutgt = await lxlogin()

    let session = await getsession(lpsutgt)
    if (session) {
        console.log(session)
        await addsign(session)
    }
    return result
}

module.exports=lxyb
