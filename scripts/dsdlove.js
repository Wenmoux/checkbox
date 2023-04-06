const rules = {
    name: "【Hires后花园】： ",
    url: "https://dsdlove.com/plugin.php?id=dc_signin", //用于获取formhash的链接
    cookie: config.dsdlove.cookie,
    formhash: 'formhash=(.+)"', //formhash正则
    verify: "输入用户名", //验证cookie状态
    op: [{
        name: "签到",
        method: "post", //签到请求方式 get/post
        data: "formhash=@formhash&signsubmit=yes&handlekey=signin&emotid=1&referer=https%3A%2F%2Fdsdlove.com%2Fplugin.php%3Fid%3Ddc_signin&content=%E8%AE%B0%E4%B8%8A%E4%B8%80%E7%AC%94%EF%BC%8Chold%E4%BD%8F%E6%88%91%E7%9A%84%E5%BF%AB%E4%B9%90%EF%BC%81",
        url: "https://dsdlove.com/plugin.php?id=dc_signin:sign&inajax=1"
    }]
};

async function abooky() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = abooky