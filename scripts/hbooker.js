/*
 * @Author: Wenmoux
 * @Date: 2020-04-03
 * @LastEditTime: 2020-09-12
 * @Description: 刺猬猫每日任务(除了订阅章节) 需要填写 login_name和passwd 也就是手机号和密码
 * @Other：加解密还有写法都抄的 @zsakvo
 */

login_name = config.hbooker.login_name;
passwd = config.hbooker.passwd;
token = "";
username = "";
const CryptoJS = require("crypto-js");
const axios = require("axios");
const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000')
const decrypt = function (data, key) {
  key = CryptoJS.SHA256(key ? key : 'zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn')
  var decrypted = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.CBC,
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

//decrypt("6WafpH+G/+hDyIp4Xth47HuRUp3OWI/mxE8FJLj0OZGVAQDl9VcGF/amBrmvth9Hers7f8OE8b3zQTM+WN75DA==")
const mixin = {
  baseUrl: "https://app.hbooker.com", //url 前缀
  standardFlag: true,
  timeout: 15000,
  withCredentials: false, //跨域请求是否使用凭证
};
const para = {
  app_version: "2.3.922",
  device_token: "ciweimao_dora.js_zsakvo",
};

function get(options) {
  let params = Object.assign({}, para, options.para);
  return new Promise((resolve, reject) => {
    axios
      .get(mixin.baseUrl + options.url, {
        params: params,
      })
      .then((response) => {
        let data = decrypt(response.data.trim());
        var lastIndex = data.lastIndexOf("}");
        data = data.substr(0, lastIndex + 1);
        let json = JSON.parse(data);
        resolve(json);
      })
      .catch((err) => {
        resolve({
          tip: err,
        });
      });
  });
}

var login = async function () {
  return await get({
    url: `/signup/login`,
    para: {
      login_name: login_name,
      passwd: passwd,
      login_token: "",
      account: "",
    },
  }).then((res) => {
    //  console.log(res)
    return res;
  });
};
//b=login()
//console.log(b)
//书架两本
var shelfbook = async function (collect, id) {
  return await get({
    url: `/bookshelf/${collect}`,
    para: {
      login_token: token,
      account: username,
      shelf_id: "",
      book_id: id,
    },
  }).then((res) => {
    //  console.log(res)
    return res;
  });
};

//签到
var sign = async function () {
  return await get({
    url: `/reader/get_task_bonus_with_sign_recommend`,
    para: {
      task_type: 1,
      login_token: token,
      account: username,
    },
  }).then((res) => {
    //console.log(res);
    return res;
  });
};
//阅读章节
var record = async function (cid) {
  return await get({
    url: `/chapter/set_read_chapter_record`,
    para: {
      chapter_id: cid,
      login_token: token,
      account: username,
    },
  }).then((res) => {
    //  console.log(res)
    return res;
  });
};
var view = async function () {
  return await get({
    url: `/chapter/get_paragraph_tsukkomi_list_new`,
    para: {
      login_token: token,
      account: username,
      count: 1000,
      chapter_id: 105494781,
      paragraph_index: 5,
      page: 0,
    },
  }).then((res) => {
    //     console.log(res)
    return res;
  });
};
//阅读60min
var addr = async function () {
  return await get({
    url: `/reader/add_readbook`,
    para: {
      readTimes: 1200,
      getTime: `${getNowFormatDate()} 00:25:06`,
      book_id: 100166786,
      chapter_id: 105495180,
      login_token: token,
      account: username,
    },
  }).then((res) => {
    //console.log(res)
    return res;
  });
};
var gettask = async function () {
  return await get({
    url: `/task/get_all_task_list`,
    para: {
      login_token: token,
      account: username,
    },
  }).then((res) => {
    //  console.log(res)
    return res;
  });
};
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

async function hbooker() {
  let result = "【刺猬猫小说】：";
  a = await login();
  if (a.tip == "密码不正确" || a.tip == "此用户不存在" || a.tip == "缺少参数") {
    result += "账号或密码不正确";
  } else if (a.code == 100000 && a.data) {
    token = a.data.login_token;
    username = a.data.reader_info.account;
    console.log("%s 登陆成功", username);
    //签到
    await sign();
    //加入书架两本书 删加
    await shelfbook("delete_shelf_book", 100180114);
    await shelfbook("favor", 100180114);
    await shelfbook("delete_shelf_book", 100148386);
    await shelfbook("favor", 100148386);
    //阅读10章
    a = Math.ceil(Math.random() * 10000);
    for (i = a; i < a + 20; i++) {
      await record(i++);
    }
    //浏览20间贴
    await view();
    //阅读60min
    await addr();
    await addr();
    await addr();
    //阅读10章
    let res = await gettask();
    tasklist = res.data.daily_task_list;
    for (i in tasklist) {
      taskname = tasklist[i].name;
      status = tasklist[i].is_finished == 1 ? "已完成" : "未完成";
      result += `${taskname}：${status}  ||  `;
    }
  } else {
    result = "未知错误";
    console.log(a);
  }
  console.log(result);
  return result;
}
module.exports = hbooker;
