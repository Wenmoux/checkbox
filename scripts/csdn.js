const axios = require("axios")
function task(id) {
    return new Promise(async resolve => {
        try {
            let cookie=require("../config.json").csdn.cookie
            let url = `https://me.csdn.net/api/LuckyDraw_v2/${id}`          
            let res = await axios.get(url,{headers:{"cookie":cookie}})                 
         if(res.data.code==200&&res.data.data&&res.data.data.msg){
           console.log(res.data.data.msg)
         }
         else{
           console.log(res.data)
         }
        } catch (err) {
          console.log("操作失败"+err.response.data.message)          
        }
        resolve()
    })
}


async function csdn(){
await task("signIn")//签到
await task("goodluck")//抽奖
}

//task()

module.exports=csdn