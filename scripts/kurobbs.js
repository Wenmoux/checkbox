const axios = require("axios")

let token = config.kurobbs.token
let userId = JSON.parse(base64Decode(token.split(".")[1])).userId
let devCode = config.kurobbs.devCode

function sleep(n) {
    let start = new Date().getTime()
    while (true) {
        if (new Date().getTime() - start > n) {
            break
        }
    }
}

function base64Decode(data) {
    return Buffer.from(data, 'base64').toString('utf-8')
}

async function post(option) {
    return await axios({
        url: `https://api.kurobbs.com/${option.url}`,
        method: "post",
        params: option.data,
        headers: {
            osVersion: "Android",
            devCode: devCode,
            countryCode: "CN",
            ip: "",
            model: "Mi 13",
            source: "android",
            lang: "zh-Hans",
            version: "1.0.5",
            versionCode: 1050,
            token: token,
            "User-Agent": "okhttp/3.10.0"
        }
    }).then(res => {
        return res.data
    })
}

//帖子列表
async function bbsList() {
    return await post({
        url: "forum/list",
        data: {
            forumId: 10,
            gameId: 3,
            pageIndex: 1,
            pageSize: 20,
            searchType: 1,
            timeType: 0
        }
    })
}

//社区签到
async function bbsSign() {
    return await post({
        url: "user/signIn",
        data: {
            gameId: 3
        }
    })
}

//分享
async function share() {
    return await post({
        url: "encourage/level/shareTask",
        data: {
            gameId: 3
        }
    })
}

//点赞 type 1是点赞，2是取消点赞
async function like(type, bbs) {
    return await post({
        url: "forum/like",
        data: {
            forumId: bbs.gameForumId,
            gameId: 3,
            likeType: 1,
            operateType: type,
            postCommentId: 0,
            postCommentReplyId: 0,
            postId: bbs.postId,
            postType: bbs.postType,
            toUserId: bbs.userId
        }
    })
}

//浏览帖子
async function getBbs(bbs) {
    return post({
        url: "forum/getPostDetail",
        data: {
            isOnlyPublisher: 0,
            postId: bbs.postId,
            showOrderType: 2
        }
    })
}

//任务列表
async function task() {
    return post({
        url: "encourage/level/getTaskProcess",
        data: {
            gameId: 0,
            userId: userId
        }
    })
}

async function main() {
    let result = "【库街区】："
    await bbsSign()
    let bbslist = await bbsList()
    for (let i = 1; i <= 5; i++) {
        let random = Math.floor(Math.random() * 20)
        let bbs = bbslist.data.postList[random]
        await like(1, bbs)
        await like(2, bbs)
    }
    await share()
    for (let j = 3; j <= 3; j++) {
        let random = Math.floor(Math.random() * 20)
        let bbs = bbslist.data.postList[random]
        await getBbs(bbs)
        sleep(3000)
    }
    let taskList = await task()
    for (let i of taskList.data.dailyTask) {
        let taskName = i.remark
        let status = i.completeTimes === i.needActionTimes ? "已完成" : "未完成"
        result += `${taskName}：${status}  `
    }
    console.log(result)
    return result
}

module.exports = main