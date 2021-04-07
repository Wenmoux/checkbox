//魅族社区https://bbs.meizu.cn/

const axios = require("axios");
function meizu() {
  return new Promise(async (resolve) => {
    try {
      let url =
        "https://mf.meizu.cn/signin/sign";
      const header = {
        headers: {
          Referer: "https://mf.meizu.cn/space/user",
          cookie: config.meizu.cookie,
        },
      };
      let res = await axios.get(url, header);
      if (res.data.code == 200) {
        data = `${res.data.message} 排名 ${res.data.rank}`
      } else {
        data = res.data.message;
      }
      console.log(data);
    } catch (err) {
      console.log(err);
      data="签到接口请求出错"
    }
    resolve("【魅族社区每日签到】：" + data);
  });
}


module.exports = meizu;
