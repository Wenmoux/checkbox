const axios = require("axios");

function Template(rules) {
    return new Promise(async (resolve) => {
        try {
            const header = {
                headers: {
                    cookie: rules.cookie,
                    referer: rules.url1,
                    "User-Agent": rules.ua == "pc" ? "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Safari/537.36" : "Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36"
                }
            };
            res = await axios.get(rules.url1, header);
            formhash = res.data.match(rules.reg1)
            if (!res.data.match(rules.verify)) {
                ckstatus = 1
                let signurl = rules.signurl.replace(/@formhash/, formhash[1]);               
                if (rules.charset) {
                    header.responseType = "arraybuffer"
                }
                if (rules.signmethod == "post") {
                    data = rules.signdata
                    res2 = await axios.post(
                        signurl,
                        data.replace(/@formhash/, formhash[1]),
                        header
                    );
                } else {
                    res2 = await axios.get(signurl, header);
                }
                if (rules.charset) {
                    res2data = require("iconv-lite").decode(res2.data, rules.charset);
                } else {
                    res2data = res2.data
                }
//                console.log(res2data)
                if (res2data.match(/id=\"messagetext\">.*?<p>(.+?)<\/p>/s)) { //dz论坛大多都是
                    msg = res2data.match(/id=\"messagetext\">.*?<p>(.+?)</s)[1];
                } else if (!rules.name.match("togamemod")&&res2data.match(/<root><!\[CDATA\[/)) {
                    console.log(res2data)
                    msg = res2data.match(/<!\[CDATA\[(.+?)>/)[1].replace(/]/g, "")
                } else if (res2data.match(rules.reg2)) {
                    msg = "今天已经" + rules.op + "过啦";
                } else if (res2data.match(rules.reg3)) {
                    msg = res2data.match(rules.info)[0];
                } else {
                    msg = rules.op + "失败!原因未知";
                    console.log(res2data);
                }
            } else {
                ckstatus = 0
                msg = "cookie失效";
            }

            console.log(msg);
            //   console.log(msg);
        } catch (err) {
            console.log(err);
            msg = rules.op + "接口请求失败"
        }
        resolve(msg);
    });
}

module.exports = Template;