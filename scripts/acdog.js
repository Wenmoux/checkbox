let header = {
    headers: {
        'referer': 'https://www.acgndog.com/category/qingxiaoshuo',
        'cookie': config.acdog.cookie }
}
const axios = require("axios")
let result = "次元🐕：\n"
async function getnonce() {
    var res = await axios.get('https://www.acgndog.com/wp-admin/admin-ajax.php?action=d2e5b56b75e2f3d4ab412a6d9561faee&%5Btype%5D=checkSigned&6bce68d6adeec8e9a3fb135daeb30b7f%5Btype%5D=checkUnread&7a2a6dd56f97c9a9a1b3bd5ade6d8f17%5Btype%5D=getUnreadCount', header)
    if (res.data.user.uid) {
        msg = "当前共" + res.data.customPoint.point + "狗爪\n"
        nonce = res.data._nonce
        result += msg
        console.log(msg)
        await dailysign(nonce)
    } else {
        msg = "cookie已失效"
        result += msg
        console.log(msg)
    }    
    return result
}

async function dailysign(nonce) {
    var res = await axios.get("https://www.acgndog.com/wp-admin/admin-ajax.php?_nonce=" + nonce + "&action=5ced0113734a2bc46ecf3f30b0685b7b&type=goSign", header)
    if (res.data.code == 0) {
        msg = res.data.msg
    } else {
        msg = "签到失败"
        console.log(res.data)

    }
    console.log(msg)
    result += msg
}

module.exports = getnonce