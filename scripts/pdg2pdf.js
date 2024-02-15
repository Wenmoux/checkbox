const axios = require('axios');

async function dailyCheckin() {
  try {
    const headers = {
   cookie: config.pdg2pdf.cookie
    }
    const response = await axios.post('https://pdg2pdf.com/api/user/daily_checkin', "",{headers});    
    if (response.data.check_count) {     
      msg = '签到成功！✅'
    } else {     
      msg = '签到失败！❌'+response.data.error
    }
    console.log(msg)
    return "【PDG2PDF】:"+msg
  } catch (error) {   
    msg = `签到失败！❌ 错误信息：${error.response.data.error}`
    console.log(msg)
    return "【PDG2PDF】:"+msg
  }
}

module.exports = dailyCheckin;