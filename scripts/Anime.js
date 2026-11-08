const rules = {
    name: "【Anime字幕论坛】：",
    url: "https://bbs.acgrip.com/plugin.php?id=dsu_paulsign:sign&mobile=2", // 改为签到页，专门获取签到用的 formhash
    cookie: config.Anime.cookie,
    formhash: 'formhash=(.+?)[&"\']', // 兼容签到页中 formhash 后跟 & 或引号的情况
    verify: "答案",
    op: [{
        name: "签到",
        method: "post",
        url: "https://bbs.acgrip.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes",
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
