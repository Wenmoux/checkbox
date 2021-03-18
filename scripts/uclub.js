//uclub签到 每天获得1积分,30天后每天2积分
//我的邀请链接 https://uclub.ucloud.cn/invite/478
const axios = require("axios");
function task() {
  return new Promise(async (resolve) => {
    try {
      let token = config.ucloud.token;
      let url = "https://uclub.ucloud.cn/index/signin/dosign";
      let res = await axios.post(url, "", {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          cookie: `token=${token}`,
        },
      });
      if (res.data.wait) {
        msg = res.data.msg;
      } else {
        msg = "cookie失效";
      }
      console.log(msg);
    } catch (err) {
      console.log(err);
    }
    resolve("uclub签到: \n" + msg);
  });
}

//task()
module.exports = task;
