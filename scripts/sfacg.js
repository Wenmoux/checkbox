//sf轻小说app每日签到以及每日任务(除了分享)
let result = "【SF轻小说】：";
const headers = {
    headers: {
        "user-agent": config.sfacg.ua,
        authorization: config.sfacg.authorization,
        "content-type": "application/json; charset=UTF-8",
        cookie: config.sfacg.cookie
    },
};
//上面的user-agent authorization sfsecurity 建议自行替换成自己的


//任务列表
const axios = require("axios");
dailytasklist = [];
//查询任务
function getask() {
    return new Promise(async (resolve) => {
        try {
            let res = await axios.get(
                `https://api.sfacg.com/user/tasks?taskCategory=1&page=0&size=20`,
                headers
            );
            k = 0;
            //result = "";
            for (i of res.data.data) {
                result += `${i.name}：${i.tips2}  ||  `;
                dailytasklist.push({
                    name: i.name,
                    id: i.taskId,
                    status: i.status + "  " + i.tips2,
                    desc: i.desc,
                    taskReward: i.tips1,
                });
            }
        } catch (err) {
            console.log(err.response.data);
        }
        resolve();
    });
}

//领取任务
function taskl(id) {
    return new Promise(async (resolve) => {
        try {
            let resl = await axios.post(
                `https://api.sfacg.com/user/tasks/${id}`,
                "",
                headers
            );
            console.log(resl.data);
            if (resl.data.status.httpCode == 201) {
                console.log("领取成功\n");
            } else {
                console.log(resl.data);
            }
        } catch (err) {
            console.log(err.response.data.status.msg + "\n");
        }
        resolve();
    });
}

//阅读时长

function reading(time) {
    return new Promise(async (resolve) => {
        try {
            const url = "https://api.sfacg.com/user/readingtime";
            const data = `{"entityType":2,"readingDate":"${getNowFormatDate()}","seconds":${time}}`;
            console.log(data);
            let res = await axios.put(url, data, headers);
            if (res.data.status.httpCode == 200) {
                console.log("刷阅读时长成功\n");
            } else {
                console.log(res.data);
            }
        } catch (err) {
            // console.log(err)
            console.log("刷阅读时长失败,请重新填写cookie\n");
        }
        resolve();
    });
}

//领取奖励
function rewardl(id) {
    return new Promise(async (resolve) => {
        try {
            let resl = await axios.put(
                `https://api.sfacg.com/user/tasks/${id}`,
                "",
                headers
            );
            console.log(resl.data);
        } catch (err) {
            console.log(err.response.data.status.msg + "\n");
        }
        resolve();
    });
}

//签到
function Sign(id) {
    return new Promise(async (resolve) => {
        try { // 新版APP签到改用newsignInfo了
            let date = formatDate(new Date());
            let body = { signDate: date };

            var res = null;

            try {//修复响应代码非200会中断后续代码的BUG
                res = await axios.put(
                    'https://api.sfacg.com/user/newSignInfo',
                    JSON.stringify(body),
                    headers
                )
            } catch (error) {
                res = error.response
            }

            if (res.data.status.httpCode == 200) {
                msg = "签到成功 || " + `获得${res.data.data.num}代卷`;
            } else {
                msg = "签到失败 || " + res.data.status.msg;
            }
            result += msg;
            console.log(msg);

            // money = requests.get('https://api.sfacg.com/user/money',headers = headers).json()
        } catch (err) {
            result += "签到失败" + err.response.data + " || ";
            console.log(err.response.data);
        }
        resolve();
        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份需要加1，且保证两位数
            const day = String(date.getDate()).padStart(2, '0'); // 日期保证两位数
            return `${year}-${month}-${day}`;
        }
    });
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//查询金币
function info(id) {
    return new Promise(async (resolve) => {
        try {
            let res = await axios.get(
                "https://api.sfacg.com/user/welfare/income",
                headers
            );
            var coin = res.data.data.coinRemain

            res = await axios.get(
                "https://api.sfacg.com/user?",
                headers
            );

            var usename = res.data.data.nickName

            res = await axios.get(
                "https://api.sfacg.com/user/money",
                headers
            );
            var huojuan = res.data.data.fireMoneyRemain
            var daijuan = res.data.data.couponsRemain

            msg = `\n 用户: ${usename} \n 火卷: ${huojuan} \n代卷: ${daijuan} \n金币: ${coin}`;

            result += msg;
            console.log(msg);
        } catch (err) {
            result += "查询失败⚠️⚠️⚠️" + err.response.data.status.msg;
        }
        resolve();
    });
}
async function task() {
    await info();
    await Sign();
    await getask();
    for (i of dailytasklist) {
        console.log("领取" + i.name + "任务中~");
        await taskl(i.id);
    }
    await reading(9000);
    for (i of dailytasklist) {
        console.log("领取" + i.name + "任务奖励中~");
        await rewardl(i.id);
    }
    dailytasklist = [];
    await getask();
    console.log(dailytasklist);
    await info();
    return result;
}

//task()
module.exports = task;
