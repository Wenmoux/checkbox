/*
https://huodong.4399.cn/game/y2020/game/playToEarn/index/?id=18380&u=3091185497&f=share&token=57222f&hduuid=qd99j3jdk
4.1～4.24
*/

const axios = require("axios")
//var sckstatus = false
var sckstatus = false
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
userinfo = ""
const udid = config.youlecheng.udid
const device = config.youlecheng.device
const scookie = config.youlecheng.scookie
const UA = config.youlecheng.UA ? config.youlecheng.UA : "..."

function get(a, b, log) {
    return new Promise(async resolve => {
        try {
            let url = `http://huodong.4399.cn/game//api/huodong/2022/yxhPlayCoin${a}.html?udid=${udid}&scookie=${scookie}&deviceId=${device}&${b}`
            let res = await axios.get(url, {
                headers: {
                    "User-Agent": UA,
                    //    "Referer": "https://yxhhd2.5054399.com/2019/fxyxtq2/"
                }
            })
            resolve(res.data)
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
    let res = await get("", "", true)
    if (res.code == 100 && res.result) {
        info = res.result.userInfo
        userinfo = `积分: ${info.coin}`
        sckstatus = true
    } else userinfo = res.data.message
    return userinfo

}
async function getaskList() {
    let res = await get("-taskList", "", true)
    let List = res.result.filter(x => x.num != x.finish_num)
    return List
}



async function task() {
    fh = "    "
    if (UA) {
        await getinfo()
        if (sckstatus) {
            let tlist = await getaskList()
            for (task of tlist) {
                console.log(task.title)
                await get("-finish", `task=${task.id}`, true)
                await sleep(1500)
            }
            for (l = 0; l < 18; l++) {
                let lottery = await get("-lottery", "", true)
                if (lottery.code == 100 && lottery.result) {
                    console.log(`恭喜获得 ${lottery.result.name}`)
                    if (lottery.result.name != "2积分") fh += lottery.result.name + " | "
                } else console.log(lottery.message)
                if(lottery.message == "抽奖资格不足") break;
                await sleep(1500)
            }           
        }
        let userinfo = "【四三君九九娘】: " + await getinfo() + fh
        console.log(userinfo)
        return userinfo
    } else console.log("请先填写你的User-Agent再运行脚本")

}
//task()
module.exports = task;