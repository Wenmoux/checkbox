waterresult = "";
const axios = require("axios");
//照料id 我没加好友所以随机取得 第一个是我,不建议改ヽ(*´з｀*)ﾉ
buid = [21039293, 12661364, 44191145, 44471412, 44440362,45562418,45236927,45045871,45507665,45263948,45249695,44042408,9169383,44761568,45466314];
let scookie = "这里填你的scookie"; //打开好游快爆app，任务页面，随便一个post包，查看post数据里的scookie
function get(a, b, c) {
  return new Promise(async (resolve) => {
    try {
      if (a == "grow") {
        if (b == "gamehander") {
          d = "buid";
        } else {
          d = "id";
        }
      } else {
        5;
        d = "gameid";
      }
      let res = await axios.post(
        `https://huodong3.3839.com/n/hykb/${a}/ajax.php`,
        `ac=${b}&${d}=${c}&icon_id=60&t=2020-07-23+0%3A54%3A56&r=0.1362954162068364&scookie=${scookie}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 8.0.0; FRD-AL10 Build/HUAWEIFRD-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM/3.0.0.2860 QQ/6.5.5  NetType/WIFI WebP/0.3.0 Pixel/1080",
          },
        }
      );
      if (b == "Watering") {
        if (res.data.key == "ok") {
          waterresult = `今日浇灌成功,获得${res.data.add_bmh}爆米花,连续浇灌${res.data.nowJiaoGuanDay}天,成熟度：${res.data.csd_num},爆米花：${res.data.baomihua}`;
          back = waterresult;
        } else {
          waterresult = res.data.info;
          back = waterresult;
        }
      } else {
        back = res.data;
      }
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
      //分享游戏id
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
  await get("grow", "GuanZhu", "21039293"); //关注我
  await getid();
  await get("grow", "Watering", "6");
  for (i of buid) {
    await get("grow", "gamehander", i);
  }
  for (i of id) {
    i = i.match(/\.(.+)\((\d+)\)/);
    switch (i[1]) {
      case "Ling":
        await get("gs", "recordshare", i[2]);
        await get("gs", "ling", i[2]);
        break;
      case "DailyShare":
        await get("grow", "DailyShare", i[2]); //发起分享
        await get("grow", "DailyShareCallb", i[2]); //返回
        await get("grow", "DailyShare", i[2]); //领取
        break;
      case "DailyGameLing":
        await get("grow", "DailyGamePlay", i[2]);
        await get("grow", "DailyGameLing", i[2]);
        break;
      case "DailyDouyinLing":
        await get("grow", "DailyDouyinCheck", i[2]);
        await get("grow", "DailyDouyinPlay", i[2]);
        await get("grow", "DailyDouyinLing", i[2]);
        break;
      case "DailyJiaoHu":
        await get("grow", "DailyJiaoHu", i[2]);
        break;
      case "DailyDati":
        let ress = await get("grow", "DailyDati", 4);
        await get("grow", "DatiJumpYxpage", "");
        if (ress.option1) {
          let yxid = ress.expand.split("##")[1];
          let urll = `https://api.3839app.com/cdn/android/gameintro-home-1546-id-${yxid}-packag--level-2.htm`;
          let resss = await axios.get(urll);
          let strr = JSON.stringify(resss.data.result.data.downinfo.appinfo)
            .replace(/&nbsp;/g, "")
            .replace(/ /g, "");
          for (i; i < 5; i++) {
            let strrr = ress["option" + i].replace(/ /g, "");
            if (!strr.match(strrr)) {
              await get(
                "grow",
                `DailyDatiAnswer&option=${ress["option" + i]}`,
                4
              );
            }
          }
        }
        await get("grow", "DailyDati", 4);
        break;
      case "DailyFriendLing":
        await get("grow", "DailyFriendLing", i[2]); //照料3次
        break;
      case "DailyInviteLing":
        let invite = await get("grow", "DailyInviteJump", i[2]);
        let uid = invite.invite_url.match(/u=(.+?)&/);
        await get("grow", `DailyInvite&u=${uid ? uid[1] : ""}&rwid=10`, 10);
        await get("grow", "DailyInviteLing", i[2]);
        break;
    }
  }
  let csdata = await get("grow", "Dailylogin", "174"); //抖音任务
  if (csdata.key == "ok" && csdata.config && csdata.config.day_rw_csd) {
    result = `\n今日获得${csdata.config.day_rw_csd}成熟度,共${csdata.config.chengshoudu}成熟度,${csdata.config.baomihua}爆米花`;
    if (csdata.config.chengshoudu == 100) {
      await get("grow", "PlantRipe", ""); //收获
      await get("grow", "PlantSow", ""); //播种
    }
  } else {
    result = csdata.key;
  }
  result = waterresult + result;
  console.log(result);
  return result;
}
task();
