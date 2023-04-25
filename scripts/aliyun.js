const axios = require("axios")

refresh_token = config.aliyun.refresh_token
function aliyun() {
    return new Promise(async (resolve) => {
    try {
        const url = 'https://auth.aliyundrive.com/v2/account/token';
        const headers = {
            "Content-Type": "application/json; charset=UTF-8",
        };
        const data = {"grant_type":"refresh_token",
                      "app_id":"pJZInNHN2dZWk8qg",
                      "refresh_token":`${refresh_token}`
                    };

        let res = await axios.post(url, data, headers);
        if (res.data.code == 'InvalidParameter.RefreshToken' || res.data.code == 'RefreshTokenExpired') {
            console.log(`token刷新失败,${res.data.message}`);
            msg = "token刷新失败"
        }
        else{
            const name = res.data.nick_name
            const token = res.data.access_token
            console.log(name,token)
            return sign(token, name)
        }

    } catch (error) {
        console.log(error);
        msg = "签到接口请求失败";
    }
        resolve("【阿里云盘】：" + msg);
    })
}

async function sign(token, name) {
    return new Promise(async (resolve) => {
        try {
            // const url = 'https://member.aliyundrive.com/v1/activity/sign_in_list';
            // const headers = {
            //     "Content-Type": "application/json",
            //     "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/20D5024e iOS16.3 (iPhone15,2;zh-Hans-CN) App/4.1.3 AliApp(yunpan/4.1.3) com.alicloud.smartdrive/28278449  Channel/201200 AliApp(AYSD/4.1.3) com.alicloud.smartdrive/4.1.3 Version/16.3 Channel/201200 Language/zh-Hans-CN /iOS Mobile/iPhone15,2 language/zh-Hans-CN",
            //     Authorization: "Bearer "+token
            // }
            // const data = {"isReward": false}
            // let res = await axios.post(url, data, headers)
            const res = await axios.post('https://member.aliyundrive.com/v1/activity/sign_in_list', {
                isReward: false},{
                headers:{
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/20D5024e iOS16.3 (iPhone15,2;zh-Hans-CN) App/4.1.3 AliApp(yunpan/4.1.3) com.alicloud.smartdrive/28278449  Channel/201200 AliApp(AYSD/4.1.3) com.alicloud.smartdrive/4.1.3 Version/16.3 Channel/201200 Language/zh-Hans-CN /iOS Mobile/iPhone15,2 language/zh-Hans-CN",
                Authorization: "Bearer "+token
                }
            })
            if (res.data.success) {
                console.log(`${name}，已连续签到${res.data.result.signInCount}天!`)
            }
            else {
                console.log(`${name}，签到失败，${res.data.message}!`)
                msg = "签到失败"
            }

        } catch (error) {
            console.log(error)
            msg = "签到接口请求失败"
        }
        resolve("【阿里云盘】：" + msg)
    });
}

module.exports = aliyun;