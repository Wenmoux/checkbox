/*
打码账号密码必须填写 注册地址https://account.jsdati.com/
题库https://github.com/Hanyang-Li/BotFarmer-1point3acres/blob/master/bot-farmer-local/cheat_sheet.json 答题不知道会不会出现多选阿 https://github.com/Hanyang-Li/BotFarmer-1point3acres/blob/master/bot-farmer-local/cheat_sheet.json暂时没遇到 不管了
建议每天定时跑两三次 以免出错emmm
有问题再说
2021-03-12
@wenmoux
*/


const axios = require("axios");
const headers = {
  cookie: "",
  origin: "https://www.1point3acres.com",
  referer: "https://www.1point3acres.com/bbs",
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Safari/537.36",
};
const signurl =
  "https://www.1point3acres.com/bbs/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0";
const datiurl =
  "https://www.1point3acres.com/bbs/plugin.php?id=ahome_dayquestion:pop";
base64img = "";
typeid = 1001; //打码识别类型
answer = null;
username = config.ym3fd.username
password = config.ym3fd.password
lzusername = config.ym3fd.lzusername //联众账号
lzpassword = config.ym3fd.lzpassword //联众密码
softwareId = 22870; //打码 软件id 
softwareSecret = "Ykt5eVBtSaeHhivCyxUURCWMTniJmTgGmKYDxlC7";//不用管 打码 软件密钥
let result = "一亩三分地：\n";
const tiku = {
  下面哪个州在美国西海岸: ["Washington"],
  "公司之间级别对应，如下哪个是错误的？": ["Facebook L6 = Facebook E6"],
  "下面哪部作品是喜剧？": ["仲夏夜之梦"],
  "地里发帖可以隐藏内容。假如要设置200积分以上才可以看到，下面哪个语法正确？": [
    "[hide=200]想要隐藏的内容[/hide]",
  ],
  在Linkedin上求内推如何作死: ["这些都会作死"],
  "哪种选校策略最合理？": [
    "根据自己下一步职业和学业目标，参考地里数据和成功率，认真斟酌",
  ],
  "Which company is the largest single-site employer in the US?": [
    "Disney World",
  ],
  "音乐家贝多芬出生于哪国？": ["德国"],
  "下面哪种方法，可以妥妥拿到积分？": ["这些全都可以"],
  "下面哪种行为，在地里会被扣光积分，甚至封号？": ["这些全都会"],
  "下面哪个学术会议不是机器学习领域的？": ["ICSE"],
  "论坛鼓励如何发面经？": ["以上都正确"],
  "下面哪个城市不是典型的温带海洋性气候？": ["波士顿"],
  "美国哪个州具有地中海气候？": ["加利福尼亚"],
  "下面哪所纽约高校的主校区坐落于中央公园附近？": ["Columbia University"],
  "Miami University在哪个城市": ["Oxford, Ohio"],
  "以下哪个说法正确？": ["一篇一作指的是有一篇第一作者的文章"],
  "下面哪所大学所在城市不是波士顿？": ["Boston College", "MIT"],
  "Negotiate 工资的时候，哪种做法有利于得到更大的包裹？": [
    "精读地里谈工资宝典，知己知彼，百战不殆",
  ],
  "美国哪个州没有夏令时？": ["亚利桑那州"],
  "Apollo 11是哪一年登月的？": ["1969"],
  "地里数据科学类职位面经放在在什么版最合理？": ["数科面经版"],
  "下面哪个公司的主要收入不是来自广告？": ["Apple"],
  "下面哪个大学在华盛顿州？": ["University of Washington"],
  "一亩三分地鼓励如何发面经？": ["以上都正确"],
  "下面哪类版块，可以拉群，而且不会被警告扣分？": [
    "学友工友、找室友或者版聚本地",
  ],
  "下面哪个专业，不是STEM，OPT没法延期？": ["教育学"],
  "一亩三分地是哪年创立的？": ["2009"],
  "休斯敦在美国以什么工业出名?": ["宇航"],
  "以下哪种不是Modes of dataflow?": ["tcp/ip"],
  "以下哪一位名人不是英国人？": ["Louis Pasteur(他发现了巴斯德高温消毒法)"],
  "下面哪个城市没有SUNY（纽约州立大学）校区？": ["Fulton"],
  "下面哪个州不属于西海岸三州？": ["内华达"],
  "以下哪个美国城市不靠海？": ["亚特兰大"],
  "求内推如何作死？": ["这些都会作死"],
  "关于旧金山市中心描述，下面哪个不正确？": [
    "旧金山创业公司很多，被称为“硅谷”",
  ],
  "以下哪所学校是美国第一所研究型大学？": ["约翰霍普金斯大学"],
  "下面哪个州里有Disney World？": ["Florida"],
  "下面哪个州冬天最暖和？": ["Oklahoma"],
  "一亩三分地发帖可以用hide语法隐藏内容。下面哪个写法正确？": [
    "柯南的名字是[hide=200]工藤新一[/hide]",
  ],
  "下列哪一项首府与州的对应关系是正确的？": ["俄克拉何马州 - 俄克拉何马城"],
  "以下哪所学校不位于南部？": ["凯斯西储大学"],
  "以下有哪一个包是pytorch下的？（就是torch.xx）": ["cuda"],
  "地里面经数目最多的是哪家公司？": ["Amazon"],
  "下面哪个公司的streaming service不是会员subscription付费模式运营的？": [
    "Tubi",
  ],
  "下面哪个童话故事不是安徒生写的？": ["尼尔斯骑鹅旅行记"],
  "下面哪个情况，不会消耗你的积分？": ["看到干货帖子和精华回复，给作者加分！"],
  "下面哪个Ivy League，离东海岸最远？": ["Cornell"],
  "想找室友或者当房东，帖子发在哪里？": ["租房广告|找室友版"],
  "下面哪个公司总部不在湾区？": ["snapchat"],
  "下面哪个作家是英国人？": ["Charles Dickens"],
  "下面哪个公司总部在圣地亚哥？": ["Qualcomm"],
  "回答别人的私信提问还需要消耗我5大米怎么办？": [
    "直接在版面回答，这样大家都能看见",
  ],
  "下面哪个州，没有income tax?": ["Nevada"],
  "下面几个州，哪个离美国首都最远？": ["North Carolina"],
  "以下哪个神经网络不能处理语音数据？": ["以上都可以"],
  "下面哪个州，对公司友好，所以吸引了美国很多公司注册？": ["特拉华"],
  "以下哪个不是Linux操作系统？": ["Vue"],
  "下面哪个大学实际上不存在？": ["University of Michigan, Twin City"],
  "给论坛ios或者安卓手机应用留评价如何获取50大米？": ["以上步骤都需要"],
  "下面哪种情况，管理员会按照你的要求，进行删帖？": ["这些情况全都不删帖！"],
  "下面哪个说法错误？": [
    "中国驻纽约领事馆位于法拉盛中国城，周围全是好吃的！",
    "芝加哥是美国著名的雨城",
  ],
  "下面哪个州，没有state income tax?": ["Florida", "Alaska", "New Hampshire"],
  "下面哪个州，有state income tax on wages": ["North Dakota", "Mississippi"],
  "一亩三分地是谁创立的？": ["Warald"],
  "下面哪家公司的总部不在西雅图?": ["波音"],
  "下面哪个machine learning的模型不是supervised learning？": ["Clustering"],
  "which state is University of Miami located?": ["Florida"],
  "在论坛发slack群，qq群，微信群，任何站外讨论方式，会如何？": ["以上都正确"],
  "下面加州哪个地点离墨西哥最近？": ["圣迭戈"],
  "加州大学有多个分校，下面哪个成立时间最短？": ["UC Merced"],
};


