const axios = require("axios")
var strcode = ""
var name = []
const device = config.youlecheng.device
const scookie = config.youlecheng.scookie
const UA = config.youlecheng.UA ? config.youlecheng.UA : "..."
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function get(b, p, log) {
    return new Promise(async resolve => {
        try {
            let path = "fulizhongxin"
            if (p) path = "fulizhongxin2"
            let url = `https://yxhhd2.5054399.com/comm/${path}/ajax.php?ac=${b}&strcode=${strcode}&scookie=${scookie}&device=${device}`
            let res = await axios.get(url, {
                headers: {
                    "User-Agent": UA,
                    "Referer": "https://yxhhd2.5054399.com/2019/fxyxtq2/"
                }
            })
            resolve(res.data)
            if (res.data.msg && !log && !res.data.msg.match(/没有此任务/)) {
                console.log("    " + res.data.msg)
            }
        } catch (err) {
            resolve({
                key: err.code,
                msg: err.msg ?? err.code
            })
        }
        resolve()
    })


}

async function dotask(code, cha) {
    strcode = code.match(/strcode=(.+)/)[1]
    userinfo = ""
    p = null
    if (code.match(/fulizhongxin2/)) p = 1
    let res = await get("do_init", p, true)
    if (res.key == 200) {
        userinfo = `${gamename}：  ${res.suipian}\n`
        if (!cha) {
            await get("do_share", p)
            for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13]) {
                let gres = await get(`get_num&id=${i}`, p)
                if (gres && gres.msg && !gres.msg.match(/没有此任务/)) await get("choujiang", p)
                await sleep(1500)
            }
        } else console.log(userinfo)
    } else userinfo = res.msg
    console.log(userinfo)
    return userinfo
}





async function task() {
    if (UA) {
        yxinfo = "【4399游戏福利社】: \n"
        let startKey = 0
        k = 0
        more = true
        for (i = 0; more; i++) {
            let res = await axios.post('https://mapi.yxhapi.com/android/box/other/v1.0/huodong-search.html', `startKey=${startKey}&keyword=%E7%A6%8F%E5%88%A9%E4%B8%AD%E5%BF%83&n=20`)
            if (res.data.result.more != 1) more = false
            else startKey = res.data.result.startKey
            for (game of res.data.result.data) {
            if(game.id != 9199){         
                gamename =game.title.match(/《(.+)》/)&& game.title.match(/《(.+)》/)[1]
                console.log(gamename)
                console.log("过期时间："+ new Date(parseInt(game.etime) * 1000).toLocaleString())                
                yxinfo += await dotask(game.cli_url)
                console.log("\n\n")
                await sleep(5*1000)
                }
            }
        }
    } else return "请先填写你的User-Agent再运行脚本"
    return yxinfo
}
//task()
module.exports = task;