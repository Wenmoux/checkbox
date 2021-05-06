let st = "";
let result = "ACFUN:\n";
let authkey = "";
let headers = {
  access_token: "",
  acPlatform: "ANDROID_PHONE",
  deviceType: 1,
  "Content-Type": "application/x-www-form-urlencoded",
  "User-Agent": "acvideo core/6.11.1.822",
  cookie: "",
};
const $http = require("axios");
function get(options) {
  return new Promise((resolve, reject) => {
    $http
      .post(
        "https://api-new.acfunchina.com/rest/app" + options.url,
        options.para,
        {
          headers,
        }
      )
      .then((response) => {
        //  console.log(response)
        resolve(response.data);
      })
      .catch((err) => {
        //console.log(err.response)
        resolve(err.response.data);
      });
  });
}

var signIn = async function () {
  return await get({
    url: `/user/signIn`,
    para: {},
  }).then((res) => {
    //console.log(res)
    if (res.result == 0) {
      signata = "签到成功！ || ";
    } else if (res.result == 122) {
      signdata = "今天已经签到过啦！ || ";
    }
    console.log(signdata);
    result += signdata;
    return res;
  });
};
var ThrowBanana = async function (id) {
  return await get({
    url: "/banana/throwBanana",
    para: `resourceId=${id}&count=1&resourceType=2`,
  }).then(async (res) => {
    //console.log(res)
    console.log(id);
    if (res.result == 0) {
      signdata = "🍌易已达成！ || ";
    } else if (
      res.error_msg == "内容未找到" ||
      res.error_msg == "被投蕉用户id不能小于0"
    ) {
      await ThrowBanana(Math.round(Math.random() * 10000) + 14431808);
    } else {
      signdata = "🍌易失败！ || ";
      console.log(res);
    }
    console.log(signdata);
    result += signdata;
    return res;
  });
};

var getinfo = async function () {
  return await get({
    url: "/user/personalInfo",
    para: "",
  }).then(async (res) => {
    
    let info=`香蕉：${res.info.banana}  金香蕉：${res.info.goldBanana} ||  `
    result += info
    console.log(info)
  });
};

var NewDanmu = async function () {
  return await get({
    url: `/new-danmaku/add`,
    para:
      "mode=1&color=16777215&size=25&body=%E5%A5%BD%E8%80%B6&videoId=21772556&position=0&type=douga&id=26084622&subChannelId=60&subChannelName=%E5%A8%B1%E4%B9%90&roleId=",
  }).then((res) => {
    //console.log(res)
    if (res.result == 0) {
      signdata = "发送弹幕成功！ ||  ";
    } else {
      signdata = "发送弹幕失败！||  ";
      console.log(res);
    }
    console.log(signdata);
    result += signdata;
    return res;
  });
};
//分享任务
function share() {
  return new Promise(async (resolve) => {
    try {
         let res = await $http.get("https://api-ipv6.app.acfun.cn/rest/app/task/reportTaskAction?taskType=1&market=tencent&product=ACFUN_APP&sys_version=8.0.0&app_version=6.42.0.1119&ftt=K-F-T&boardPlatform=hi3650&sys_name=android&socName=%3A%20HiSilicon%20Kirin%20950&ks_ipv6_cellular=2408%3A8470%3A8a03%3A526d%3A8017%3Acdeb%3A414%3Acbec&appMode=0",
        {
          headers
        }
      );
      if (res.data.result == 0) {
        console.log("分享成功");
        result+="分享成功！  "
      } else {
        console.log(res.data);
      }
    } catch (err) {
      console.log(err.response.data);
      console.log("分享接口请求出错");
      result += "分享接口请求出错！  ";
    }
    resolve();
  });
}

