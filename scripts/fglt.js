//每整点可签

const rules = {
    name: "【富贵论坛】： ",
    url: "https://www.fglt.net/forum.php", //用于获取formhash的链接
    cookie: config.fglt.cookie,
    formhash: 'formhash=(.+?)\\"', //formhash正则
    verify: "使用QQ帐号登录", //验证cookie状态  
    op: [{
        name: "签到",
        method: "get", //签到请求方式 get/post
        url: "https://www.fglt.net/plugin.php?id=dsu_amupper&ppersubmit=true&formhash=@formhash&mobile=2",
            reg3: "<p class=\"f_c\">(.+?)<\\/p>", //签到成功判断
            info: "<p class=\"f_c\">(.+?)<\/p>", //签到成功返回信息         
    }]
};

async function fglt() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = fglt