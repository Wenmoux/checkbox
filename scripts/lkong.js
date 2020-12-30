const axios = require("axios")
function task() {
    return new Promise(async resolve => {
        try {
            let cookie=require("../config.json").lkong.cookie
            let url = 'http://lkong.cn/index.php?mod=ajax&action=punch'            
            let res = await axios.get(url,{headers:{"cookie":cookie}} )       
             if(res.data.punchday)
         {
           msg=`签到成功✅已连签${res.data.punchday}天`         
         }
         else{
           msg=res.data.error
         }
         console.log(msg)
        } catch (err) {
          console.log(err)         
        }
        resolve()
    })
}


//task()
module.exports=task