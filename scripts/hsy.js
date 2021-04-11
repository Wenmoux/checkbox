const rules = {
  name: "【好书友论坛每日签到】： ",
  type: 2, //签到类型 2 需要formhash
  url1: "https://www.93hsy.com/plugin.php?id=k_misign:sign", //用于获取formhash的链接
  cookie: config.hsy.cookie,
  charset:"gb2312",
  reg1: 'formhash=(.+?)\\"', //formhash正则
  verify: "你还没登录，确定登录", //验证cookie状态
  signmethod: "get", //签到请求方式 get/post
  signurl: "https://www.93hsy.com/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=@formhash", //签到链接
  reg2: "今日已签", //重复签到判断
  reg3: "已签到", //签到成功判断
  info: "已签到", //签到成功返回信息
};

async function hsy(){
const template = require("../Template");
return await template(rules)
}
module.exports=hsy