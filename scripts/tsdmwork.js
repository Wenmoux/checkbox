const rules = {
    name: "【天使动漫】： ",
    cookie: config.tsdm.cookie,
    url: "https://www.tsdm39.com/plugin.php?id=dsu_paulsign:sign&mobile=yes", //用于获取formhash的链接     
    formhash: 'formhash=(.+?)\&', //formhash正则
    verify: "您需要先登录才能继续本操作", //验证cookie状态
    op: [
        {
            name: "打工",
            ua: "pc",
            method: "post", 
            url: "https://www.tsdm39.com/plugin.php?id=np_cliworkdz:work",
            data: "act=getcre"
        }]
};
async function tsdmwork() {
var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
   const template = await require("../Template");
    for(i=0;i<8;i++) {    
    let dg= await require("axios").post("https://www.tsdm39.com/plugin.php?id=np_cliworkdz:work","act=clickad", {headers: {cookie: rules.cookie,referer: rules.url,"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Safari/537.36"}})
    if((""+dg.data).match(/才可再次进行。/)) break;
    console.log("第"+(i+1)+"次打工："+dg.data)
    await sleep(1500)
    }    
    return rules.name + await template(rules)
}
module.exports = tsdmwork
