const rules = {
    name: "【帆软社区】： ",
    cookie: config.fanruan.cookie,
    url: "https://bbs.fanruan.com/plugin.php?id=k_misign:sign", //用于获取formhash的链接
    formhash: 'formhash=(.+?)\\"', //formhash正则
    verify: "使用QQ帐号登录", //验证cookie状态
    op: [{
            name: "签到",
            method: "get", //签到请求方式 get/post
            url: "https://bbs.fanruan.com/qiandao/?mod=sign&operation=qiandao&format=text&formhash=@formhash", //签到链接
        },
        {
            name: "大转盘",
            method: "get", //签到请求方式 get/post
            url: "https://bbs.fanruan.com/plugin.php?id=levaward:l&fh=@formhash&m=_openaward.18&ajax&_t=0.7032190526469371",
            reg2: "awardnum", //重复签到判断
            reg3: "8(\\d+)", //签到成功判断
            info: ".+", //签到成功返回信息
        },
        {
            name: "摇摇乐",          
            method: "post", //签到请求方式 get/post
            url: "https://bbs.fanruan.com/plugin.php?id=yinxingfei_zzza:yinxingfei_zzza_post",
            data: "formhash=@formhash",
            reg2: "已经摇过奖", //重复签到判断
            reg3: "摇出", //签到成功判断
            info: "摇出\\d+豆", //签到成功返回信息
        },
    ]
};
async function togamemod() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = togamemod