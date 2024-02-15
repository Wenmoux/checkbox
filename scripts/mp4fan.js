const rules = {
    name: "【高清mp4】： ",
    url: "https://mp4fan.org/", //用于获取formhash的链接
    cookie: config.mp4fan.cookie,
    formhash: 'formhash=(.+)"', //formhash正则
    verify: "登录", //验证cookie状态
    op: [{
        name: "登录",
        method: "get", 
        url: "https://mp4fan.org/",
        reg2: "退出"  
    }]
};

async function jlpzj() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = jlpzj