const axios = require("axios");
const {
    MTMC_userId,
    MTMC_fingerprint,
    MTMC_token,
    MTMC_uuid
} = config.MeiTuan
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function get(task, method = "get", data = null) {
    return new Promise(async (resolve) => {
        try {
            let url = `https://mall.meituan.com/api/c/mallcoin/${task}&app_tag=union&bizId=2&ci=2&page_type=h5&poi=10000380&poiId=66&tenantId=1&t=${MTMC_token}&uci=-1&userid=${MTMC_userId}&utm_medium=android&utm_term=5.38.0&uuid=${MTMC_uuid}&xuuid=`
            const headers = {
                t: MTMC_token,
                "user-agent": "Mozilla/5.0 (Linux; Android 11; MEIZU 18 Pro Build/RKQ1.201105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/104.0.5112.69 Mobile Safari/537.36 TitansX/20.12.6 KNB/1.2.0 android/11 com.meituan.retail.v.android/armv7 App/11g20/5.38.0 com.meituan.retail.v.android/5.38.0",
                Host: "mall.meituan.com",
                "X-Requested-With": "com.meituan.retail.v.android",
                "Content-Type": "application/json; charset=utf-8"
            }

            //console.log(headers)
            if (method == "get") res = await axios.get(url, {
                headers
            });
            if (data) {
                xxstr = {
                    "platform": 4,
                    "app": 95,
                    "utm_term": "5.38.0",
                    "uuid": MTMC_uuid,
                    "fingerprint": MTMC_fingerprint,
                    "utm_medium": 95
                }
                data.riskMap ==
                    Object.assign(data.riskMap, xxstr)
            }
            //    console.log(data)
            if (method == "post") res = await axios.post(url, data, {
                headers
            });
            if (res.data.code == 0) console.log("    操作成功")
            //    console.log(headers)
            //        console.log(res.data)
            resolve(res.data)
        } catch (err) {
            console.log(err);
            resolve({
                code: 500,
                error: {
                    msg: "签到接口请求出错"
                }
            })
        }
        resolve();
    });
}

async function getaskList() {
    console.log("查询任务列表")
    let res = await get("checkIn/queryTaskListInfoV3?&channel=1", "post", 　　 {
        "riskMap": {
            "partner": 109,
            "campaignId": 1002,
            "campaignName": "买菜币"
        }
    })
    if (res.code == 0 && res.data) return res.data.checkInTaskInfos.filter(x => x.id == 52 && x.taskFinishCount != x.taskChance || x.status == 100)
    return []
}


async function sign() {
    signmsg = ""
    console.log("去签到：")
    let signRes = await get("checkIn/userCheckInNew?", "post", 　　 {
        "userId": MTMC_userId,
        "riskMap": {}
    })
    if (signRes.code == 0) {
        if (signRes.data.result) signmsg = `签到成功！获得 ${signRes.data.rewardValue} 买菜币`
        else signmsg = `签到失败！可能签到过啦`
        console.log("    " + signmsg)

    } else signmsg = signRes.error.msg
    //console.log(signRes)/
    //
    for (rewardDate of [3, 7]) {
        await get("checkIn/getWeekContinuousRewardNew?", "post", {
            userId: MTMC_userId,
            rewardDate: rewardDate,
            "riskMap": {}
        })
    }
    return signmsg
}
//浏览任务
async function view() {
    let taskList = await getaskList()
    if (taskList.length != 0) {
        let task = taskList[0]
        //领取
        console.log("浏览任务开始：\n  去领取浏览任务：")
        console.log("    " + task.buttonDesc)
        if (task) {

            if (task.buttonDesc == "领任务" || task.status == 10) {
                let lqRes = await get("checkIn/takeTask?activityId=33&taskId=52&channel=1")
                if (lqRes && lqRes.code == 0) {
                    console.log("    领取成功\n等待17s")
                    await sleep(17 * 1000)
                    await get("checkIn/taskEventComplete?eventType=6&channel=1")

                } else console.log("    " + lqRes.error.msg)
                taskList = await getaskList()
                task = taskList[0]
            }

            if (task.buttonDesc == "领奖励") {
                await sleep(3 * 1000)
                console.log("  去领取奖励：")
                let lqReward = await get(`checkIn/takeTaskReward?activityId=33&taskId=52&rewardId=774&taskType=6&userTaskId=${task.userTaskId}&channel=1`)
                if (lqReward && lqReward.code == 0) {
                    console.log(`    领取成功！获得 ${lqReward.data.rewardType}  ${lqReward.data.rewardValue}`)
                }
            }



        } else console.log("    暂无可领取任务")
    }
}
async function getmyb() {
    let res = await get("checkIn/getCheckInMainView?")
    if (res && res.code == 0) return `\n        我的菜币：${res.data.userInfo.balance}\n        签到天数：${res.data.checkInCount}\n        smjb：${res.data.noticeDetail}\n`
    else return ""

}

async function share() {
    console.log("去分享：")
    let res = await get("checkIn/getShareReward?shareBusinessType=2&")
    if (res.code == 0) {
        if (res.data.result) console.log(`    分享成功！获得 ${res.data.rewardValue}菜币`)
        else console.log("    分享过啦")
    }
}
async function meituanmc() {
    let signMsg = await sign()
    await view()
    await share()
    myInfo = await getmyb()
    content = `        签到：${signMsg} ${myInfo}`
    console.log(myInfo)
    return content
}



module.exports = meituanmc