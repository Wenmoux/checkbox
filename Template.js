const axios = require("axios");
var formhash = null
var message = ""

function Template(rules) {
    return new Promise(async (resolve) => {
        try {
            const header = {
                headers: {
                    cookie: rules.cookie,
                    referer: rules.url,
                    "User-Agent": rules.ua == "pc" ? "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Safari/537.36" : "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36"                }
            };
            message = rules.op.length > 1 ? "\n" : ""
            res = await axios.get(rules.url, header);
            if (rules.formhash) formhash = res.data.match(rules.formhash)
            if (!res.data.match(rules.verify)) {
                ckstatus = 1
                formhash = formhash ? formhash[1] : ""
                for (i = 0; i < rules.op.length; i++) {
                    console.log("去" + rules.op[i].name)
                    header.headers["User-Agent"] = (rules.op[i].ua == "pc" )? "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Safari/537.36" : "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36"
                    let signurl = rules.op[i].url.replace(/@formhash/, formhash);
                    delete(header.responseType)
                    if (rules.op[i].charset) {
                        header.responseType = "arraybuffer"
                    }
                    if (rules.op[i].method == "post") {
                        data = rules.op[i].data
                        res2 = await axios.post(signurl, data.replace(/@formhash/, formhash), header);
                    } else {
                        res2 = await axios.get(signurl, header);
                    }
                    if (rules.op[i].charset) {
                        res2data = require("iconv-lite").decode(res2.data, rules.op[i].charset);
                    } else {
                        res2data = res2.data
                    }
                    res2data = "" + res2data
                    if (res2data.match(/id=\"messagetext\".*?<p>(.+?)<\/p>/s)) { //dz论坛大多都是
                        msg = res2data.match(/id=\"messagetext\".*?<p>(.+?)</s)[1];
                    } else if ((!rules.name.match(/togamemod/))&&res2data.match(/<root><!\[CDATA\[/)) {
                        msg = res2data.match(/<!\[CDATA\[(.+?)>/)[1].replace(/]/g, "").replace(/<script.+/, "")
                        if (rules.name == "【Hires后花园】： " && res2.data.match(/签到成功/)) msg = res2data.match(/签到成功~随机奖励新币\d+/)[0]
                    } else if (rules.op[i].reg2 && res2data.match(rules.op[i].reg2)) {
                        msg = "今天已经" + rules.op[i].name + "过啦";
                    } else if (rules.op[i].reg3 && res2data.match(rules.op[i].reg3)) {
                        msg = res2data.match(rules.op[i].info)[0];
                    } else {
                        msg = rules.op[i].name + "失败!原因未知";
                        console.log(res2data);
                    }
                    message += "    " + (rules.op.length > 1 ? (rules.op[i].name + "：") : "") + msg + "\n"
                    console.log(msg)
                }
            } else {
                ckstatus = 0
                message = "  cookie失效";
            }
        } catch (err) {
            console.log(err);
            message = "接口请求失败"
        }
        resolve(message);
    });
}

module.exports = Template;