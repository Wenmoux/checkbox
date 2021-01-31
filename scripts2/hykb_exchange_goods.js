const axios = require ("axios")
const scookie = ""
async function get(a, b) {
    return new Promise(async resolve => {
        try {
            let res = await axios.post(`https://huodong3.3839.com/n/hykb/bmhstore2/inc/inkind/ajaxInkind.php`, `ac=${a}&t=2020-08-3+11%3A14%3A48&r=0.9948423196524376&${b}&scookie=${scookie}`, {
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

async function exchange(id) {
    for (i = 0; i < 999; i++) {
        await get("checkExchange", `gid=${id}`) //检测
        await get("exchange", `goodsid=${id}`) //兑换
    }
}


//id自己抓包看 4496好像是玩偶吧
exchange(4496)