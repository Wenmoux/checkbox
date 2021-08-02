const axios = require("axios")
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 11; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
    referer: "http://www.100bt.com/",
    "Host": "service.100bt.com",
    cookie:  config.aoqi.cookie
}

function get(api, data) {
    return new Promise(async (resolve) => {
        try {
            let url = `http://service.100bt.com/creditmall/${api}.jsonp?${data}&_=${Date.now()}`
            let res = await axios.get(url, {
                headers
            })
            console.log(res.data.jsonResult.message)
            resolve(res.data.jsonResult)
        } catch (err) {
            console.log(err)
        }
        resolve();
    });
}



function getSsort(arr){for(var j=0;j<arr.length-1;j++){for(var i=0;i<arr.length-1-j;i++){if(Number(arr[i].score)<Number(arr[i+1].score)){var temp=arr[i];arr[i]=arr[i+1];arr[i+1]=temp}}}return arr};
async function aoqi() {
    let info = ""
    let taskList = []
    let res = await get("activity/daily_task_list", "gameId=2")
    if (res.code == 0 && res.data) {
        let b = res.data.filter(x => x.status == 1).length
        if (b == 5) console.log("今日已完成5任务")
        else taskList = await getSsort(res.data.filter(x => x.status != 1))
        for (task of taskList) {
            await get("activity/do_task", `taskId=${task.taskID}&gameId=${task.gameID}`)
            await sleep(1200)
        }
        let infores = await get("my/user_info")
       info = `积分：${infores.data.credit}  已累计签到：${infores.data.signInTotal}天`

    } else {
       info = res.message
    }
    console.log(info)
    return "【奥拉星】："+info
}
//aoqi()
module.exports = aoqi