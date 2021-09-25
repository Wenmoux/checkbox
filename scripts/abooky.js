const rules = {
    name: "【阅次元论坛】： ",
    url: "https://www.abooky.com/plugin.php?id=k_misign:sign", //用于获取formhash的链接
    cookie: config.abooky.cookie,
    formhash: 'formhash=(.+)"', //formhash正则
    verify: "没有帐号", //验证cookie状态
    op: [{
        name: "签到",
        method: "get", //签到请求方式 get/post
        url: "https://www.abooky.com/plugin.php?id=k_misign:sign&operation=qiandao&format=button&formhash=@formhash", //签到链接
    }]
};

async function abooky() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = abooky