/*
sign解密过程 
http://www.liteng1220.com/blog/articles/mdd-crack/
https://github.com/navhu/MddOnline
2021-04-09
*/
const axios = require("axios")
const md5 =require("crypto-js").MD5
const appToken = config.mdd.appToken
const deviceNum = config.mdd.deviceNum ? config.mdd.deviceNum : "11b1384f0801478795ae2fab421fc413" 
let taskVideoUuid;
var i = 1
const date = new Date();
signdata = "【埋堆堆每日任务】："
const Sign = function(action, param) {
    var str = '';
    var arr = [];
    var data = {
        'os': 'iOS',
        'version': '4.0.92',
        'action': action,
        'time': new Date().getTime().toString(),
        'appToken': appToken,
        'privateKey': 'e1be6b4cf4021b3d181170d1879a530a9e4130b69032144d5568abfd6cd6c1c2',
        'data': ''
    };
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            arr.push(key + ':' + data[key]);
        }
    } 
    str = arr.join('|'); 
    for (var key in param) {
        if (param.hasOwnProperty(key)) {
            str += (key + '=' + param[key] + '&');
        }
    }
    sign = md5(str).toString()
    bbody = {
        action: action,
        os: 'iOS',
        channel: 'AppStore',
        time: data.time,
        deviceNum: '11b1384f0801478795ae2fab421fc413',
        deviceType: 1,
        appToken: appToken,
        data: param,
        version: '4.0.92',
        sign
    }
    return bbody
}



