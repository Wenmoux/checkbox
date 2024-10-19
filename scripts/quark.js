/*
new Env('签到盒')
cron: 0 9 * * *

抓包流程：
    【手机端】
    ①打开抓包，手机端访问签到页
    ②找到url为 https://drive-m.quark.cn/1/clouddrive/capacity/growth/info 的请求信息
    ③复制url后面的参数: kps sign vcode 粘贴到环境变量
    user字段是用户名 (可是随意填写，多账户方便区分)
    例如: 
    quark:
      cookie:
        - user=张三;kps=Ayp****WDE;sign=AAS***%3D;vcode=1726***466
        - user=张ss;kps=AAO****m3D;sign=AAS***%3D;vcode=1726***466
*/
const axios = require("axios");

/**
 * 获取增长信息
 * @param {*} params
 * @returns {Promise<Object|false>}
 */
async function getGrowthInfo(params) {
  const url = "https://drive-m.quark.cn/1/clouddrive/capacity/growth/info";
  const querystring = {
    pr: "ucpro",
    fr: "android",
    kps: params.kps,
    sign: params.sign,
    vcode: params.vcode,
  };
  try {
    const { data } = await axios.get(url, { params: querystring });
    return data.data || false;
  } catch (error) {
    console.error(
      "获取增长信息失败:",
      error.response?.data?.message || error.message
    );
    return false;
  }
}

/**
 * 获得成长标志
 * @param {*} params
 * @returns {Promise<[boolean, string]>}
 */
async function getGrowthSign(params) {
  const url = "https://drive-m.quark.cn/1/clouddrive/capacity/growth/sign";
  try {
    const { data } = await axios.post(url, { sign_cyclic: true }, { params });
    return [true, data.data.sign_daily_reward];
  } catch (error) {
    return [false, error.response?.data?.message || error.message];
  }
}

/**
 * 转换字节
 * @param {number} bytes 字节大小
 * @returns {string}
 */
function convertBytes(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

/**
 * 执行签到
 * @param {Object} userData 用户数据
 * @returns {Promise<string>}
 */
async function doSign(userData) {
  const log = [];
  const growthInfo = await getGrowthInfo(userData);

  if (growthInfo) {
    log.push(`${growthInfo["88VIP"] ? "88VIP" : "普通用户"} ${userData.user}`);
    log.push(
      `💾 网盘总容量：${convertBytes(
        growthInfo.total_capacity
      )}，签到累计容量：${convertBytes(
        growthInfo.cap_composition.sign_reward || 0
      )}`
    );

    if (growthInfo.cap_sign.sign_daily) {
      log.push(
        `✅ 今日已签到+${convertBytes(growthInfo.cap_sign.sign_daily_reward)}。`
      );
    } else {
      const [signSuccess, signReward] = await getGrowthSign(userData);
      log.push(
        `✅ 执行签到: 今日签到+${
          signSuccess ? convertBytes(signReward) : signReward
        }。`
      );
    }
  } else {
    log.push(`❌ 无法获取用户 ${userData.user} 的信息`);
  }

  return log.join("\n");
}

/**
 * 主执行函数
 */
async function quark() {
  const message = [];
  const cookieString = config.quark.cookie;
  if (!cookieString) {
    console.error("❌未添加 COOKIE_QUARK 变量");
    return;
  }

  const userDataList = cookieString.map((item) =>
    item.split(";").reduce((acc, part) => {
      const [key, value] = part.split("=");
      acc[key.trim()] = value.trim();
      return acc;
    }, {})
  );
  for (const userData of userDataList) {
    const log = await doSign(userData);
    message.join(log);
    console.log(log);
  }
  return message;
}

module.exports = quark;
