const axios = require ("axios")
const scookie = ""
scookie = scookie.match("\\|")?encodeURIComponent(scookie):scookie
  
async function get(a,b,key) {
    return new Promise(async resolve => {
        try {
            let res = await axios.post(`https://huodong3.3839.com/n/hykb/bmhstore2/inc/${key}/ajax${key.slice(0, 1).toUpperCase() + key.slice(1)}.php`, `ac=${a}&r=0.9948423196524376&${b}&scookie=${scookie}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; FRD-AL10 Build/HUAWEIFRD-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM/3.0.0.2860 QQ/6.5.5  NetType/WIFI WebP/0.3.0 Pixel/1080"
                }
            })
            console.log(res.data)
        } catch (err) {
            console.log(err)
        }
        resolve()
    })
}

async function exchange(id,key) {
        await get("checkExchange", `gid=${id}`,key) //检测
    for (i = 0; i < 999; i++) {
        await get("exchange", `goodsid=${id}`,key) //兑换
    }
}


/*
填写格式exchange(gid,"key")
直接分享商品链接查看 
例https://huodong3.3839.com/n/hykb/bmhstore2/inc/libao/index.php?gid=6237
比如上面这个 gid就是6237  key就是 libao 就是查看inc/后面的哪个东西
*/
exchange(6237,"libao")