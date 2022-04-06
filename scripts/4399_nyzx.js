/*
https://huodong.4399.cn/game/y2020/game/playToEarn/index/?id=18380&u=3091185497&f=share&token=57222f&hduuid=qd99j3jdk
4.6～4.19
*/

const axios = require("axios")
//var sckstatus = false
var sckstatus = false
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
userinfo = "" ; taskList = {}
const udid = config.youlecheng.udid
const device = config.youlecheng.device
const scookie = config.youlecheng.scookie
const UA = config.youlecheng.UA ? config.youlecheng.UA : "..."
const SMid = config.youlecheng.SMid
function get(ac,log)  {
    return new Promise(async resolve => {
        try {
            let url = "http://yxhhd2.5054399.com/2022/nyzx/ajax.php"
            let data = `ac=${ac}&scookie=${scookie}&client_version=6.6.0.40&ct=${Math.floor(Date.now() / 1000)}&device=${device}&smid=${SMid}`
            let res = await axios.post(url,data, {
                headers: {
                    "User-Agent": UA,
                    //    "Referer": "https://yxhhd2.5054399.com/2019/fxyxtq2/"
                }
            })          
            resolve(res.data)
            if (!log)  console.log(JSON.stringify(res.data))
            
        } catch (err) {
            console.log(err)
        }
        resolve()
    })


}

//查询
async function getinfo() {
    let res = await get("init",  true)
    if (res.key == 200 && res.code == 0) {
         userinfo = `圈数：${res.turns}: 位置${res.pos}`
         taskList = res.task     
    } else userinfo = res.msg
    return userinfo

}



async function task() {  
    if (UA) {
        let res = await get("init",  true)
        if (res.key == 200 && res.code == 0) {       
            if(res.task.sign !=1 ) await get("getTimes&type=sign")
            if(res.subscribe !=1) await get("subscribe")
            if(res.task.luntan!=1) {
            await get("activeTask&tid=luntan")
            await sleep(11*1000)
            await get("queryTask&tid=luntan")
            }
            for(i of (new Array(4) )) await get("forward")   
            message = await getinfo()           
        }else message = res.msg                
    } else message = "请先填写你的User-Agent再运行脚本"
    return  "【诺亚大陆】: " +  message

}
//task()
module.exports = task;