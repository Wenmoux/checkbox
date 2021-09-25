//传奇GM论坛  https://www.diygm.com/home.php?mod=spacecp&ac=credit&op=rule

const rules = {
    name: "【数码之家】：",
    url: "https://www.mydigit.cn/plugin.php?id=k_misign:sign&mobile=2", //用于获取formhash的链接
    cookie: config.mydigit.cookie,
    formhash: 'formhash=(.+?)"', //formhash正则
    verify: "您需要先登录才能继续本操作", //验证cookie状态
    op: [{
        name: "签到",
        method: "get", //签到请求方式 get/post
        url: "https://www.mydigit.cn/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=@formhash"
    }]
};

async function diygm() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = diygm