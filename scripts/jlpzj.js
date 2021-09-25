const rules = {
    name: "【纪录片之家】： ",
    url: "http://www.jlpzj.net/plugin.php?id=dsu_paulsign:sign&mobile=2", //用于获取formhash的链接
    cookie: config.jlpzj.cookie,
    formhash: 'formhash=(.+)"', //formhash正则
    verify: "您需要先登录才能继续本操作", //验证cookie状态
    op: [{
        name: "签到",
        method: "post", //签到请求方式 get/post
        url: "http://www.jlpzj.net/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes", //签到链接
        data: "formhash=@formhash&qdxq=kx&qmode=3&todaysay=&fastreply=0"
    }]
};

async function jlpzj() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = jlpzj