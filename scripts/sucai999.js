//素材图库 http://cntk.sucaidao.com/invite/NDY4MjU0.html
const axios = require("axios");
function sucai999() {
  return new Promise(async (resolve) => {
    try {
      let url =
        "http://www.sucai999.com/default/qiandao/qd";
      const header = {
        headers: {
          Referer: "http://www.sucai999.com",
          cookie: config.sucai999.cookie,
        },
      };
      let res = await axios.get(url, header);
      if (res.data.status == 1) {
        data = `签到成功! ${res.data.content} ${res.data.yiqiandao}`;
      } else {
        data = res.data.msg;
      }
      console.log(data);
    } catch (err) {
      console.log(err);
      data="签到接口请求出错"
    }
    resolve("【菜鸟图库每日签到】：" + data);
  });
}
//smzdm()
module.exports = sucai999;
