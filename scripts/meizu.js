//魅族社区https://www.meizu.cn/

const axios = require("axios");
function meizu() {
  return new Promise(async (resolve) => {
    try {
      let url =
        "https://myplus-api.meizu.cn/myplus-muc/u/user/signin";
      const header = {
        headers: {
          Referer: "https://www.meizu.cn",
          cookie: config.meizu.cookie,
        },
      };
      let res = await axios.post (url,"", header);
      if (res.data.code == 200) {
        msg = `煤球奖励+${res.data.data.mcoin}，已连续签到${res.data.data.continuous}天`
      } else {
        msg = `今日已签到，明天再来哦`
      }
      console.log(res.data.msg);
    } catch (err) {
      msg = `签到接口请求错误`
      console.log(err);
    }
    resolve("【魅族社区】：" + msg);
  });
}


module.exports = meizu;
