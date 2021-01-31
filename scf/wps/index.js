const axios = require("axios")



exports.main_handler =  async() => {
 await task()
};

/*
wps会员群集结
https://github.com/Wenmoux/checkbox
活动地址：WPS会员公众号-福利签到-打卡免费领会员-群集结
奖励：集结成功3次,获得6天会员+10M空间
运行方法：获取sid,填入,就可以了
注意：不要手动开团
     最好换4个自己小号的sid,默认的可能用的人多九妹次数乐
     建议13人抱团,节省sid,还能保证sid有效
     格式为用户名@sid如下所示,最多13个(加上开团的自己的)
     https://cdn.jsdelivr.net/gh/Wenmoux/wenpic/other/IMG_20210122_111815.jpg
*/

let ssid = [
    "僵尸用户1@V02S2UBSfNlvEprMOn70qP3jHPDqiZU00a7ef4a800341c7c3b",
    "僵尸用户2@V02StVuaNcoKrZ3BuvJQ1FcFS_xnG2k00af250d4002664c02f",
    "僵尸用户3@V02SWIvKWYijG6Rggo4m0xvDKj1m7ew00a8e26d3002508b828",
    "僵尸用户4@V02Sr3nJ9IicoHWfeyQLiXgvrRpje6E00a240b890023270f97",
    "僵尸用户5@V02SBsNOf4sJZNFo4jOHdgHg7-2Tn1s00a338776000b669579",
    "僵尸用户6@V02ScVbtm2pQD49ArcgGLv360iqQFLs014c8062e000b6c37b6",
    "僵尸用户7@V02S2oI49T-Jp0_zJKZ5U38dIUSIl8Q00aa679530026780e96",
    "僵尸用户8@V02ShotJqqiWyubCX0VWTlcbgcHqtSQ00a45564e002678124c",
    "僵尸用户9@V02SFiqdXRGnH5oAV2FmDDulZyGDL3M00a61660c0026781be1",
    "僵尸用户10@V02S7tldy5ltYcikCzJ8PJQDSy_ElEs00a327c3c0026782526",
    "僵尸用户11@V02SPoOluAnWda0dTBYTXpdetS97tyI00a16135e002684bb5c",
    "僵尸用户12@V02Sb8gxW2inr6IDYrdHK_ywJnayd6s00ab7472b0026849b17",
    "僵尸用户13@V02SwV15KQ_8n6brU98_2kLnnFUDUOw00adf3fda0026934a7f",
    "僵尸用户14@V02SC1mOHS0RiUBxeoA8NTliH2h2NGc00a803c35002693584d"
]
k = 0
t = 1
name = "僵尸用户1" //开团人名字,随意
sid = "V02S2UBSfNlvEprMOn70qP3jHPDqiZU00a7ef4a800341c7c3b" //这里填你的sid/开团人的sid
headers = {
    sid
}
code = null
const wpsapi = "https://zt.wps.cn/2020/massing/api"


function cha() {
    return new Promise(async resolve => {
        try {
            let res = await axios.get(wpsapi, {
                headers
            })
            if (res.data.result == "ok" && res.data.data && res.data.data.reward) {
                reward = res.data.data.reward
                console.log(`今日集结${reward.time}次,共集结${reward.total_time}次。获得${reward.member}天会员,${reward.drive}M空间`)
                if (res.data.data.latest_record && res.data.data.latest_record.code && !res.data.data.latest_record.is_timeout) {
                    code = res.data.data.latest_record.code
                    console.log(name + "已开团：" + code)
                }
            } else {
                console.log("sid已失效,请重新获取sid")
            }
        } catch (err) {
            console.log(err)
        }
        resolve()
    })
}

//开团
async function kai() {
    let res = await axios.post(wpsapi, {}, {
        headers
    })
    if (res.data.result == "error" && res.data.msg == "up to limit") {
        console.log("今日集结次数已达到上限,请明日再来")
        t = null
    } else if (res.data.data && res.data.data.code) {
        console.log(name + "  开团成功：" + res.data.data.code)
        code = res.data.data.code
    } else {
        console.log(res.data)
    }
}

//参团
async function can(code) {
    invitedata = `code=${code}`
    for (i = 0; i < ssid.length; i++) {
        sidd = ssid[i].split("@")
        let res = await axios.post("https://zt.wps.cn/2020/massing/api", invitedata, {
            headers: {
                sid: sidd[1]
            }
        })
        if (res.data.result == "ok") {
            console.log(`${sidd[0]} 参团成功`)
        } else {
            if (res.data.msg == "no login") {
                console.log(`${sidd[0]}🔫🔫🔫 这个b的sid已经失效啦！干他！！！`)
            } else if (res.data.msg == "up to limit") {
                console.log(`${sidd[0]}🔫🔫🔫 已经参团3次啦！干他！！！`)
            } else {
                console.log(res.data)
            }
            //  console.log(`${sidd[0]} 参团失败`)
        }
    }
}

async function task() {
    await cha()
    for (l = 0; l < 3; l++) {
        await kai()
        if (code && t) {
            await can(code)
        }
    }
    await cha()
}
