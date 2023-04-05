const axios = require('axios');
const checkIn = async () => {
  const data = 'timeZoneStr=Asia%2FShanghai&uid=-1&sign=';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
"_c":20,
"x-auth-token":config.kilamanbo.authtoken
  };
  try {
    const response = await axios.post('https://api.kilamanbo.com/api/v391/user/checkIn', data, { headers });
    const msg = response.data?.h?.msg;
    return "【克拉漫播】："+msg
    console.log(msg);
  } catch (error) {
    const msg = error.response?.data?.h?.msg || error.message;
    console.error(msg);
    return "【克拉漫播】："+msg
  }
};

module.exports = checkIn


  