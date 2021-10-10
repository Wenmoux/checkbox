//Qoo app 个人中心转蛋 没啥用
const axios = require("axios");
function task() {
  return new Promise(async (resolve) => {
    try {
      let token = config.Qoo.token;
      await axios.post(`https://api.qoo-app.com/v9/usercard/setcardshare?token=${token}`)
      let url = `https://api.qoo-app.com/v9/usercard/signincard?token=${token}`;
      let res = await axios.post(url);    
      if (res.data.code == 200) {
       msg = `签到成功✅ 当前共${res.data.data.point}转蛋券`;
       if(res.data.data.ret==1) console.log(`签到成功！今日获得${res.data.data.add}券`)       
      } else {
        msg = JSON.stringify(res.data);
      }
      console.log(msg);
    } catch (err) {
      msg = "签到接口请求出错";
      console.log(err);
    }
    resolve("【Qoo】："+msg );
  });
}


module.exports = task;
  