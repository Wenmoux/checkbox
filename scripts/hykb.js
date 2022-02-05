//好游快爆爆米花任务,可兑换激活码、实物周边等
//我的邀请码 sdvf180uscf3
result = "【好游快爆】：";
const $http = axios = require("axios");
const hyck = config.hykb.scookie;
const qq =  config.hykb.qq?config.hykb.qq:null
//照料id 我没加好友所以随机取得 第一个是我,不建议改ヽ(*´з｀*)ﾉ
//   const moment=require("moment")
var uid = ""
//照料id 我没加好友所以随机取得 第一个是我,不建议改ヽ(*´з｀*)ﾉ
buid = [21039293,48653684,44191145,54216701,54184381,38442812,34977383,54099572,54060137,18344113,53950826,53334988,49100316,24158995,53043395,53746196,7495782,53752398,13268805,53540861,53169378,53481728,53480955,53236037,5015419,17998323,142234,53043027,53022651,52883552,52919017,52883915,2987459,52863870]
scookie = hyck.match(/\|/)?encodeURIComponent(hyck):hyck
function get(a, b) {
  return new Promise(async (resolve) => {
    try {
      let res = await axios.post(
        `https://huodong3.3839.com/n/hykb/${a}/ajax.php`,
        `ac=${b}&r=0.${Math.round(Math.random() * 8999999999999999) + 1000000000000000}&scookie=${scookie}`,
        {
          headers: {
            "User-Agent":
              config.UA?config.UA:"Mozilla/5.0 (Linux; Android 8.0.0; FRD-AL10 Build/HUAWEIFRD-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM/3.0.0.2860 QQ/6.5.5  NetType/WIFI WebP/0.3.0 Pixel/1080",
          },
        }
      );

      if (JSON.stringify(res.data).match(/玉米成熟度已经达到100/)) {
        await get("grow", "PlantRipe"); //收获
        await get("grow", "PlantSow"); //播种
        await get(a, b); //播种        
      }
      if (JSON.stringify(res.data).match(/还没有播种玉米/)) {
          let bzs = await get("grow", "PlantSow"); //播种
          if (bzs.seed && bzs.seed == 0) {
            //    console.log("莫得种子了")
            await get("grow", "GouMai&resure=1&gmmode=seed&tmpNum=10"); //购买种子*10
            await get("grow", "PlantSow"); //播种
          }
          await get(a, b);
        }

        back = res.data;      
      console.log(back);
    } catch (err) {
      console.log(err);
    }
    resolve(back);
  });
}

