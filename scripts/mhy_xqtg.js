const axios = require("axios")

cookie = config.mhy_xqtg.cookie
const headers = {
    "Content-Type": "application/json",
    "Cookie": `${cookie}`,
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.37(0x18002523) NetType/WIFI Language/zh_CN"
};

function mhy_xqtg() {
    return new Promise(async (resolve) => {
    try {
        const url = 'https://api-takumi.mihoyo.com/event/pointsmall/task/index';
        let res = await axios.get(url, {headers});
        if (res.data.retcode == 0){
            const obj = res.data.data.list
            // console.log(obj)
            await task(obj)
        }else{
            msg = "接口请求失败";
        }

    } catch (error) {
        console.log(error);
        msg = "接口请求失败";
    }
        resolve("【星穹铁道活动】：" + msg);
    })
}

function task(obj) {
    return new Promise(async (resolve) => {
    try {
        let message = "【星穹铁道活动】：\n";
        for (let i = 0; i < obj.length; i++){
            const item = obj[i];
            const url = 'https://api-takumi.mihoyo.com/event/pointsmall/task/finish';
            
            const data = {"id":`${item.id}`};
            let res = await axios.post(url, data, {headers});

            const url2 = 'https://api-takumi.mihoyo.com/event/pointsmall/task/award/receive';
            let res2 = await axios.post(url2, data, {headers});

            message += `${item.name}: ${res2.data.message}\n`;
        }
        const url3 = 'https://api-takumi.mihoyo.com/event/pointsmall/task/index';
        let res3 = await axios.get(url3, {headers});
        message += "我的积分：" + res3.data.data.user_score
        console.log(message);

    } catch (error) {
        console.log(error);
        msg = "接口请求失败";
    }
        resolve("【星穹铁道活动】：" + msg);
    })
}

module.exports = mhy_xqtg;