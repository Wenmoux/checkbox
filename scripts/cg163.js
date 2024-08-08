const headers = {
  headers: {
    Authorization: config.cg163.Authorization || " bearer xxxxx",
    "user-agent":
      "Mozilla/5.0 (Linux; Android 10; Redmi K30 Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36",
    //                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
  },
  validateStatus: status => status >= 200 && status < 300 || status === 400
};
const axios = require("axios");
function decrypt(data) {
  const i = Buffer.from(data, "base64");

  const result = i.map((item) => {
    const n = (item - 301) % 256;
    // 确保结果为正数
    return n < 0 ? n + 256 : n;
  });

  return result.toString();
}

function check() {
  return new Promise(async (resolve) => {
    try {
      const url = `https://n.cg.163.com/api/v2/users/@me`;
      let res = await axios.get(url, headers);
      console.log("cookie未失效,即将开始签到...");
      ckstatus = 1;
    } catch (err) {
      // console.log(err);
      console.log("cookie已失效");
      ckstatus = 0;
    }
    resolve();
  });
}

function sign() {
  return new Promise(async (resolve) => {
    try {
      const url = `https://n.cg.163.com/api/v2/sign-today`;
      const res = await axios.post(url, "", headers);
      const result = decrypt(res.data);
      const data = JSON.parse(result);
      if (data.hasOwnProperty("errmsgcn")) {
        msg = "签到失败：" + data.errmsgcn;
      } else {
        msg = "签到成功！！ \n" + data.map(item => item.sign_msg).join('\n');
      }
    } catch (err) {
      // console.log(err)
      msg = "签到失败，未知原因！！ ";
    }
    console.log(msg);
    resolve("【网易云游戏】：" + msg);
  });
}
async function cg163() {
  ckstatus = 0;
  await check();
  if (ckstatus == 1) {
    return await sign();
  } else {
    console.log("cookie失效,请重新抓取cookies...");
    return "【网易云游戏】: cookie失效,请重新抓取cookies...";
  }
}
//cg163()
module.exports = cg163;
