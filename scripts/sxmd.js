let account = ""
let password = ""
const iconv = require("iconv-lite");
const axios= require("axios");
let ck = null;
let formhash = null;
let result = "书香门第签到：\n"
let header = {
  headers: {
    Host: "www.txtnovel.top",
    cookie: "66",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.83 Mobile Safari/537.36",
  },
};
function login() {
  return new Promise(async (resolve) => {
    try {
      let loginurl = "http://www.txtnovel.top/member.php?mod=logging&action=login&loginsubmit=yes&loginhash=&mobile=2"
      header = {
        headers: {
          "Host": "www.txtnovel.top",
          "cookie": "66",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.83 Mobile Safari/537.36"
        }
      }
      let data = `formhash=&referer=http%3A%2F%2Fwww.txtnovel.top%2Fforum.php%3Fmobile%3Dyes&fastloginfield=username&cookietime=2592000&username=${account}&password=${password}&questionid=0&answer=&submit=true`
      let res = await axios.post(loginurl, data, {
        header,
        responseType: 'arraybuffer'
      })
      let resdata = iconv.decode(res.data, 'gb2312')
      if (resdata.match(/欢迎您回来/)) {
        result += "登陆成功\n"
        console.log("登陆成功")
        ckk = res.headers["set-cookie"]
        ck = ""
        for (i = 0; i < ckk.length; i++) {
          ck += ckk[i].split("expires")[0]
        }
      } else {
        console.log("登陆失败")
        let message = resdata.match(/<div id=\"messagetext\">.*?<p>(.+?)<\/p>/s)
        result += message[1]
      }

    } catch (err) {
      console.log(err);
    }
    resolve();
  });
}

function getformhash() {
  return new Promise(async (resolve) => {
    try {
      let url = `http://www.txtnovel.top/plugin.php?id=dsu_paulsign:sign&mobile=yes`
      let res = await axios.get(url, header)
      formhash = res.data.match(/<input type=\"hidden\" name=\"formhash\" value=\"(.+?)\" \/>/s)[1]
    } catch (err) {
      console.log(err);
    }
    resolve();
  });
}
function sign() {
  return new Promise(async (resolve) => {
    try {
      let url = `http://www.txtnovel.top/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes`
      let data = `formhash=${formhash}&qdxq=kx`
      let res = await axios.post(url, data, header)
      let message = res.data.match(/<div id=\"messagetext\">.*?<p>(.+?)<\/p>/s)
      if (message) {
        result += message[1] + "\n"
      }
      else {
        result += "签到失败\n"
      }
    } catch (err) {
      console.log(err);
    }
    resolve();
  });
}

function info() {
  return new Promise(async (resolve) => {
    try {
      let url = `http://www.txtnovel.top/home.php?mod=space&`
      let res = await axios.get(url, header)
      let message = res.data.match(/<li><em>金币<\/em>(.+?) 枚<\/li>/)
      if (message) {
        result += "金币：" + message[1]
      }
    } catch (err) {
      console.log(err);
    }
    resolve();
  });
}
async function task() {
  await login()
  header.headers.cookie = ck
  if (ck) {
    await getformhash()
    await sign()
    await info()
    console.log(result)
  } else { }
//  return result


}

//task();
module.exports=task
