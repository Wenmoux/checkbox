const rules = {
  name: "【阅次元论坛每日签到】： ",
  type: 2, //签到类型 2 需要formhash
  url1: "https://www.abooky.com/plugin.php?id=k_misign:sign", //用于获取formhash的链接
  cookie: config.abooky.cookie,
  reg1: 'formhash=(.+)"', //formhash正则
  verify: "没有帐号", //验证cookie状态
  signmethod: "get", //签到请求方式 get/post
  signurl: "https://www.abooky.com/plugin.php?id=k_misign:sign&operation=qiandao&format=button&formhash=@formhash", //签到链接
   reg2: "今日已签", //重复签到判断
  reg3: "签到成功", //签到成功判断
  info: "获得随机奖励.+?银币", //签到成功返回信息
};

async function abooky(){
const template = require("../Template");
return await template(rules)
}
module.exports=abooky