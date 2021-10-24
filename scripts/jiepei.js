//id就是客户编号中的数字
const axios = require("axios");
function jiepei() {
  return new Promise(async (resolve) => {
    try { 
      let headers = {
        referer: "",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
     //   cookie: config.oshwhub.cookie         
        }      
      let url = "https://www.jiepei.com/Member/Checkin?MbId="+config.jiepei.MbId;
      let res = await axios.post(url,"",{headers});        
      if (res.data.success) {
       msg = `签到成功✅ 获得￥${res.data.message}`;
      } else {
        msg = res.data.message
      }
      resolve("【捷配】："+msg)
    } catch (err) {
      console.log(err);
      resolve("【捷配】：签到接口请求出错")
    }
    resolve();
  });
}


module.exports =jiepei;
  