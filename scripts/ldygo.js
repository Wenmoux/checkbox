//联动云租车每日签到https://m.ldygo.com/app/extension/phoneVoucher.html?inviteCode=JW0hcdmJ
const axios = require("axios");
function ldygo() {
  return new Promise(async (resolve) => {
    try {
      let url =
        "https://m.ldygo.com/los/zuche-intf-union.signIn";
      const header = {
        headers: {
          cookie: config.ldygo.cookie,
        },
      };
       const postdata = {"_channel_id":"09","_client_version_no":"2.11.0","timestamp":Math.round(new Date().getTime()/1000).toString()}    
        let res =  await axios.post(url, postdata,header);
      if (res.data.responseCode == "000000") {
        data = `签到成功! ☁️ + ${res.data.model.points}`;
      } else {
        data = res.data.responseMsg;
      }
      console.log(data);
    } catch (err) {
      console.log(err);
      data="签到接口请求出错"
    }
    resolve("【联动云租车】：" + data);
  });
}
module.exports = ldygo;
