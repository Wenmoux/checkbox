let header = {
  headers: {
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    cookie: config.maoer.cookie,
    referer: "https://fm.missevan.com/live/160481424",
    "user-agent":
      "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.111 Mobile Safari/537.36",
  },
};
tw = 0;
k = 0;
point = 0;
let soundid = [2006321, 1891240, 1891238, 1850399, 1850337];
const $http = require("axios");
function check() {
  return new Promise(async (resolve) => {
    try {
      ress = await $http.get(
        "https://www.missevan.com/account/userinfo",
        header
      );
      if (ress.data.success) {
        let data = ress.data.info;
        point = data.point;
        console.log(`${data.username}   当前小鱼干：${data.point}`);
        await task(`https://www.missevan.com/member/gettask?ttype=1&userid=`);
        await task("https://www.missevan.com/member/getcatears?gtype=1");
        await task("https://www.missevan.com/member/getcatears?gtype=4");
        await task(
          `https://www.missevan.com/member/getfeedtask?ttype=1&userid=&_=`
        );
        await task("https://www.missevan.com/member/getcatears?gtype=2");
      } else {
        console.log("cookie失效");
        point=0
      }
    } catch (err) {
      console.log(err);
      point =0
    }
    resolve(point);
  });
}

function task(url) {
  return new Promise(async (resolve) => {
    try {
      let res = await $http.get(url, header);
      message = res.data.success;
      //  console.log(res.data)
      if (res.data.success && res.data.info && res.data.info.message) {
        message = res.data.info.message;

        //   console.log( || res.data.info.message)
      } else if (res.data.error || !res.data.success) {
        message = res.data.error ? res.data.error : res.data.info;
      }
      console.log(message);
      if (JSON.stringify(res.data).match(/必须发布/)) {
        await addcomment();
        await task(url);
      } else if (JSON.stringify(res.data).match(/必须投食/)) {
        await ts();
        await task(url);
      }
    } catch (err) {
      console.log(err);
      console.log("接口请求出错");
    }
    resolve();
  });
}

function addcomment() {
  return new Promise(async (resolve) => {
    try {
      for (i = 0; i < 3; ) {
        let msg = await $http.get("https://chp.shadiao.app/api.php");
        let data = `type=1&eId=2154758&comment=${encodeURI(msg.data)}`;
        let ress = await $http.post(
          "https://www.missevan.com/site/addcomment",
          data,
          header
        );

        if (ress.data.success) {
          console.log(`评论第${++i}次成功：${msg.data}`);
        } else {
          console.log(`评论失败`);
          console.log(ress.data);
          break;
        }
      }
    } catch (err) {
      //  console.log(err)
      console.log("接口请求出错");
    }
    resolve();
  });
}

function ts() {
  return new Promise(async (resolve) => {
    try {
      while (tw < 4) {
        let data1 = `sound_id=${soundid[k++]}`;

        let res = await $http.post(
          "https://www.missevan.com/sound/ts",
          data1,
          header
        );

        if (res.data.success) {
          console.log(`投喂第${++tw}次成功`);
        } else if (res.data.error == "五分钟只能投一次小鱼干囧") {
          console.log(res.data.error);
        } else {
          console.log(`投喂失败`);
          console.log(res.data);
          break;
        }
      }
    } catch (err) {
      console.log(err);
      console.log("接口请求出错");
    }
    resolve();
  });
}

async function missevan() {
  let point1 = await check();
  let point2 = await check();
  console.log(`今日共获得${point2 - point1}小鱼干`);
  return `猫耳FM：\n今日共获得${point2 - point1}小鱼干`;
}

module.exports = missevan;

//missevan()
