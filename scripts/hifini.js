const axios = require('axios');
const headers = {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    "X-Requested-With": "XMLHttpRequest",
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    "cookie": config.hifini.cookie
};

async function getSign() {
    const url = 'https://www.hifini.com/sg_sign.htm';
    try {
        const res = await axios.get(url, {headers});
        const sign = res.data.match(/sign = \"(.*?)\";/);
        return sign[1];
    } catch (err) {
        console.error("获取sign出错", err);
        return null;
    }
}

async function task() {
    const url = 'https://www.hifini.com/sg_sign.htm';
    const sign = await getSign();
    if (!sign) return "【HiFiNi每日签到】：签到接口请求出错";

    try {
        const res = await axios.post(url, {sign}, {headers});
        const msg = res.data.message;
        console.log(msg);
        return "【HiFiNi每日签到】：" + msg;
    } catch (err) {
        console.error("签到接口请求出错", err);
        return "【HiFiNi每日签到】：签到接口请求出错";
    }
}

module.exports = task;
 

