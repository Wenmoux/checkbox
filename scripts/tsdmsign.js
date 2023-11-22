const rules = {
    name: "【天使动漫】： ",
    cookie: config.tsdm.cookie,
    url: "https://www.tsdm39.com/plugin.php?id=dsu_paulsign:sign&mobile=yes", //用于获取formhash的链接     
    formhash: 'formhash=(.+?)\&', //formhash正则
    verify: "您需要先登录才能继续本操作", //验证cookie状态
    op: [{
            name: "签到",
            method: "post",
            url: "https://www.tsdm39.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes", //签到链接
            data: "formhash=@formhash&qdxq=kx&qdmode=3&todaysay=&fastreply=1"
        }]
}
async function tsdmsign() {
    const template = await require("../Template");
    return rules.name + await template(rules)
}
module.exports = tsdmsign
