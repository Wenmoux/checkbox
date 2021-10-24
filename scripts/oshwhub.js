const axios = require("axios");
function oshwhub() {
  return new Promise(async (resolve) => {
    try { 
      let headers = {
        referer: "https://oshwhub.com/sign_in",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        cookie: config.oshwhub.cookie          
        }      
      let url = "https://oshwhub.com/api/user/sign_in";
      let res = await axios.post(url,"",{headers});    
      if (res.data.success) {
       msg = `签到成功✅ 周签到${res.data.result.weekCount}，连签${res.data.result.monthCount}天`;
      } else {
        msg = res.data.message
      }
      resolve("【立创】："+msg)
    } catch (err) {
      console.log(err);
      resolve("【立创】：签到接口请求出错")
    }
    resolve();
  });
}


module.exports =oshwhub;
  