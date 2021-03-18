//精易论坛  https://bbs.125.la/?fromuid=452270

const rules = {
  name: "精易论坛每日签到：\n",
  type: 2, //签到类型 2 需要formhash
  url1: "https://bbs.125.la/plugin.php?id=dsu_paulsign:sign", //用于获取formhash的链接
  cookie: config.jy.cookie,
  reg1: 'formhash=(.+?)"', //formhash正则
  verify: "您需要先登录才能继续本操作", //验证cookie状态
  signmethod: "postjson", //签到请求方式
  signdata:"formhash=@formhash&submit=1&operation=qiandao&qdxq=kx&ajax=1&infloat=0",//post请求数据
  signurl: "https://bbs.125.la/plugin.php?id=dsu_paulsign:sign", //签到链接
  reg2: "status", //签到成功判断
  reg2value:1,
  reg2info:'`msg=签到成功,获得${res2.data.data.credit}精益币`',
  reg3: "status", //重复签到判断
  reg3value:0,
  reg3info:"msg=res2.data.msg"
};

async function jyi(){
const template = require("../Template");
return await template(rules)
}
//jyi()
module.exports=jyi