//登陆m.jjwxc.net获取cookie,必须有sid
const axios = require("axios")
function jjwxc() {
    return new Promise(async resolve => {
        try {
            let url = 'https://m.jjwxc.net/my/signIn'            
            let res = await axios.get(url,{headers:{"cookie":require("../config.json").jjwxc.cookie||"sid=wenmoux","x-requested-with":"XMLHttpRequest"}})
        console.log(res.data)
         if(res.data&&res.data.message)
         {
         str=`${res.data.message}`
         }
         else {
           str="cookie失效"
         }
         console.log(str)
        } catch (err) {
          console.log(err)
          console.log("签到失败！接口请求出错")
        }
        resolve()
    })
}

module.exports=task