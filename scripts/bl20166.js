
const rules = {
  name: "【有分享论坛】： ",
  type: 2, //签到类型 2 需要formhash
  op: "签到",
  url1: "https://www.bl20166.com/plugin.php?id=dsu_paulsign:sign&mobile=2", //用于获取formhash的链接
  cookie: config.bl20166.cookie,
  reg1: 'formhash=(.+)', //formhash正则
  verify: "您需要先登录才能继续本操作", //验证cookie状态
  signmethod: "post", //签到请求方式 get/post
  signurl: "https://www.bl20166.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes", //签到链接
  signdata:"formhash=@formhash&qdxq=kx&qdmode=1&todaysay=%E4%B9%88%E4%B9%88%E5%93%92%EF%BD%9E%28%5E%D0%B7%5E%29-%E2%98%86&fastreply=3",
  reg2: "", //重复签到判断
  reg3: "", //签到成功判断
  info: "", //签到成功返回信息
};

async function bl20166(){
const template = require("../Template");
return rules.name+await template(rules)
}
module.exports=bl20166