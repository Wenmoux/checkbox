const axios = require('axios');

async function signIn() {
  const url = 'https://www.ablesci.com/user/sign';
  const headers = {
    'Cookie': config.ablesci.cookie// 传入cookie
  };
  try {
    const response = await axios.get(url, { headers });
    let msg = ""   
      if (response.data.code === 0) {
        console.log("签到成功:", response.data.msg);
         msg = response.data.msg;
      } else if (response.data.code === 1) {
        console.log("签到失败:", response.data.msg);
        msg =  response.data.msg;
      } else {
        console.log("签到异常:", response.data.msg);
        msg =  response.data.msg;
      }
    return "【科研通】:"+msg
  } catch (error) {
    console.error("签到请求失败", error);
    return "【科研通】：签到请求失败";
  }
}

module.exports = signIn;