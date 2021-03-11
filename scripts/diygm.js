//传奇GM论坛  https://www.diygm.com/home.php?mod=spacecp&ac=credit&op=rule

const rules = {
  name: "传奇GM论坛每日签到：\n",
  type: 2, //签到类型 2 需要formhash
  url1: "https://www.diygm.com/plugin.php?id=dc_signin", //用于获取formhash的链接
  cookie: require("../config.json").diygm.cookie,
  reg1: 'formhash=(.+?)"', //formhash正则
  verify: "抱歉，您尚未登录，无法进行此操作", //验证cookie状态
  signmethod: "post", //签到请求方式
  signurl: "https://www.diygm.com/plugin.php?id=dc_signin:sign&inajax=1", //签到链接
  reg2: "您今日已经签过到~~", //签到成功判断
  reg3: "签到成功", //签到成功判断
  return: "签到成功.+金钱\d+", //签到成功返回信息
};

async function diygm(){
const template = require("../Template");

return await template(rules)
}
module.exports=diygm