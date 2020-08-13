/*
 * @Author: Wenmoux
 * @Date: 2020-08-04 01:21:09
 * @LastEditTime: 2020-08-13 17:41:35
 * @Description: bilibili夏日音乐季活动 手书嘉年华
 */

const {promisify} = require('util');
const axios = require('axios');
const timeAsync = promisify(setTimeout);   
        let msg =""
        let cookie = ";bili_jct=b209003cf8e7f18e7bff601c7a581152;author=wenmoux"//这里填cookie
                let crsf = cookie.match(/bili_jct=(.+)/)[1]
        let header = {
            headers: {
                "cookie": cookie,
                "Referer": "https://www.bilibili.com/video/av244192967"
            }
        }
        task()
async function task() {
    //抽6
    await addt(3) //分享    
    await gz(65754890)
    await addt(4) //关注
    await lottery("dd83a687-c800-11ea-8597-246e966235d8")
    await timeAsync(5000)
    await lottery("dd83a687-c800-11ea-8597-246e966235d8")
     await timeAsync(5000)
    await lottery("dd83a687-c800-11ea-8597-246e966235d8")   
    //10换12 有时候能抽两次
    await toubi()
    await adt()
    await timeAsync(5000)
    await lottery("23ec0c85-b53c-11ea-8597-246e966235d8")
    await timeAsync(5000)
    await lottery("23ec0c85-b53c-11ea-8597-246e966235d8")
    console.log(msg)
    }
        function toubi() {
            return new Promise(async resolve => {
                try {
                    let url = "https://api.bilibili.com/medialist/gateway/base/detail?media_id=1005976362&pn=0&ps=20"
                    let res = await axios.get(url)
                    let list = res.data.data.medias
                    list.splice(5, 15)
                    for (i of list) {
                        url = "https://api.bilibili.com/x/web-interface/coin/add"
                        data = `aid=${i.id}&multiply=2&select_like=1&cross_domain=true&csrf=${crsf}`
                        let ress = await axios.post(url, data, header)
                        console.log(ress.data)
                        await timeAsync(1000)
                    }
                } catch (err) {
                    console.log(err)
                }
                resolve()
            })
        }

        function addt(type) {
            return new Promise(async resolve => {
                try {
                    let url = "https://api.bilibili.com/x/activity/lottery/addtimes"
                    let data = `sid=dd83a687-c800-11ea-8597-246e966235d8&action_type=${type}&csrf=${crsf}`
                    let res = await axios.post(url, data, {
                        headers: {
                            "cookie": cookie
                        }
                    })
                    console.log(res.data)
                } catch (err) {
                    console.log(err)
                }
                resolve()
            })
        }

        function lottery(sid) {
            return new Promise(async resolve => {
                try {
                    let url = "https://api.bilibili.com/x/activity/lottery/do"
                    let data = `sid=${sid}&type=1&csrf=${crsf}`
                    let res = await axios.post(url, data, {
                        headers: {
                            "cookie": cookie
                        }
                    })
                    if (res.data.code == "75415") {
                      msg+=res.data.message+"\n"
                    } else if (res.data.code==0) {                      
                        let a =`抽奖成功 获得${res.data.data[0].gift_name}`
                         msg+=a+"\n"
                    }
                    console.log(res.data)
                } catch (err) {
                    console.log(err)
                }
                resolve()
            })
        }

        function adt() {
            return new Promise(async resolve => {
                try {
                    let url = "https://api.bilibili.com/x/activity/handwrite/addlotterytimes"
                    let data = `csrf=${crsf}`
                    let res = await axios.post(url, data, {
                        headers: {
                            "cookie": cookie
                        }
                    })
                    console.log(res.data)
                } catch (err) {
                    console.log(err)
                }
                resolve()
            })
        }

        function gz(fid) {
            return new Promise(async resolve => {
                try {
                    let url = "https://api.bilibili.com/x/relation/modify"
                    let data = `fid=${fid}&re_src=222&act=1&csrf=${crsf}`
                    let res = await axios.post(url, data, {
                        headers: {
                            "cookie": cookie
                        }
                    })
                    console.log(res.data)
                } catch (err) {
                    console.log(err)
                }
                resolve()
            })
        }