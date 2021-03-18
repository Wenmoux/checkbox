const axios = require("axios");
let result = "晋江小说每日签到:\n";
function jjwxc() {
  return new Promise(async (resolve) => {
    try {
      let url = "https://m.jjwxc.net/my/signIn";
      let res = await axios.get(url, {
        headers: {
          cookie: config.jjwxc.cookie || "sid=wenmoux",
          "x-requested-with": "XMLHttpRequest",
        },
      });
      if (res.data && res.data.message) {
        str = `${res.data.message}`;
      } else {
        str = "cookie失效";
      }
      result += str;
      console.log(str);
    } catch (err) {
      console.log(err);
      result += "签到失败！接口请求出错";
      console.log("签到失败！接口请求出错");
    }
    resolve(result);
  });
}

module.exports = jjwxc;
