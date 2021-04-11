const mixin = {
    baseUrl: "https://app.3000.com",
    standardFlag: true,
    timeout: 15000,
    withCredentials: false
};
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const axios = require("axios")
token = config.shanyi.token
u = config.shanyi.u
urlpara = "&v=1.0.0&app_version=2.1.0&client=" + config.shanyi.client
datapara = "&u=" + encodeURIComponent(u) + "&token=" + encodeURIComponent(token)
function post(options) {
    //let params = Object.assign({}, para, options.para);
    return new Promise((resolve, reject) => {
        axios.post(mixin.baseUrl + options.url + urlpara, options.data + datapara, {
                headers: {
                    "User-Agent": config.shanyi.UA
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                console.log(err)
                resolve({
                    tip: err
                });
            });
    });
}

var task = async function(name, url, data) {
    return await post({
        url: url,
        data: data
    }).then(res => {
        //  console.log(res)
        console.log(`${name}：${res.msg}`)
        return res;
    });
};

function jm(data) {
    let algorithm = 'aes-128-cbc'
    let passwd = 'WDF#$H*#SJN*&G$&'
    let iv = 'JH&$GF$DR%*K@SC%'
    let cryptojs = require('crypto-js');
    str = cryptojs.AES.encrypt("" + data, cryptojs.enc.Utf8.parse(passwd), {
        iv: cryptojs.enc.Utf8.parse(iv),
        mode: cryptojs.mode.CBC,
        // padding: cryptojs.pad.Pkcs7
    })
    return encodeURIComponent(str.toString())
}

function ling(name, type, taskid) {
    task(name + " 奖励领取：", "/?m=user&op=daily_task&ac=receive_task_limit_bonus", `task_id=${taskid}&type=${type}`)
}


async function renwu() {
    let dataa = await task("获取任务列表", "/?m=user&op=daily_task&ac=index", "")
    await task("领取等级福利", "/?m=user&op=level&ac=privilege_receive", "level=" + jm(dataa.data.level_info.level))
    let timelist = dataa.data.task_limit_time_list
    if (timelist.length>0) {
        for (id of timelist) {
            await task("阅读", "/?m=user&op=index&ac=add_user_play_time", "minute=" + jm(120) + "&gid=" + jm(id.game_id))
            await ling(id.title + " " + id.game_id, jm(1), jm(id.task_id))
            await sleep(60000)
        }
    } else {    
        await task("阅读", "/?m=user&op=index&ac=add_user_play_time", "minute=" + jm(120) + "&gid=y822%2Bk8oG37pr8x6YUBAcQ%3D%3D")
    }
    for (id of dataa.data.daily_task_list) {
        await ling(id.task_name, jm(2), jm(id.task_id))
    }
    for (id of dataa.data.hy_bonus_daily_list) {
        await task("活跃度宝箱 " + id.hy_val, "?m=user&op=daily_task&ac=receive_hy_bonus", "package_id=" + jm(id.package_id))
    }


}
async function getinfo() {
    let dataa = await task("获取个人信息", "/?m=user&op=daily_task&ac=index", "")
    info = `【闪艺app每日任务】：${dataa.data.nickname}|| Lv${dataa.data.level_info.level} 经验值 ${dataa.data.level_info.current_empirical} / ${dataa.data.level_info.next_empirical}\n任务完成情况：`
    for (id of dataa.data.daily_task_list) {
        status = id.status == 3 ? "已领取" : "未领取"
        info += id.task_name + " ：" + status + " || "
    }
    //console.log(info)
    return info
}
async function shanyi() {

    let res = await task("获取任务列表", "/?m=user&op=daily_task&ac=index", "")
    if (JSON.stringify(res).match(/你还未登录/)) {
        return "token和u已失效或填写错误";
    } else {
        //默认填写我的邀请码 
        await task("填写邀请码 05802486","/?m=user&op=activity&ac=use_invite_code","code="+jm(05802486))
        await task("每日签到", "/?m=user&op=check_in&ac=check_in", "")
        await task("签到翻牌", "/?m=user&op=check_in&ac=receive_daily_bonus", "type=2jyfrX4gfTvnrWc+orX+og==")
        await task("作品评论取消点赞", "/?m=comment&op=index&ac=hate_comment", "comment_id=My7xxKY4ZkyoMMJg3T3zww%3D%3D")
        await task("作品评论点赞", "/?m=comment&op=index&ac=love_comment", "comment_id=My7xxKY4ZkyoMMJg3T3zww%3D%3D")
        await task("评论作品", "/?m=comment&op=index&ac=do_comment", "game_id=y822%2Bk8oG37pr8x6YUBAcQ%3D%3D&type=2jyfrX4gfTvnrWc%2BorX%2Bog%3D%3D&content=DFdLvn%2BxRXBsPs8BuHNxzg%3D%3D")
        await task("圈子取消点赞", "/?m=qz&op=topic&ac=praise", "topic_id=b5Xy0BT9w1np7AOUwumsRA%3D%3D")
        await task("圈子点赞", "/?m=qz&op=topic&ac=praise", "topic_id=b5Xy0BT9w1np7AOUwumsRA%3D%3D")
        await task("分享作品", "/?m=share&op=index&ac=game_share", "game_id=y822%2Bk8oG37pr8x6YUBAcQ%3D%3D&op_from=5nXP9qADvw3bmKOnRJA5Xw%3D%3D")
        await task("守护角色礼物", "/?m=game_info&op=role&ac=give_gift", "amount=5nXP9qADvw3bmKOnRJA5Xw%3D%3D&is_own=5nXP9qADvw3bmKOnRJA5Xw%3D%3D&gift_id=Ee6W%2F%2FIRGANKm%2FJI1ZdVqw%3D%3D&gift_num=W%2FWdZKs5lJhcLOK5XBhwXA%3D%3D&comment=&role_id=%2BU8vUwupuwFWbE94QXgYow%3D%3D")
        let qz= await task("圈子回复", "?m=qz&op=topic&ac=add_topic_comment", "topic_id=b5Xy0BT9w1np7AOUwumsRA==&content=IcQo64q0HYOVzUoFR6X0uQ==")
        let cid = qz.data.comment_id
        await task("删除评论","/?m=comment&op=index&ac=del_comment","comment_id="+jm(cid))  
        await renwu()
        await video()
        await task("兑换阅读时长", "/?m=user&op=index&ac=exchange_star", "star=" + jm(20))
        let info = await getinfo()
        return info
    }
}
async function video() {
    for (i = 1; i < 11; i++) {
        await task("点击广告", "/?m=user&op=index&ac=watch_ad_status", "")
        let rres = await task("获取获取时间戳", "/?m=index&op=index&ac=timestamp", "")
        timestamp = rres.data.timestamp
        await task(`第${i}次获取赠币奖励`, "/?m=user&op=index&ac=watch_ad", `timestamp=${jm(rres.data.timestamp)}`)
        await sleep(10000)
    }
}
module.exports = shanyi