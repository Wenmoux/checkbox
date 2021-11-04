//mt论坛每日签到  https://bbs.binmt.cc/?fromuid=14593

const axios = require("axios");

function mt() {
  return new Promise(async (resolve) => {
    try {
      let cookie = config.mt.cookie || "wenmoux";
      let header = {
        headers: {
          cookie: cookie
        }
      };
      res = await axios.get("https://bbs.binmt.cc/k_misign-sign.html", header);
      let formhash = res.data.match(/formhash=(.+?)&/);
      if (formhash && !res.data.match(/登录/)) {
        let signurl = `https://bbs.binmt.cc/k_misign-sign.html?operation=qiandao&format=button&formhash=${formhash[1]}&inajax=1&ajaxtarget=midaben_sign`;
        res2 = await axios.get(signurl, header);
        if (res2.data.match(/今日已签/)) {
          msg = "今天已经签到过啦";
        } else if (res2.data.match(/签到成功/)) {
          msg1 = res2.data.match(/获得随机奖励.+?金币/);
          msg2 = res2.data.match(/已累计签到 \d+ 天/);
          msg = "签到成功\n" + msg1 + "\n" + msg2;
        } else {
          msg = "签到失败!原因未知";
          console.log(res2.data);
        }
      } else {
        msg = "cookie失效";
      }
      console.log(msg);
    } catch (err) {
      console.log(err);
      msg = "签到接口请求出错";
    }
    resolve("【MT论坛】: " + msg);
  });
}

//mt()
module.exports = mt;