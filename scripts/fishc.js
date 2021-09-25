const rules = {
    name: "【鱼C论坛】： ",
    url: "https://fishc.com.cn/plugin.php?id=k_misign:sign", //用于获取formhash的链接
    cookie: config.fishc.cookie,
    formhash: 'formhash=(.+?)\\"', //formhash正则
    verify: "您需要先登录才能继续本操作", //验证cookie状态
    op: [{
        name: "签到",
        charset: "gbk",
        method: "get", //签到请求方式 get/post
        url: "https://fishc.com.cn/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=@formhash"
    }]
};

async function fishc() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = fishc