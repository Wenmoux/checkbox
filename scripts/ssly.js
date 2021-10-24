const axios = require("axios");
//绅士领域 注册时候推荐码填：2984317

uid = config.ssly.uid; //抓包看,比如签到的post包里就有u_id,如120487
function ssly() {
  return new Promise(async (resolve) => {
    try {
      let url = `https://91ssly.xyz/mz_pbl/app_con/add_sign.php`;
      let data = `time=1635039871&mac=09308021a9da3472e6095aa048c98327&u_id=${uid}`;
      let res = await axios.post(url, data);
      if (res.data.state == 0) {
        msg = res.data.erro;
      } else if (res.data.state == 1) {
        msg = res.data.sms;
      } else {
        console.log(res.data);
        msg = "签到失败,原因未知";
      }
      console.log(msg);
    } catch (err) {
      console.log(err);
      msg = "签到接口请求失败";
    }
    resolve("【绅士领域】：" + msg);
  });
}
//ssly()
module.exports = ssly;
