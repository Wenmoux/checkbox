const axios = require("axios")
function task() {
    return new Promise(async resolve => {
        try {
            let cookie=require("../config.json").csdn.cookie
            let url = 'https://me.csdn.net/api/LuckyDraw_v2/signIn'            
            let res = await axios.get(url,{headers:{"cookie":cookie}})                 
         if(res.data.code==200){
           console.log(res.data.data.msg)
         }
         else{
           console.log(res.data)
         }
        } catch (err) {
          console.log("签到失败"+err.response.data.message)          
        }
        resolve()
    })
}

//task()

module.exports=task