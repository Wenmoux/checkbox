const rules = {
    name: "【村花论坛】：",
    url: "https://www.cunhua.uno/k_misign-sign.html", //用于获取formhash的链接
    cookie: config.cunhua.cookie,
    formhash: 'formhash=(.+?)"', //formhash正则
    verify: "抱歉，您尚未登录，无法进行此操作", //验证cookie状态  
    op: [{
        name: "签到",
        method: "get", //签到请求方式
        url: "https://www.cunhua.uno/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=@formhash", //签到链接
    }]
};

async function cunhua() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = cunhua