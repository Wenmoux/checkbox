/*
4399游戏盒赚盒币任务
https://www.mobayx.com/2017/hebi2/
邀请链接：https://yxhhd2.5054399.com/comm/bzyld2/share/index.php?ext=3091185497
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
var sckstatus = false

const device = config.youlecheng.device
const scookie = config.youlecheng.scookie
const UA = config.youlecheng.UA
const sdevice = config.youlecheng.udid
const date = new Date()
function get(ac, b, log) {
    return new Promise(async resolve => {
        try {
            let url = "https://www.mobayx.com/comm/playapp2/m/hd_wap_user_e1.php"
            let data = `ac=${ac}&${b}&t=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&scookie=${scookie}&device=${device}&sdevice=${sdevice}`
            let res = await axios.post(url, data, {
                headers: {
                    "User-Agent": UA,                
                    "Referer": "https://www.mobayx.com/comm/playapp2/m/index.php?comm_id=556"
                }
            })
            resolve(res.data)
            if (log) {
                console.log("    " + res.data.msg)
            }
        } catch (err) {
            console.log(err)
        }
        resolve()
    })
}
async function task() {
if(UA){
    //获取试玩软件id
    let res = await axios.get("https://www.mobayx.com/2017/hebi2/")
    let ids = res.data.match(/https:\/\/www\.mobayx\.com\/comm\/playapp2\/m\/index\.php\?comm_id=\d+/g)
    console.log(`共获取到${ids.length}个试玩软件`)
    
    for (id of ids) {
        yxid = id.match(/comm_id=(\d+)/)[1]
        //查询信息
        let cres = await get("login", "cid=" + yxid)
              let conf = cres.config
  


        console.log(`软件名: ${conf.gameinfo.appname}\n已体验天数: ${conf.play_day}\n今日已体验: ${conf.today_play_stat==1?"是":"否"}\n已验证: ${conf.check_code_stat.success==1?"是":"否"}`)               
      if(lzpassword){
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
        }}
        
        await get("download", "cid=" + yxid)
        await get("clickplay", "cid=" + yxid)
        await sleep(1000)          
       // await sleep(3000)    
        let playinfo = await get("playtime", "cid=" + yxid)     
         lq = await get("lingqu", "cid=" + yxid)
        console.log(lq.msg || lq.error_msg)
        }      
        console.log("\n\n")
        await sleep(2000)
    }else console.log("请先填写你的User-Agent再运行脚本")   
}

function getb64(key) {
    return new Promise(async (resolve) => {
        try {
            console.log(key)
            let res = await axios.get(
                `https://www.mobayx.com/comm/codeimg/common_img_code.php?ac=pic&key=${key}`, {
                    responseType: "arraybuffer"
                }
            );
            base64img = res.data.toString("base64");
        } catch (err) {
            console.log(err);
            base64img = ""
        }
        resolve(base64img);
    });
}
async function upload(_username, _password, imgdata, _captchaType) {
    var _captchaData = imgdata;
    var jsonData = {
        softwareId: softwareId,
        softwareSecret: softwareSecret,
        username: _username,
        password: _password,
        captchaData: _captchaData,
        captchaType: _captchaType,
        captchaMinLength: 0,
        captchaMaxLength: 0,
        workerTipsId: 0,
    };
    let response = await axios.post(
        "https://v2-api.jsdama.com:443/upload",
        jsonData
    );
    if (response.data.code == 0) {
        console.log("识别结果：" + response.data.data.recognition);
        // console.log("识别ID：" + response.data.data.captchaId);
        code = response.data.data.recognition;
    } else {
        console.log(response.data.message);
       //  result += "打码：" + response.data.message;
        code = null
    }
    return code;
}
//task()
module.exports = task