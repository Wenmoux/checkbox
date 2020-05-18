//参考 @chavyleung

token = $prefs.get('rrsptoken')

//打开安卓端 人人视频 抓包

const header = {

  headers: {

    token: token,

    'User-Agent':

      'Mozilla/5.0 (Linux; Android 10; Redmi K30 Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.117 Mobile Safari/537.36 App/RRSPApp platform/android AppVersion/4.6.4',

    clientVersion: '3.6.0',

    Origin: 'http://mobile.rr.tv',

    clientType: 'web'

  }

}

let info = {}

let question = []

async function task() {

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

      'simpleBody=EWx4vvTAW8ZCihg%2FChjY3kcO7pEq%2F%2FB2lVZ2PlZDs49euKJwQDBjFwPZxXijDWeCtOP6sp7P0imm%0AzuVBNMp98Dd8yZukN%2Bk4gBM%2BDweGl1A%3D&'

    )

  await openbox(

    '银宝箱',

    'openboxy',

    'simpleBody=AxwAI1bd%2BQwgH7ECsba3dkWKjeqJUhySRqb%2FJ0%2FJWDKOstLY7FBMG13WwLBLSqvYsF1iTr%2FbHvn0%0ARlQvYLYgGNnp9W3Nu01zz5qcB4Jwdrk%3D&'

  )

  await openbox(

    '金宝箱',

    'openboxgold',

    'simpleBody=ihyBuIbys32H4e2HieqtHN0B%2BzqlFbD2aBgyhiNSKD5CvFj9aswRPdQmuwOxVEs7x4C2J%2FT9WPeV%0AK%2BzXXh5pYHeumwD97%2FbMxG1sCz4tHh4%3D&'

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

    '  答案：' +

    info.answer

  //  console.log(signdata)

  // wx(signdata)

  console.log(info)

  //notice('人人视频签到：\n' + signdata)

  //server('人人视频签到' + signdata)

}

function check() {

  return new Promise(async resolve => {

    try {

      let url = 'https://api.rr.tv/rrtv-activity/sign/sign'

      let res = await $http.get(url, header)

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

      let res = await $http.get(url, header)

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

      let res = await $http.get(url, header)

      qlist = res.data.data.question.optionViewList

      code = res.data.code

      info.question = res.data.data.question.questionStr

      if (code == '0000') {

        info.questionid = res.data.data.question.id

        //  console.log(res.data.data.question)

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

      let res = await $http.post(url, data, header)

      code = res.data.code

      if (code == '0000') {

        let ad = res.data.data.operationId

        for (i = 0; i < question.length; i++) {

          let reg = question[i].answer

          if (!(ad.indexOf(`${reg}`) == -1)) {

            info.answerid = question[i].id

            info.answer = reg

            //     console.log(`正确答案为：${reg} id：${info.answerid}`)

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

      let res = await $http.post(url, data, {

        headers: {

          p: 'Android',

          clientVersion: '4.6.4',

          'user-agent':

            'Dalvik/2.1.0 (Linux; U; Android 10; Redmi K30 MIUI/V11.0.9.0.QGHCNXM)',

          clientType: 'android_XiaoMi',

          token: token

        }

      })

    } catch (err) {

      info.answerq = '答题失败失败'

      console.log(err)

    }

    resolve()

  })

}

function openbox(box, b, data) {

  return new Promise(async resolve => {

    try {

      let url = 'https://api.rr.tv/v3plus/taskCenter/openBox'

      let res = await $http.post(url, data, {

        headers: {

          p: 'Android',

          clientVersion: '4.6.4',

          clientType: 'android_XiaoMi',

          token: token

        }

      })

      //    console.log(res.data)

      code = res.data.code

      let a = ''

      if (code == '0000') {

        res.data.data.boxs.map(data => {

          console.log(res.data)

          a += `${data.rewardName}：${data.rewardNum}\n`

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

function getuserinfo() {

  return new Promise(async resolve => {

    try {

      let url = 'https://api.rr.tv/user/profile'

      let res = await $http.post(url, '', {

        headers: {

          p: 'Android',

          clientVersion: '4.6.4',

          clientType: 'android_XiaoMi',

          token: token

        }

      })

      code = res.data.code

      if (code == '0000') {

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

task()
