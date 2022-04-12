/*
做任务得电脑游戏签到卡
想要签到领电脑游戏礼包？漏签，没时间签到？做任务得补签卡、加速卡，助你快速领礼包
http://huodong.4399.cn/daily/3423.html?id=3423&u=3091185497&f=share&token=4a6878
邀请链接：https://yxhhd2.5054399.com/comm/bzyld2/share/index.php?ext=3091185497
隔十分钟跑两次就可以
2021-09-07 13:24
联众打码 https://www.jsdati.com/
@wenmoux
*/
base64img = "";
typeid = 1201; //打码识别类型
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
lzusername = config.Lzong.account //联众账号
lzpassword = config.Lzong.password //联众密码
softwareId = 22870; //打码 软件id 
softwareSecret = "Ykt5eVBtSaeHhivCyxUURCWMTniJmTgGmKYDxlC7"; //不用管 打码 软件密钥
const axios = require("axios")
var sckstatus = true

const device = config.youlecheng.device
const scookie = config.youlecheng.scookie
const UA = config.youlecheng.UA
const sdevice = config.youlecheng.udid
const date = new Date()

function get(ac, b, log) {
    return new Promise(async resolve => {
        try {
            let url = "https://www.mobayx.com/2016/signcart2/hd_wap_user_e13.php?1="
            let data = `ac=${ac}&${b}&t=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&scookie=${scookie}&device=${device}&sdevice=${sdevice}`
            let res = await axios.post(url, data, {
                headers: {
                    "User-Agent": UA,
                    "Referer": "https://www.mobayx.com/comm/playapp2/m/index.php?comm_id=556"
                }
            })
            resolve(res.data)
            if (res.data.msg && !log) {
                console.log(res.data.msg)
            } else if (res.data.key){
            if(res.data.key =="nologin") ckstatus = false
              console.log(res.data.key)}
        } catch (err) {
            console.log(err)
        }
        resolve()
    })
}
async function task() {
    if (UA) {
        //获取试玩软件id
        let res = await get("login", "", true)
        if(sckstatus){
        //兑换加速卡
        if(config.youlecheng.duihuanka) {
       for (dd of new Array(6) ){
        await get("accelerator")
        await sleep(4000)
        }
        }
        let glist = res.config.gameinfo_list
        console.log(`共获取到${glist.length}个试玩软件`)
        for (id of glist) {
            /*      console.log(`软件名: ${conf.gameinfo.appname}\n已体验天数: ${conf.play_day}\n今日已体验: ${conf.play_day==1?"是":"否"}\n已验证: ${conf.check_code_stat.success==1?"是":"否"}`)               
            if (conf.check_code_stat.success != 1) {
                console.log("开始打码验证")
                let pickey = await axios.get("https://www.mobayx.com/identifying_code/identifyCode.https.api.php?ac=pic&type=4&randkey=hd_playapp_lingqu&reflash=1")
                if (pickey.data.key) {
                    let b64img = await getb64(pickey.data.key)
                    verifycode = await upload(lzusername, lzpassword, b64img, typeid);
                    if (verifycode) vres = await get("checkindentify", `codekey=${pickey.data.key}&cid=${yxid}&code=${verifycode}`)
                    if (vres.check_code_stat && vres.check_code_stat.success == 1) console.log("验证成功")
                    else console.log("验证失败")
                }
            }
           */ 
            yxid = id.gid
            console.log(id.title)
            console.log("去下载")
            await get("download_confirm", "gid=" + yxid)
            await sleep(1000)
            await get("download", "gid=" + yxid)
            await sleep(1000)
            console.log("去体验")
            let pinfo = await get("playgame", "gids=" + yxid)
            if (pinfo.key == "ok") {
                if (pinfo.mark) console.log("当前共" + pinfo.mark + "积分")
            }
            await sleep(5000)
        }        
        console.log("\n\n")
        let ccres = await get("login", "", true)
        if (res.key == "ok") yxinfo = `【4399签到卡】积分: ${ccres.config.mark}   补签卡：${ccres.config.supplementary_card}  加速卡：${ccres.config.accelerator_card} 荣耀卡：${ccres.config.glory_card}`
        return yxinfo
}
    } else console.log("请先填写你的User-Agent再运行脚本")
}

module.exports = task