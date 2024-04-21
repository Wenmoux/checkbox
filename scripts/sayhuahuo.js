const rules = {
    name: "【花火论坛】： ",
    url: "https://www.sayhuahuo.xyz/dsu_paulsign-sign.html", //用于获取formhash的链接
    cookie: config.huahuo.cookie,    
    formhash: 'name=\"formhash\" value=\"(.+?)\"', //formhash正则
    verify: "您需要先登录才能继续本操作", //验证cookie状态
    op: [{
        name: "签到",
        method: "post", 
        ua: "pc",
        url: "https://www.sayhuahuo.xyz/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1", //签到链接
        data: "formhash=@formhash&qdxq=kx&qmode=3&todaysay=&fastreply=0",
        reg2: "已经签到", //重复签到判断
        reg3: "签到成功", //签到成功判断
        info: "恭喜你签到成功!获得随机奖励 烟花 \\d+"
    }]
};

async function huahuo() {
    const template = require("../Template");
    return rules.name + await template(rules)
}
module.exports = huahuo