const rules = {
  name: "【数码之家每日签到】: ",
  type: 2, //签到类型 2 需要formhash 
  url1: "https://www.mydigit.cn/plugin.php?id=k_misign:sign&mobile=2", //用于获取formhash的链接
  cookie: config.mydigit.cookie,
  reg1: 'formhash=(.+?)"', //formhash正则
  verify: "您需要先登录才能继续本操作", //验证cookie状态
  signmethod: "get", //签到请求方式 get/post
  restype:"html",
  signurl: "https://www.mydigit.cn/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=@formhash", //签到链接
  reg2: "今日已签", //重复签到判断
  reg3: "已签到", //签到成功判断
  info: "已签到", //签到成功返回信息
};

async function mydigit(){
const template = require("../Template");
return await template(rules)
}
module.exports=mydigit