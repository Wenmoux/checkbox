//17k小说签到 app/网页cookie通用
const axios = require("axios");
const y7kck = config.y7k.cookie
function get(url, method = "get", data = null) {
    return new Promise(async (resolve) => {
        try {
            let headers = { "cookie" : y7kck }
            if (method == "get") res = await axios.get(url, {
                headers
            });
            if (method == "post") res = await axios.post(url, data, {
                headers
            });
            resolve(res.data)
        } catch (err) {
            console.log(err);
            resolve("签到接口请求出错")
        }
        resolve();
    });
}

async function y7k() {
    my = "";signResult1 ="";signResult2 ="";
//网页签到
    let res1 = await get("https://h5.17k.com/userSigninH5/saveUserSigninH5.html", "post", "0")
    signResult1 = res1.msg
    
//app任务 阅读30min
   let res2 =await get("http://api.17k.com/user/task/receive-prize","post","taskId=5&cpsOpid=0&_filterData=1&device_id=32536325221b1ba1&channel=0&_versions=1110&merchant=17Kyyb&platform=2&manufacturer=Xiaomi&clientType=1&appKey=4037465544&model=Redmi%20K30&cpsSource=0&brand=Redmi")
   console.log(res2.status.msg) 
  
//app签到
    let signInfo = await get("http://api.17k.com/sign/user/info?access_token=1&clientType=1&cpsOpid=0&_filterData=1&channel=0&_versions=1070&merchant=17Kyyb&appKey=4037465544&cpsSource=0&platform=2")
    signResult2 =(signInfo.status.code == 0)?"签到成功":signInfo.status.msg

//查询
    let info = await get("http://api.17k.com/user/mine/merge?access_token=1&accountInfo=1&bindInfo=1&benefitsType=1&cpsOpid=0&_filterData=1&device_id=&channel=0&_versions=1230&merchant=17Khwyysd&platform=2&manufacturer=Xiaomi&clientType=1&width=1080&appKey=4037465544&cpsSource=0&youthModel=0&height=2175")
    if (info.status.code == 0 && info.data) {
        data = info.data
        my = `昵称：${data.nickname}\nK币：${data.accountInfo.balance}\nVIP：Lv${data.vipLevel}\n代金券：${data.accountInfo.totalBalance}\n推荐票：${data.cardInfo.recommendTicketCount}\napp签到：${signResult2}\nweb签到：${signResult1}`
    } else my = info.status.msg
    console.log(my)
    return my
}

//y7k()
module.exports = y7k;