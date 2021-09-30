//云原神签到
const axios = require("axios");
function yunys() {
  return new Promise(async (resolve) => {
    try {
      let url =
        "https://api-cloudgame.mihoyo.com/hk4e_cg_cn/wallet/wallet/get";
      const header = {
        headers: {
          Referer: "https://app.mihoyo.com/",
          "x-rpc-combo_token": config.yunys.token,
          "x-rpc-client_type": "2"
        },
      };
      let res = await axios.get(url, header);
      if (res.data.retcode == 0) {
        data = `签到成功! 当前账号剩余总时间为${res.data.data.free_time.free_time}分钟`;
      } else {
        data = res.data.error_msg;
      }
      console.log(data);
    } catch (err) {
      console.log(err);
      data="签到接口请求出错"
    }
    resolve("【云原神】：" + data);
  });
}
//yunys()
module.exports = yunys;
