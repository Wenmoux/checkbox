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
          "x-rpc-combo_token": config.yunys.combo_token,
          "x-rpc-client_type": config.yunys.type,
		  "x-rpc-app_version": config.yunys.app_version,
          "x-rpc-sys_version": config.yunys.sys_version,
          "x-rpc-channel": "mihoyo",
          "x-rpc-device_id": config.yunys.device_id,
          "x-rpc-device_name": config.yunys.device_name,
          "x-rpc-device_model": config.yunys.device_model,
          "x-rpc-app_id": config.yunys.app_id,
          "Referer": "https://app.mihoyo.com",
          "Host": "api-cloudgame.mihoyo.com",
          "Connection": "Keep-Alive",
          "Accept-Encoding": "gzip",
          "User-Agent": "okhttp/3.14.9"
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
