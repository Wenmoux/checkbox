const axios = require("axios");
var formhash = null
var message = ""
function sign(op, header, rules,formhash) {
    return new Promise(async (resolve) => {
        try {
            console.log("去" + op.name)
            header.headers["User-Agent"] = (op.ua == "pc") ? "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Safari/537.36" : "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36"
            let signurl = op.url.replace(/@formhash/, formhash);
            delete(header.responseType)
            if (op.charset) {
                header.responseType = "arraybuffer"
            }
            if (op.method == "post") {
                data = op.data
                res2 = await get(signurl, header, op.method, data.replace(/@formhash/, formhash));
              } else {
                res2 = await get(signurl, header);
            }
            if (op.charset) {
                res2data = require("iconv-lite").decode(res2, op.charset);
            } else {
                res2data = res2
            }
            res2data = "" + res2data
            if (res2data.match(/id=\"messagetext\".*?<p>(.+?)<\/p>/s)) { //dz论坛大多都是
                msg = res2data.match(/id=\"messagetext\".*?<p>(.+?)</s)[1];
            } else if ((!(rules.url.match(/togamemod|sayhuahuo|99fuman/) )) && res2data.match(/<root><!\[CDATA\[/)) {
                msg = res2data.match(/<!\[CDATA\[(.+?)>/)[1].replace(/]/g, "").replace(/<script.+/, "")
              if (rules.name == "【Hires后花园】： " && res2.data.match(/签到成功/)) msg = res2data.match(/签到成功~随机奖励新币\d+/)[0]
             } else if (op.reg2 && res2data.match(op.reg2)) {
                msg = "今天已经" + op.name + "过啦";
                console.log(msg)
            } else if (op.reg3 && res2data.match(op.reg3)) {
                msg = res2data.match(op.info)[0];
            } else {
                msg = op.name + "失败!原因未知";
                console.log(res2data);
            }            
            resolve(msg)
       //     console.log(msg)
        } catch (err) {
            console.log(err);
            message = "接口请求失败"
            resolve("接口请求失败")
        }
        resolve();
    });
}
async function getcredit(rules){            
                ccres = await get(rules.crediturl, rules.header)
                for (o = 0; o < rules.credit.length; o++) {
                    regex = rules.credit[o].value.replace(/\"/g, "")
                    console.log(rules.credit[o].name)
                    regex = eval(regex)
                    let credit = ccres.match(regex)
                    
                    return `   ${rules.credit[o].name} ${credit?credit[1]:"null"} `                   
                }            
}
function get(url, header, method = "get", data = null) {
    return new Promise(async (resolve) => {
        try {
            if (method == "get") res = await axios.get(url,
                header
            );
            if (method == "post") res = await axios.post(url, data,
                header
            );
            resolve(res.data)
        } catch (err) {
            console.log(err);
            resolve( "接口请求出错")
        }
        resolve();
    });
}


async function Template(rules) {
    const header = {
        headers: {
            cookie: rules.cookie,
            referer: rules.url,
            "User-Agent": rules.ua == "pc" ? "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Safari/537.36" : "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36"
        }
    };
    rules.header = header
    message = rules.credit ? "\n" : ""
    let checkres = await get(rules.url, header);
    if (checkres && !checkres.match(rules.verify)) {
        ckstatus = 1
        if (rules.formhash) formhash = checkres.match(rules.formhash)
        formhash = formhash ? formhash[1] : ""
        for (i = 0; i < rules.op.length; i++) {
            msg = await sign(rules.op[i], header, rules,formhash)
            message += "    " + rules.op[i].name + "：" + msg + "\n"
            console.log(msg)
        }
       if(rules.credit) message+= "    资产："+await getcredit(rules)
        
    } else {
        ckstatus = 0
        message = "  cookie失效";
    }
return message
}
module.exports = Template;