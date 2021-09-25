const rules = {
    name: "【阡陌居】： ",
    cookie: config.qmj.cookie,
    url: "http://www.1050qm.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes", //用于获取formhash的链接     
    formhash: 'formhash=(.+?)\&', //formhash正则
    verify: "您需要先登录才能继续本操作", //验证cookie状态
    op: [{
            name: "签到",
            method: "post", 
            url: "http://www.1050qm.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0", //签到链接
            data: "formhash=@formhash&qdxq=wl"
        },
        {
            name: "申请贡献任务",
            ua: "pc",
            charset: "gb2312",
            method: "get", 
            url: "http://www.1000qm.vip/home.php?mod=task&do=draw&id=1"
        }
    ]
};
async function togamemod() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = togamemod