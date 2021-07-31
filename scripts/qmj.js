const rules = {
  name: "【阡陌居】： ",
  type: 2, //签到类型 2 需要formhash
  op: "签到",
  url1: "http://www.1050qm.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes", //用于获取formhash的链接
  cookie: config.qmj.cookie,
  reg1: 'formhash=(.+)"', //formhash正则
  verify: "您需要先登录才能继续本操作", //验证cookie状态
  signmethod: "post", //签到请求方式 get/post
  signurl: "http://www.1050qm.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes", //签到链接
  signdata: "formhash=@formhash&qdxq=wl",
  reg2: "", //重复签到判断
  reg3: "", //签到成功判断
  info: "", //签到成功返回信息
};

async function togamemod(){
const template = require("../Template");
return rules.name+await template(rules)
}
module.exports=togamemod