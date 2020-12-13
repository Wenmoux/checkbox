const w2ck = require("../config.json").w2pj.cookie
let w2result = ""
const axios = require("axios")
function w2sign() {
    return new Promise(async (resolve) => {
            try {
                let url = `https://www.52pojie.cn/home.php?mod=task&do=apply&id=2`
                let res = await axios.get(url, {
                        headers: {
                            "cookie": w2ck               
                    },
                    responseType: 'arraybuffer'
             }   )
            const data = require("iconv-lite").decode(res.data, 'gb2312')
            if (data.match(/您需要先登录才能继续本操作/)) {
              w2result ="⚠️⚠️签到失败,cookie失效⚠️⚠️"                
            } else if (data.match(/已申请过此任务/)) {
                w2result="今日已签☑️"
            } else if (data.match(/恭喜/)) {
              w2result+="签到成功✅"
             
            } else {             
              w2result="签到失败,原因未知❗️"               
            }
         console.log(w2result)
        } catch (err) {
            console.log(err);
        }
        resolve();
    });
}
async function task() {
    await w2sign()
    //return w2result
}

//task()
module.exports = task