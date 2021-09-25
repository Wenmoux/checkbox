const rules = {
    name: "【好书友论坛】： ",
    url: "https://www.93hsy.com/plugin.php?id=k_misign:sign", //用于获取formhash的链接
    cookie: config.hsy.cookie,
    ua: "pc",
    formhash: 'formhash=(.+?)\\"', //formhash正则
    verify: "你还没登录，确定登录", //验证cookie状态
    op: [{
            name: "签到",
            ua: "pc",
            charset: "gb2312",
            method: "get", //签到请求方式 get/post
            url: "https://www.93hsy.com/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=@formhash", //签到链接
        },
        {
            name: "在线奖励",
            ua: "pc",
            charset: "gb2312",
            method: "get", //签到请求方式 get/post
            url: "https://www.93hsy.com/plugin.php?id=gonline:index&action=award&formhash=@formhash", //签到链接
            reg2: "没", //重复签到判断
            reg3: "parent", //签到成功判断
            info: "\\(\\'(.+?)\\'", //签到成功返回信息
        }
    ]
};

async function hsy() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = hsy