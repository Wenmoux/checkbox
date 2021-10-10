const rules = {
    name: "【耽漫资源网】： ",
    url: "https://www.99fuman.com/dsu_paulsign-sign.html", //用于获取formhash的链接
    cookie: config.fuman99.cookie,
    formhash: 'formhash=(.+)\&', //formhash正则
    verify: "后使用快捷导航", //验证cookie状态
    op: [{
        name: "签到",
        method: "post", //签到请求方式 get/post
        url: "https://www.99fuman.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1", //签到链接
        data: "formhash=@formhash&qdxq=kx",
        reg2: "已经签到", //重复签到判断
        reg3: "签到成功", //签到成功判断
        info: "恭喜你签到成功!获得随机奖励 金币 \\d+"
    }]
};

async function fuman99() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = fuman99