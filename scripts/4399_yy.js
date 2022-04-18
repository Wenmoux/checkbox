let items = []
const axios = require("axios")
const load = require("cheerio").load
var sckstatus = true
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const device = config.youlecheng.device
const scookie = config.youlecheng.scookie
const UA = config.youlecheng.UA ? config.youlecheng.UA : "..."



function get(ac, id) {
    return new Promise(async resolve => {
        try {
            let url = `https://huodong2.4399.com/comm/qdlb/ajax_e3.php`
            let data = `ac=${ac}&rand=&device=${device}&c=&hdid=${id}&gameid=&scookie=${scookie}`
            let res = await axios.post(url, data, {
                headers: {
                    "User-Agent": UA,
                    //    "Referer": "https://yxhhd2.5054399.com/2019/fxyxtq2/"
                }
            })
            if (JSON.stringify(res.data).match("需要先登录4399账号")) sckstatus = false
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


//获取游戏id
async function getid() {
    let url = "https://m.4399.cn/zqhd-yy.html"
    let res = await axios.get(url)
    const $ = load(res.data)
    let list = $(".mod_wg")
    list.each((index, li) => {
       if ($(".glb_txtitem",li).attr("href").match(/qdlb/)) {                 
            items.push({
                title: $(".txt_game", li).text(),
                hdid:  $(".glb_txtitem",li).attr("href").match(/id=(\d+)/)[1],
                reawrd: $(".txt",li).text().split("、")[0] +"......"
            })
        }
    })
}
async function task() {
    signmsg = ""
    if (UA) {
        await getid()
        await get("sign", items[0].hdid)
        if (sckstatus) {
            for (game of items) {
                console.log(game.title)
                let res = await get("sign", game.hdid)
                console.log("    " + (res && res.msg))
                signmsg += `    ${game.title}：${res&&res.msg}   ${(res.sign_days?"签到天数":"  ")+(res.sign_days?res.sign_days: " ") }\n`
                await sleep(5*000)
            }
            return "【4399页游签到】：\n" + signmsg.replace(/您今天已经签到过了，请明天再来/g, "今日已签")
        } else return "【4399页游签到】：scookie已失效"
    } else return "【4399页游签到】：请先填写你的User-Agent再运行脚本"
}
//task()
module.exports = task;