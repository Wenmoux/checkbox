const axios = require("axios");
function task() {
  return new Promise(async (resolve) => {
    try {
      let cookie = config.zbwx.cookie;
      let url = "http://api.wenxue.mgtv.com/user/benefits/merge?cpsOpid=zb_xm&_filterData=1&device_id=c3ad60274fc24dea&channel=0&_versions=1260&merchant=zb_xm&Guid=48c5d293-6a72-461a-9cd5-cacc4789b19f&ua=Mozilla%2F5.0%20(Linux%3B%20Android%209%3B%20MI%206%20Build%2FPKQ1-wesley_iui-19.07.13%3B%20wv)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Version%2F4.0%20Chrome%2F74.0.3729.136%20Mobile%20Safari%2F537.36&platform=2&manufacturer=Xiaomi&clientType=1&width=1080&appKey=7283695590&model=MI%206&cpsSource=0&brand=Xiaomi&subapp=0&youthModel=0&height=1920&path=%2Fuser%2Fbenefits%2Fmerge&timestamp=1632355285136&sn=392a955a1842912262f01a84af983dd2";
      let res = await axios.get(url, { headers: { cookie: cookie } });
      if (res.data.data.signInfo) {
        msg = `签到成功✅本月累计签到${res.data.data.signInfo.sign.m_num}天`;
      } else {
        msg = res.data.error;
      }
      console.log(msg);
    } catch (err) {
      msg = "签到接口请求出错";
      console.log(err);
    }
    resolve("【瞻彼文学】：" + msg + "\n当月累计签到达到7、14、21、满签时，可获得额外奖励\n请自行手动领取");
  });
}

//task()
module.exports = task;
