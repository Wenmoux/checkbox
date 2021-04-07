const rules = {
  name: "【togamemod每日签到】： ",
  type: 2, //签到类型 2 需要formhash
  url1: "http://www.togamemod.cn/forum.php?mod=forumdisplay&fid=71", //用于获取formhash的链接
  cookie: config.togamemod.cookie,
  reg1: 'formhash=(.+)"', //formhash正则
  verify: "后使用快捷导航", //验证cookie状态
  signmethod: "get", //签到请求方式 get/post
  signurl: "http://www.togamemod.cn/plugin.php?id=k_misign:sign&operation=qiandao&formhash=@formhash&inajax=1&ajaxtarget=midaben_sign", //签到链接
   reg2: "今日已签", //重复签到判断
  reg3: "签到成功", //签到成功判断
  info: "获得随机奖励 \\d+金币", //签到成功返回信息
};

async function togamemod(){
const template = require("../Template");
return await template(rules)
}
module.exports=togamemod