function getid() {
  return new Promise(async (resolve) => {
    try {
      let res = await axios.get(
        "https://huodong3.3839.com/n/hykb/gs/index.php"
      );
      //预约游戏id
      str = res.data.match(/HdmodelUser\.Ling\((.+?)\)/g);
      let res2 = await axios.get(
        "https://huodong3.3839.com/n/hykb/grow/daily.php"
      );
      //任务id
      str2 = res2.data.match(
        /ACT\.Daily[a-z,A-Z]+(Share||Ling||JiaoHu){1,}\(\d+\)/g
      );
      id = str.concat(str2);
    } catch (err) {
      console.log(err);
    }
    resolve();
  });
}
async function task() {
  let logindata = await get("grow", "Dailylogin&id=174");
  if (logindata.key == "ok" ) {
   exdata = await get("kbexam","login")
   if(exdata.config.lyks==1){
  var mres = await axios.get(
    "https://cdn.jsdelivr.net/gh/Wenmoux/sources/other/miling.json"
  );
  await get("friend", `Secretorder&miling=${mres.data.miling}`); //密令
  await get("wxsph", `send_egg&egg_data=${mres.data.egg}`); //视频彩蛋
  await get("grow", "GuanZhu&singleUid=21039293"); //关注我
  await get("signhelp", "useCode&code=21039293"); //邀请码
  await get("friend", "LingXinrenFuli");
  await get("grow", "shareEwai");
  //  await get("friend","EnterInviteCode&invitecode=sdvf180uscf3","") //填邀请码
  await getid(); //获取任务id
  await get("grow", "Watering&id=6"); //浇灌
  let canzl = true
  let mode =0
//  let uids = await axios.get("http://1oner.cn:1919/hykb/all?res=uid")
//  if(uids && uids.data && uids.data.message) buid = uids.data.message
  for (i of buid) { 
  if(mode!=2){
   if(canzl) {          
  let zlres= await get("grow", `gamehander&buid=${i}&icon_id=58`); //照料
  mode = zlres.mode
  if(zlres.sy_day_shijian_corn_max_num ==0) canzl=false
}
    if (i != 21039293) {      
    let stealres = await get("grow",  `gamehander&buid=${i}&icon_id=888888`,true); //偷玉米
      console.log(`偷 ${i}玉米 ${stealres.msg}`)  
    }
  }}
//  if(mode!=2)  await axios.post("http://1oner.cn:1919/hykb/add", `uid=${logindata.uid}&nickname=${encodeURI(logindata.name)}`)
  for (i of id) {
    i = i.match(/\.(.+)\((\d+)\)/);
    switch (i[1]) {
      case "Ling":
        await get("gs", `recordshare&gameid=${i[2]}`); //分享
        await get("gs", `ling&gameid=${i[2]}`); //领取
        break;
      case "DailyShare":
        await get("grow", `DailyShare&id=${i[2]}`); //发起分享
        await get("grow", `DailyShareCallb&id=${i[2]}`); //返回
        await get("grow", `DailyShare&id=${i[2]}`); //领取
        break;
      case "DailyGameLing":
        await get("grow", `DailyGamePlay&id=${i[2]}`); //打开试玩
        await get("grow", `DailyGameLing&id=${i[2]}`); //试玩领取
        break;
      case "DailyYuyueLing":
        await get("grow", `DailyYuyueLing&id=${i[2]}`); //预约领取
        break;
      case "DailyDouyinLing":
        await get("grow", "DailyDouyinCheck", i[2]);
        await get("grow", "DailyDouyinPlay", i[2]); //打开抖音
        await get("grow", "DailyDouyinLing", i[2]); //领取
        break;
      case "DailyVideoLing":
        await get("grow", `DailyVideoGuanzhu&id=${i[2]}`);
        await get("grow", `DailyVideoShare&id=${i[2]}`);
        await get("wxsph", "share&mode=qq"); //DailyVideoShare
        await get("grow", `DailyVideoLing&id=${i[2]}`);
      case "DailyJiaoHu":
        await get("grow", `DailyJiaoHu&id=${i[2]}`); //分享任务
        break;
      case "DailyDati":
        let ress = await get("grow", "DailyDati&id=4"); //获取题目
        if (ress.option1 && ress.expand) {
          i = 1;
          kw = 1;
          let yxid = ress.expand.split("##")[1] || "16876"; //获取游戏id
          let urll = `https://api.3839app.com/cdn/android/gameintro-home-1546-id-${yxid}-packag--level-2.htm`;
          let resss = await axios.get(urll);
          if (resss.data.result) {
            let strr = JSON.stringify(resss.data.result.data.downinfo.appinfo)
              .replace(/&nbsp;/g, "")
              .replace(/ /g, ""); //查答案
            reg = /错误|不属于|不是|不存在|没有|不需要|不能|不可以/;
            if (reg.test(ress.title)) {
              console.log("错误类型");
              for (i; i < 5; i++) {
                let strrr = ress["option" + i].replace(/ /g, "");
                if (!strr.match(strrr)) {
                  kw = i;
                  //        await get("grow", `DailyDatiAnswer&option=${ress["option" + i]}`, 4)
                }
              }
            } else {
              //    console.log("正确类型")
              for (i; i < 5; i++) {
                let strrr = ress["option" + i].replace(/ /g, "");
                if (strr.match(strrr)) {
                  kw = i;
                  //   await get("grow", `DailyDatiAnswer&option=${ress["option" + kw]}`, 4)
                }
              }
            }
            //瞎鸡儿答 非游戏类问题/找不到答案
            //算了不瞎鸡儿答了 自行去app里答吧
          }
          console.log("正确答案");
          console.log(ress["option" + kw]);
          await get("grow", `DailyDatiAnswer&option=${ress["option" + kw]}&id=4`);
        } else {
          console.log("劳资找不到答案,请自行去app里答题");
        }
        break;
      case "DailyFriendLing":
        await get("grow", `DailyFriendLing&id=${i[2]}`); //照料5次
        break;
      case "DailyInviteLing":
       /* let invite = await get("grow", `DailyInviteJump&id=${i[2]}`);
        let uid = invite.invite_url.match(/u=(.+?)&/);
        await get("grow", `DailyInvite&u=${uid ? uid[1] : ""}&rwid=10`); //邀请下载
        */
        await get("grow", `DailyInviteLing&id=${i[2]}`);
        break;
        
    }
  }    
  let tasl1data = await axios.get(
    "https://cdn.jsdelivr.net/gh/Wenmoux/sources/other/activities.js"
  );
  eval(tasl1data.data);
  await task1();   
  let csdata = await get("grow", `Dailylogin&id=174`); //查询  
  if (csdata.key == "ok" && csdata.config ) {
  csinfo = csdata.config
  exinfo = exdata.config
  result +=`昵称：${csinfo.name} \n种子：${csinfo.seed}爆米花：${csinfo.baomihua}  \n成熟度：${csinfo.chengshoudu}  \n荣誉等级：${exinfo.tag_title}\n`
    if (csinfo.chengshoudu == 100) {
      await get("grow", "PlantRipe"); //收获
      await get("grow", "PlantSow"); //播种
    }
  } else {
    result += csdata.key;
  }  
  }else{
  result += "请先进行礼仪考试,再运行脚本"  
  }
  return result;
    } else {
    console.log(logindata);
    return "【好游快爆】: " + logindata.key;
  }
}

module.exports = task;
