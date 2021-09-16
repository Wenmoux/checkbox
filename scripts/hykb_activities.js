let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
result ="【好游快爆临时任务】:"
const axios = require("axios")
const hyck = config.hykb.scookie
scookie = hyck.match(/\|/)?encodeURIComponent(hyck):hyck
function get(a, b,c) {
            return new Promise(async resolve => {
                try {
                  let url = `https://huodong3.3839.com/n/hykb/${a}/ajax.php`
                   let data =`ac=${b}&r=0.${Math.round(Math.random() * 8999999999999999) + 1000000000000000}&scookie=${scookie}&device=${scookie.split("%7C")[4]}`
                     let res = await axios.post(url, data, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; FRD-AL10 Build/HUAWEIFRD-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM/3.0.0.2860 QQ/6.5.5  NetType/WIFI WebP/0.3.0 Pixel/1080"
                        }                        
                    })                         
           resolve(res.data)         
                    if(!c){console.log(res.data)}
                } catch (err) {
                    console.log(err)
                }
                resolve()
            })
        }  
        
async function jhy(id) {
    prize = `\n[活动id${id}]`
    let logindata = await get("zhuli", `login&comm_id=${id}`,true)
    if (logindata.loginStatus == 100 && logindata.key == "ok") {
        uid = logindata.config.uid
        for (i = 0; i < 3; i++) {
            await get("zhuli", `zhuli&uid=${uid}&comm_id=${id}`)
            let res = await get("zhuli", `choujiang&isdown=1&comm_id=${id}`)
            if (res.prize) {
                prize += res.prize + "-"
            } else {
                prize += "未中奖-"
            }
            await sleep(1000)
        }
    }
    return prize
}
async function wzcj() {
    for (id of [1, 2, 3, 4, 5]) {
        console.log(`礼包${id}抽奖中...`)
        let wzcjres = await get("wzry2021", `ChouJiang&tag=${id}`, true)
        if (wzcjres.key == "no_band") {
            console.log("您还没有绑定qq")
        } else if (wzcjres.key == "3001") {
            console.log(`您的探索值还不够哦~ ${wzcjres.score}/${wzcjres.needMinScore}`)
            return;
        } else if (wzcjres.key == "ok") {
            result += "王者抽奖："+wzcjres.title+"\n"
            console.log(`恭喜您获得 ${wzcjres.title}`)
        } else if (wzcjres.key == "3002") {
            console.log("您已经领过奖啦~")
        }
    }
}
// 

//王者荣耀快乐一夏 07.23 -08.25
async function wzry() {
    console.log("\n--------王者荣耀快乐一夏活动开始--------n")
    let wzryres = await get("wzry2021", "login", true)
    if (wzryres.config.userDuihuanCode5 == 1) return;
    if (wzryres.config.day_share != 2) await get("wzry2021", "dayshare")
    await get("wzry2021", "DayLingShare")
    await get("wzry2021", "Zhuli&invitecode=crcf804hkfp")
    await get("wzry2021", "DayLingInvite")
    if (wzryres.config.day_play_ling != 2) await get("wzry2021", "DailyGamePlay")
    await get("wzry2021", "DayLingGamedown")
    wzres = await get("wzry2021", "login", true)
    if (wzres.config.userDuihuanCode5 == 0) await wzcj()
    wzryinfo = "王者荣耀：" + wzres.config.score + " 探索值"
    console.log(wzryinfo)
    result += wzryinfo
}


//原神集卡活动 7.21-8.21
async function summer() {
    console.log("\n--------原神集卡活动开始--------\n")
    aid = "2021summer/m"
    let coderes = await axios.get("http://1oner.cn:1919/hykb/all")
    if (coderes) codeList = coderes.data.message
    else codeList = ["4cae9d15aa53c"]
    let needhelp = true
    while (needhelp) {
        if (codeList) code = codeList[Math.round(Math.random() * (codeList.length))].yscode
        else code = codeList[0]
        console.log(`为${code}助力...`)
        let helpres = await get(aid, `giftcode&shareCode=${code}`)
        if (helpres.key == "ok" || helpres.key == "3007") needhelp = false
    }
    await get(aid, "playgame")
    await get(aid, "lingqushiwan")
    await get(aid, "lingquinvite")
    await get(aid, "xuyuan&resure=1")
    await get(aid, "share")
    await get(aid, "lingqushare")
    await get(aid, "qiandao")
    // await get(aid,"GetFuliMa&ma=no_miling")
    for (a = 0; a < 4; a++) {
        await get(aid, "jumprw&rwid=" + a)
        let cdata = await get(aid, "lingqujumprw&rwid=" + a, true)
        if (cdata.is_huizhang == 1) {
            console.log(`恭喜您获得卡牌 ${cdata.hz_name}`)
        } else if (cdata.is_huizhang == 0) {
            console.log(`恭喜您获得绯樱碎片 ${cdata.wzsp_num} 共${cdata.all_wzsp}`)
        } else {
            console.log(cdata.msg)
        }
    }
    let loginres = await get(aid, "login", true)
    if (loginres) {
        config = loginres.config
        mycode = config.invite_code
        console.log(`${loginres.name}的助力码 ${mycode}\n开始提交助力码`)
        let res1 = await axios.get(`http://1oner.cn:1919/hykb/info?uid=${loginres.uid}`)
        if (res1.data.err_code == 0) {
            let resi = await axios.post("http://1oner.cn:1919/hykb/update", `uid=${loginres.uid}&yscode=${mycode}&nickname=${encodeURI(loginres.name)}`)
            console.log(resi.data)
        } else {
            let resi = await axios.post("http://1oner.cn:1919/hykb/add", `uid=${loginres.uid}&yscode=${mycode}&nickname=${encodeURI(loginres.name)}`)
            console.log(resi.data)
        }
        info = `原神集卡： 绯樱碎片${config.wzsp_nums} 神${config.cid1}泡${config.cid2}鸣${config.cid3}动${config.cid4}不${config.cid5}灭${config.cid6}影${config.cid7}断${config.cid8}  \n`
        result += info
        console.log(info)
    }
    console.log("\n--------原神集卡活动运行结束--------\n")
}

