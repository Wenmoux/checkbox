rrtoken = $storage.get('rrsp')||""

const header = {

headers: {

token: rrtoken,

'User-Agent':

'Mozilla/5.0 (Linux; Android 10; Redmi K30 Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 App/RRSPApp platform/android AppVersion/4.6.4',

clientVersion: '',

Origin: 'http://mobile.rr.tv',

clientType: 'web'

}

}

let info = {}

let question = []

async function task() {
await getuserinfo(),
await watch(),

await check(),

await signfl(),

await getQuestion(),

await getanswerid(info.questionid)

if (!info.answerstatus) {

if (info.answerid) {

await answerq(info.answerid)

}

await getQuestion()

} else {

info.answerstatus = '已答题'

}

await answerq(info.answerid),

await openbox(

'铜宝箱',

'openboxt',

`boxId=3&token=${rrtoken}`

)

await openbox(

'银宝箱',

'openboxy',

`boxId=2&token=${rrtoken}`
)

await openbox(

'金宝箱',

'openboxgold',

`boxId=1&token=${rrtoken}`
)

await getuserinfo()

let signdata =

info.user +

'\n' +

info.sign +

'\n' +

info.fl +

'\n' +

info.answerstatus +

'\n' +

info.openboxt +

'\n' +

info.openboxy +

'\n' +

info.openboxgold +

'\n今日题目：' +

info.question +

' 答案：' +

info.answer

// console.log(signdata)
// wx(signdata)
console.log(info)
//return('' + signdata)
//server('人人视频签到' + signdata)

}

function check() {

return new Promise(async resolve => {

try {

let url = 'https://api.rr.tv/rrtv-activity/sign/sign'

let res = await axios.get(url, header)


code = res.data.code

if (code == '0000' || code == '8750') {

info.sign = code == '0000' ? '签到成功' : '重复签到'

} else {

info.sign = '签到失败 原因：' + res.data.msg

}

} catch (err) {

info.sign = '签到失败'

console.log(err)

}

resolve()

})

}

function signfl() {

return new Promise(async resolve => {

try {

let url = 'https://api.rr.tv/dailyWelfare/getWelfare'

let res = await axios.get(url, header)

code = res.data.code

if (code == '0000' || code == '8623') {

info.fl = code == '0000' ? '福利领取成功' : '福利重复领取'

} else {

info.fl = '福利领取失败 原因：' + res.data.msg

}

} catch (err) {

info.fl = '领取失败'

console.log(err)

}

resolve()

})

}

function getQuestion(data) {

return new Promise(async resolve => {

try {

let url = 'https://api.rr.tv/v3plus/question/getQuestion'

let res = await axios.get(url, header)

qlist = res.data.data.question.optionViewList

code = res.data.code

info.question = res.data.data.question.questionStr

if (code == '0000') {

info.questionid = res.data.data.question.id

// console.log(res.data.data.question)

info.answerstatus = res.data.data.question.hasAnswered

answer = ''

for (i = 0; i < qlist.length; i++) {

question.push({

id: qlist[i].id,

answer: qlist[i].optionStr

})

}

} else {

info.question = '获取问题失败'

}

} catch (err) {

info.question = '获取问题失败'

console.log(err)

}

resolve()

})

}

function getanswerid(id) {

return new Promise(async resolve => {

try {

let url = 'https://api.rr.tv/v3plus/question/payForAnswer'

let data = `questionId=${id}&type=share`

let res = await axios.post(url, data, header)

code = res.data.code

if (code == '0000') {

let ad = res.data.data.operationId

for (i = 0; i < question.length; i++) {

let reg = question[i].answer

if (!(ad.indexOf(`${reg}`) == -1)) {

info.answerid = question[i].id

info.answer = reg

// console.log(`正确答案为：${reg} id：${info.answerid}`)

}

}

} else {

console.log('获取答案失败')

}

} catch (err) {

info.question = '获取问题失败'

console.log(err)

}

resolve()

})

}

function answerq(id) {

return new Promise(async resolve => {

try {

let url = 'https://api.rr.tv/v3plus/question/answerQuestion'

let data = `optionId=${id}`

let res = await axios.post(url, data, {

headers: {

//p: 'Android',

clientVersion: '',

'user-agent':

'Dalvik/2.1.0 (Linux; U; Android 10; Redmi K30 MIUI/V11.0.9.0.QGHCNXM)',

clientType: 'web',

token: rrtoken

}

})

} catch (err) {

info.answerq = '答题失败'

console.log(err)

}

resolve()

})

}

function openbox(box, b, data) {

return new Promise(async resolve => {

try {

let url = 'https://api.rr.tv/v3plus/taskCenter/openBox'

let res = await axios.post(url, data, {

headers: {

//p: 'Android',

clientVersion: '',

clientType: 'web',

token: rrtoken

}

})

// console.log(res.data)

code = res.data.code

let a = ''

if (code == '0000') {

res.data.data.boxs.map(data => {

console.log(res.data)

a += `${data.rewardName}：${data.rewardNum}`

})

info[b] = box + '：' + a

} else {

info[b] = box + '：' + res.data.msg

}

} catch (err) {

info[b] = box + '开箱失败'

console.log(err)

}

resolve()

})

}

function watch() {

return new Promise(async resolve => {

try {

let url = 'https://api.rr.tv/constant/growthCallback'
data = "growthStr=" + encodeURIComponent('{"growthRecordDtos":[{"userId":'+info.uid+',"clientVersion":"","playDuration":"'+Math.floor(Math.random() * -30 + 10800)+'","clientType":"web","objId":"'+Math.floor(Math.random() * 99 + 153300)+'","type":"season","playTime":"'+Math.round(new Date().getTime()/1000)+'"}]}') + "&token=" + rrtoken
let res = await axios.post(url, data, {

headers: {

clientVersion: '',

clientType: 'web',

token: rrtoken

}

})



} catch (err) {

info.watch = '观看视频失败'

console.log(err)

}

resolve()

})

}




function getuserinfo() {

return new Promise(async resolve => {

try {

let url = 'https://api.rr.tv/user/profile'

let res = await axios.post(url, '', {

headers: {

//p: 'Android',

clientVersion: '',

clientType: 'web',

token: rrtoken

}

})

code = res.data.code

if (code == '0000') {
 info.uid=res.data.data.user.id

info.user = `${res.data.data.user.nickName} || Lv${res.data.data.user.level}(${res.data.data.user.levelStr}) || 银币：${res.data.data.user.silverCount}`

} else {

info.user = `查询失败！ ${res.data.msg}`

}

} catch (err) {

info.user = `查询失败！ `

console.log(err)

}

resolve()

})

}

//task()
module.exports = task

