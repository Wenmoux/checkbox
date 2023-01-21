const rules = {
    name: "【Anime字幕论坛】：",
    url: "https://bbs.acgrip.com/member.php?mod=logging&action=login&mobile=2", //用于获取formhash的链接
    cookie: config.Anime.cookie,
    formhash: 'formhash\":\"(.+?)\"', //formhash正则
    verify: "答案", //验证cookie状态
    op: [{
        name: "签到",
        method: "post", //签到请求方式
        url: "https://bbs.acgrip.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes", //签到链接
        data: "formhash=@formhash&qdxq=kx&qdmode=3&todaysay=&fastreply="
    },
        {
            name: "申请红包任务",
            ua: "pc",          
            method: "get", 
            url: "https://bbs.acgrip.com/home.php?mod=task&do=apply&id=1"
        }    ]
};

async function Anime() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = Anime