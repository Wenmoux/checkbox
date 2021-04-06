const axios = require("axios");

function Template(rules) {
    return new Promise(async (resolve) => {
        try {
            const header = {
                headers: {
                    cookie: rules.cookie
                }
            };
            res = await axios.get(rules.url1, header);
            let formhash = res.data.match(rules.reg1)
             if (formhash&&!res.data.match(rules.verify)) {
                let signurl = rules.signurl.replace(/@formhash/, formhash[1]);
               // console.log(signurl)
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
                console.log(res2data)
                if (res2data.match(rules.reg2)) {
                    msg = "今天已经签到过啦";
                } else if (res2data.match(rules.reg3)) {
                    msg = res2data.match(rules.info)[0];
                } else {
                    msg = "签到失败!原因未知";
                    console.log(res2data);
                }
            } else {
                msg = "cookie失效";
            }

            console.log(msg);
            //   console.log(msg);
        } catch (err) {
            console.log(err);
            msg = "签到失败"
        }
        resolve(rules.name + msg);
    });
}

module.exports = Template;