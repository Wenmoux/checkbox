const axios = require('axios')
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const mdconfig = {
  "username": config.mediportal.username ,
  "password": config.mediportal.password,
  "api_base_url": "https://api.mediportal.com.cn",
  "request_headers": {
    "User-Agent": "MedicalCircle/3.6.0/031/ios/iPhone14,5/16.2",
  }
}

let token = null
let uid = null

async function get(op, method = "get", data = null) {
  try {
    const headers = {
      ...mdconfig.request_headers,
      "access-token": token
    }
    const url = `${mdconfig.api_base_url}${op}`
    const options = { method, url, data, headers }
    const res = await axios(options)
    return res.data
  } catch (err) {
    console.log(err);
    return { resultMsg: "接口请求出错" }
  }
}

async function login() {
  const loginOp = `/health/user/login?model=ios&password=${mdconfig.password}&telephone=${mdconfig.username}&userType=3`
  const loginRes = await get(loginOp)
  if (loginRes.resultCode === 1) {
    console.log(`欢迎回来～${loginRes.data.name}`)
    token = loginRes.data.access_token
    uid = loginRes.data.user.userId
  } else {
    console.log(loginRes.resultMsg)
  }
  return token
}

async function getLatestQuestionId() {
  const contentOp = "/faq/question/list"
  const data = "columnId=63c67583db1136000b2b1cbc&pageIndex=0&pageSize=20"
  const contentRes = await get(contentOp, "post", data)
  if (contentRes.resultCode === 1) {
    return contentRes.data.pageData[0].id
  } else {
    return "0"
  }
}

async function signVideos() {
  let videoList = []
  const videoOp = "/faq/question/activitySignVideo"
  const videoRes = await get(videoOp)
  if (videoRes.resultCode === 1 && videoRes.data) {
    videoList = videoRes.data.filter(x => x.status !== 2)
  }
  console.log(`剩余打卡视频 ${videoList.length}`)
  for (let video of videoList) {
    const qid = video.id
    const qres = await get(`/integral-lottery/integral/signQuestion?questionId=${qid}`)
    console.log(JSON.stringify(qres))
    if (qres && qres.data.reason && qres.data.data.reason.match(/今日已打卡30个帖子/)) break
    await sleep(6000)
  }
}

async function getTasks() {
  let taskList = []
  const taskOp = "/integral-lottery/integral/queryTask"
  const taskRes = await get(taskOp)
  if (taskRes.resultCode === 1 && taskRes.data) {
    taskList = taskRes.data.everydayTask.taskList.filter(x => x.status !== 2)
  } else {
    console.log(taskRes.resultMsg)
  }
  return taskList
}

async function claimPrize(taskId) {
  const claimRes = await get(`/integral-lottery/integral/getTaskIntegral/${taskId}`)
  if (claimRes.resultCode === 1) {
    console.log(`领取成功！获得${claimRes.data.taskIntegral}积分`)
  } else {
    console.log(claimRes.resultMsg)
  }
}

async function doTask(task) {
  if (task.taskName === "点赞内容") {
    await get("/faq/like/like", "post", `id=${await getLatestQuestionId()}&type=1`)
  }
  if (task.taskName === "每日答题") {
    const question = await get("/integral-lottery/integral/getQuestionInfo")
    if (question.resultCode === 1) {
      const qseq = question.data.seq
      const seqs = question.data.options.filter(x => x.ifRight === 1)
      console.log(`Q：${question.data.name}\nA：${seqs[0].name}  ${seqs[0].seq}`)
      await get("/integral-lottery/integral/submitAnswer", "post", { optionSeq: qseq, queSeq: seqs[0].seq })
    } else {
      console.log('获取问题失败：' + question.resultMsg)
    }
  }
  if (task.taskName == "转发1篇内容") {
    await get(`/faq/question/share/v2/${await getLatestQuestionId()}`)
  }
  if (task.taskName == "阅读内容") {
    await get("/faq/action/read", "post", {
      bizType: "home-recommend",
      questionId: await getLatestQuestionId(),
    })
  }
  if (task.taskName === "推荐阅读") {
    await get("/recommend-read/app/listReadings", "post", {
      columnId: "1",
      pageSize: 10,
      pageIndex: 1,
      viewUserId: uid,
    })
  }
}
async function sign() {
  const token = await login()
  if (token) {
    await signVideos()
    const signRes = await get("/integral-lottery/integral/sign")
if (signRes.resultCode === 1) {
      console.log(`签到成功！获得 ${signRes.data.integral} 积分，连签 ${signRes.data.continueSign} 天`)
    } else {
      console.log("签到：" + signRes.resultMsg)
    }
    const tasks = await getTasks()
    for (let task of tasks) {
      console.log("任务：" + task.taskName)
      if (task.status == 1) {
        await claimPrize(task.id)
      } else {
        await doTask(task)
        await sleep(2000)
        await claimPrize(task.id)
      }
    }
    const xcRes = await get("/integral-lottery/integral/getCurrentIntegral")
    if(xcRes.resultCode === 1) {
      jfmsg = `【医生圈】：当前总积分：${xcRes.data.currentIntegral}`
      console.log(jfmsg)
      return jfmsg
    }
  }
}
/*async function main() {
  try {
    await sign()
  } catch (error) {
    console.log(error)
  }
}
*/
module.exports=sign