const headers = {
  Authorization: config.hscy.authorization
};
const axios = require("axios")
function sign() {
  return new Promise(async (resolve) => {
    try {
      const url = `https://heisi.moe/wp-json/b2/v1/userMission`;
      let res = await axios.post(url, "", {headers});
      let credit = res.data.credit ? res.data.credit : res.data
      console.log("签到成功，获得：" + credit + "分");
      msg = "签到成功，获得：" + res.data.credit + "分";
    } catch (err) {
      console.log(err)
      msg = "签到失败,其它未知原因！！ ";
      console.log(msg);
    }
    resolve("【黑丝次元】："+msg);
  });
}
async function hscy() {
  await sign();
}

module.exports = hscy;
