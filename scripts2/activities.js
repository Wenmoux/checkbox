
const axios = require("axios")
    function get(a, b) {
            return new Promise(async resolve => {
                try {
                     let res = await axios.post(`https://huodong3.3839.com/n/hykb/${a}/ajax.php`, `ac=${b}&r=0.1362954162068364&scookie=${scookie}`, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; FRD-AL10 Build/HUAWEIFRD-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM/3.0.0.2860 QQ/6.5.5  NetType/WIFI WebP/0.3.0 Pixel/1080"
                        }
                    })
                    msg=res.data                                 
                 console.log(msg)
                } catch (err) {
                    console.log(err)
                }
                resolve(msg)
            })
        }
        
//2021助力
     await get("2021zhuli","login")  
    for (i of new Array(5)){await get("2021zhuli","share")} //分享
    for (i of [1,2,3,4,5]){
      await get("2021zhuli",`checklingqu&num=${i}`)
      await get("2021zhuli",`lingqu&num=${i}`)     
      } 
//新人福利      
      await get("friend","LingXinrenFuli")   
//新年发弹幕领奖励         
   await get("yearend","login")
    await get("yearend","send&content=新年快乐&status=0")

//新春游乐园 集拼图

let txyyh =await get("2021txyyh","login") 
if(txyyh.key=="ok") {
  console.log("登陆成功！邀请码为 %s , 当前共有 %d 张拼图",txyyh.config.invite_code,txyyh.config.somethingNum)
  await get("2021txyyh","FirstPintu")  

 await get("2021txyyh","Zhuli&invitecode=vefe9177wf3") //默认助力作者

 await get("2021txyyh","lingZhuliPrize") //领取助力奖励
 await get("2021txyyh","check") 
 await get("2021txyyh","DayLingInvite") //邀请领奖励
 
 await get("2021txyyh","dayshare") 
 await get("2021txyyh","DayLingShare") //每日分享
 
 await get("2021txyyh","DayGoFuli&mode=2") 
 await get("2021txyyh","DayGoFuli&mode=1") //福利消耗
 
 await get("2021txyyh","downloadclick") 
 await get("2021txyyh","DailyGamePlay") //试玩游戏
 await get("2021txyyh","DayLingGamedown") 
 
 await get("2021txyyh","DayGoGG") 
 await get("2021txyyh","DayLingGG") //每日去逛逛
 await get("2021txyyh","DaSuccessGG") 
 await get("2021txyyh","DayLingYuyue") 
 }
 


