const axios = require("axios");
const sckey = "";//server酱turbo版key
const qmsgkey = "";
const cpkey = "";
const pushplustoken = ""
const corpsecret = ""
const corpid = ""
const agentid=""
mediaid=""//素材库图片id
const tgbotoken="" //bot token
const chatid="" //私聊就是userid 群聊就是群组id 可通过userinfo机器人获得
async function sendmsg(text) {
    console.log(text)
    await server(text);
    await qmsg(text);
    await cp(text);
    await pushplus(text);
    await wx(text); 
    await tgpush(text)
}

function server(msg) {
    return new Promise(async (resolve) => {
        try {
            if (sckey) {
                let url = `https://sctapi.ftqq.com/${sckey}.send`
                let data = `title=${encodeURI("签到盒每日任务已完成")}&desp=${encodeURI(msg.replace(/\n/g,"\n\n"))}`
                let res = await axios.post(url, data)
                if (res.data.code == 0) {
                    console.log("server酱:发送成功");
                } else {
                    console.log("server酱:发送失败");
                    console.log(res.data.info);
                }
            } else {
                console.log("server酱:你还没有填写server酱推送key呢，推送个鸡腿");
            }
        } catch (err) {
            console.log("server酱：发送接口调用失败");
      //      console.log(err.response.data.message);
        }
        resolve();
    });
}

function pushplus(msg) {
    return new Promise(async (resolve) => {
        try {
            if (pushplustoken) {
                let url = "http://pushplus.hxtrip.com/send"
                let data = {
                    "token": pushplustoken,
                    "title": "签到盒每日任务已完成-",
                    "content": msg.replace(/\n/g,"<br>"),
                    "temple": "html"
                }
                let res = await axios.post(url, data, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (res.data.code == 200) {
                    console.log("pushplus:发送成功");
                } else {
                    console.log("pushplus:发送失败");
                    console.log(res.data.msg);
                }
            } else {
                console.log("pushplus:你还没有填写token呢，推送个鸡腿");
            }
        } catch (err) {
            console.log("pushplus酱：发送接口调用失败");
            console.log(err);
        }
        resolve();
    });
}



function qmsg(msg) {
    return new Promise(async (resolve) => {
        try {
            if (qmsgkey) {
                url = `https://qmsg.zendee.cn/send/${qmsgkey}`;
                res = await axios.post(url, `msg=${encodeURI(msg)}`);
                if (res.data.success) {
                    console.log("qmsg酱:发送成功");
                } else { 
                    console.log("qmsg酱:发送失败 "+res.data.resson);
                    
                }
            } else {
                console.log("qmsg酱:你还没有填写qmsg酱推送key呢，推送个鸡腿");
            }
        } catch (err) {
            console.log("qmsg酱:发送接口调用失败");
            console.log(err);
        }
        resolve();
    });
}

function cp(msg) {
    return new Promise(async (resolve) => {
        try {
            if (cpkey) {
                let url = `https://push.xuthus.cc/send/${cpkey}?c=${encodeURI(msg)}`;
                let res = await axios.get(url);
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

function tgpush(msg) {
    return new Promise(async (resolve) => {
        try {
            if(tgbotoken&&tgbotoken){
         //   let url = "https://api.telegram.org/bot${tgbotoken}/sendMessage";
         //   let data=`parse_mode=Markdown&text=${msg.replace(/\n/g,"%0A").replace(/【|】/g,"*")}&chat_id=${chatid}`
             let url=`https://telegram_proxy.lulafun.workers.dev/bot${tgbotoken}/sendMessage?parse_mode=Markdown&text=${encodeURI(msg.replace(/【|】/g,"*"))}&chat_id=${chatid}`
           //     console.log(uu)
           //   let res = await axios.post(url,data);
             let res = await axios.get(url);
            if (res.data.ok) {
                console.log("Tg：发送成功");
            } else {
                console.log("Tg：发送失败!");
                console.log(res.data);
            }}else{
            console.log("tg：你还没有填写tgbot token和chatid呢！！！")}
        } catch (err) {
            console.log(err);
        }
        resolve();
    });
}

function wx(msg) {
    return new Promise(async (resolve) => {
        try {
            if (corpid && corpsecret) {
                let url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`
                let res = await axios.get(url)
                access_token = res.data.access_token
                let turl = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${access_token}`
                let text = {
                    "touser": "@all",
                    "msgtype": "text",
                    "agentid": agentid?agentid:1000002,
                    "text": {
                        "content": msg
                    },
                    "safe": 0
                }
                
                let mpnews = {
                    "touser": "@all",
                    "msgtype": "mpnews",
                    "agentid": agentid?agentid:1000002,
                    "mpnews": {
       "articles":[
           {
               "title": "签到盒每日任务已完成", 
               "thumb_media_id": mediaid?mediaid:"",
               "author": "wenmoux",
               "content_source_url": "",
               "content": msg.replace(/\n/g,"<br>"),
               "digest": msg
            }
       ]
   },
       "safe": 0}
       
       let data =mediaid?mpnews:text
                let tres = await axios.post(turl,data)
                if (tres.data.errcode == 0) {
                    console.log("企业微信:发送成功");
                } else {
                    console.log("企业微信:发送失败");
                    console.log(tres.data.errmsg);
                }
            } else {
                console.log("企业微信:你还没有填写corpsecret和corpid呢，推送个鸡腿");
            }
        } catch (err) {
            console.log("企业微信：发送接口调用失败");
            console.log(err);
        }
        resolve();
    });
}

module.exports = sendmsg