//获取任务id
async function lottery(a, c, b) {
    let info = await get(`${a}/m`, `login&comm_id=${b}&isyuyue=0`,true) 
    if(info&&info.config&&info.config.is_end==0){ 
    let res = await axios.get(
        `https://huodong3.3839.com/n/hykb/${a}/m/?comm_id=${b}`
    );
    str = res.data.match(/daily_btn_(\d+)/g);
    //  console.log(res.data)
    await lottery2(a, c, b, str)
  }else{
  console.log(`活动 ${c}已结束`)
  } 
}
//快爆粉丝福利80080
async function lottery2(a, c, b, str) {
    for (i of str) {
        i = i.split("_")[2]
        await get(`${a}/m`, `DailyAppJump&comm_id=${b}&isyuyue=0&id=${i}`)
        await get(`${a}/m`, `DailyAppLing&comm_id=${b}&isyuyue=0&id=${i}`)
        await get(`${a}/m`, `chouqu&comm_id=${b}&isyuyue=0&id=${i}`)
        await get(`${a}/m`, `BaoXiangLing&comm_id=${b}&isyuyue=0&id=${i}`)
    }
    if (c != 0) {
        ct = c.split("-")
        let info = await get(`${a}/m`, `login&comm_id=${b}&isyuyue=0`,true)
        let msg = `${ct[0]}：${ct[1]} ${info.config.daoju} 抽奖次数 ${info.config.played} \n`
        result += msg
    }
}

//游戏单第7期 7.9-8.1
async function glist(id) {
    for (typeid of ["qq", "wx", "weibo"]) {
        await get("glist", `share&typeid=${typeid}&comm_id=${id}`)
        await sleep(1000)
    }
    await get("glist", `receiveBmh&comm_id=${id}`)
}

async function ddd(id) {
    await get("yuyue2020/m", `yuyuedown&comm_id=${id}&isyuyue=0&testkey=4399NoneDeviceId`)
    await get("yuyue2020/m", `yuyue&comm_id=${id}&isyuyue=0&testkey=4399NoneDeviceId`)
    await get("yuyue2020/m", `invite&comm_id=${id}&isyuyue=0&isfx=1&isdown=1&isdownonly=1&testkey=4399NoneDeviceId`)
    await get("yuyue2020/m", `playgame&comm_id=${id}&isyuyue=0&isfx=1&isdown=1&isdownonly=1&testkey=4399NoneDeviceId`)
    await get("yuyue2020/m", `choujiang&comm_id=${id}&isyuyue=0&isdown=1&isdownonly=1&testkey=4399NoneDeviceId`)
    await get("yuyue2020/m", `mycode&comm_id=${id}&isyuyue=0&testkey=4399NoneDeviceId`)
}

//史莱姆 2021-07-16 ~ 2021-07-31
async function slm() {
   console.log("活动已结束")  
/*    console.log("\n--------夏日福利史莱姆养成计划开始(搜索2021666)--------\n")
    aid = "2021slm/m"
    slmdata = await get(aid, "login", true)
    await Promise.all([
        get(aid, "gofuli&resure=1"),
        get(aid, "share"),
        get(aid, "xinshou&resure=1"),
        get(aid, "gozhongcao&resure=1")
    ]);
    if (slmdata.config.day_guang != 2) {
        await get(aid, "guangczzl")
        await get(aid, "guang&resure=1")
    }
    let res = await axios.get(
        "https://huodong3.3839.com/n/hykb/2021slm/m/index.php"
    );
    str = res.data.match(/prize1_lingqu_(\d+)/g);
    for (id of str) {
        await get(aid, "playgame&gameid=" + id.split("_")[2])
    }
    for (id of str) {
        await get(aid, "lingqushiwan&gameid=" + id.split("_")[2])
    }
    let info = await get(aid, "login")
    if (info.key == "ok") {
        msg = `史莱姆：魔法值 ${info.config.tizhong}  露珠 ${info.config.maoqiu} \n`
        result += msg
        console.log(msg)
    }
    console.log("\n--------夏日福利 史莱姆养成计划结束--------\n")
    */
}

async function task1() {
    console.log(`临时任务列表：
1：粉丝福利80080,25525,630630,79979都可以去首页搜索对应数字绑定qq`)
    //await slm()
    await lottery("lottery", "60030-王牌勋章", 5)
    await lottery("lottery", "25525-补给箱", 4)
    await lottery("lottery", "79979-宝石", 3)
    await lottery("lottery2", "0", 2)
    let ids = await axios.get("https://cdn.jsdelivr.net/gh/Wenmoux/sources/other/id.json");
    for (id of ids.data) {
        result += await jhy(id) +"\n"
    }
    let ids2 = await axios.get("https://cdn.jsdelivr.net/gh/Wenmoux/sources/other/id2.json");
    for (id of ids2.data) {
       await ddd(id)
    }
    //await summer()
    //await wzry()    
    //await glist(2)
}
module.exports= task1