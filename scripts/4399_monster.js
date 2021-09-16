/*
一天4次
邀请链接：https://yxhhd2.5054399.com/comm/bzyld2/share/index.php?ext=3091185497
2021-09-07 10:24
@wenmoux
*/

const axios = require("axios")
//var sckstatus = false
var sckstatus = false
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
bbinfo = ""
userinfo = ""
const udid = config.youlecheng.udid
const device = config.youlecheng.device
const scookie = config.youlecheng.scookie
const UA = config.youlecheng.UA?config.youlecheng.UA:"..."
function get(a, b, log) {
    return new Promise(async resolve => {
        try {
            let url = `http://huodong.4399.cn/game//api/huodong/daily/${a}.html?udid=${udid}&scookie=${scookie}&deviceId=${device}&${b}`
            let res = await axios.get(url, {
                headers: {
                    "User-Agent": UA,             
                    //    "Referer": "https://yxhhd2.5054399.com/2019/fxyxtq2/"
                }
            })
            resolve(res.data)
       //     await sleep(1500)
            if (res.data.message && !log) {
                console.log("    " + res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
        resolve()
    })


}

//查询
async function getinfo() {
    let res = await get("yxhMonster", "", true)
    await getaskList()
    await get("yxhMonster-addFollow", "followId=3091185497",true)
    if (res.code == 100 && res.result) {
        info = res.result.userInfo
        userinfo = `昵称: ${info.nick}\n等级: Lv${info.level}\n怪力值: ${info.monster}\n心情值: ${info.mood}`
        sckstatus = true
    } else userinfo = res.data.message
    return userinfo

}
async function getaskList() {
    let res = await get("yxhMonster-taskList", "", true)
    let List = res.result.taskList.day.filter(x => x.num != x.finish_num)
    return List
}

async function bb() {
    let res = await get("douWaFairyLand-index","",true) 
     if (res.code == 100 && res.result) {
        info = res.result
        bbinfo = `绿豆: ${info.score}\n经验值: ${info.exp}\n下次投喂: ${new Date(parseInt(info.hunger_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')}`
        let ts = Math.round(new Date().getTime()/1000).toString()
        if(ts-info.hunger_time>0 ) {
       await get("douWaFairyLand-feed","food=1")
              await get("douWaFairyLand-feed","food=2")
                    await get("douWaFairyLand-feed","food=3")
                          await get("douWaFairyLand-feed","food=9")
        }
    } else bbinfo = res.data.message
    return bbinfo    

}


async function task() {
if(UA){
    await getinfo()
    if (sckstatus) {
        let tlist = await getaskList()
        await get("yxhMonster-share","",true)
        await get("yxhMonster-getTaskPrize", "taskId=529")
        for (task of tlist) {
            console.log(task.title)
            await get("yxhMonster-finishTask", `task_id=${task.id}&action=${task.action[0].action}`, true)
            await get("yxhMonster-getTaskPrize", `taskId=${task.id}`)
          for (var i = 0; (task.id==507 ||task.id==513) && i < task.num - task.finish_num; i++) {
    (  function(a){
        setTimeout(async function(){
            await get("yxhMonster-finishTask", `task_id=${task.id}&action=${task.action[0].action}`, true)           
            await get("yxhMonster-getTaskPrize", `taskId=${task.id}`)
        },1000);
    }(i))
    await sleep(2000)
}                  
        }
    bbinfo =  await bb()
  //  await ddtob()
    }
    let userinfo ="【4399】:\n" +await getinfo() +"\n"+bbinfo
    console.log(userinfo)
    return userinfo
    }else console.log("请先填写你的User-Agent再运行脚本")   

}
//task()
module.exports = task;