const axios = require('axios');
const sckey = require('./config').sckey;
url = `https://sc.ftqq.com/${sckey}.send`
async function server(b) {
  res = await axios.post(url, `text=wps每日打卡&desp=${b}`)
  if (res.data.errmsg == 'success') {
    console.log('server酱:发送成功')
  } else {
    console.log('server酱:发送失败')
    console.log(res.data)
  }
}
module.exports = server
