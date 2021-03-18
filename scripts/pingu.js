//经管之家 邀请链接 https://bbs.pinggu.org/?fromuid=11925701
const axios = require("axios");
function task() {
  return new Promise(async (resolve) => {
    try {
      let url = "https://bbs.pinggu.org/index_lth5.php?mod=my_qiandao&uid=";
      let res = await axios.get(url, {
        headers: {
          cookie: config.pinggu.cookie,
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.110 Mobile Safari/537.36",
        },
      });
      if (res.data.data) {
        msg = res.data.data.msg;
      } else {
        msg = "cookie已失效,请及时更新";
      }
      console.log(msg);
    } catch (err) {
      console.log(err);
      msg = "签到接口请求出错";
    }
    resolve("经管之家每日签到：\n" + msg);
  });
}

//task()

module.exports = task;
