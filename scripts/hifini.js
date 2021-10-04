const axios = require("axios")
function task() {
    return new Promise(async resolve => {
        try {
            let url = 'https://www.hifini.com/sg_sign.htm'
            let res = await axios.post(url, "000", {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "cookie": config.hifini.cookie
                }
            })
            msg = res.data.message
            console.log(msg)
        } catch (err) {
            console.log(err)
            msg = "签到接口请求出错"
        }
        resolve("【HiFiNi每日签到】：" + msg)
    })
}


//task()
module.exports = task