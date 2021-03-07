const sckey = "";
const qmsgkey = "";
const cpkey = "";
const $http = require("axios");

async function sendmsg(text) {
    console.log(text)
  await server(text);
  await qmsg(text);
  await cp(text);
}

function qmsg(msg) {
  return new Promise(async (resolve) => {
    try {
      if (qmsgkey) {
        let url = `https://qmsg.zendee.cn/send/${qmsgkey}?msg=${encodeURI(
          msg
        )}`;
        let res = await $http.get(url);
        if (res.data.code == 0) {
          console.log("Qmsg酱：发送成功");
        } else {
          console.log("Qmsg酱：发送失败!" + res.data.reason);
        }
      } else {
        console.log("Qmsg酱：你还没有填写qmsg酱推送key呢，推送个鸡腿");
      }
    } catch (err) {
      console.log("Qmsg酱：发送接口调用失败");
      console.log(err);
    }
    resolve();
  });
}
function server(a) {
  return new Promise(async (resolve) => {
    try {
      if (sckey) {
        url = `https://sc.ftqq.com/${sckey}.send`;
        res = await $http.post(url, `text=签到盒-每日任务已完成&desp=${a}`);
        if (res.data.errmsg == "success") {
          console.log("server酱:发送成功");
        } else {
          console.log("server酱:发送失败");
        }
      } else {
        console.log("server酱:你还没有填写qmsg酱推送key呢，推送个鸡腿");
      }
    } catch (err) {
      console.log("server酱:发送接口调用失败");
      console.log(err);
    }
    resolve();
  });
}
function cp(msg) {
  return new Promise(async (resolve) => {
    try {
      if (qmsgkey) {
        let url = `https://push.xuthus.cc/send/${cpkey}?c=${encodeURI(msg)}`;
        let res = await $http.get(url);
        if (res.data.code == 200) {
          console.log("酷推：发送成功");
        } else {
          console.log(res.data);
          console.log("酷推：发送失败!" + res.data.reason);
        }
      } else {
        console.log("酷推：你还没有填写酷推推送key呢，推送个鸡腿");
      }
    } catch (err) {
      console.log("酷推：发送接口调用失败");
      console.log(err);
    }
    resolve();
  });
}
module.exports=sendmsg