function task(name, action, param) {
    return new Promise(async (resolve) => {
        try {
            let data = Sign(action, param)
            let res = await axios.post(`https://mob.mddcloud.com.cn${action}`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            //    console.log(res.data)
            if (res.data.status && res.data.data) {
                if (action.match(/like/)) {
                    console.log(`第${i++}次点赞成功`)
                    msg = ""
                } else {
                    if (action.match(/signIn/)) {
                        msg = `签到成功：获得${res.data.data.pointIncr}堆豆,${res.data.data.expIncr} || `
                    } else if (action.match(/acceptAll/)) {
                        msg = `领取成功！获得${res.data.data.pointIncr}堆豆,${res.data.data.expIncr}经验 当前共${res.data.data.memberPoint}堆豆,${res.data.data.memberExp}经验值`
                    } else {
                       msg = `${name}：${res.data.msg} || `
                    }
                }
            } else {
                msg = name + "：" + res.data.msg + " || "
            }
            resolve(res.data)

            console.log(msg)
            signdata += msg
        } catch (err) {
            console.log(err);
            signdata += "签到接口请求失败"
        }
        resolve();
    });
}

async function mdd() {
    /*   
    await task("登陆","/api/member/login.action",{
       "loginNum": "手机号",
       "password": "密码",
       "type": 0
     }) 一般用不到 群里有个憨批分身抓不了包
     */
    await task("每日签到", "\/missionApi\/signIn\/sign", {})

    await task("获取VIP 签到页面任务", "\/api\/module/listTabModules.action", {
        "maxModuleType" : 37,
        "rows" : 10,
        "startRow" : 0,
        "tabUuid" : "ff8080817b3f1fd3017b70bcda34199d",
    }).then(async (res) => {
        var missionUuid = 0;
        for(var index = 0 ;index < res.data.length; index++){
            var item = res.data[index];
            if (item.moduleType == 35 && item.moduleData.length > 0){
                //找到类型是VIP签到的，并且模块不为空
                //多从判断，防止以外报错
                missionUuid = item.moduleData[0].continueSignInMission ? (item.moduleData[0].continueSignInMission.missionUuid || 0) : 0;
            }
        }
        if(missionUuid){
            console.log('成功获取到本周任务ID 是' + missionUuid);
            await task("VIP每日签到 ", "\/missionApi\/signIn\/vipsign", {"missionUuid": missionUuid})    
        }
    })
    
    await task("查询关注状态", "/api/member/profile.action", {
        memberUuid: "e3f799b3eeac4f2eaa5ea70b0289c67a"
    }).then(async (res) => {
        if (res.data.followType == 0) {
            await task("关注我", "/api/member/followMember.action", {
                memberUuid: "e3f799b3eeac4f2eaa5ea70b0289c67a"
            })
        }
    })

//快速帖子评论
    await task("获取【声生不息】板块帖子", "\/api/service/listPostOrderAndFilter.action", {
        "postFilterType": 2,
        "postOrderType" : 1,
        "rows" : 20,
        "serviceUuid" : "ff808081805a43c001805a7d31850119",//声生不息
        "startRow" : 0
    }).then(async (res) => {
        if(res.data){
            postUuid = res.data[0].uuid;
            postComment = ["好听啊","真的好好听","听入迷了","🎵🎵🎵👍" ,"👍👍👍" ];
            postComment.push(res.data[0].shareTitle);
            console.log(postComment);
            signdata += "评论了《"+res.data[0].title+"》\n";
            await task("评论帖子", "\/api\/postComment\/replyComment.action", {
                "atInfoList": "[]",
                "content": postComment[Math.round(Math.random() * postComment.length)],
                "contentType": 0,
                "faceUuid": 0,
                "imageArray": "",
                "postUuid": postUuid,
                "resourceId": "",
            })
            
            await task("分享帖子", "\/api\/post\/share.action", {
                "postUuid": postUuid
            })
            await task("分享帖子", "\/missionApi\/action\/uploadAction", {
                "actionCode": "share_post",
                "params": "{\"post_uuid\":\""+postUuid+"\"}"
            })
            
            time = res.data.length > 10 ? 10 : res.data.length;
            for (k = 0; k < time; k++) {

                signdata += `点赞 ${k}/${time} \n `
                await task("点赞", "\/api\/post\/like.action", {
                    "isLike": 1,
                    "postUuid":res.data[k].uuid
                })
            }
        }
        
    })

    await task("获取播放量最高的限免电视剧", "\/api\/module\/listMoreVods.action", {
        "moduleUuid" : "ff80808175b1bb7c017603d94c41487d",
        "rows" : 21,
        "startRow" : 0
    }).then(async (res) => {
        if(res.data && res.data.psVodModuleEntryList){
            //找到播放量最高的限免电视剧
            let playNum = 0;
            let vod = [];
            for(var vodIndex = 0; vodIndex < res.data.psVodModuleEntryList.length; vodIndex++){
                if(res.data.psVodModuleEntryList[vodIndex].playNum > playNum){
                    playNum = res.data.psVodModuleEntryList[vodIndex].playNum;
                    vod = res.data.psVodModuleEntryList[vodIndex];
                }
            }
            taskVideoUuid = vod.vodUuid;
            signdata += "今天看的限免剧集是：《" + vod.name + "》\n";

        }
    });

    await task("获取剧集信息", "\/api\/vod/listVodSactions.action", {
        "hasIntroduction" : 0,
        "vodUuid": taskVideoUuid,
    }).then(async (res) => {
        if (res.data) {
            let index = Math.floor(Math.random() * res.data.length);
            let dramas = res.data[index];
            let session_id = Math.floor(Math.random() * 899 + 100).toString() + Math.floor(Date.now() / 1000).toString();//观看时长用的session_id
            if(dramas){
                let watchTime = Math.floor(Math.random() * dramas.duration);//随机观看时间
                signdata += "本次观看的是：《"+dramas.name+"》\n";
                //确保剧集在
                await task("发送影视弹幕", "\/api\/barrage\/addBarrage396.action", {
                    "barrageUuid" : "1",
                    "content" : "打卡",
                    "sactionUuid" : dramas.uuid,
                    "times" : Math.round(Math.random() * 60),
                    "vodUuid" : dramas.vodUuid,
                })
                await task("观影记录", "\/api\/watchHistory\/add.action", {
                    "duration": 4157,
                    "sactionUuid": dramas.uuid,
                    "time": 4157,
                    "vodUuid": dramas.vodUuid,
                })
                
                await task("上传观影时长", "\/missionApi\/action\/uploadAction", {
                    "actionCode": "watch_vod",
                    "params": "{\"duration\":" + watchTime + ",\"session_id\":\"" + session_id + "\",\"vod_type\":0,\"vod_uuid\":\"" + dramas.vodUuid + "\"}"
                })
                
                let comment = ["666", "奥利给！！！", "好看滴很", "爱了爱了", "必须顶", "ヾ(๑╹ヮ╹๑)ﾉ", "路过ヾ(๑╹ヮ╹๑)ﾉ", "每日一踩", "重温经典(*ﾟ∀ﾟ*)", "资瓷"]
                await task("评论剧集", "/api/post/post.action", {
                    "atInfoList": "",
                    "content": comment[Math.round(Math.random() * 10)],
                    "contentType": 0,
                    "faceUuid": 0,
                    "imageArrayStr": "",
                    "imageResolutionRatio": "",
                    "redirectTimes": 0,
                    "resourceId": "",
                    "thumbnail": "",
                    "title": "",
                    "topicName": "",
                    "uuid": dramas.vodUuid,
                    "uuidName": "",
                    "uuidType": "1"
                })
    
                await task("分享结果", "\/api\/vod\/shareVod.action", {
                    "isServiceShareNum": 1,
                    "vodUuid": dramas.vodUuid
                })
            }
            
        }
    })
    
    /*
    let date = new Date();
    let msg = await axios.get("https://chp.shadiao.app/api.php");
    await task("日常发帖", "/api/post/post.action", {
        "atInfoList": "",
        "content": msg.data,
        "contentType": 0,
        "faceUuid": 0,
        "imageArrayStr": "",
        "imageResolutionRatio": "",
        "redirectTimes": 0,
        "resourceId": "",
        "thumbnail": "",
        "title": "日常打卡 " + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        "topicName": "",
        "uuid": "ff80808175b1bb7c0175f95318ed42da",
        "uuidName": "埋堆吹水堂",
        "uuidType": "2"
    })
*/
    //激励视频x5
    
    //激励视频x5
    await task("任务列表", "\/missionApi\/mission\/center", {
    }).then(async (res) => {
        var videoMissionUuid = 0;
        var iosToponAdSeatUuid;
        for (var index = 0; index < res.data.missionGroupList.length; index++) {
            var missionList = res.data.missionGroupList[index].normalMissionList;//普通任务列
            if(!missionList){
                //签到任务可能没有这个变量导致报错。所以跳过即可
                continue;
            }
            for(var missionListIndex = 0; missionListIndex < missionList.length; missionListIndex++){
                if(missionList[missionListIndex].redirectInfo && missionList[missionListIndex].redirectInfo.redirectExtra){
                    //找到激励视频的任务。
                    iosToponAdSeatUuid = missionList[missionListIndex].redirectInfo.redirectExtra.iosToponAdSeatUuid;//请求头是IOS ，这里使用IOS ，原来的是使用安卓的。
                    videoMissionUuid = missionList[missionListIndex].missionUuid;//每周的任务ID 都会改变。
                    if(missionList[missionListIndex].missionStatus){
                        console.log(missionList[missionListIndex]);
                        //激励视频任务已经完成
                        videoMissionUuid = 0;
                        //打印信息
                        signdata += `激励视频任务已完成，不重复做。\n`;
                    }
                }
            }
        }
        if (videoMissionUuid) {
            console.log('成功获取到本周任务ID 是' + videoMissionUuid);
            for (jl = 0; jl < 5; jl++) {
                await task("观看激励视频", "\/missionApi\/action\/uploadAction", {
                    "actionCode": "watch_reward_ad",
                    "params": "{\"mission_uuid\":\""+videoMissionUuid+"\",\"topon_ad_seat_uuid\":\""+iosToponAdSeatUuid+"\",\"watch_status\":1}"
                })
            }
        }
    })
   /*
     await task("赠送礼物", "\/userLiveApi\/gift\/sendGiftEnd", {
        "batchUuid": "4a345dc9221541ee9ba403487bd1965d",
        "giftUuid": 4,
        "liveUuid": "1044127"
    })
    await task("赠送礼物", "\/userLiveApi\/gift\/sendGift", {
        "batchUuid": "4a345dc9221541ee9ba403487bd1965d",
        "deductWay": 1,
        "giftUuid": 4,
        "liveUuid": "1044127",
        "num": 1
    })
    */
    await task("一键领取奖励", "\/missionApi\/award\/acceptAll", {})
    return signdata
}

module.exports = mdd