function login() {
  return new Promise(async (resolve) => {
    try {
      let res = await axios.get(
        `https://www.1point3acres.com/bbs/member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes&inajax=1&username=${username}&password=${password}&quickforward=yes&handlekey=ls`
      );
      CKS = "";
      for (i = 0; i < res.headers["set-cookie"].length; i++) {
        CKS += res.headers["set-cookie"][i].split(";")[0] + ";";
      }
      let res2 = await axios.get(
        `https://www.1point3acres.com/bbs/home.php?mod=spacecp&ac=profile&op=password`,
        { responseType: "arraybuffer", headers: { cookie: CKS } }
      );
      for (i = 0; i < res.headers["set-cookie"].length; i++) {
        headers.cookie += res.headers["set-cookie"][i].split(";")[0] + ";";
      }
      let data = require("iconv-lite").decode(res2.data, " gbk");
  //  console.log(data)
        if (!data.match(/您需要先登录才能继续本操作/)) {
        let name = data.match(/访问我的空间\">(.+?)<\//)[1];
        msg = name + "   登陆成功\n";
        result += msg;
        console.log(msg);
       await getcode();
       await getquestion();
      } else {
        console.log("登陆出错 账号或密码错误或者有设置问题?");
        result += "登陆出错 账号或密码错误或者有设置问题?";
      }
    } catch (err) {
      console.log(err);
      result += "登陆请求出错";
    }
    resolve(result);
  });
}
//获取题目
function getquestion() {
  return new Promise(async (resolve) => {
    try {
      let res = await axios.get(
        "https://www.1point3acres.com/bbs/plugin.php?id=ahome_dayquestion:pop&infloat=yes&handlekey=pop&inajax=1&ajaxtarget=fwin_content_pop",
        { headers, responseType: "arraybuffer" }
      );
      let data = require("iconv-lite").decode(res.data, " gbk");
      data = data.replace(/&nbsp;/g, " ");
      answer = "";
   //   console.log(data)
      if (data.match(/您今天已经参加过答题，明天再来吧！/)) {
        console.log("您今天已经参加过答题，明天再来吧！");
        result +="您今天已经参加过答题，明天再来吧！"
      } else if (data.match(/您的积分不足以/)) {
        console.log("您的积分不足以支付错题惩罚！");
      } else if (data.match(/【题目】/)) {
        console.log("开始答题...");
        formhash = data.match(/name=\"formhash\" value=\"(.+?)\">/)[1];
        console.log(formhash);
        let question = data.match(/<b>【题目】<\/b> (.+)<\/font>/)[1];
        result += question + "\n";
        answers = data.match(/name=\"answer\" value=.+?<\/div>/g);
        console.log(answers)
        question=question.trim()
        if (tiku[question]) {
          for (answer1 of tiku[question]) {
            for (ianswer of answers) {
              if (ianswer.match(answer1)) {
              console.log(ianswer)
                console.log("匹配到答案 %s", answer1);
                answer += ianswer.match(/value=\"(\d+)\"/)[1];
                result += "答案："+ianswer + "\n";
              }
            }
          }
        }
        if (answer) {
          verifycode = await getimgcode("SA00");
          await dati("SA00", verifycode, formhash, answer);
        }else{        
        result +="未匹配到答案"
        }
      } else {
        console.log("cookie失效");
        result +="cookie失效"
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
    resolve();
  });
}

//验证码 SA00答题 S00签到
function getimgcode(idhash) {
  return new Promise(async (resolve) => {
    try {
      let res = await axios.get(
        `https://www.1point3acres.com/bbs/misc.php?mod=seccode&action=update&idhash=SA00&inajax=1&ajaxtarget=seccode_${idhash}`,
        { headers }
      );
      let update = res.data.match(/update=(\d+)&idhash=(.+?)\"/);
      console.log(update[0]);
      if (update) {
        let b64img = await getb64(update[1], update[2]);
        verifycode = await upload(lzusername, lzpassword, b64img, typeid);
        let rres = await axios.get(
          `https://www.1point3acres.com/bbs/misc.php?mod=seccode&action=check&inajax=1&&idhash=SA00&secverify=${verifycode}`,
          { headers }
        );
        console.log(rres.data);
        if (rres.data.match(/succeed/)) {
          msg = "验证码正确: ";
        } else {
          msg = "打码失败: ";
          //await getimgcode(idhash)
        }
        console.log(msg)
        result += msg + verifycode+"\n";
        resolve(verifycode);
      }
    } catch (err) {
      console.log(err);
      resolve("1234");
    }
  });
}

function dati(idhash, verifycode, formhash,answer) {
  return new Promise(async (resolve) => {
    try {
    var data=`formhash=${formhash}&answer=${answer}&sechash=${idhash}&seccodeverify=${verifycode}&submit=true`
      let res = await axios.post(datiurl, data, {
        headers,
        responseType: "arraybuffer",
      });
      data1 = require("iconv-lite").decode(res.data, " gbk");

      if (data1.match(/回答正确/)) {
        msg ="恭喜你对啦!奖励1大米";
      } else if (data1.match(/验证码填写错误/)) {
        msg ="验证码错误,重新答题...";
      } else if (data1.match(/您今天已经参加过答题，明天再来吧！/)) {
        msg ="您今天已经参加过答题，明天再来吧！...";
      } else if (data1.match(/回答错误/)) {
        msg ="答案错啦...扣除1大米";
      } else {
        console.log(data1);
        msg ="答题出错"
      }
      result+=msg
     
    } catch (err) {
      console.log(err);
    }
    resolve();
  });
}
//签到
function getcode() {
  return new Promise(async (resolve) => {
    try {
      let res = await axios.get(
        "https://www.1point3acres.com/bbs/dsu_paulsign-sign.html",
        { headers, responseType: "arraybuffer" }
      );
      let data = require("iconv-lite").decode(res.data, " gbk");
      if (data.match(/今天签到了吗/)) {
        let formhash = data.match(/formhash=(.+?)\">退出<\/a>/)[1];
        console.log(formhash);
        let res = await axios.get(
          `https://www.1point3acres.com/bbs/misc.php?mod=seccode&action=update&idhash=S00&inajax=1&ajaxtarget=seccode_S00`,
          { headers }
        );
        
        let update = res.data.match(/update=(\d+)&idhash=(.+?)\"/);
        console.log(update[0]);
        console.log(
          "签到 : update  %d idhash %s 获取成功",
          update[1],
          update[2]
        );
        let b64img = await getb64(update[1], update[2]);
        console.log("签到 : 开始打码");
        let verifycode = await upload(lzusername, lzpassword, b64img, typeid);
        await sign(update[2], verifycode, formhash);
      } else if (data.match(/您今天已经签到过了或者签到时间还未开始/)) {
        console.log("您今天已经签到过了或者签到时间还未开始,请稍后再来");
        result += "您今天已经签到过了或者签到时间还未开始,请稍后再来\n";
      } else {
    //  console.log(data)
        console.log("cookie失效");
        result += "cookie失效";
      }
    } catch (err) {
      console.log(err);
      result += "签到请求出错";
    }
    resolve();
  });
}

function getb64(update, idhash) {
  return new Promise(async (resolve) => {
    try {
      let res = await axios.get(
        `https://www.1point3acres.com/bbs/misc.php?mod=seccode&update=${update}&idhash=${idhash}`,
        { responseType: "arraybuffer", headers: headers }
      );
      for (i = 0; i < res.headers["set-cookie"].length; i++) {
        headers.cookie += res.headers["set-cookie"][i].split(";")[0] + ";";
      }
      base64img = res.data.toString("base64");
    } catch (err) {
      console.log(err);
      base64img=""
    }
    resolve(base64img);
  });
}

function sign(idhash, verifycode, formhash) {
  return new Promise(async (resolve) => {
    try {
      let data = `formhash=${formhash}&qdxq=kx&qdmode=2&todaysay=&fastreply=0&sechash=${idhash}&seccodeverify=${verifycode}`;
      let res = await axios.post(signurl, data, {
        headers,
        responseType: "arraybuffer",
      });
      let data1 = require("iconv-lite").decode(res.data, " gbk");
      if (data1.match(/微信验证/)) {
        msg = "请做微信验证（网站右上角）后参与每日答题";
      } else if (data1.match(/验证码填写错误/)) {
        msg = "验证码错误,重新签到...";
      } else if (data1.match(/恭喜你签到成功!/)) {
        msg = data1.match(/恭喜你签到成功!获得随机奖励 大米 \d+ 颗/);
        console.log("恭喜你签到成功!获得随机奖励 大米 1 颗 ...");
      } else {
        msg = "签到失败 原因未知";
        console.log(data1);
      }
      console.log(msg);
      result += msg;
    } catch (err) {
      console.log(err);
      result += "签到请求出错";
    }
    resolve();
  });
}
async function upload(_username, _password, imgdata, _captchaType) {
  var _captchaData = imgdata;
  var jsonData = {
    softwareId: softwareId,
    softwareSecret: softwareSecret,
    username: _username,
    password: _password,
    captchaData: _captchaData,
    captchaType: _captchaType,
    captchaMinLength: 0,
    captchaMaxLength: 0,
    workerTipsId: 0,
  };
  let response = await axios.post(
    "https://v2-api.jsdama.com:443/upload",
    jsonData
  );
  if (response.data.code == 0) {
    console.log("识别结果：" + response.data.data.recognition);
    console.log("识别ID：" + response.data.data.captchaId);
    code = response.data.data.recognition;
  } else {
    console.log(response.data.message);
    result += "打码：" + response.data.message;
    code ="2333"
  }
  return code;
}


module.exports=login