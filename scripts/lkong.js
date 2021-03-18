const axios = require("axios");
function task() {
  return new Promise(async (resolve) => {
    try {
      let cookie = config.lkong.cookie;
      let url = "http://lkong.cn/index.php?mod=ajax&action=punch";
      let res = await axios.get(url, { headers: { cookie: cookie } });
      if (res.data.punchday) {
        msg = `签到成功✅已连签${res.data.punchday}天`;
      } else {
        msg = res.data.error;
      }
      console.log(msg);
    } catch (err) {
      msg = "签到接口请求出错";
      console.log(err);
    }
    resolve("龙空论坛签到：\n" + msg);
  });
}

//task()
module.exports = task;
