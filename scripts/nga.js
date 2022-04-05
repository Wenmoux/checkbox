const axios = require("axios");

function ngaGet(lib, act, output = 11, other = null) {
    return new Promise(async (resolve) => {
        try {
            let nga = config.nga;
            let url = "https://ngabbs.com/nuke.php";
            let res = await axios.post(
                url,
                `access_uid=${nga.uid}&access_token=${
          nga.accesstoken
        }&    app_id=1010&__act=${act}&__lib=${lib}&__output=${output}&${other}`, {
                    headers: {
                        "User-Agent":  nga.UA ? nga.UA : "xxxxxx Nga_Official/90306"
                    }
                }
            );
            console.log("    " + (res.data && res.data.time || res.data.code))
            resolve(res.data)
        } catch (err) {
            console.log(err);
            resolve({
                error: ["签到接口请求出错"]
            })
        }
        resolve();
    });
}

async function task() {
    msg = "【NGA】：\n"
    //签到
    let res1 = await ngaGet("check_in", "check_in")
    if (res1 && res1.data) {
        msg += "    签到：" + res1.data[0];
    } else {
        console.log(res1);
        msg += "    签到：" + (res1.error && res1.error[0]);
    }
    if (!msg.match(/登录|CLIENT/)) {
        await ngaGet("mission", "checkin_count_add", 11, "mid=2&get_success_repeat=1&no_compatible_fix=1")
        await ngaGet("mission", "checkin_count_add", 11, "mid=30&get_success_repeat=1&no_compatible_fix=1")
        console.log("看视频免广告")
        await ngaGet("mission", "video_view_task_counter_add_v2_for_adfree_sp1")
        for (c of new Array(4)) await ngaGet("mission", "video_view_task_counter_add_v2_for_adfree")
        console.log("看视频得N币")
        for (c of new Array(5)) await ngaGet("mission", "video_view_task_counter_add_v2")
        //分享帖子
        console.log("分享帖子 5")
        tid = Math.ceil(Math.random() * 12346567) + 12345678
        for (c of new Array(5)) await ngaGet("data_query", "topic_share_log_v2", 12, "event=4&tid=" + tid)
        console.log("领取分享奖励 1N币")
        await ngaGet("mission", "check_mission", 11, "mid=149&get_success_repeat=1&no_compatible_fix=1")
        //查询
        let {
            data: [sign, money, y]
        } = await ngaGet("check_in", "get_stat")
        msg += ` 连签 ${sign.continued}天 累签 ${sign.sum}天\n    N币：${money.money_n}\n    铜币：${money.money}\n    啊哈：${y[0]}`
    }
    return msg
}

module.exports = task;