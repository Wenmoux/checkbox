const rules = {
  name: "【村花论坛】：",
  type: 2, //签到类型 2 需要formhash
  op: "签到",
  url1: "https://www.cunhua.uno/k_misign-sign.html", //用于获取formhash的链接
  cookie: config.cunhua.cookie,
  reg1: 'formhash=(.+?)"', //formhash正则
  verify: "抱歉，您尚未登录，无法进行此操作", //验证cookie状态
  signmethod: "get", //签到请求方式
  signurl: "https://www.cunhua.uno/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=@formhash", //签到链接
  reg2: "", //重复签到判断
  reg3: "", //签到成功判断
  info: "", //签到成功返回信息
};

async function cunhua(){
const template = require("../Template");
return rules.name+await template(rules)
}
module.exports=cunhua