const axios = require("axios");

function Template(rules) {
  return new Promise(async (resolve) => {
    try {
      const header = { headers: { cookie: rules.cookie } };
      res = await axios.get(rules.url1, header);
      let formhash = res.data.match(rules.reg1);
      // console.log(formhash)
      if (formhash && !res.data.match(rules.verify)) {
        let signurl = rules.signurl.replace(/@formhash/, formhash[1]);
        if (rules.signmethod == "post") {
          data = `formhash=@formhash&signsubmit=yes&handlekey=signin&emotid=1&referer=https%3A%2F%2Fwww.diygm.com%2Fmisc.php%3Fmod%3Dmobile&content=%E8%AE%B0%E4%B8%8A%E4%B8%80%E7%AC%94%EF%BC%8Chold%E4%BD%8F%E6%88%91%E7%9A%84%E5%BF%AB%E4%B9%90%EF%BC%81`;
          res2 = await axios.post(
            signurl,
            data.replace(/@formhash/, formhash[1]),
            header
          );
        } else if (rules.signmethod == "get") {
          res2 = await axios.get(signurl, header);
        }
        if (res2.data.match(rules.reg2)) {
          msg = "今天已经签到过啦";
        } else if (res2.data.match(rules.reg3)) {
          msg = res2.data.match(rules.info);
        } else {
          msg = "签到失败!原因未知";
          console.log(res2.data);
        }
      } else {
        msg = "cookie失效";
      }
      console.log(msg);
      //   console.log(msg);
    } catch (err) {
      console.log(err);
      msg = "签到失败"
    }
    resolve(rules.name + msg);
  });
}

module.exports = Template;
