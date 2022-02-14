const axios = require("axios")
const url1 = "https://rt.huashi6.com"
const url2 = "https://app.huashi6.com/app"

function get(url, method = "get", data = null) {
    return new Promise(async (resolve) => {
        try {
            let headers = { "cookie": config.huashi6.cookie    }
            if (method == "get") res = await axios.get(url, {
                headers
            });
            headers ["content-type"] = "application/json;charset=utf-8"
            if (method == "post") res = await axios.post(url, data, {
                headers
            });
            resolve(res.data)
        } catch (err) {
            console.log(err);
            resolve({msg:"签到接口请求出错"})
        }
        resolve();
    });
}

async function task() {
    let taskres = await get(`${url1}/front/growthTask/user/list`, "post")
    if (taskres.success) {
        taskList = ((taskres && taskres.data && taskres.data.daily) ?? []).filter(x => !x.finish)
        if (taskList) {
            for (t of taskList) {
                console.log("去做任务："+t.name)
                if (t.id == 4) await get(`${url2}/growthTask/share`, "post") //分享
                else if (task.id == 23) { //点赞
                    await get(`${url2}/like/like`, "post", {
                        "like": false,
                        "requestId": "",
                        "objectId": 638,
                        "objectType": 80
                    })
                    await get(`${url2}/like/like`, "post", {
                        "like": true,
                        "requestId": "",
                        "objectId": 638,
                        "objectType": 80
                    })
                } else if (t.id == 9) {await get(`${url2}/comment/add`,"post", {
                    "resourceId": 955042,
                    "requestId": "",
                    "content": "🤤🤤",
                    "resourceType": 1
                })} else if (t.id == 19){await get(`${url2}/user/currentUser`,"post", {
                    "requestId": ""
                }) }//评论
                
            }            
        }
        console.log("\n\n")
        //签到
        let signres = await get(`${url1}/app/user/signin`, "post")
        signInfo =""
        if (signres.success) signInfo=`签到：连签${signres.data.continueCount}天\n`  
      //查询  
      let [coinInfo,levelInfo] = await Promise.all([
        get(`${url2}/user/coinAccount`, "post",{"requestId":""}),
        get(`${url2}/user/levelInfo`,"post", {"requestId":""})
    ]);
   let coin = coinInfo&&coinInfo.data&&coinInfo.data.currentCoinCount
   let level = levelInfo.data.levelInfo.fullLevelName  
  msg = signInfo+ "cc币："+coin+"\n"+"等级："+level+"\n"+  `升级进度：${levelInfo.data.currentExp}/${levelInfo.data.nextLevelExp}`
    } else msg = taskres.msg
    return "【触站】：\n"+msg
}
module.exports = task