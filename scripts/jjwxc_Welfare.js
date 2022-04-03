//晋江小说app福利中心 sign必须抓观看广告的sign 关键字 watchAdsAddLog
const axios = require("axios");
const sign = config.jjwxc.sign
function get(op, other = "", method = "get", data = null) {
    return new Promise(async (resolve) => {
        try {
            let url = `https://android.jjwxc.net/newWelfareAndroid/${op}?versionCode=232&sign=${sign}&${other}`
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
    for (id of [1, 2, 3, 4]) {
        await get("executeGet", "welfare_task_id=" + id)
    }

    for (i = 0; i < 99; i++) {
        let res1 = await get("watchAdsAddLog") //看广告
        if (res1.code == 200) await get("executeGet", "welfare_task_id=8")
        else {
            message = res1.message
            break;
        }
    }
    let balanceres = await get("getBalance")
    if (balanceres.code == 200) balance = balanceres.data.balance
    return "【晋江福利中心】：\n    阳光值：" + balance + "\n    看视频：" + message
}

module.exports = jjwxcNewWelfare;