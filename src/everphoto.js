const axios = require("axios")
phone = ""
password = ""
let header = {
    headers: {
        "User-Agent": "EverPhoto/2.7.0 (Android;2702;ONEPLUS A6000;28;oppo)",
        "x-device-mac": "02:00:00:00:00:00",
        "application": "tc.everphoto",
        "authorization": "Bearer 94P6RfZqvVQ2hH4jULaYGI",
        "x-locked": "1",
        "content-length": "0"
    }
}
token = null
function balance() {
    return new Promise(async resolve => {
        try {
            let url = 'https://web.everphoto.cn/api/auth'
            data = `mobile=+86${phone}&password=${password}`
            let res = await axios.post(url, data, header)
            token = res.data.data.token
        } catch (err) {
            console.log("登陆失败" + err.response.data.message)
        }
        resolve()
    })
}
function check() {
    return new Promise(async resolve => {
        try {
            let url = 'https://api.everphoto.cn/users/self/checkin/v2'
            data = ""
            let res = await axios.post(url, data, header)
            if (res.data.code == 0) {
                if (!res.data.data.checkin_result) {
                    console.log("已签到过或签到失败")
                } else {
                    console.log("签到成功")
                }
            } else {
                console.log("签到失败")
            }
        } catch (err) {
            console.log(err.response.data.message)
        }
        resolve()
    })
}
async function task() {
    await balance()
    header.headers.authorization = `Bearer ${token}`
    await check()
}



task()
