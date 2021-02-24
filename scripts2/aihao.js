const axios = require("axios")
function aihao() {
    return new Promise(async resolve => {
        try {
            let cookie = require("./config.json").aihao.cookie
            let header = {headers: {"cookie":cookie }}
            for (i of [1,2,3,4]){
            str = ["上午打卡","下午打卡","晚上打卡","全勤奖励"]
            data=`button${i}=`
            res = await axios.post("https://www.aihao.cc/plugin.php?id=daka", data,header)
                    if (!res.data.match(/请先登录后才能继续使用/)) {                  
                    if (res.data.match(/未到打卡时间|您本月还未打卡|已过打卡时间/)) {
                    msg = "还没到打卡时间呢亲_(:D)∠)_"
                } else if (res.data.match(/打卡成功/)) {
                    msg = res.data.match(/打卡成功！奖励金钱：\d+/)                   
                } else if(res.data.match(/请勿重复打卡/)){
                msg = "当前时间段已经打过卡了嗷(๑°3°๑)"
                } else if(res.data.match(/无法获得全勤奖励/)){
                msg = res.data.match(/无法获得全勤奖励！您本月打卡次数：\d+/) 
                }
                 else {
                    msg = "签到失败!原因未知"
                    console.log(res.data)
                }
                
            } else {
                msg = "cookie已失效"
            }  
            console.log(str[i-1]+"："+msg)          
              }
         
            
        } catch (err) {
            console.log(err)
        }
        resolve()
    })
}

aihao()