// formhash获取(在浏览器F12控制台输入)：document.querySelector('input[name="formhash"]').getAttribute('value')

const axios = require("axios");
let result = "【海贼王论坛】："

class HZW {
    constructor() {
        this.host = 'https://bbs.talkop.com/plugin.php';
        this.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": config.hzw.cookie,
        };
        this.body = `formhash=${config.hzw.formhash}&qdxq=kx&qdmode=2&todaysay=&fastreply=0`;
    }

    // 签到
    async sign() {
        const url = this.host + '?id=dsu_paulsign:sign&operation=qiandao&infloat=1&sign_as=1&inajax=1';
        try {
            const res = await axios.post(url, this.body, {headers: this.headers});
            let matchResult = res.data.match(/(.+?)\r\n<\/div>/);
            let response = matchResult ? matchResult[1] : '签到失败，原因未知';
            console.log(`${response}`);
            result += `${response} ||`
        } catch (error) {
            console.log(`签到失败，原因是：${error}`);
            result += `签到失败，原因是：${error} ||`
        }
    }

    async run() {
        await this.sign();
        console.log();
    }
}

async function hzw() {
    const hzwlt = new HZW();
    await hzwlt.run();
    if (result.endsWith('||')) {
        result = result.substring(0, result.length - 2);
    }
    return result;
}

module.exports = hzw;
