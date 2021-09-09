/*
邀请链接：https://yxhhd2.5054399.com/comm/bzyld2/share/index.php?ext=3091185497
2021-09-07 10:24
@wenmoux
*/

const axios = require("axios")
var sckstatus = true
var strcode = ""
var name = []
const device = config.youlecheng.device
const scookie = config.youlecheng.scookie
const UA = config.youlecheng.UA?config.youlecheng.UA:"..."
function get( b,p, log) {
    return new Promise(async resolve => {
        try {
            let path = "fulizhongxin"          
            if(p) path = "fulizhongxin2"
            let url = `https://yxhhd2.5054399.com/comm/${path}/ajax.php?ac=${b}&strcode=${strcode}&scookie=${scookie}&device=${device}`
            let res = await axios.get(url, {
                headers: {
                    "User-Agent": UA,                    
                    "Referer": "https://yxhhd2.5054399.com/2019/fxyxtq2/"
                }
            })
            resolve(res.data)
            if (res.data.msg&&!log&& !res.data.msg.match(/没有此任务/)) {
                console.log("    " + res.data.msg)
            }
        } catch (err) {
            console.log(err)
        }
        resolve()
    })


}

async function dotask(name,code,cha) {
    strcode = code.match(/strcode=(.+?)\"/)[1]
    gamename = name.match(/《(.+?)》/)[1]
    console.log(gamename+"  "+strcode)
    userinfo = ""
    p=null
    if(code.match(/fulizhongxin2/)) p=1
    let res = await get("do_init",p,true)
    if (res.key ==200) {       
        userinfo = `游戏:${gamename}\n道具: ${res.suipian}\n抽奖次数: ${res.cjnum}\n`
        sckstatus = true    
        if(!cha){
    await get("do_share",p)
    for(i of [1,2,3,4,5,6,7,8,9,11,12,13]){   
    let gres=await get(`get_num&id=${i}`,p)
    if(gres.msg&& !gres.msg.match(/没有此任务/)) await get("choujiang",p)
    }}else   console.log(userinfo)    
    } else console.log(res.msg)
    
    
    return userinfo
}
async function getyxid() {
    let res = await axios.get(`https://yxhhd2.5054399.com/2019/fxyxtq2/`, {
        responseType: "arraybuffer"
    })
    resdata = require("iconv-lite").decode(res.data, "gbk")
    let id = resdata.match(/data-id=\"\d+\" data-name=\".+?\"/g)
    console.log("获取分享游戏信息成功 总游戏数 ：" + id.length)
    if (id) return id
    else return []
}

async function getstrcode() {
    let acturl = "https://yxhhd2.5054399.com/comm/flhdjh/?id=9199&u=3091185497&f=share&token=ba65df&hduuid=kywrnjrdq"
    let res = await axios.get(acturl, {responseType: "arraybuffer" })
    resdata = require("iconv-lite").decode(res.data, "gbk")
    let code = resdata.match(/<a class=\".+\" data-id=\"\d+\" data-url=\".+?\">/g)
    code.push('https://yxhhd2.5054399.com/comm/fulizhongxin2/index.php?strcode=MTU="')
    name = resdata.match(/<p class=\"p1\">.+?福利中心<\/p>/g)
    name.push('"<p class=\"p1\">《英雄联盟》福利中心<\/p>"')
    console.log("共"+code.length+"游戏 任务待完成")
  //  console.log(code)
  //  console.log(name)
    return code
}


async function task() {
if(UA){
  yxinfo = "【4399游戏福利社】: \n"
  let codeList =   await getstrcode()
   for(k=0;k< codeList.length;k++){   
   if (sckstatus) await dotask(name[k],codeList[k])      
     yxinfo += await dotask(name[k],codeList[k],1)  
   console.log("\n\n") 
   } 
    return yxinfo
 }else console.log("请先填写你的User-Agent再运行脚本")   
   
}
//task()

module.exports = task;