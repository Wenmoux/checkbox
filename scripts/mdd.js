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
            console.log(res.data)
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

            console.log(msg)
            signdata += msg
        } catch (err) {
            console.log(err);
            signdata += "签到接口请求失败"
        }
        resolve(signdata);
    });
}

async function mdd() {
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
    await task("分享帖子", "\/missionApi\/action\/uploadAction", {
        "actionCode": "share_post",
        "postUuid": "51e658fd35204a55859a0eebfdc8d492"
    })
    await task("分享帖子", "\/api\/post\/share.action", {
        "postUuid": "51e658fd35204a55859a0eebfdc8d492"
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
        "num": 1,
        "giftUuid": 4,
        "liveUuid": "1044237",
        "deductWay": 0,
        "batchUuid": "nuh7qdx5j4cd848gjmp49405aogprjg8"
    })
    await task("一键领取奖励", "\/missionApi\/award\/acceptAll", {})
    return signdata
}

module.exports = mdd