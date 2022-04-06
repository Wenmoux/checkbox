//晋江小说app福利中心 sign必须抓观看广告的sign 关键字 watchAdsAddLog
const axios = require("axios");
const sign = config.jjwxc.sign
function get(op, other = "", method = "get" ) {
    return new Promise(async (resolve) => {
        try {
            let data = `versionCode=232&sign=${sign}`
            let url = `https://android.jjwxc.net/${op}?versionCode=232&sign=${sign}&${other}`
            if (method == "get") res = await axios.get(url);
            if (method == "post") res = await axios.post(url, data);
            console.log(res.data)
            resolve(res.data)
        } catch (err) {
            console.log(err);
            resolve("签到接口请求出错")
        }
        resolve();
    });
}

async function jjwxcNewWelfare() {
    message = "";
    balance = 0
    await get("androidapi/shareInvite","","post")
    for (id of [1, 2, 3, 4]) {
        await get("newWelfareAndroid/executeGet", "welfare_task_id=" + id)
    }
//签到
    let signres = await get("androidapi/signin","" ,"post")
    signresult = signres&&signres&&signres.message
    for (i = 0; i < 99; i++) {
        let res1 = await get("newWelfareAndroid/watchAdsAddLog") //看广告
        if (res1.code == 200) await get("newWelfareAndroid/executeGet", "welfare_task_id=8")
        else {
            message = res1.message
            break;
        }
    }
    let balanceres = await get("newWelfareAndroid/getBalance")
    if (balanceres.code == 200) balance = balanceres.data.balance
    return "【晋江福利中心】：\n    签到："+signresult+"\n    阳光值：" + balance + "\n    看视频：" + message
}

module.exports = jjwxcNewWelfare;