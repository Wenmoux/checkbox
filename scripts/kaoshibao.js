const axios = require('axios')
const md5 = require('crypto-js').MD5
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function KsGet(url, method = "get", data = null) {
    return new Promise(async (resolve) => {
        try {
            const headers = {
                'client-identifier': config.kaoshibao.clientid,
                authorization: config.kaoshibao.authorization
            }
            timestamp = new Date().getTime().toString()
            headers.sign = md5("12b6bb84e093532fb72b4d65fec3f00b" + config.kaoshibao.clientid + url + timestamp + '12b6bb84e093532fb72b4d65fec3f00b').toString()
            headers.timestamp = timestamp
            let res = await axios({
                method,
                url: "https://api.yisouti.com" + url,
                data,
                headers
            });
            // console.log(res)
            if (res.data.msg) console.log("    " + res.data.msg)
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


//KsGet("请求链接后面那一坨 /user开始","请求方式 get就不用填了 其它的再填 如post","请求数据 同理 get的不用填")


async function task() {
    idss = [];ans = null;pid = 876501;Info = "";
    let signres = await KsGet("/user/PointCenter/sign") //签到 写别的也这样
    if (signres && signres.code == 200) Info = `签到成功,获得${signres.data.point}积分，连签 ${signres.data.continue_days}天`
    else Info = signres.msg
    let task = await KsGet("/user/PointCenter/home") //获取任务列表  
    if (task) {
        taskList = ((task && task.code == 200) ? task.data.tasks : []).filter(x => x.task_id == 10004 || x.task_id == 10010)
    }
    for (task of taskList) {
        console.log("任务：" + task.title)
        if (task.status == 1) {
            if (task.task_id == 10004) {
                let ids = await KsGet("/questions/fetch", "post", {
                    "paperid": "876501"
                })
                //获取题目id
                if (ids && ids.code == 200) idss = ids.data.rows
                console.log(`共获取到 ${idss.length}道题目`)
                for (i = 0; i < 201; i) {
                    var n = Math.floor(Math.random() * idss.length + 1) - 1;
                    //   console.log(`抽取题目中： ${idss[n]}\n去查询答案`)
                    let answer = await KsGet("/questions/ids", "post", {
                        "ids": `[${idss[n]}]`
                    })
                    if (answer.code == 200) {
                        ans = answer.data[0].answer
                        //console.log(`Q：${answer.data[0].question}\nA：${answer.data[0].analysis}`)
                    }
                    if (ans) {
                        let r = await KsGet("/questions/reportResult", "post", {
                            "result": "1",
                            "answer": `${ans}`,
                            "use_time": "1181",
                            "question_id": idss[n],
                            "paperid": pid
                        })
                        if (r.code == 200) console.log(`答题进度 ${i++}/200`)

                    }
                }
                await getprize(task.id, task.point)
            } else await KsGet("/user/PointCenter/taskCallback", "post", {
                "event": "view_video"
            }) //激励视频
            await getprize(task.id, task.point)
        } else {
            await getprize(task.id, task.point)
        } //领取奖励
        await sleep(2000)
        await getprize(task.id, task.point)
    }
    async function getprize(id, point) {
        let res = await KsGet("/user/PointCenter/getTaskReward", "post", {
            "id": id,
            "point": point
        })
        if (res.code == 200) console.log(`领取成功！！获得${res.data.point}积分`)
    }
    //查询 
    let baseInfo = await KsGet("/user/pointCenter/getBase")
    if (baseInfo && baseInfo.code == 200) {
        sign = baseInfo.data.is_signed == 1 ? "已签" : "未签"
        Info = `今日${sign} ，连签${baseInfo.data.continue_days}，总积分 ${baseInfo.data.user_point} `
    }
    return "【考试宝】：" + Info
}
module.exports = task;