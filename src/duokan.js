ids = []
const {
    promisify
} = require('util');
const axios=require("axios")
const timeAsync = promisify(setTimeout)
result = ""
header = {
    headers: {
        'cookie':  "device_id=wenmoux666666;666666;"
    }}
device = header.headers.cookie.match(/device_id=(.+?);/)
did = device?device[1]: ""
timeout = 1000 // 时间间隔 默认1s  自行修改 n*1000 app内任务一般30s一次
function getc() {
    t = parseInt(new Date().getTime()/1000)
    list = (did+"&"+t).split("")
    for (c = 0, i = 0; i < list.length; i++) {
        c = (c * 131 + list[i].charCodeAt()) % 65536
    }
    a = `_t=${t}&_c=${c}`
    // console.log(a)
    return(a)
}
//大转盘
function drawing() {
    return new Promise(async resolve => {
        try {
            for (m = 0; m < 3; m++) {
                let urld = `https://www.duokan.com/store/v0/event/drawing`
                let datad = `code=8ulcky4bknbe_f&${getc()}&withid=1`
                let resd = await axios.post(urld, datad, header)
                console.log(resd.data)

            }
        } catch (err) {
            console.log(err)
        }
        resolve()
    })
}

//体验app

function getids() {
    return new Promise(async resolve => {
        try {
            let rest = await axios.post("https://www.duokan.com/growth/user/task/list", `activity_id=1124&all_required=1&${getc()}&withid=1`, header)
            rest.data.data.map(list => {
                ids[ids.length] = list.task_id
            })
            console.log(ids)
        } catch (err) {
            console.log(err)
        }
        resolve()
    })
}


function tiyan() {
    return new Promise(async resolve => {
        try {
            let url = 'https://www.duokan.com/growth/user/task/claim'
            for (id of ids) {
                data = `task_id=${id}&stair_id=1000&${getc()}&withid=1`
            //    console.log(data)
                let res = await axios.post(url, data, header)
                console.log(res.data)
                await timeAsync(timeout);
            }

        } catch (err) {
            console.log(err)
        }
        resolve()
    })
}

//日常任务
function code() {
    return new Promise(async resolve => {
        try {
            codee = ["K7S36GFSZC",
                "A2AMBFHP6C",
                "K5HHKUU14D",
                "J18UK6YYAY",
                "1BJGW140U5"]
            let url = `https://www.duokan.com/events/tasks_gift`
            for (code of codee) {
                for (j = 0; j < 3; j++) {
                    let data = `code=${code}&chances=3&${getc()}&withid=1`
                    let res = await axios.post(url, data, header)                    
                    console.log(res.data)
                    await timeAsync(timeout);  
                }
            }
        } catch (err) {
            console.log(err)
            // msg = "签到接口请求失败"
        }
        resolve()
    })
}

//下载任务
function download() {
    return new Promise(async resolve => {
        try {
            let url = `https://www.duokan.com/events/common_task_gift`
                while(a){
                let data = `code=J18UK6YYAY&chances=17&${getc()}&withid=1`
                let res = await axios.post(url, data, header)
                console.log(res.data)
                await timeAsync(timeout);
               if(res.data.msg=="超出限制"){
                 a=null
               }
            }

        } catch (err) {
            console.log(err)
            // msg = "签到接口请求失败"
        }
        resolve()
    })
}

//查询豆子
function info() {
    return new Promise(async resolve => {
        try {
            let url = `https://www.duokan.com/store/v0/award/coin/list`
            let data = `sandbox=0&${getc()}&withid=1`
            let res = await axios.post(url, data, header)
            list = res.data.data.award
            info = []
            number = 0
            list.map(list => {
                number += list.coin
                info.push({
                    "书豆": list.coin,
                    "到期时间": list.expire
                })
            })
            console.log(info)
            console.log("共"+number+"书豆")
            $ui.toast("共"+number+"书豆")
        } catch (err) {
            console.log(err)
        }
        resolve(number)
    })
}

//签到
function sign() {
  return new Promise(async resolve => {
    try {
      let url ='https://www.duokan.com/checkin/v0/checkin'
               let res = await axios.post(url,getc(),header)               
               console.log(res.data)                      
    } catch (err) {     
      console.log(err)
     
    }
    resolve()
  })
}


//限免
function getO() {
  return new Promise(async resolve => {
    try {
      let url ='https://www.duokan.com/hs/v4/channel/query/2027'
               let res = await axios.get(url)
                bid=res.data.items[0].data.book_id                      
  data=`payment_name=BC&ch=VSZUVB&book_id=${bid}&price=0&allow_discount=1`
   let furl="https://www.duokan.com/store/v0/payment/book/create"
   let fres= await axios.post(furl,data,header)
  a=`今日限免：${fres.data.book.title} • ${fres.data.msg}`
console.log(a)
    } catch (err) {     
      console.log(err)
      result+="今日限免购买失败"
    }
    resolve()
  })
}



async function task() {
    await sign()
    await getO()
    await drawing()
    await  download()
    await getids()
    await tiyan()
    await code()
    await info()
}

task()
//每日签到
//今日限免购买
//大转盘
//看视频看广告
//体验app
//下载app
