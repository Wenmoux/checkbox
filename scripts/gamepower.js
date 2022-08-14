//游戏动力app*/
const axios = require("axios");
const code = config.gamepower.loginCode
const headers = {
    packagename: "com.vgn.gamepower",
    "user-agent": "okhttp/3.12.0",
    Host: "api.vgn.cn",
    version: "1.3.7",
    version_code: 47,
    device_name: "",
    device_id: "",
    screen_resolution: "2400*1080",
    device_type: "android",
    //    "Content-Token": "",
    "Content-Type": "application/json; charset=utf-8"
}

function get(task, method = "get", data = null) {
    return new Promise(async (resolve) => {
        try {

            let url = `https://api.vgn.cn/apiv2/${task}`;
            if (method == "get") res = await axios.get(url, {
                headers
            });
            if (method == "post") res = await axios.post(url, data, {
                headers
            });
            if (method == "patch") res = await axios.patch(url, data, {
                headers
            });
            if (method == "delete") res = await axios.delete(url, {
                headers
            });
            if (res.data.code == 200) console.log("    操作成功")
            else console.log("    " + res.data.msg)
            resolve(res.data)
        } catch (err) {
            console.log(err);
            resolve({
                code: 500,
                msg: "签到接口请求出错"
            })
        }
        resolve();
    });
}

async function getaskList() {
    console.log("查询任务列表")
    let res = await get("task/list")
    if (res.code == 200 && res.data) return res.data.filter(x => x.task_type == 1 && x.status != 2)
    return []
}

async function dotask(taskList) {
    for (var task of taskList) {
        console.log("开始任务：" + task.title)
        if (task.status == 0) {
            switch (task.id) {
                case 14:
                    await get("v3/member/wish", "patch", {
                        "product_id": 1394330
                    })
                    break
                case 10:
                    await get("v3/game/1394330/comment", "post", {
                        "difficulty": 1,
                        "score": 5,
                        "length": 0,
                        "progress": 1,
                        "sale_notice": 0,
                        "play_status": 2,
                        "content": "好玩ヾ ^_^♪"
                    })
                    break
                case 7:
                    for (i = 0; i < 5; i++) await get("home/operate", "post", {
                        "operate": 1,
                        "type_id": 22312,
                        "type": 1
                    })
                    break
                case 8:
                    let cres = await get("v3/group/comment/22179", "post", {
                        "revert_id": "0",
                        "revert_user_id": "0",
                        "content": "牛啊牛啊牛啊牛",
                        "p_id": "0"
                    })
                    await get("comment/" + cres.data, "delete")
                    break
                case 11:
                    await get("task/share/6001", "post")
                    break
                case 17:
                    await get("task/share/6002", "post")
                    break
                default:
                    break
            }
        }
        console.log(`  去领取奖励：经验值${task.exp} 瓶盖${task.reward_point}`)
        await get("task/" + task.id, "post")
    }
}

async function gamepower() {
    rinfo = ""
    let loginRes = await get("v2/login/qq", "post", {
        "code": code
    })
    if (loginRes.code == 200) {
        console.log("登陆成功")
        headers["Content-Token"] = loginRes.data.token
        let taskList = await getaskList()
        console.log(`当前还有${taskList.length}任务待完成`)
        console.log("去签到")
        await get("v3/mine/reward/point/daily", "post")
        await dotask(taskList)
        console.log("\n查询个人信息")
        let uinfo = await get("v3/login/userinfo")
        if (uinfo.code == 200) rinfo = `\n昵称：${uinfo.data.member_nickname}\n等级：${uinfo.data.level_info.level}\n瓶盖：${uinfo.data.reward_point}\n连签：${uinfo.data.reward_days}`
        else rinfo = uinfo.msg
    } else rinfo = loginRes.msg
    console.log(rinfo)
    return "【游戏动力】：" + rinfo
}
module.exports = gamepower