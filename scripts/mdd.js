/*
sign解密过程 
http://www.liteng1220.com/blog/articles/mdd-crack/
https://github.com/navhu/MddOnline
2021-04-09
*/
const axios = require("axios")
const md5 = require("md5")
const appToken = config.mdd.appToken
const deviceNum = config.mdd.deviceNum ? config.mdd.deviceNum : "11b1384f0801478795ae2fab421fc413" 
var i = 1
const date = new Date();
signdata = "【埋堆堆每日任务】："
const Sign = function(action, param) {
    var str = '';
    var arr = [];
    var data = {
        'os': 'iOS',
        'version': '4.0.04',
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
    sign = md5(str)  
    bbody = {
        action: action,
        os: 'iOS',
        channel: 'AppStore',
        time: data.time,
        deviceNum: '11b1384f0801478795ae2fab421fc413',
        deviceType: 1,
        appToken: appToken,
        data: param,
        version: '4.0.04',
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
                        msg += `签到成功：获得${res.data.data.pointIncr}堆豆,${res.data.data.expIncr} || `
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
    for (k = 0; k < 10; k++) {
        await task("点赞", "\/api\/post\/like.action", {
            "isLike": 1,
            "postUuid": "f2385fedab6470e8520c3329f40bd5c"
        })
    }
    signdata += `点赞 ${i-1}/10 || `
    await task("分享至外站", "\/missionApi\/action\/uploadAction", {
        "actionCode": "share_vod_to_out",
        "params": "{\"vod_uuid\":\"ff8080817844680001786373c7481028\",\"vod_type\":0}"
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
    await task("分享结果", "\/api\/vod\/shareVod.action", {
        "isServiceShareNum": 1,
        "vodUuid": "ff8080817844680001786373c7481028"
    })

    await task("上传观看直播时长", "\/missionApi\/action\/uploadAction", {
        "actionCode": "watch_live",
        "params": "{\"member_uuid\":\"d9d7e516537a42a9b8986b0f8d4a39be\",\"session_id\":\"3231617888398794\",\"live_uuid\":\"1044223\",\"duration\":390}"
    })
    await task("发送影视弹幕", "\/api\/barrage\/addBarrage396.action", {
        "barrageUuid": "1",
        "content": "好看",
        "sactionUuid": "ff80808178691eab01788cee4b4c12f2",
        "times": 169,
        "vodUuid": "e96180c6a8cc424a88dec5ec4416f6fa"
    })
    await task("分享帖子", "\/api\/post\/share.action", {
        "postUuid": "52d6d8359a9947c48d59639afd7771ee"
    })
    await task("分享帖子", "\/missionApi\/action\/uploadAction", {
        "actionCode": "share_post",
        "params": "{\"post_uuid\":\"52d6d8359a9947c48d59639afd7771ee\"}"
    }, )
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
        "uuid": "ff8080817410d5a50174b531028c3f58",
        "uuidName": "",
        "uuidType": "1"
    })
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


    await task("观影记录", "\/api\/watchHistory\/add.action", {
        "duration": 1562,
        "sactionUuid": "ff80808178691eab01787cf4d4ef094b",
        "time": 2892,
        "vodUuid": "ff80808178446800017863197a110fa4"
    })
    await task("上传观影时长", "\/missionApi\/action\/uploadAction", {
        "actionCode": "watch_vod",
        "params": "{\"session_id\":\"4701617887966740\",\"vod_type\":0,\"vod_uuid\":\"e96180c6a8cc424a88dec5ec4416f6fa\",\"duration\":32000}"
    })

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

    await task("一键领取奖励", "\/missionApi\/award\/acceptAll", {})
    return signdata
}

module.exports = mdd