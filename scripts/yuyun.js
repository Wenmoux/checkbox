/*
new Env('雨云')
cron: 0 7 * * * yuyun.js

白嫖的项目：签到白嫖游戏服务器或者稳定的虚拟主机，攒着提现也可以（2018年以来一直稳定运行的，自己可以查一查资料）

https://www.rainyun.cc/
*/

const axios = require("axios");
let result = "【云雨】：";
class RainYun {
  constructor(token) {
    this.token = token;
    this.signinResult = false;
    this.points = null;

    this.urls = {
      signin: "https://api.v2.rainyun.com/user/reward/tasks",
      logout: "https://api.v2.rainyun.com/user/logout",
      query: "https://api.v2.rainyun.com/user/",
    };

    this.session = axios.create({
      headers: {
        "x-api-key": this.token,
        "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
        "Content-Type": "application/json",
      },
    });
  }

  async request(method, url, data = {}) {
    try {
      const res = await this.session({ method, url, data });
      // console.log(res);
      if (res.status === 200) return res;
      console.error(`请求失败: ${method.toUpperCase()} ${url}`);
    } catch (error) {
      // console.log(error.response);
      console.error(`请求出错: ${method.toUpperCase()} ${url}`, error.message);
    }
    return null;
  }

  async signin() {
    var data = JSON.stringify({
      task_name: "每日签到",
    });

    const res = await this.request("post", this.urls.signin, data);
    this.signinResult = !!res;
    this.signinResult
      ? console.log("成功签到并领取积分")
      : console.error("签到失败");
  }

  async query() {
    const res = await this.request("get", this.urls.query);
    if (res) {
      this.points = res.data.data.Points || res.data.data.points;
      console.log("积分查询成功，积分为", this.points);
      result += "当前积分: " + this.points;
    }
  }
}

function yuyun() {
  return new Promise(async (resolve) => {
    const tokens = config.yunyu.token;

    if (!tokens) {
      console.error("❌未添加 YUYUN_token 变量");
      return;
    }

    for (const token of tokens) {
      const ry = new RainYun(token);
      await ry.signin();
      await ry.query();
    }
    resolve(result);
  });
}

module.exports = yuyun;
