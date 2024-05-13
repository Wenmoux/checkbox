const axios = require("axios");

cookie = config.quark.cookie;

const headers = {
  "Content-Type": "application/json",
  Cookie: cookie,
};

/**
 *
 * @returns 签到情况
 */
function quark() {
  return new Promise(async (resolve) => {
    try {
      const url = "https://drive-m.quark.cn/1/clouddrive/capacity/growth/info";
      const params = {
        pr: "ucpro",
        fr: "pc",
        uc_param_str: "",
      };
      let res = await axios.get(url, { headers, params });
      if (res.data.data.cap_sign.sign_daily) {
        const sign = res.data.data.cap_sign;
        const number = sign.sign_daily_reward / 1048576;
        const progress = Math.round(
          (sign.sign_progress / sign.sign_target) * 100
        );
        console.log(`今日已签到,获取${number}MB，进度${progress}%`);
        msg = `今日已签到,获取${number}MB，进度${progress}%`;
      } else {
        await qd();
      }
    } catch (error) {
      console.log(error);
      msg = "签到接口请求失败";
    }
    resolve("【夸克网盘】：" + msg || "正常运行了");
  });
}

/**
 *
 * @returns 签到结果
 */
function qd() {
  return new Promise(async (resolve) => {
    try {
      const url = "https://drive-m.quark.cn/1/clouddrive/capacity/growth/sign";
      const params = {
        pr: "ucpro",
        fr: "pc",
        uc_param_str: "",
      };
      let res = await axios.post(
        url,
        {
          sign_cyclic: true,
        },
        { headers, params }
      );
      if (res.data.status == 200) {
        const sign = res.data.data;
        const number = sign.sign_daily_reward / 1048576;
        console.log(`签到成功,本次签到领取${number}MB`);
        msg = `签到成功,本次签到领取${number}MB`;
      } else {
        console.log(`签到失败，${res.data.message}!`);
        msg = "签到失败";
      }
    } catch (error) {
      console.log(error);
      msg = "签到接口请求失败";
    }
    resolve("【夸克网盘】：" + msg || "正常运行了");
  });
}

module.exports = quark;
