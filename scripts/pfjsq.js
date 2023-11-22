const axios = require("axios");

let result = "【泡芙加速器】："

class PFJS {
    constructor() {
        this.host = 'https://api-admin-js.paofujiasu.com/';
        this.headers = {
            "Host": "api-admin-js.paofujiasu.com",
            "User-Agent": "Mozilla/5.0 (Linux; Android 12; M2012K11AC Build/SKQ1.220303.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/107.0.5304.141 Mobile Safari/537.36 XWEB/5169 MMWEBSDK/20221011 MMWEBID/6242 MicroMessenger/8.0.30.2260(0x28001E3B) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android",
            "tokentype": "applet",
            "Content-Type": "application/json",
            "token": config.pfjsq.token,
        };
        this.count = 0;
        this.body = '{"res_type":1}';
    }

    // 检查金币是否满5个
    async check_gold(msg) {
        if (msg.indexOf('5个金币') !== -1) {
            await this.exchange();
        }
    }

    // 兑换6小时时长卡
    async exchange() {
        const url = this.host + 'client/api/v1/virtual_currency/exchange_by_species';
        try {
            this.body = '{"rule_id":4}'
            const res = await axios.post(url, this.body, {headers: this.headers});
            console.log(`兑换${res.data.info}`);
            result += `兑换${res.data.info} ||`
        } catch (error) {
            console.log(`兑换失败，原因是：${error.response.data.info}`);
            result += `兑换失败，原因是：${error.response.data.info} ||`
        }
    }

    // 签到
    async sign() {
        const url = this.host + 'client/api/v1/virtual_currency/sign_in_for_species';
        try {
            const res = await axios.post(url, this.body, {headers: this.headers});
            console.log(`签到${res.data.data.info}`);
            result += `签到${res.data.data.info} ||`
            await this.check_gold(res.data.data.info)
        } catch (error) {
            console.log(`签到失败，原因是：${error.response.data.info}`);
            result += `签到失败，原因是：${error.response.data.info} ||`
            await this.check_gold(error.response.data.info)
        }
    }

    async getAd() {
        const url = this.host + 'client/api/v1/virtual_currency/look_ad_count';
        try {
            const res = await axios.get(url, {headers: this.headers});
            console.log(`广告${res.data.data.sign_count}/${res.data.data.limit_count}`);
            this.count = res.data.data.limit_count - res.data.data.sign_count;
        } catch (error) {
            console.log(`查询广告失败，原因是：${error.response.data.info}`);
        }
    }

    // 看广告前置
    async lookAdForPower() {
        const url = this.host + 'client/api/v1/virtual_currency/look_ad_for_power';
        try {
            const res = await axios.post(url, this.body, {headers: this.headers});
            console.log(`目前倍率：${res.data.data.power}`);
        } catch (error) {
            console.log(`看广告失败，原因是：${error.response.data.info}`);
        }
    }

    // 看广告
    async lookAd() {
        const url = this.host + 'client/api/v1/virtual_currency/look_ad_for_species';
        try {
            const res = await axios.post(url, this.body, {headers: this.headers});
            console.log(`看广告${res.data.info}`);
            await this.check_gold(res.data.data.info)
            result += `看广告${res.data.info} ||`
        } catch (error) {
            console.log(`看广告失败，原因是：${error.response.data.info}`);
            await this.check_gold(error.response.data.info)
            result += `看广告失败，原因是：${error.response.data.info} ||`
        }
    }

    async run() {
        await this.sign();
        await this.getAd();
        console.log();
        for (let i = 0; i < this.count; i++) {
            console.log(`--------------- 第${i + 1}轮广告 ---------------`);
            await this.lookAdForPower();
            await this.lookAd();
            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000));
        }
        console.log();
    }
}

async function pfjsq() {
    const pfjs = new PFJS();
    await pfjs.run();
    if (result.endsWith('||')) {
        result = result.substring(0, result.length - 2);
    }
    return result;
}

module.exports = pfjsq;
