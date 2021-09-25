//传奇GM论坛  https://www.diygm.com/home.php?mod=spacecp&ac=credit&op=rule

const rules = {
    name: "【传奇GM论坛】：",
    url: "https://www.diygm.com/plugin.php?id=dc_signin", //用于获取formhash的链接
    cookie: config.diygm.cookie,
    formhash: 'formhash=(.+?)"', //formhash正则
    verify: "抱歉，您尚未登录，无法进行此操作", //验证cookie状态
    op: [{
        name: "签到",
        method: "post", //签到请求方式
        url: "https://www.diygm.com/plugin.php?id=dc_signin:sign&inajax=1", //签到链接
        data: "formhash=@formhash&signsubmit=yes&handlekey=signin&emotid=1&referer=https%3A%2F%2Fwww.diygm.com%2Fmisc.php%3Fmod%3Dmobile&content=%E8%AE%B0%E4%B8%8A%E4%B8%80%E7%AC%94%EF%BC%8Chold%E4%BD%8F%E6%88%91%E7%9A%84%E5%BF%AB%E4%B9%90%EF%BC%81;"
    }]
};

async function diygm() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = diygm