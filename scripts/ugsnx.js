const rules = {
    name: "【ug爱好者】： ",
    url: "http://www.ugsnx.com/forum.php?mod=guide&view=newthread&mobile=2", //用于获取formhash的链接
    cookie: config.ugsnx.cookie,
    formhash: 'formhash=(.+?)"', //formhash正则
    verify: "有你更精彩！",
    op: [{
        name: "签到",
        charset: "gb2312",
        method: "get", //签到请求方式 get/post
        url: "http://www.ugsnx.com/plugin.php?id=dsu_amupper&ppersubmit=true&nogoto=1&formhash=@formhash&mobile=2&inajax=1"
    }]
};

async function ugsnx() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = ugsnx