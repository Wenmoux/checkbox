const axios = require('axios');

let msg = "【共创世界】：\n";
const token = config.ccw.token
const headers = {
  'Content-Type': 'application/json',
  token
};

async function checkIn() {
  const url = 'https://community-web.ccw.site/study-community/check_in_record/insert';
  const body = {
    "scene": "HOMEPAGE"
  };

  try {
    const response = await axios.post(url, body, { headers });
    if (response.data && response.data.code === "200") {
      console.log("签到成功");
      return "成功";
    } else if (response.data && response.data.code === "10736001") {
      console.log("用户已签到");
      return "用户已签到";
    } else {
      return "签到失败";
    }
  } catch (error) {
    console.error("签到失败", error);
    return "签到失败";
  }
}

async function queryBalance() {
  const url = 'https://community-web.ccw.site/currency/account/personal';

  try {
    const response = await axios.post(url, {}, { headers });
    if (response.data && response.data.code === "200" && response.data.body) {
      console.log("当前积分:", response.data.body.internalCurrencyBalance);
      return response.data.body.internalCurrencyBalance.toString();
    } else {
      return "获取积分失败";
    }
  } catch (error) {
    console.error("查询失败", error);
    return "查询失败";
  }
}

async function task() {
  let checkInMsg = await checkIn();
  let balanceMsg = await queryBalance();
  msg += `签到：${checkInMsg}\n积分：${balanceMsg}`;
//  console.log(msg);
  return msg
}

//task(); // 如果你想在文件执行时直接运行 task 函数

module.exports = task; // 允许其他文件导入并使用 task 函数
