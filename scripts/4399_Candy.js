/*
每天4-5次就可
邀请链接：https://yxhhd2.5054399.com/comm/bzyld2/share/index.php?ext=3091185497
2021-09-07 10:24
@wenmoux
*/

const axios = require("axios")
var sckstatus = false
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const device = config.youlecheng.device
const scookie = config.youlecheng.scookie
const udid = config.youlecheng.udid
const CryptoJS = require("crypto-js") 
var Canstart = true
const UA = config.youlecheng.UA?config.youlecheng.UA:"..."
function encrypt(word) {
    let key = CryptoJS.enc.Utf8.parse("candyGame2020yxh");
    let iv =CryptoJS.enc.Utf8.parse("4399@cdg@2020yxh") ;   
    str = CryptoJS.DES.encrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
   return CryptoJS.enc.Base64.stringify(str.ciphertext)
   }

function get(a, b, log) {
    return new Promise(async resolve => {
        try {
            let url = `http://huodong.4399.cn/game/api/huodong/2020/yxhCandyGame${a}.html`
            let data = `udid=${udid}&scookie=${scookie}&deviceId=${device}&${b}`
         if(a=="-gameOver"){
                res = await axios.post(url, data,{
                headers: {
                    "Host":"huodong.4399.cn",
                    "User-Agent": UA,                  
                    "Referer": "http://huodong.4399.cn/game/maintain/game/beanBabyV3/index?hduuid=3d4q3w6y4&id=8217",
                    "X-Requested-With":"com.m4399.gamecenter"
                }
            })
            }else{            
                         res = await axios.get(url+"?"+data, {
                headers: {
                    "Host":"huodong.4399.cn",
                    "User-Agent": UA,                    
                    "Referer": "http://huodong.4399.cn/game/maintain/game/beanBabyV3/index?hduuid=3d4q3w6y4&id=8217",
                    "X-Requested-With":"com.m4399.gamecenter"
                }
            })  
            }
            resolve(res.data)
              //  if(a=="-gameOver")     console.log(res)
            if (!log) {
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
    let res = await get("","",true) 
     if (res.code == 100 && res.result) {
        userinfo = res.result.userInfo
        if(userinfo.limit9 <=23 || userinfo.limit39<=18) Canstart = false
        sckstatus = true
    } else userinfo = res.data.message
    console.log(userinfo)
    
}

async function task() {
if(UA){
    await getinfo()
    if (sckstatus &&Canstart) {
    ext = null
    let gameinfo = await get("-gameStart","type=1",true)
    if(gameinfo.code !=100) console.log(gameinfo.message)
    else ext = gameinfo.result.ext
    if(ext){ 
    let b64token = Buffer.from(ext, 'base64').toString('utf8')   
    let str =b64token+`_${Math.ceil(9*Math.random())}_1`
    let gametoken =encodeURIComponent(encrypt(str))
    console.log("等待19s...")
    console.log(gametoken)
    await sleep(15000+Math.ceil(3*Math.random())*25)
    let oinfo= await get("-gameOver","ext="+gametoken)
    if(oinfo.code==100) console.log("成功通关")    
   }}    
    return ""
    }else console.log("请先填写你的User-Agent再运行脚本")   

}
//task()
module.exports = task;