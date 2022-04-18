//BookId TicketCount 用于投推荐票 不投不要填 TicketCount 投票数量 <=你的推荐票总数 roleId 是比心角色id 需要和BookId那本书一致 不支持多角色 (渣男必须死 划掉x
//qdsign相关解密 https://www.jianshu.com/p/58ec69e04983
const {
    cookie,
    UserId,
    deviceUid,
    BookId,
    TicketCount,
    roleId,
    version
} = config.qidian
QDSign = "";
Message = ""
const cryptojs = require('crypto-js');
const axios = require("axios")

function encrypt(data) {
    let algorithm = 'des-128-cbc'
    let passwd = '{1dYgqE)h9,R)hKqEcv4]k[h'
    let iv = '01234567'
    str = cryptojs.TripleDES.encrypt("" + data, cryptojs.enc.Utf8.parse(passwd), {
        iv: cryptojs.enc.Utf8.parse(iv),
        mode: cryptojs.mode.CBC,
        padding: cryptojs.pad.Pkcs7
    })
    return str.toString()
}
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function QDGet(url, data, method = "post") {
    return new Promise(async (resolve) => {
        try {
            let headers = {
                cookie,
                QDSign,
                "User-Agent": "Mozilla/mobile QDReaderAndroid/7.9.186/674/1000209"
            }
            qdsign = QD(data)
            headers.QDSign = qdsign

            let res = await axios({
                method,
                url: "https://druidv6.if.qidian.com" + url,
                data,
                headers
            })
            console.log(JSON.stringify(res.data))
            resolve(res.data)
        } catch (err) {
            console.log(err)
            if (err.response && err.response.data) resolve(err.response.data)
            else Message += err
        }
        resolve();
    });
}


function QD(data) {
    let str1 = data.split("&")
        .sort(function(a, b) {
            return a.localeCompare(b);
        }).join("&").toLowerCase()
    sign = cryptojs.MD5(str1).toString()
    let str = `Rv1rPTnczce|${Math.floor(Date.now() )}|${UserId}|${deviceUid}|1|${version}|0|${sign}|f189adc92b816b3e9da29ea304d4a7e4`
    qdsign = encrypt(str)
    return qdsign
}

async function qidian() {
    Message += "  签到："
    let QDSign = ""
    let signres = await QDGet("/argus/api/v2/checkin/checkin", "sessionKey=&banId=0&captchaTicket=&captchaRandStr=&challenge=&validate=&seccode=")
    if (signres && (signres.Result == 0)) Message += `签到成功！连签${signres.Data.NoBrokenTime}天`
    else if (signres && signres.Message) Message += signres.Message
    if (TicketCount) {
        //投票
        urltp = "/Atom.axd/Api/InterAction/VoteRecomTicket"
        datatp = `bookId=${BookId}&bookName=&count=${TicketCount}&description=这本书写的太好了,犒劳一下希望后续更精彩!&isSendSina=0&isSendTX=0&clienttype=1400&sourceId=0&sourceType=0`
        let VoteRecomTicketRes = await QDGet(urltp, datatp)
        if (VoteRecomTicketRes && VoteRecomTicketRes.Message) Message += "\n  投推荐票：" + VoteRecomTicketRes.Message
    }
    //笔芯 
    urlbx = "/argus/api/v1/bookrole/setrolelikestatus"
    let databx = `bookId=${BookId??"1033475139"}&roleId=${roleId??("61367713050100871")}&likeStatus=1`
    let likeRes = await QDGet(urlbx, databx)
    if (likeRes && likeRes.Message) Message += "\n  比心：" + likeRes.Message
    //每日抽卡
    urlck = "/argus/api/v2/bookrole/card/call?type=1&costType=1&cardpoolid=0"
    datack = "type=1&costType=1&cardpoolid=0"
    let ckres = await QDGet(urlck, datack, "get")
    if (ckres && ckres.Result == 0) Message += "\n  抽卡：" + "恭喜你欧气爆棚！！获得：" + ckres.Data.Items[0].CardName
    else Message += "\n  抽卡：" + ckres.Message
    return "【起点读书：】\n" + Message
}
module.exports = qidian