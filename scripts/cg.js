/*
 * @Author: Wenmoux
 * @Date: 2020-12-03 08:48:00
 * @LastEditTime: 2020-12-03 09:13:14
 * @Description: 橙光游戏app每日签到+登陆奖励领取+每日分享
 * @Other：X-sign生成 https://my.oschina.net/2devil/blog/2395909
 */

const axios = require("axios");
const md5 =require("crypto-js").MD5
const token = config.cg.token;
const skey = config.cg.skey;
const shareid = 1129745;
let result = "橙光app签到: \n";
function check() {
  return new Promise(async (resolve) => {
    try {
      const url = "https://www.66rpg.com/Ajax/Home/new_sign_in.json";
      let data = `token=${token}&mobile_uid=&client=2&android_cur_ver=268`;
      const headers = {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 10; Redmi K30 Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      };
      let res = await axios.post(url, data, {
        headers,
      });
      if (res.data.status == 1) {
        msg = `签到成功,获得：${res.data.data.today.award_name}\n明日继续签到🉑获得：${res.data.data.tomorrow.award_name}\n`;
      } else {
        msg = "签到失败⚠️⚠️⚠️ " + res.data.msg + "\n";
      }
      console.log(msg);
      result += msg;
    } catch (err) {
      msg = "签到接口请求出错\n";
      console.log(err);
    }
    resolve();
  });
}

function loginreward() {
  return new Promise(async (resolve) => {
    try {
      var ar = `pack_name=com.sixrpg.opalyer&sv=QKQ1.190825.002testkeys&android_cur_ver=2.25.268.1027&nt=4g&device_code=RedmiK30&channel=LYyingyongbao&skey=&device_unique_id=e6999ad43244c52f&token=${token}`;
      var str = ar
        .split("&")
        .sort(function (a, b) {
          return a.localeCompare(b);
        })
        .join("&");
      const url = `http://iapi.66rpg.com/user/v2/sso/launch_remind?${ar}`;
      let data = `token=${token}&mobile_uid=&client=2&android_cur_ver=268`;
      headers = {
        headers: {
          "x-sign": md5(str + "a_744022879dc25b40").toString(),
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; Redmi K30 Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      };
      let res = await axios.get(url, headers);
      if (res.data.status == 1) {
        if (!res.data.data.integral.hidden) {
          msg =
            "    登陆成功,获得：" +
            res.data.data.integral.msg +
            "," +
            res.data.data.flower.msg;
        } else {
          msg = "今日已经领取过登陆奖励了";
        }
      } else {
        msg = "领取登陆奖励失败：" + res.data.msg;
      }
      result += msg;
      console.log(msg);
    } catch (err) {
      console.log(err);
    }
    resolve();
  });
}

function share() {
  return new Promise(async (resolve) => {
    try {
      var ar = `pack_name=com.sixrpg.opalyer&sv=QKQ1.190825.002testkeys&android_cur_ver=2.27.273.1229&nt=4g&channel=vivoDYD&platform=2&token=${token}&gindex=${shareid}&share_msg_id=&device_code=RedmiK30&action=share_game&skey=${skey}&device_unique_id=e6999ad43244c52f&share_channel=3`;
      var str = ar
        .split("&")
        .sort(function (a, b) {
          return a.localeCompare(b);
        })
        .join("&");
      const url = `http://www.66rpg.com/api/newClient?${ar}`;
      headers = {
        headers: {
          "x-sign": md5(str + "a_744022879dc25b40").toString(),
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; Redmi K30 Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      };
      let res = await axios.get(url, headers);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
    resolve();
  });
}

async function cg() {
  console.log("橙光app每日签到开始...");
  await check();
  await loginreward();
  await share();
  return result;
}
//cg()
module.exports = cg;
/*
#todo
每日活跃任务
领取活跃宝箱
邀请小号
*/
