const task=require("./syapi").task
const jm=require("./syapi").jm
function ling(name,type, taskid) {
    task(name + " 奖励领取：", "/?m=user&op=daily_task&ac=receive_task_limit_bonus", `task_id=${taskid}&type=${type}`)
}
//gettasklist
async function renwu() {
    let dataa = await task("获取任务列表", "/?m=user&op=daily_task&ac=index", "")
    await task("领取等级福利","/?m=user&op=level&ac=privilege_receive","level="+jm(dataa.data.level_info.level))
       for (id of dataa.data.daily_task_list) {
        await ling(id.task_name, jm(2),jm(id.task_id))
    }
        for (id of dataa.data.task_limit_time_list) {
        await ling(id.title +" "+id.game_id, jm(1),jm(id.task_id))
    }    
        for (id of dataa.data.hy_bonus_daily_list) {      
        await task("活跃度宝箱 "+id.hy_val,"?m=user&op=daily_task&ac=receive_hy_bonus","package_id="+jm(id.package_id))
      }
    
    
}
async function getinfo() {
    let dataa = await task("获取任务列表", "/?m=user&op=daily_task&ac=index", "")
    info = `【闪艺app每日任务】：${dataa.data.nickname}|| Lv${dataa.data.level_info.level} 经验值 ${dataa.data.level_info.current_empirical} / ${dataa.data.level_info.next_empirical}\n任务完成情况：`
      for (id of dataa.data.daily_task_list) {
        status = id.status == 3 ? "已领取" : "未领取"
        info += id.task_name + " ：" + status + " || "
    }
    console.log(info)
    return info
}
async function shanyi() {

    let res = await task("获取任务列表", "/?m=user&op=daily_task&ac=index", "")
    if (JSON.stringify(res).match(/你还未登录/)) {
        return "token和u已失效或填写错误";
    } else {
            //默认填写我的邀请码 
    await task("填写邀请码 05802486","/?m=user&op=activity&ac=use_invite_code","code="+jm(05802486))
        await task("阅读", "/?m=user&op=index&ac=add_user_play_time", "minute=W%2FWdZKs5lJhcLOK5XBhwXA%3D&gid=y822%2Bk8oG37pr8x6YUBAcQ%3D%3D")
        await task("每日签到", "/?m=user&op=check_in&ac=check_in", "")
        await task("签到翻牌", "/?m=user&op=check_in&ac=receive_daily_bonus", "type=2jyfrX4gfTvnrWc+orX+og==")
        await task("作品评论取消点赞", "/?m=comment&op=index&ac=hate_comment", "comment_id=My7xxKY4ZkyoMMJg3T3zww%3D%3D")
        await task("作品评论点赞", "/?m=comment&op=index&ac=love_comment", "comment_id=My7xxKY4ZkyoMMJg3T3zww%3D%3D")
        await task("评论作品", "/?m=comment&op=index&ac=do_comment", "game_id=y822%2Bk8oG37pr8x6YUBAcQ%3D%3D&type=2jyfrX4gfTvnrWc%2BorX%2Bog%3D%3D&content=DFdLvn%2BxRXBsPs8BuHNxzg%3D%3D")
        await task("圈子取消点赞", "/?m=qz&op=topic&ac=praise", "topic_id=b5Xy0BT9w1np7AOUwumsRA%3D%3D")
        await task("圈子点赞", "/?m=qz&op=topic&ac=praise", "topic_id=b5Xy0BT9w1np7AOUwumsRA%3D%3D")
        await task("分享作品", "/?m=share&op=index&ac=game_share", "game_id=y822%2Bk8oG37pr8x6YUBAcQ%3D%3D&op_from=5nXP9qADvw3bmKOnRJA5Xw%3D%3D")
        await task("守护角色礼物", "/?m=game_info&op=role&ac=give_gift", "amount=5nXP9qADvw3bmKOnRJA5Xw%3D%3D&is_own=5nXP9qADvw3bmKOnRJA5Xw%3D%3D&gift_id=Ee6W%2F%2FIRGANKm%2FJI1ZdVqw%3D%3D&gift_num=W%2FWdZKs5lJhcLOK5XBhwXA%3D%3D&comment=&role_id=%2BU8vUwupuwFWbE94QXgYow%3D%3D")
        await task("圈子回复", "?m=qz&op=topic&ac=add_topic_comment", "topic_id=b5Xy0BT9w1np7AOUwumsRA==&content=IcQo64q0HYOVzUoFR6X0uQ==")
        await renwu()        
        await video()
        await task("兑换阅读时长","/?m=user&op=index&ac=exchange_star","star="+jm(10))
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