const axios = require('axios');
let backendtoken =null
let guildtoken = null
let Authorization = ""
let userid = ""
async function sendRequest(method, url, data) {
  var config = {
    method: method,
    url: url,
    headers: {
        Authorization,
        userid,
        Source:"android",
        'Content-Type': 'application/json'
    },
  };
//console.log(config)
  if (method.toLowerCase() === 'post') {
    config.data = data;
  } else if (method.toLowerCase() === 'get') {
    config.params = data;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}
 
async function refreshToken() {
  const url = 'https://simbasdk.icesimba.com/simba-sdk/api/v1/refresh-tokens';
  const data = {
  //测试
    "refreshToken": config.simba.refreshtoken,
    "appId": "yybs"
  };
  console.log(config.simba.refreshtoken)
  try {
    const res = await sendRequest('post', url, data);
    console.log('Token 刷新成功:');
    backendtoken = "Bearer "+res.serviceTokens["yybs-backend"]
    guildtoken = "Bearer "+res.serviceTokens["yybs-guild"]
    userid = res.subject.split("_")[1]
  } catch (error) {
    console.log('Token 刷新失败:', error);
    return null;
  }
}


async function guildSignIn() {
  const url = 'https://simba-avg-yybs-guild.icesimba.com/api/v1/guild/signs';
  try {
    const response = await sendRequest('post', url, {});
    console.log('工会签到成功:', response);
    gx = response.dayRewards[0].count
    gb = response.dayRewards[1].count
    gmsg = `获得工会贡献 ${gx},工会币${gb}`
   return gmsg
  } catch (error) {
    console.log('工会签到失败:', error.message);
    gmsg = error.message
      return gmsg
  }

}

async function claimActiveReward() {
  const url = 'https://simba-avg-yybs.icesimba.com/api/v1/online';
  try {
    const response = await sendRequest('post', url, [30]);
    console.log('领取活跃奖励成功:', response);
  } catch (error) {
    console.log('领取活跃奖励失败:', error.message);
  }
}

async function claimLowGuarantee(code) {
  const url = 'https://simba-avg-yybs.icesimba.com/api/v1/activities/pickup';
  const data = {
    "vipCode": "ED0RArGAU6A",
    "source": "Simba",
    "activityId":code,// "7L22",//4Gyd
    "count": 1
  };
  try {
    const response = await sendRequest('post', url, data);
    console.log('摩绪涅低保领取成功:', response);
  } catch (error) {
    console.log('摩绪涅低保领取失败:', error.message);
  }
}


async function checkSunstoneBalance() {
  const url = 'https://simba-avg-yybs.icesimba.com/api/v1/backpacks';
  try {
    const response = await sendRequest('get', url);
    const sunstoneBalance = response.pack["132"].num;
    console.log('太阳石余额:', sunstoneBalance);
    return sunstoneBalance;
  } catch (error) {
    console.log('查询太阳石余额失败:', error);
    return 0;
  }
}

 


async function performTasks() {
  await refreshToken();//刷新token
  if(backendtoken){
  Authorization = guildtoken;
  let gmsg = await guildSignIn();  //工会打卡
  Authorization = backendtoken
    yy1=await checkSunstoneBalance(); //查询
  await claimActiveReward(); //活跃甜点
  await claimLowGuarantee("7L22"); //小推车低保
  await claimLowGuarantee("7L22"); //小推车低保
  await claimLowGuarantee("4Gyd");
  yy2=await checkSunstoneBalance(); //查询
  let msg = `【月影别墅】：\n    工会打卡：${gmsg}\n    低保领取：\n    太阳石余额：${yy2}\n    本次获得：${yy2-yy1}`
  console.log(msg)
  return msg
}
return "【月影别墅】：获取token失败"
}
//performTasks();
module.exports = performTasks
 

