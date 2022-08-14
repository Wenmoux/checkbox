//晋江小说app福利中心 sign必须抓观看广告的sign 关键字 watchAdsAddLog
const axios = require("axios");
//const sign = config.jjwxc.sign
tickketok = true
function get(op, data) {
    return new Promise(async (resolve) => {
        try {
            data = `type=3002&plateType=4&ticket=${config.wb.ticket}&appVersion=104302&appId=10002&channelId=17&deviceId=&deviceInfo=MEIZU%2018%20Pro%281080%2A2296%29&__nsr=&__cf=yes&${data}`
            let url = `https://www.wodidashi.com/web/webApi/${op}`
            let headers = {
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": "Mozilla/5.0 (Linux; Android 11; MEIZU 18 Pro Build/RKQ1.201105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/102.0.5005.125 Mobile Safari/537.36?AppType/Wanba_WanBa?AppVersion/104302?Device/MEIZU 18 Pro?Pixel/1080_2296?Language/zh_CN?NetType/WIFI?",
                "x-requested-with": "com.wodi.who"
            }
            let res = await axios.post(url, data, {
                headers
            });

            //   console.log(res.data)
            resolve(res.data)
        } catch (err) {
            console.log(err);
            resolve({
                code: 10086,
                msg: (err.message ? err.message : err.code)
            })
        }
        resolve();
    });
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

async function wb() {
    message = "";
    signresult = ""
    taskConfigId = null
    //签到
    let signres = await get("activity/signIn", `uid=144846574&date=${getNowFormatDate()}`)
  console.log(signres.data)
      if (signres && signres.code == 0) {
        signres = signres.data
        let reward = signres.rewards.map(tag => (`${tag.title} ${tag.desc}`)).join("  ")
        signresult = `${reward} \n 累签 ${signres.signInCount}`
    } else {
        signresult = signres.msg
    }
    console.log(signresult)
    message += `    今日签到：${signresult}\n`
    //每日暖心福利
    let freeRes = await get("activity/process/triggerEvent", "eventName=freeLottery&activityCode=454")
 console.log(freeRes)
       if (freeRes) {
        if (freeRes.code == 0) {
            freeRes = freeRes.data
            freeResult = freeRes.prize.desc    
        } else {
            freeResult = freeRes.msg
        }
        message += `    暖心福利：${freeResult}\n`
    }
    
    date = new Date()
    if(date.getHours()==12) taskConfigId=500001
      if(date.getHours()==20) taskConfigId= 500002
      console.log(date.getHours())
    //午间福利12-13
 if(taskConfigId) { 
let Cres =  await get("task/userReceiveRewards",`taskConfigId=${taskConfigId}`)
console.log(Cres)
if(Cres && Cres.code == 0) message += `    限时登陆：${Cres.data.name}\n`
else message += `    限时登陆：${Cres.msg}\n`
 }

    //查询
    let ires = await get("gradeAward/personalInformation", "")
    if (ires && (ires.code == 0) && ires.data) me = `    昵称：${ires.data.username}\n    等级：Lv${ires.data.level}\n    距下级差：${ires.data.updateNeedScore}积分\n` 
    let coinfo = await get("shop/getNewShopInfo","source=100106")
    if(coinfo && (coinfo.code == 0)&& coinfo.data) {
    codata = coinfo.data.currencyList
    coinfo = `    我的资产：钻石 x ${codata[0].count} 金币 x ${codata[1].count}  逗豆 x ${codata[2].count} \n`
 message = me+coinfo+message
       }

    return `【玩吧】：\n${message}`
}

module.exports = wb;