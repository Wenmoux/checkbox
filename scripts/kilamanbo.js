const axios = require('axios');
const md5 = require("crypto-js").MD5;
const BASE_URL = 'https://api.kilamanbo.com/api';
let klmsg = "【克拉漫播】：\n"
const headers = {
  ua: config.kilamanbo.ua,
  "_c": 20,
  "x-auth-token": config.kilamanbo.authtoken
};
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const makeRequest = async (method, endpoint, data = '',json=null) => {
  const url = `${BASE_URL}${endpoint}`;
  try {
  if(json) headers["Content-Type"] = "application/json"
  else headers["Content-Type"] = 'application/x-www-form-urlencoded'
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

const ft = async () => {
  const endpoint = '/v433/imgtxt/new/add';
  let msg = await axios.get("https://v1.hitokoto.cn/");
  const data = {"groupActivityId":0,"imgList":[],"introduce":msg.data.hitokoto,"source":1}
  try {
    const response = await makeRequest('post', endpoint, data,true);
    const msg = response?.h?.msg;
    console.log(msg);
    if(response.b){ id = response.b.imgTxtResp.id
    console.log(`发帖 ${id}`)
    await sleep(3000)
    let data = `dynamicId=${id}&type=38`
    let signedData = `${data}&sign=${getSign(data)}`;
    let rss =await makeRequest('post','/v435/dynamic/info/delete',signedData) 
    console.log(signedData) 
    console.log(rss)  
    }
  //  return  msg;
  } catch (error) {
    const msg = error.response?.data?.h?.msg || error.message;
    console.error(msg);
 //   return msg;
  }
};
const getSign = (data) => {
  var str = data.split("&").sort().join("&");
  return md5("nJi9o;/" + str).toString();
};
const cx = async () => {
  const endpoint = '/v433/user/level/info?uid=';
  const data = 'uid=';
  try {
    const response = await makeRequest('get', endpoint);
    const msg = response.b;
    console.log("获取个人信息成功")

    klmsg +=`    昵称：${msg.nickname}\n    等级：Lv${msg.level}(${msg.levelInfo.exp}/${msg.levelInfo.nextExp})\n    签到：`
   // console.log(msg)
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
const getExp = async (id) => {
console.log("去领宝箱：",id)
const data = `giftPackType=${id}`
  const endpoint = `/v435/user/gift/pack/get?giftPackType=${id}&sign=${getSign(data)}`;
  const response = await makeRequest('get', endpoint);
  console.log(response?.h?.msg);
};

const task = async () => {
 let checkinMsg = await checkIn();
  let vList = await getVideo();
  for (let i = 0; i < 5; i++) {
    console.log(`看视频：${vList[i].videoResp.introduce}`)
    await complete("21", vList[i].videoResp.idStr);
    await complete("4", vList[i].videoResp.idStr);
  }
  for ( k of [1,2,3]){
await ft()  
  }
  for (c of [1,2,3]) await getExp(c)
  await cx()
   klmsg+=checkinMsg
   return klmsg
};

module.exports = task;
 