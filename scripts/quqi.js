const axios = require("axios")
var headers = {cookie:config.quqi.cookie,   referer: "https://quqi.com/"}
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function getdailyTask() {
    return new Promise(async (resolve) => {
        try {
            let res = await axios.get(`https://exp.quqi.com/v1/dailyTask/state?_=1${Date.now()}`, {headers})
            if(res.data.err==0){
            list = res.data.data.filter(x => x.status != 2)
            console.log(`剩余${list.length}任务未完成`)
            resolve(list)
           }
        } catch (err) {
            console.log(err)
        }
        resolve();
    });
}

function getreward(id) {
    return new Promise(async (resolve) => {
        try {
            let res = await axios.get(`https://exp.quqi.com/v1/dailyTask/sendAward/${id}`, {headers})
            console.log("领取奖励：" + res.data.msg)
        } catch (err) {
            console.log(err)
        }
        resolve();
    });
}

function visit(id) {
    return new Promise(async (resolve) => {
        try {
            headers["User-Agent"] = "Mozilla/5.0 (Linux; Android 11; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
            let res = await axios.post(`https://quqi.com/api/dir/ls?quqi_id=${id}`, `quqi_id=${id}&tree_id=1&node_id=0`, {headers})
            let res1 = await axios.post(`https://quqi.com/auth/updateVisit?quqi_id=${id}`, `quqi_id=${id}`, {headers})
            console.log("浏览多人群组：" + res1.data.msg)
            await sleep(500)
             await getreward(14)
        } catch (err) {
            console.log(err)
        }
        resolve();
    });
}

function getquqid() {
    return new Promise(async (resolve) => {
        try {
            let res = await axios.get("https://group.quqi.com/v1/group/list", {headers})
            if (res.data.msg == "success") {
                gplist = res.data.data.filter(x => x.type == 14)
                quqid = gplist.length == 0 ? res.data.data[0].quqi_id : gplist[0].quqi_id
                gtype = gplist.length == 0 ? 1 : 2
                if (gtype == 1) {
                    console.log("🈚️多人群组,请自行创建一个多人群组,或者申请加入https://quqi.avyeld.com/join/company/team.html?jointarget=ed521eef-7ed1-486f-a903-2457ebe5704f")
                    let sqres = await axios.post("https://group.quqi.com/v1/application", "credential=ed521eef-7ed1-486f-a903-2457ebe5704f", {headers})
                    console.log("申请加入多人群组：" + sqres.data.msg)
                }
                resolve({
                    qid: quqid,
                    gtype
                })
            }
        } catch (err) {
            console.log(err)
        }
        resolve();
    });
}

function uploadimg(id) {
    return new Promise(async (resolve) => {
        try {
            let name = `每日签到${Date.now()}`
            headers["User-Agent"] = "Mozilla/5.0 (Linux; Android 11; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
            let res = await axios.post(`https://quqi.com/api/upload/v1/file/init?quqi_id=${id}`, `file_name=${name}.jpg&is_slice=false&md5=507cf982c5db90bc35f9c6c8179c292f&parent_id=0&quqi_id=${id}&sha=4b4afc24113d86d0afd9be21b6841d9c627cdabf01317e3e760308b05f8bdd81&sign=617db783e0ba01343338ee9887dfdb18&size=331665&tree_id=1`, {headers})
            if (res.data.msg == "ok") {
                console.log(`上传图片 ${name} 成功`)
                nid = res.data.data.node_id
                if (nid) await axios.post(`https://quqi.com/api/node/batchDel?quqi_id=${id}`, `quqi_id=${id}&tree_id=1&node_ids=${nid}`, {headers})
                await sleep(500)
                await getreward(15)
            } else console.log("上传失败：" + res.data.msg)
        } catch (err) {
            console.log(err)
        }
        resolve();
    });
}

async function quqi() {
    let quqinfo = ""
    let dailyTaskList = await getdailyTask()
    let qgp = await getquqid()
    if (dailyTaskList) {
        for (task of dailyTaskList) {
            console.log(task.task_decreption)
            if (task.status == 1) await getreward(task.task_type)
            else if (task.task_type == 14 && task.status == 0 && qgp.gtype == 2) await visit(qgp.qid)
            else if (task.task_type == 15 && task.status == 0) await uploadimg(qgp.qid)
        }
    }
    let ires = await axios.get("https://api.quqi.com/vipWallet/v1/vipAndWallet", {headers})
    if (ires.data.msg == "success") quqinfo = `曲奇饼：${ires.data.data.wallet_info.cookie}  曲奇豆：${ires.data.data.wallet_info.bean}`
    else quqinfo = ires.data.msg
    console.log(quqinfo)
    return "【曲奇网盘】："+quqinfo
}

//quqi()
module.exports = quqi