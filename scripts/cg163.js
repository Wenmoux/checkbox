const headers = {
  headers: {
    Authorization:
      config.cg163.Authorization || " bearer xxxxx",
    "user-agent":
      "Mozilla/5.0 (Linux; Android 10; Redmi K30 Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36",
    //                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
  },
};
function check() {
  return new Promise(async (resolve) => {
    try {
      const url = `https://n.cg.163.com/api/v2/users/@me`;
      let res = await $http.get(url, headers);
      console.log("cookie未失效,即将开始签到...");
      ckstatus = 1;
    } catch (err) {
      //   console.log(err)
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
      let res = await $http.post(url, "", headers);
      console.log("签到成功");
      msg = "签到成功\n";
    } catch (err) {
      //   console.log(err)
      msg = "签到失败,已签到过或其它未知原因\n";
      console.log(msg);
    }
    resolve(msg);
  });
}
async function cg163() {
  ckstatus = 0;
  await check();
  if (ckstatus == 1) {
    return await sign();
  } else {
    console.log("cookie失效,请重新抓取cookies...");
    return "网易云游戏: cookie失效,请重新抓取cookies...";
  }
}
//cg163()
module.exports = cg163;
