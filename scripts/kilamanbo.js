const axios = require('axios');
const md5 = require("crypto-js").MD5;
const BASE_URL = 'https://api.kilamanbo.com/api';
let klmsg = "【克拉漫播】：\n"
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  ua: config.kilamanbo.ua,
  "_c": 20,
  "x-auth-token": config.kilamanbo.authtoken
};

const makeRequest = async (method, endpoint, data = '') => {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await axios({
      method: method,
      url: url,
      data: data,
      headers: headers
    });
    return response.data;
  } catch (error) {
    console.error(`Error with ${method.toUpperCase()} request to ${endpoint}`, error);
    throw error;
  }
};

const checkIn = async () => {
  const endpoint = '/v424/user/checkIn';
  const data = 'timeZoneStr=Asia%2FShanghai&uid=-1&sign=';
  try {
    const response = await makeRequest('post', endpoint, data);
    const msg = response?.h?.msg;
    console.log(msg);
    return  msg;
  } catch (error) {
    const msg = error.response?.data?.h?.msg || error.message;
    console.error(msg);
    return msg;
  }
};

const getSign = (data) => {
  var str = data.split("&").sort().join("&");
  return md5("nJi9o;/" + str).toString();
};
const cx = async () => {
  const endpoint = '/v433/user/level/info?uid=3100350001213';
  const data = 'uid=3100350001213';
  try {
    const response = await makeRequest('get', endpoint);
    const msg = response.b;
    console.log("获取个人信息成功")

    klmsg +=`    昵称：${msg.nickname}\n    等级：Lv${msg.level}(${msg.levelInfo.thisExp}/${msg.levelInfo.nextExp})\n    签到：`
  } catch (error) {
   const msg = error.response?.data?.h?.msg || error.message;
   console.error("获取个人信息失败：" + msg);
 klmsg+=msg
   //  return "【克拉漫播】：" + msg;
  }
};
const complete = async (bid, objectId) => {
  const data = `missionBizId=${bid}&objectId=${objectId}&bizType=12&probe=0`;
  const sign = getSign(data);  
  const signedData = `${data}&sign=${sign}`;  
  const endpoint = '/v424/user/daily/mission/complete';
  const response = await makeRequest('post', endpoint, signedData); 
  console.log(response.h.msg);
};
const getVideo = async () => {
  const endpoint = '/v433/small/video/plant/grass/timeline?pageNo=1&pageSize=10';
  const response = await makeRequest('get', endpoint);
  return response.b.data;
};

const task = async () => {
  let checkinMsg = await checkIn();
  let vList = await getVideo();
  for (let i = 0; i < 5; i++) {
    console.log(`看视频：${vList[i].videoResp.introduce}`)
    await complete("21", vList[i].videoResp.idStr);
    await complete("4", vList[i].videoResp.idStr);
  }
  await cx()
   klmsg+=checkinMsg
   return klmsg
};

module.exports = task;
 