const axios = require("axios")
let result ="【香蕉视频每日任务】："
let headers ={cookie:`xxx_api_auth=${config.xjvideo.xxx_api_auth}`}
function get(name, url, data) {
    return new Promise(async (resolve, reject) => {
        url = config.xjvideo.baseurl+ url
        data = data ? data : null
        if (data) {
            res = axios.post(url, data, {headers})
        } else {
            res = axios.get(url, {headers})
        }
        res
            .then(response => {
                if (response.data.retcode == 0) {
                    console.log(`${name}：成功`)
                    msg=name+"：成功  "
                } else {
                    msg=name + "：" + response.data.errmsg+" || "
                }
                console.log(msg)
                result += (name=="每日签到"?msg:"  ")
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


async function xjtask(){
await get("每日签到", "/ucp/task/sign")
await get("点击视频广告","/ucp/task/adviewClick")
await get("发表评论", "/comment/post", "vodid=51134&parentid=0&content=yyds")
let res = await get("获取视频列表","/vod/listing--0-0-1-0-0-0-0-0-1")
let list = res.data.vodrows
 for (i=0;i<list.length;i++) 
   {
      let vodid=list[i].vodid
      console.log("视频："+vodid)
      get("播放视频",`/vod/reqplay/${vodid}`)     
      await get("取消收藏",`/favorite/remove`,`vodid=${vodid}`)
      let data =await get("收藏",`/favorite/add`,`vodid=${vodid}`)
      if(JSON.stringify(data).match(/登录后/)){
      result+="auth已失效"
      i=100
      }
     }
let infores = await get("查询", "/ucp/task/index")
let user = infores.data.user
let info = user?`${user.nickname} || 金币：${user.goldcoin} || 会员：${user.gicon} || 尊享VIP到期时间：${user.dueday} || 邀请码：${user.uniqkey}`:infores.errmsg
result += info
console.log(info)
return result
}

module.exports=xjtask