function getoken() {
  return new Promise(async (resolve) => {
    try {
      let res = await $http.post(
        "https://id.app.acfun.cn/rest/web/token/get",
        "sid=acfun.midground.api",
        {
          headers,
        }
      );
      if (res.data.result == 0 && res.data["acfun.midground.api_st"]) {
        st = res.data["acfun.midground.api_st"];
        signdata = "获取token成功\n";
        console.log(signdata);
        await interact("delete"); //取消点赞
        await interact("add"); //重新点赞
      } else {
        signdata = "获取token失败\n";
        console.log(res.data);
      }
     // result += signdata;
    } catch (err) {
      console.log(err.response.data);
      result += "token获取出错！ ||  ";
    }
    resolve();
  });
}
//点赞
function interact(option) {
  return new Promise(async (resolve) => {
    try {
      let data = `kpn=ACFUN_APP&kpf=PC_WEB&subBiz=mainApp&interactType=1&objectType=2&objectId=26030726&acfun.midground.api_st=${
        st || 0
      }&userId=${authkey}&extParams%5BisPlaying%5D=false&extParams%5BshowCount%5D=1&extParams%5BotherBtnClickedCount%5D=10&extParams%5BplayBtnClickedCount%5D=0`;
      let res = await $http.post(
        `https://kuaishouzt.com/rest/zt/interact/${option}`,
        data,
        {
          headers,
        }
      );
      if (res.data.result == 1) {
        console.log("点赞成功");
      } else {
        console.log(res.data);
      }
    } catch (err) {
      console.log(err.response.data);
      console.log("点赞接口请求出错");
      result += "点赞接口请求出错！ ||  ";
    }
    resolve();
  });
}
//直播间扭蛋 还没测试 做任务前观看30s直播 等能开第一个了就用脚本跑 就可以全部领取了
function timeBox(id) {
  return new Promise(async (resolve) => {
    try {
      headers["url_page"] = "LIVE_DETAIL";
      let res = await $http.post(
        `https://api-ipv6.acfunchina.com/rest/app/live/timeBox/draw?userId=${authkey}&boxId=${id}&market=tencent&product=ACFUN_APP&sys_version=8.0.0&app_version=6.40.2.1108&boardPlatform=hi3650&sys_name=android&socName=%3A%20HiSilicon%20Kirin%20950&appMode=0`,
        "",
        { headers }
      );
      //   console.log(res.data)
      if (res.data.result == 0) {
        signdata = `扭蛋${id}开启成功 ,获得${
          res.data.timeBoxList[id - 1].bananaCount
        }🍌 || `;
        console.log(signdata);
      } else {
        signdata = `扭蛋${id}开启失败：${res.data.error_msg} ||  `;
        console.log(signdata);
      }
    //  result += signdata;
    } catch (err) {
      console.log(err.response.data);
      console.log("扭蛋接口请求出错");
   //   result += "扭蛋接口请求出错！|| ";
    }
    resolve();
  });
}

function acfun(account, password) {
  return new Promise(async (resolve) => {
    try {
      console.log("Acfun每日任务开始...");
      const account = config.acfun.phone;
      const password = config.acfun.password;
      let res = await $http.post(
        "https://id.app.acfun.cn/rest/app/login/signin",
        `username=${account}&password=${password}`,
        {
          headers,
        }
      );
      if (res.data.result == 0 && res.data.acPassToken) {
        signdata = `${res.data.username}登陆成功👏 ||  `;
        console.log(signdata);
        authkey = res.data.auth_key;
        headers["access_token"] = res.data.token;
        headers[
          "cookie"
        ] = `auth_key=${res.data.auth_key};acPasstoken=${res.data.acPassToken};`;
        await signIn();
        await ThrowBanana(Math.round(Math.random() * 10000) + 14431808);
        await NewDanmu();
        await getoken();
        await share()
        console.log("开始扭蛋领取 请先手动观看30s+直播\n");
        for (id of [1, 2, 3, 4, 5, 6]) {
          await timeBox(id);
        }
        await getinfo()
      } else {
        signdata = `登陆失败 ${res.data.error_msg}😅！！`;
      }
      console.log(signdata);
      result += signdata;
    } catch (err) {
      console.log(err.response.data);
      result += "登陆失败😅！！";
      console.log("登陆失败");
    }
    resolve(result);
  });
}

//acfun()

module.exports = acfun;
