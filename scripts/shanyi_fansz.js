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
const = config.shanyi.gids.split("&")
const gids = [116993]
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
let mds = ""
let yxList = []
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


function randC() {
    let key = ["日常表白作者大大", "爱了爱了", "咪啾", "好玩"]
    let i = Math.floor((Math.random() * key.length))
    return key[i]
}



async function shanyi() {
    let res = await task("获取任务列表", "/?m=user&op=daily_task&ac=index", "")
    if (JSON.stringify(res).match(/你还未登录/)) {
        return "token和u已失效或填写错误";
    } else {
        for (gid of gids) {
            let ginfo = await task("作品详情", "/?m=game_info&op=index&ac=game_detail", "gid=" + jm(gid))
            if (ginfo.status == 0 && ginfo.data) {
                game_name = ginfo.data.game_info.name
                console.log(game_name)
                qzid = ginfo.data.circle_id
                await task("阅读", "/?m=user&op=index&ac=add_user_play_time", "minute=" + jm(120) + "&gid=" + jm(gid))
                for (i = 0; i < 5; i++) {
                    await task(`第${i+1}次分享`, "/?m=share&op=index&ac=game_share", "game_id=" + jm(gid) + "&op_from=5nXP9qADvw3bmKOnRJA5Xw%3D%3D")
                    await sleep(13000)
                }
                await task("评论作品", "/?m=comment&op=index&ac=do_comment", "game_id=" + jm(gid) + "&type=2jyfrX4gfTvnrWc%2BorX%2Bog%3D%3D&content=" + jm(randC()))
                let cres = await task("获取评论列表", "?m=comment&op=index&ac=list", "list_type=W%2FWdZKs5lJhcLOK5XBhwXA%3D%3D&game_id=" + jm(gid) + "&page=2jyfrX4gfTvnrWc%2BorX%2Bog%3D%3D")
                if (cres.status == 0 && cres.data.comment_list) {
                    comment_list = cres.data.comment_list.list || []
                    for (c = 0; c < 6; c++) {
                        if (comment_list[c]) {
                            cid = jm(comment_list[c].id)
                            await task("作品评论点赞", "/?m=comment&op=index&ac=love_comment", "comment_id=" + cid)
                            await task("作品评论回复", "/?m=reply&op=index&ac=do_reply", "comment_id=" + cid + "&content=" + jm(randC))
                        }
                    }
                }
                if (qzid) {
                    let qres = await task("获取圈子评论列表", "/?m=qz&op=circle&ac=topic_list", "page=2jyfrX4gfTvnrWc+orX+og==&type=2jyfrX4gfTvnrWc+orX+og==&limit=W/WdZKs5lJhcLOK5XBhwXA==&circle_id=" + jm(qzid))
                    if (qres.status == 0 && qres.data && qres.data.list) {
                        let qzlist = qres.data.list || []
                        for (q = 0; q < 7; q++) {
                            if (qzlist[q]) {
                                qid = qzlist[q].id
                                await task("圈子点赞", "/?m=qz&op=topic&ac=praise", "topic_id=" + jm(qid))
                                await task("圈子回复", "?m=qz&op=topic&ac=add_topic_comment", "topic_id=" + jm(qid) + "&content=" + jm(randC()))
                            }

                        }
                    }
                } else console.log("该作品还没有开通圈子哦")
            }
        }
    }
}
module.exports = shanyi