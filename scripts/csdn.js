const axios = require("axios");
let result = "【CSDN每日签到】：";
function task(id) {
  return new Promise(async (resolve) => {
    try {
      let cookie = config.csdn.cookie;
      let url = `https://me.csdn.net/api/LuckyDraw_v2/${id}`;
      let res = await axios.get(url, { headers: { cookie: cookie } });
      console.log(res.data);
      if (res.data.code == 200 && res.data.data ) {        
        msg = res.data.data.msg?res.data.data.msg:(res.data.data.prize_title?`抽奖成功！获得${res.data.data.prize_title}`:JSON.stringify(res.data.data));
      } else {        
        msg = "签到失败";
      }
      result+=msg+" "
    } catch (err) {
      msg = "操作失败" + err.response.data.message;
      console.log(msg);
    }
    resolve(msg);
  });
}

async function csdn() {
  await task("signIn"); //签到
  await task("goodluck"); //抽奖
  return result;
}

//task()

module.exports = csdn;
