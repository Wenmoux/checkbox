const axios = require("axios");
function get(op) {
  return new Promise(async (resolve) => {
    try { 
      let headers = {
        referer: "https://www.linovel.net/my/profile",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        cookie: config.linovel.cookie 
          }      
      let url = `https://www.linovel.net/my/${op}?xhr=1`;
      let res = await axios.get(url,{headers});    
      if (res.data.code == 0) {
       if(op == "qiandao") msg = `签到成功✅ 获得${res.data.data.base}墨水，连签${res.data.data.day}天`;
       if(op=="getMonthlyTicket") msg = `领取月票成功✅ 获得${res.data.data.now}月票`;
      } else {
        msg = res.data.msg
      }
      resolve(msg)
    } catch (err) {
      console.log(err);
      resolve("签到接口请求出错")
    }
    resolve();
  });
}

async function linovel(){
  let qdmsg = await get("qiandao")
  let ypmsg = await get("getMonthlyTicket")
  let Liresult = `【轻之文库】：\n签到:${qdmsg}\n领取月票:${ypmsg}`
  return Liresult
} 
module.exports =linovel ;
  