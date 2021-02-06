ids = []
const {
    promisify
} = require('util');
const axios=require("axios")
const timeAsync = promisify(setTimeout)
result = ""
header = {
    headers: {
        'cookie':  require("../config.json").duokan.cookie
    }}
device = header.headers.cookie.match(/device_id=(.+?);/)
did = device?device[1]: ""
timeout = 1000 // 时间间隔 默认1s  自行修改 n*1000 app内任务一般30s一次
const  sign1 = [
    'd16ad58199c69518a4afd87b5cf0fe67',
    '828672d6bc39ccd25e1f6ad34e00b86c',
    'f0ccc1bb1cecea673c197b928fb8dbd9',
    '6b86c490d92a138de9a0ae6847781caa',
    'c707047e8b820ba441d29cf87dff341e',
    '82b2c012a956b18cff2388d24f2574a6',
    '87d6b5183a361ee1f6ea8cece1ee83c3',
    '9d42576f7e99c94bb752fde06e6770a5',
    'e58d1f67a82a539d9331baaa3785a943',
    '52c95192ebcb1d0113a748df58a72055',
    '511f33e481fe4504d2637aaf6cbbbaff',
    '6e986f36f4a45cadf61d2f246b27cdc6',
    'f27797a6a1d7fe495b0f4de05f799327',
    '4bd335e899fa665f15eea2f215156321',
    '9355df762183f084473432b5c6900c44',
    '4fb21fb04cbbae9d65556c3958603674',
    '2d02ceb4f1bc916510c7407ce4eca5a5',
    'ef314bf665af0b51294e624244acd7d6',
    '1b441a2ab8e9e7dcf11a55b85931132f',
    '005d2345782ab456e5af167336b70623',
    '51ac508a4d494654035f17f1d646779b',
    '0f6579670f1081f1bcba89dd64645b48',
    '0cd858abe26f0d3db561185fe26bbb75',
    'b5f5fd5b47fd587cb003807e97bed783',
    '6ac9509a5cb799efeb1bb877c505f7e3',
    'b5dd986ffc84762429901ffe633d82a0',
    'f98a436cc2c85943d23d986a8d84c3bd',
    '6fc387f2a17b8564ca212e2b16544cc3',
    '12ead6a62411402378c6311199a0b2ef',
    '7d8dcf31e2e69fcf6bd8af4f48831e92',
    '446c3d0303b0dbd6bc2157844f1222ad',
    '439890227d823ff57bed8ad351fa1b75',
    '645acf3107722ab26b9d3194ecd156ff',
    'afcb41dd9bc54d752c26ace985b49960',
    '1100ab94ccd2e8373af70326c194d8ea',
    '373d73c0c0975cf959eb4c40dc82b27c',
    '2167ac28833149e9ad4ca217bcfa1a62',
    '80547afccc42f34e4c8c4083e00a41a6',
    'b604dda473644bd8157bafdf4ae518dc',
    '15eaa8f727b595d512b82f55364b53b9',
    '8fb656937fd613ccbbcacdc384595b03',
    'dd8410da0b5144ba4aba5a618723b72e',
    '204208386b056a2288e541110bfeeec3',
    'c5b2e7344efd4128bcab5840fa427103',
    '0168601e4335095c502e2e550ca53114',
    'dfa12fe056a8deee35da18613173560f',
    'ed945efdef9c7b2de41249a4fed3945e',
    'b9ece5964ab62d51f8b70ffd35191e9d',
    'f0e0ca4ca0b8afd766821a4922a2873c',
    '5c687b8c6bd641f3f2c0d6aaeceafff6',
    'c983be6420027231d77b748f9d02c1f2',
    '7c53358df8156d979cb6cbb74e15877b',
    'a58058035f73628a7c0847c66c350e88',
    '79dd039ca5cf401993801710f9900d6b',
    '5aff116c2cec01fcc69b389034f456a2',
    'd006927cd9bfd620a6af4f76ee3c4100',
    '410fe62830eeb91ca48be24ffe596364',
    '9d18226ff144a72812d0104ce59fb34e',
    'de439c7f75ca80b1d5b8aba619ee200d',
    '00d1a0479590793294bfdd5c427643aa',
    'd57176b1ce88135243bd501e448b8559',
    '7c500eff681637b97dd526bb11737abb',
    '3e197e47aaac926ccd50c37eb2828311',
    '7db084ea5987f841ad77240bcbb8ce54',
    'cce74f0facc50d47c0dd0e3e2f7435fb',
    'f8bb53fbeb9b2d45db8aca1401817599',
    '5baf7f0f355db11eeb0e936b675cdb82',
    '4478a3354de6bcd7e91b49e28a2b2b3f',
    '66a0338d93af82e956122288b08d2b4b',
    '9f598b2b1c9cd0f2b20e335831cce366',
    '9f4a45fec88b2820653abba179759eb6',
    '41086649c9a39ec977ba42f9ce81f828',
    '06ccca6fd73a6e38f65638ab8abbab76',
    '0cfa0a034a203bb3a22be499e74906f4',
    'c0d1da35a8878b7e4dcdf44bf3cd6b96',
    'f34921e16f6518c1149cc083bd8e1ad7',
    'ed0be3c70075d1d8f1a412f9e59a12e7',
    'eb4d6324bae7db952bd220cb4d57a3de',
    '5ba65d9f8ad735681b594f5092f6ab37',
    '2fa6e0b612962937edb37ed7043923fd',
    'baa8268c7d85d793011c5f5b977f8d4b',
    'f4842a465e4583646abf7df67d8e2915',
    '12c6332c8c9ded3d58d45f2dae7de8da',
    'f56609232205692acf6b6a5d337b0965',
    '3e4eed15387843c668fba53641599d07',
    'd1b9d9ede145b5d426130986245cb66e',
    '2979e43f6ab786f5d68cc262105f3c45',
    '118a18ed578c78f4855b416f8271b29a',
    '9122e158d034f094627c70ed6c3d0c33',
    'dd5413c17253e86cc4247984f3bb77e5',
    'b36bb0124b962efccbb601486665ce9e',
    '6afb3a719f8b0a0b2f744b3dad8b15ab',
    'faf18d64268402ed2975a3f60bc9e651',
    '9f4081944d4ca3fa7b831d7c3b6c289d',
    '367d7a3d77a9f96cbd7903b33c30b61f',
    '605276cf621ff9ba34a99e3675a006f6',
    'a50a734c1a3a749918e20205505ef91d',
    '271ff14ba5edfe89a80a3430227bc11b',
    '3bae338062b4bb3a5087eb13cbcc6efe'
]

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
//增加大转盘次数
function drawingadd() {
    return new Promise(async resolve => {
        try {
            for (b= 0; b < 6; b++) {
                let url = `https://www.duokan.com/store/v0/event/chances/add`
                let data = `code=8ulcky4bknbe_f&count=1&${getc()}&withid=1`
                let res = await axios.post(url, data, header)
                console.log(res.data)

            }
        } catch (err) {
            console.log(err)
        }
        resolve()
    })
}
//大转盘
function drawing() {
    return new Promise(async resolve => {
        try {
            for (m = 0; m < 6; m++) {
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
/*
//体验app 暂时注释掉 新任务并不是这个接口了 虽然还能跑

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
*/
//新版体验任务接口
function tiyan2(sign) {
    return new Promise(async resolve => {
        try {
            let url = `https://www.duokan.com/events/common_task_gift`
            let data = `code=KYKJF7LL0G&chances=1&sign=${sign}&${getc()}&withid=1`
            let res = await axios.post(url, data, header)
            //  console.log(res.data)
            await timeAsync(timeout)
            if (res.data.msg == "成功") {
                console.log("体验任务完成啦！豆子+30")
            } else {
                console.log(res.data)
            }

        } catch (err) {
            console.log(err)
            // msg = "签到接口请求失败"
        }
        resolve()
    })
}
function getchances() {
    return new Promise(async resolve => {
        try {
            let url = "https://www.duokan.com/events/common_task_gift_check"
            let data = `code=KYKJF7LL0G&${getc()}&withid=1`
            let res = await axios.post(url, data, header)
            console.log("体验任务剩余次数："+res.data.chances)    
            if(res.data.chances==0){
            console.log("体验任务已经做完啦")
            }else{
           for (sign of sign1) {
        await tiyan2(sign)
    }
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
            infod = []
            number = 0
            list.map(list => {
                number += list.coin
                infod.push({
                    "书豆": list.coin,
                    "到期时间": list.expire
                })
            })
            console.log(infod)
            console.log("共"+number+"书豆")
        } catch (err) {
            console.log(err)
        }
        resolve(number)
    })
}

//签到
function dailysign() {
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
    await info()
    await dailysign()
    await getO()
    await getchances()
    await drawingadd()
    await drawing()
    await  download()
   /* await getids()
    await tiyan()*/
    await code()
    await info()
}

module.exports=task
//每日签到
//今日限免购买
//大转盘
//看视频看广告
//体验app
//下载app
