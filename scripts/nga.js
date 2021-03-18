const axios = require("axios");
function task() {
  return new Promise(async (resolve) => {
    try {
      let nga = config.nga;
      let url = "https://ngabbs.com/nuke.php?&";
      let res = await axios.post(
        url,
        `sign=&access_uid=${nga.uid}&t=${Math.round(
          new Date().getTime() / 1000
        ).toString()}&access_token=${
          nga.accesstoken
        }&    app_id=1010&__act=check_in&__lib=check_in&__output=12`
      );
      if (res.data.code == 0) {
        msg = "签到成功";
      } else {
        msg = res.data.msg;
      }
      console.log(res.data);
    } catch (err) {
      console.log(err);
      msg = "签到接口请求出错";
    }
    resolve("NGA每日签到：\n" + msg);
  });
}

//task()

module.exports = task;
