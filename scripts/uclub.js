//uclub签到 每天获得1积分,30天后每天2积分
//我的邀请链接 https://uclub.ucloud.cn/invite/478
const axios = require("axios")
function task() {
    return new Promise(async resolve => {
        try {
            let token=require("../config.json").ucloud.token
            let url = 'https://uclub.ucloud.cn/index/signin/dosign'            
            let res = await $http.post(url, "",{headers:{"X-Requested-With":"XMLHttpRequest","cookie":`token=${token}`}})
         if(res.data.wait)
         {
           console.log(res.data.msg)           
         }
         else{
           console.log("cookie失效")
         }
        } catch (err) {
          console.log(err)
          
        }
        resolve()
    })
}


//task()
module.exports=task