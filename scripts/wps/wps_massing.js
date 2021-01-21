/*
wps会员群集结
活动地址：WPS会员公众号-福利签到-打卡免费领会员-群集结
奖励：集结成功3次,获得6天会员+10M空间
运行方法：获取sid,填入,就可以了
注意：不要手动开团
     最好换4个自己小号的sid,默认的可能用的人多九妹次数乐
*/
     

const axios= require("axios")

invite_sid =[
  'V02S2UBSfNlvEprMOn70qP3jHPDqiZU00a7ef4a800341c7c3b',
  'V02StVuaNcoKrZ3BuvJQ1FcFS_xnG2k00af250d4002664c02f',
  'V02SWIvKWYijG6Rggo4m0xvDKj1m7ew00a8e26d3002508b828',
  'V02Sr3nJ9IicoHWfeyQLiXgvrRpje6E00a240b890023270f97',
  'V02SBsNOf4sJZNFo4jOHdgHg7-2Tn1s00a338776000b669579',
  'V02ScVbtm2pQD49ArcgGLv360iqQFLs014c8062e000b6c37b6',
  'V02S2oI49T-Jp0_zJKZ5U38dIUSIl8Q00aa679530026780e96',
  'V02ShotJqqiWyubCX0VWTlcbgcHqtSQ00a45564e002678124c',
  'V02SFiqdXRGnH5oAV2FmDDulZyGDL3M00a61660c0026781be1',
  'V02S7tldy5ltYcikCzJ8PJQDSy_ElEs00a327c3c0026782526',
  'V02SPoOluAnWda0dTBYTXpdetS97tyI00a16135e002684bb5c',
  'V02Sb8gxW2inr6IDYrdHK_ywJnayd6s00ab7472b0026849b17',
  'V02SwV15KQ_8n6brU98_2kLnnFUDUOw00adf3fda0026934a7f',
  'V02SC1mOHS0RiUBxeoA8NTliH2h2NGc00a803c35002693584d'
]
k = 0
sid = ""//这里填你的sid
headers = {
    sid
}
code = ""
const wpsapi = "https://zt.wps.cn/2020/massing/api"


function cha() {
    return new Promise(async resolve => {
        try {
            let res = await axios.get(wpsapi, {
                headers
            })
            if (res.data.result == "ok" &&res.data.data&& res.data.data.reward) {
                reward = res.data.data.reward
                console.log(`今日集结${reward.time}次,共集结${reward.total_time}次。获得${reward.member}天会员,${reward.drive}M空间`)
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
    } else if (res.data.data && res.data.data.code) {
        console.log("开团成功：" + res.data.data.code)
        code = res.data.data.code
    } else {
        console.log(res.data)
    }
}

//参团
async function can(code) {
    invitedata = `code=${code}`
    for (i = 0; i < invite_sid.length && k < 4; i++) {
        let res = await axios.post("https://zt.wps.cn/2020/massing/api", invitedata, {
            headers: {
                sid: invite_sid[i]
            }
        })      
        if (res.data.result == "ok") {
            k++
            console.log(`第${k}个好友参与成功`)
        } else {
            console.log(res.data)
        }

    }

}

async function task() {
    await cha()
    for (l=0;l<3;l++){
    await kai()
    if (code) {
        await can(code)
    }}
    await cha()
}

task()