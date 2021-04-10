const mixin = {
    baseUrl: "https://app.3000.com", 
    standardFlag: true,
    timeout: 15000,
    withCredentials: false 
};
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const axios = require("axios")
token = config.shanyi.token
u = config.shanyi.u
urlpara = "&v=1.0.0&app_version=2.1.0&client="+config.shanyi.client
datapara = "&u=" + encodeURIComponent(u) + "&token=" + encodeURIComponent(token)
function post(options) {
    //let params = Object.assign({}, para, options.para);
    return new Promise((resolve, reject) => {
        axios.post(mixin.baseUrl + options.url + urlpara, options.data + datapara, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (iPad; CPU OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148shanyi/2.1.0(ios;iPad7,5;13.600000)/6b8bddfe6e14719b12fe40e523c3dc370cd9f9b0"
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                console.log(err)
                resolve({
                    tip: err
                });
            });
    });
}

var task = async function(name, url, data) {
    return await post({
        url: url,
        data: data
    }).then(res => {
        //  console.log(res)
        console.log(`${name}：${res.msg}`)
        return res;
    });
};

function jm(data) {
    let algorithm = 'aes-128-cbc'
    let passwd = 'WDF#$H*#SJN*&G$&'
    let iv = 'JH&$GF$DR%*K@SC%'
    let cryptojs = require('crypto-js');
    str = cryptojs.AES.encrypt("" + data, cryptojs.enc.Utf8.parse(passwd), {
        iv: cryptojs.enc.Utf8.parse(iv),
        mode: cryptojs.mode.CBC,
        // padding: cryptojs.pad.Pkcs7
    })
    return encodeURIComponent(str.toString())
}

module.exports={
task,
jm
}