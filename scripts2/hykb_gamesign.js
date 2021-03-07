let items = []
const axios = require("axios")
const load = require("cheerio").load
const scookie = "这里填你的scookie"
async function getid() {
    let url = `https://huodong3.3839.com/n/hykb/qdjh/index.php`
    let res = await axios.get(url)
    const $ = load(res.data)
    let list = $(".glist>li")
    list.each((index, li) => {
        if (!$(".btn", li).attr("onclick").match(/已结束/)) {
            let str = $(".btn", li).attr("onclick").replace(/每日签到领/, "").split("'")
            items.push({
                title: str[3],
                id: str[1].match(/hd_id=(.+)/)[1]
            })
        }
    })
}
game = 0
//代码 https://res.onebiji.com/kuaibao/n/hykb/signcard/js/user.js?v_6_v43
function get(a, b) {
    return new Promise(async resolve => {
        try {
            let res = await axios.post(`https://huodong3.3839.com/n/hykb/signcard/ajax.php`, `ac=${a}&t=2020-08-3+11%3A14%3A48&r=0.9948423196524376&hd_id=${b}&hd_id2=${b}&scookie=${scookie}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; FRD-AL10 Build/HUAWEIFRD-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM/3.0.0.2860 QQ/6.5.5  NetType/WIFI WebP/0.3.0 Pixel/1080"
                }
            })
            back = res.data
            //  console.log(back)
        } catch (err) {
            console.log(err)
        }
        resolve(back)
    })
}
async function task() {
    await getid()
    for (i of items) {
        //   let ss=  await get("login","319")
        //    console.log(ss.config.lb_status)
        id = i.id
        await get("login", id)
        let data = await get("signToday", id)
        key = data.key
        if (key == "-1005") {
            console.log("体验游戏中,请一分钟后再刷新领取☑️")
            await get("tiyan", id)
            game++
            //   await get("login",id)
            //  await get("signToday",id)
        } else if (key == "-1007") {
            game++
            await get("sharelimit", id) //
            console.log(`${i.title}  分享成功✅`)
            await get("login", id)
            await get("signToday", id)
        } else if (key == "-1002") {
            console.log(`${i.title}  今日已签☑️`)
            game++
        } else if (key == "200") {
            game++
            console.log(`${i.title} 签到成功✅ 已签到${data.signnum}天`)
        } else if (key == "no_login") {
            console.log("⚠️⚠️scookie失效,请重新配置⚠️⚠️")
            break
        } else {
            console.log(i)
            console.log(data)}
    }
    console.log(game)
}
task()