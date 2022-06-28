/*
 * @Author: Wenmoux
 * @Date: 2020-12-03 08:48:00
 * @LastEditTime: 2022-06-15 09:13:14
 * @Description: 橙光游戏app每日签到+登陆奖励领取+每日任务+分享
 * @Other：X-sign生成 https://my.oschina.net/2devil/blog/2395909
 */

const axios = require("axios");
const md5 = require("crypto-js").MD5
headers = {}
let result = "【橙光游戏】: ";
const {uid,token,skey,sflag,folder,gameid,did} = config.cg3

//签到
function check() {
    return new Promise(async (resolve) => {
        try {
            const url = "https://www.66rpg.com/Ajax/Home/new_sign_in.json";
            let data = `token=${token}&mobile_uid=&client=2&android_cur_ver=268`;
            const headers = {
                "user-agent": "Mozilla/5.0 (Linux; Android 10; Redmi K30 Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            };
            let res = await axios.post(url, data, {
                headers,
            });
            if (res.data.status == 1) {
                msg = `签到成功,获得：${res.data.data.today.award_name}明日继续签到🉑获得：${res.data.data.tomorrow.award_name}！！ ||  `;
            } else {
                msg = "签到失败⚠️⚠️⚠️ " + res.data.msg + " ||  ";
            }
            console.log("    签到结果：" + msg);
            result += msg;
        } catch (err) {
            msg = "签到接口请求出错！！ ";
            console.log(err);
        }
        resolve();
    });
}



function get(url, method = "get", data = null, xsign) {
    return new Promise(async (resolve) => {
        try {
            if (xsign) headers["x-sign"] = xsign

            if (method == "get") res = await axios.get(url, {
                headers
            });
            //      headers ["content-type"] = "application/json;charset=utf-8"
            headers["user-agent"] == "axios/0.19.0"
            if (method == "post") res = await axios.post(url, data, {
                headers
            })
            headers = {}
            if (res.data && res.data.data && (res.data.data.msg || res.data.msg)) console.log("    " + (res.data.data.msg || res.data.msg))
            resolve(res.data)
        } catch (err) {
            console.log(err);
            resolve({
                msg: "签到接口请求出错"
            })
        }
        resolve();
    });
}

//获取活跃任务列表
async function getaskList() {
    let url = `https://www.66rpg.com/ActiveSystem/index/get_today_task_lists?jsonCallBack=&uid=&token=${token}&client=2&_=`
    let res = await get(url)
    if (res && res.status == 1) taskList = res.data
    else taskList = []
    return taskList
}


//登陆奖励
function loginreward() {
    return new Promise(async (resolve) => {
        try {
            var url = `http://iapi.66rpg.com/user/v2/sso/launch_remind?pack_name=com.sixrpg.opalyer&sv=QKQ1.190825.002testkeys&android_cur_ver=2.25.268.1027&nt=4g&device_code=RedmiK30&channel=LYyingyongbao&skey=&device_unique_id=${did}&token=${token}`;
            let res = await get(url, "get", null, getsign(url))
            if (res.status == 1) {
                if (!res.data.integral.hidden) {
                    msg =
                        "    登陆成功,获得：" +
                        res.data.integral.msg +
                        "," +
                        res.data.flower.msg;
                } else {
                    msg = "今日已经领取过登陆奖励了";
                }
            } else {
                msg = "领取登陆奖励失败：" + res.msg;
            }
            result += msg;
            console.log("    领取结果：" + msg);
        } catch (err) {
            console.log(err);
        }
        resolve();
    });
}

// x-sign生成
function getsign(url) {
    data = url.split("?")[1]
    var str = data
        .split("&")
        .sort(function(a, b) {
            return a.localeCompare(b);
        })
        .join("&");
    return md5(str + "a_744022879dc25b40").toString()
}

//评论任务
function favor() {
    return new Promise(async (resolve) => {
        try {
            //先取消收藏
            var url0 = `http://iapi.66rpg.com/Favorite/v1/Favorite/editor_game_folders?device_code=MEIZU18Pro&sv=Flyme9.0.1.3A&nt=4g&token=${token}&skey=${skey}&action=editor_game_folders&ts=&android_cur_ver=2.32.288.0119`
            let data0 = `pack_name=com.sixrpg.opalyer&folder=&sv=Flyme9.0.1.3A&gindex=242004&android_cur_ver=2.32.288.0119&nt=4g&device_code=MEIZU18Pro&channel=XiaoMiReaderDYD&skey=${skey}&device_unique_id=${did}&token=${token}`
            let res0 = await get(url0 + "&sign=" + getsign(url0), "post", data0, getsign(url0))
            console.log("    取消收藏：" + res0.msg);
            //收藏
            var url1 = `https://www.66rpg.com/api/client?pack_name=com.sixrpg.opalyer&sv=Flyme9.0.1.3A&android_cur_ver=2.32.288.0119&nt=4g&channel=XiaoMiReaderDYD&platform=2&token=${token}&folder=${folder}%2C&gindex=242004&device_code=&action=fav_game&skey=${skey}&device_unique_id=${did}&fav_type=1`
            let res = await get(url1, "get", null, getsign(url1))
            console.log("    收藏结果：" + res.msg);
        } catch (err) {
            console.log(err);
        }
        resolve();
    });
}




async function uploadtime(id,t) {
    let url = "https://c.66rpg.com/collect/v1/index/runtime"
    time = parseInt(new Date().getTime().toString() / 1000)
    let datas = `{"run":{"${id}":${t}}}${uid}${time}MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDtsvsk/MIEI9YXvHzLfg+eEJkY3d7RmVynKBZY35T0xg3WwZgmC6GSPZqrMMcht6aiZYPJywhm9JiE6kBo/0Mvxklm5Wd35wIKeDXcq8Aqb4aQXalcwsD3f829OR1P2AqGilr14Rftv4ixyQATG/BqP2/kgft2rcq4e/E7bDWNLQIDAQAB`
    let check = md5(datas).toString()
    let str = `data=%7B%22run%22%3A%7B%22${id}%22%3A${t}%7D%7D&uid=${uid}&ts=${time}&check=${check}&platform=3&channel_id=0&online_plat=10&nonce=b613b114-b3a8-4bb6-a444-7096b2abc5fe&timestamp=${time}`
    let res = await get(url, "post", str)
    console.log("    上传结果：" + res.msg)
}
async function cg() {
    console.log("橙光app每日签到开始...");
    //获取任务列表
    let taskList = await getaskList()
    for (task of taskList) {
        console.log("去做任务：" + task.task_name)
        if (task.max_claim <= task.play_count) {} else {
            switch (task.task_type) {
                case 0: //每日登陆
                    await loginreward();
                    break
                case 1: //阅读5min
                    await uploadtime(gameid,1800)
                    await sleep(1000)
                    await uploadtime(gameid,10)
                    break
                case 2: //分享作品
                    var url = `http://www.66rpg.com/api/newClient?pack_name=com.sixrpg.opalyer&sv=QKQ1.190825.002testkeys&android_cur_ver=2.27.273.1229&nt=4g&channel=vivoDYD&platform=2&token=${token}&gindex=${gameid}&share_msg_id=&device_code=RedmiK30&action=share_game&skey=${skey}&device_unique_id=${did}&share_channel=3`;
                    await get(url, "get", null, getsign(url))
                    break
                case 3: //分享别人看
                    for (c of new Array(5)) {
                         await get(`https://m.66rpg.com/main/ajax/game/add_game_share.json?token=&client=0&stype=1&starget=${gameid}&sflag=${sflag}&platform=2&share_msg_id=&um_chnnl=share&um_from_appkey=60ab3e2453b67264990bf849`)
                    }
                    break
                case 4: //发表评论
                   datac = `pack_name=com.avgorange.dating&sv=Flyme9.0.1.3A&auth=eyJhY3Rpb24iOiJjb21tZW50X3Bvc3QiLCJnaW5kZXgiOiIxNTY5ODQ0IiwicGFyZW50X2NpZCI6IiIsImNvbnRlbnQiOiLmiZPljaHmiZPljaHmiZPljaHmiZPljaHmiZPljaEiLCJkZXZpY2VfdHlwZSI6Ik1FSVpVMThQcm8iLCJyIjoiNTZGIn0%253D&android_cur_ver=2.32.292.0530&parent_cid=&nt=wifi&channel=talkingdata202106&device_type=MEIZU18Pro&content=%E6%89%93%E5%8D%A1%E6%89%93%E5%8D%A1%E6%89%93%E5%8D%A1%E6%89%93%E5%8D%A1%E6%89%93%E5%8D%A1&gindex=1569844&device_code=MEIZU18Pro&skey=${skey}&device_unique_id=${did}&call_source=game`
                   surl  = `http://www.66rpg.com/api/client?device_code=MEIZU18Pro&sv=Flyme9.0.1.3A&nt=wifi&token=${token}&skey=${skey}&action=comment_post&ts=1656227475&android_cur_ver=2.32.292.0530`
                   await get(surl + "&sign=" + getsign(surl), "post", datac, getsign(surl))
                    break
                default:
                    break
            }
        }
        await sleep(1000)
        await get(`https://www.66rpg.com/ActiveSystem/index/claimReward?task_type=${task.task_type}&uid=${uid}&token=${token}&client=2&_=`)
    }
    console.log("去签到")
    await check();
    console.log("每日分享")
    surl = `http://www.66rpg.com/api/newClient?pack_name=com.sixrpg.opalyer&sv=QKQ1.190825.002testkeys&android_cur_ver=2.27.273.1229&nt=4g&channel=vivoDYD&platform=2&token=${token}&gindex=${gameid}&share_msg_id=&device_code=RedmiK30&action=share_game&skey=${skey}&device_unique_id=${did}&share_channel=3`;
    await get(surl, "get", null, getsign(surl))
    Info = ""
    var iurl = `http://iapi.66rpg.com/user/v2/user/user_info?uid=${uid}&pack_name=com.sixrpg.opalyer&sv=Flyme9.0.1.3A&android_cur_ver=2.32.288.0119&nt=network_unknown&device_code=&channel=XiaoMiReaderDYD&action=user_info&skey=${skey}&device_unique_id=${did}&token=${token}`
    let ires = await get(iurl, "get", null, getsign(iurl))
    if (ires.status == 1) {
        info = ires.data[uid]
        if (info.last_available_time != 0) hl = `\n    花篮：至${info.last_available_time_str.replace("花篮领取有效期 ","")}`
        else hl = ""
        Info = `   昵称：${info.uname}\n    等级：${info.user_level}\n    鲜花：${info.rest_flower}\n    积分：${info.coin3}\n    橙子：${info.user_orange}${hl}`

    }
    console.log(Info)
    return "【橙光】：\n " + Info
}

//cg()
module.exports = cg;