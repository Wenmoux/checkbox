const rules = {
  name: "【纪录片之家】： ",
  type: 2, //签到类型 2 需要formhash
  url1: "http://www.jlpzj.net/plugin.php?id=dsu_paulsign:sign&mobile=2", //用于获取formhash的链接
  cookie: config.jlpzj.cookie,
  reg1: 'formhash=(.+)"', //formhash正则
  verify: "您需要先登录才能继续本操作", //验证cookie状态
  signmethod: "post", //签到请求方式 get/post
  signurl: "http://www.jlpzj.net/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes", //签到链接
  signdata:"formhash=@formhash&qdxq=kx&qmode=3&todaysay=&fastreply=0",
  reg2: "已经签到", //重复签到判断
  reg3: "恭喜你签到成功", //签到成功判断
  info: "恭喜你签到成功!获得随机奖励(.+)元", //签到成功返回信息
};

async function jlpzj(){
const template = require("../Template");
return await template(rules)
}
module.exports=jlpzj