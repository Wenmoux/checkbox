const axios = require("axios");
function task() {
  return new Promise(async (resolve) => {
    try {
      let cookie = config.yi7k.cookie;
      let url = config.yi7k.url;      
      let res = await axios.get(url, { headers: { cookie: cookie } });
      if (res.data.data.signInfo) {
        msg = `签到成功✅本月累计签到${res.data.data.signInfo.sign.m_num}天`;
      } else {
        msg = res.data.error;
      }
      console.log(msg);
    } catch (err) {
      msg = "签到接口请求出错";
      console.log(err);
    }
    resolve("【17K小说】：" + msg + "\n当月累计签到达到7、14、21、满签时，可获得额外奖励\n请自行手动领取");
  });
}
//task()
module.exports = task;
