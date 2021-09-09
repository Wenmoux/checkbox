/*
4399游戏盒游乐豆任务
等我攒够288开会员再写会员任务
邀请链接：https://yxhhd2.5054399.com/comm/bzyld2/share/index.php?ext=3091185497
2021-09-07 10:24
@wenmoux
*/

const axios = require("axios")
var sckstatus = false
const device = config.youlecheng.device
const scookie = config.youlecheng.scookie
const SMid = config.youlecheng.SMid
const UA = config.youlecheng.UA?config.youlecheng.UA:"..."
function get(a, b, log) {
    return new Promise(async resolve => {
        try {
            if (a == "comm/ylddb") aj = "ajax2"
            else aj = "ajax"
            let url = `https://yxhhd2.5054399.com/${a}/${aj}.php?ac=${b}&scookie=${scookie}&device=${device}`
            let res = await axios.get(url, {
                headers: {
                    "User-Agent": UA,                    
                    "Referer": "https://yxhhd2.5054399.com/2019/fxyxtq2/"
                }
            })
            resolve(res.data)
            if (!log) {
                console.log("    " + res.data.msg)
            }
        } catch (err) {
            console.log(err)
        }
        resolve()
    })


}

//查询游乐豆
async function getinfo() {
    let res = await axios.get(`https://yxhhd2.5054399.com/youlecheng/app/?ctl=ucenter&act=recordInfo&device=${device}&sm_device=&scookie=${scookie}`)
    if (res.data.userinfo) {
        info = res.data.userinfo
        userinfo = `昵称:${info.username}\n游乐豆: ${info.myYld}`
        sckstatus = true
    } else userinfo = res.data.msg
    console.log(userinfo)
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

//分享游戏
async function share() {
    let ids = await getyxid()
    for (str of ids) {
        yxid = str.match(/data-id=\"(\d+)\"/)[1]
        yxname = str.match(/data-name=\"(.+?)\"/)[1]
        console.log("开始分享游戏：" + yxname)
        let shareres = await get("2019/fxyxtq2", `shareOver&id=${yxid}`)
    }
    await get("2019/fxyxtq2", "getprize")
}



async function task() {
if(UA){
    await getinfo()
    if (sckstatus) {
        await get("comm/bzyld2", "sub_yqm&yqm=3091185497&SMid=" + SMid)
        var mres = await axios.get(
            "https://cdn.jsdelivr.net/gh/Wenmoux/sources/other/ylcml.json"
        );
        await get("comm/bzyld2", `sub_zb_kouling&klid=32&kl=${encodeURI(mres.data.smkl)}`); //)主播 神秘口令
        await get("comm/bzyld2", `sub_kouling&kl=${mres.data.zskl}`); //)主播 神秘口令
        await get("comm/bzyld2", "share_total", true); //每日分享
        await get("comm/bzyld2", "n_task11")
        let fxres = await get("2019/fxyxtq2", "init", true)
        if (fxres.box3 == 2) console.log("分享宝箱已领完,跳过任务")
        else await share()

        //游乐豆转盘
        await get("comm/ylddb", "played", true)
        await get("comm/ylddb", "playshow", true)
        let zpres = await get("comm/ylddb", "sharesuccess&res=1&type=3")
        if (zpres.chances && zpres.chances > 0) {
            let lotteryres = await get("comm/ylddb", "lottery", true)
            console.log("恭喜您抽中了：" + lotteryres.prizetitle)
        }
    }
    let userinfo ="【4399疯狂游乐城】:\n"+ await getinfo()
    return userinfo
}else console.log("你把UA吃了吗,赶快去填")    
}

module.exports = task;