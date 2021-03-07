const axios = require("axios");
let result = "CSDN每日签到：\n";
function task(id) {
  return new Promise(async (resolve) => {
    try {
      let cookie = require("../config.json").csdn.cookie;
      let url = `https://me.csdn.net/api/LuckyDraw_v2/${id}`;
      let res = await axios.get(url, { headers: { cookie: cookie } });
      if (res.data.code == 200 && res.data.data && res.data.data.msg) {
        console.log(res.data.data.msg);
        msg = res.data.data.msg;
      } else {
        console.log(res.data);
        msg = "签到失败";
      }
    } catch (err) {
      msg = "操作失败" + err.response.data.message;
      console.log(msg);
    }
    resolve(msg);
  });
}

async function csdn() {
  result += await task("signIn"); //签到
  await task("goodluck"); //抽奖
  return result;
}

//task()

module.exports = csdn;
