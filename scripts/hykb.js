//好游快爆爆米花任务,可兑换激活码、实物周边等
//我的邀请码 sdvf180uscf3
waterresult = "";
const axios = require("axios");
//照料id 我没加好友所以随机取得 第一个是我,不建议改ヽ(*´з｀*)ﾉ
buid = [21039293, 12661364, 44191145, 44471412, 44440362,45562418,45236927,45045871,45507665,45263948,45249695,44042408,9169383,44761568,45466314];
let scookie = require("../config.json").hykb.scookie; //打开好游快爆app，任务页面，随便一个post包，查看post数据里的scookie
if(scookie.match("\\|")){
       scookie = encodeURIComponent(scookie)       
      }
      else
      { scookie = scookie
       }
        function get(a, b, c) {
            return new Promise(async resolve => {
                try {
                    if (a == "grow") {
                        if (b == "gamehander") {
                            d = "buid"
                        }else if (b=="GuanZhu")
                        {
                          d="singleUid"
                        }
                         else {
                            d = "id"
                        }
                    } else {
                        d = "gameid"
                    }
                    let res = await axios.post(`https://huodong3.3839.com/n/hykb/${a}/ajax.php`, `ac=${b}&${d}=${c}&r=0.1362954162068364&scookie=${scookie}`, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; FRD-AL10 Build/HUAWEIFRD-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM/3.0.0.2860 QQ/6.5.5  NetType/WIFI WebP/0.3.0 Pixel/1080"
                        }
                    })
                    if(JSON.stringify(res.data).match(/玉米成熟度已经达到100/))
                    {
                    await get("grow", "PlantRipe", "") //收获
                    await get("grow", "PlantSow", "") //播种
                    await get(a,b,c)  
                    }
                    if(JSON.stringify(res.data).match(/还没有播种玉米/))
                    {
                    let bzs= await get("grow", "PlantSow", "") //播种                    
                    if(bzs.seed&&(bzs.seed==0)){
                  //    console.log("莫得种子了")
                      await get("grow", "GouMai&resure=1&gmmode=seed&tmpNum=10", "") //购买种子*10
                    }}                                          
                    if (b == "Watering") {
                        if (res.data.key == "ok") {
                            waterresult = `今日浇灌成功,获得${res.data.add_bmh}爆米花,连续浇灌${res.data.nowJiaoGuanDay}天,成熟度：${res.data.csd_num},爆米花：${res.data.baomihua}`
                            back = waterresult
                        } else {
                            waterresult = res.data.info
                            back = waterresult
                        }
                    } else {
                        back = res.data
                    }
                    console.log(back)
                } catch (err) {
                    console.log(err)
                }
                resolve(back)
            })
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
  var mres =await axios.get("https://cdn.jsdelivr.net/gh/Wenmoux/checkbox/scripts/haoyoukuaibao/miling.txt")
  await get("fgb",`Secretorder&miling=${mres.data.miling}`,"")//密令   
  await get('wxsph',`send_egg&egg_data=${mres.data.egg}`,"")//视频彩蛋
  await get("grow", "GuanZhu", "21039293"); //关注我
  await getid();
  await get("grow", "Watering", "6");
  for (i of buid) {
    await get("grow", "gamehander", `${i}&icon_id=49`) //照料
       if(i!=21039293){ //别偷我的
        await get("grow", "gamehander", `${i}&icon_id=888888`) //偷玉米               
                }
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
      case 'DailyVideoLing':
        await get('grow','DailyVideoGuanzhu',i[2])
        await get('grow','DailyVideoShare',i[2])
        await get('wxsph','share&mode=qq',"") //DailyVideoShare
        await get('grow','DailyVideoLing',i[2])
                 
      case "DailyJiaoHu":
        await get("grow", "DailyJiaoHu", i[2]);
        break;
      case "DailyDati":
                           let ress = await get("grow", "DailyDati", 4) //获取题目
                        if (ress.option1&&ress.expand) {
                          i =1 
                          kw=1                                                                 
                            let yxid = ress.expand.split("##")[1]||"16876"//获取游戏id
                            let urll = `https://api.3839app.com/cdn/android/gameintro-home-1546-id-${yxid}-packag--level-2.htm`
                            let resss = await  axios.get(urll)
                            if(resss.data.result){
                            let strr = JSON.stringify(resss.data.result.data.downinfo.appinfo).replace(/&nbsp;/g,"").replace(/ /g,"")  //查答案                          
                         reg=/错误|不属于|不是|不存在|没有|不需要/
                           if(reg.test(ress.title)){  
                           console.log("错误类型") 
                        for (i ; i < 5; i++) {
                                let strrr = ress["option" + i].replace(/ /g,"")                                                                                                                                                                      
                          if(!strr.match(strrr)){
                            kw=i
                        //        await get("grow", `DailyDatiAnswer&option=${ress["option" + i]}`, 4)                                
                             }
                                }                                                                      
                         }
                         else {
                       //    console.log("正确类型")
                           for (i ; i < 5; i++) {
                                let strrr = ress["option" + i].replace(/ /g,"")                                                 
                              if(strr.match(strrr))   {    
                                 kw=i                                                                           
                             //   await get("grow", `DailyDatiAnswer&option=${ress["option" + kw]}`, 4)                                
                                } }                                                     
                         }
                         //瞎鸡儿答 非游戏类问题/找不到答案
                         //算了不瞎鸡儿答了 自行去app里答吧                                                                                                       
                        }
                        console.log("正确答案")
                        console.log(ress["option" + kw])
                        await get("grow", `DailyDatiAnswer&option=${ress["option" + kw]}`, 4)    
                        }
                        else {
                          
                          console.log("劳资找不到答案,请自行去app里答题")
                        }
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
//  return result;
}

task();
//module.exports=task
