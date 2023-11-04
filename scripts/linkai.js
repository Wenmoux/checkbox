// https://chat.link-ai.tech/home?share=GBoWyH
 const axios = require("axios");
function linkai() { 
  return new Promise(async (resolve) => {
    try {
      const url = 'https://chat.link-ai.tech/api/chat/web/app/user/sign/in';
  const token = config.linkai.Authorization; // 
  
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });

    if (response.data.success) {
      msg = `签到成功，获得 ${response.data.data.score} 积分`;
    } else {
      msg = `签到失败，原因：${response.data.message}`;
    }
    console.log(msg)
    } catch (error) {
      msg =`签到失败，原因：${error.message}`;
    }
    resolve("【linkai】：" + msg);
  });
}
module.exports = linkai;
