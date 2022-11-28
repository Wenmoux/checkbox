login_token = config.hbooker.token
account = config.hbooker.account
device_token = config.hbooker.device_token
app_version = config.hbooker.app_version

const CryptoJS = require("crypto-js");
const axios = require("axios");

const decrypt = function(data) {
    let iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000')
    let key = CryptoJS.SHA256('zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn')
    let decrypted = CryptoJS.AES.decrypt(data, key, {
        mode: CryptoJS.mode.CBC,
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

function getNowFormatDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let aDate = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (aDate >= 1 && aDate <= 9) {
        aDate = "0" + aDate;
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (min >= 0 && min <= 9) {
        min = "0" + min;
    }
    if (sec >= 0 && sec <= 9) {
        sec = "0" + sec;
    }
    let currentdate = `${year}-${month}-${aDate} ${hour}:${min}:${sec}`
    return currentdate;
}

function JsonToUrl(data) {
    var tempArr = [];
    for (var i in data) {
        var key = encodeURIComponent(i);
        var value = encodeURIComponent(data[i]);
        tempArr.push(key + '=' + value);
    }
    var urlParamsStr = tempArr.join('&');
    return urlParamsStr;
}

function post(options) {
    let data = {
        ...options.data,
        app_version,
        device_token,
        login_token,
        account
    }
    return new Promise((resolve, reject) => {
        axios({
                url: `https://app.happybooker.cn/${options.url}`,
                method: "post",
                data: JsonToUrl(data),
                headers: {
                    "user-agent": `Android  com.kuangxiangciweimao.novel  ${app_version},Xiaomi, Mi 12, 31, 12`
                }
            })
            .then((response) => {
                let res = decrypt(response.data)
                resolve(JSON.parse(res))
            })
    })
}

//书架两本
var shelfbook = async function(collect) {
    return await post({
        url: `/bookshelf/${collect}`,
        data: {
            shelf_id: "",
            book_id: "100136011"
        },
    }).then((res) => {
        return res;
    });
};

//签到
var sign = async function() {
    return await post({
        url: "reader/get_task_bonus_with_sign_recommend",
        data: {
            task_type: 1
        },
    }).then((res) => {
        return res;
    });
};

//阅读章节
var record = async function(cid) {
    return await post({
        url: "chapter/set_read_chapter_record",
        data: {
            chapter_id: cid
        },
    }).then((res) => {
        return res;
    });
};

var view = async function() {
    return await post({
        url: "chapter/get_paragraph_tsukkomi_list_new",
        data: {
            count: 1000,
            chapter_id: 105494781,
            paragraph_index: 5,
            page: 0
        },
    }).then((res) => {
        return res;
    });
};

//阅读60min
var addr = async function() {
    return await post({
        url: "reader/add_readbook",
        data: {
            readTimes: 1200,
            getTime: getNowFormatDate(),
            book_id: 100166786,
            chapter_id: 105495180
        },
    }).then((res) => {
        return res;
    });
};

//浏览插画区5min
var addb = async function() {
    return await post({
        url: "bbs/add_bbs_read_time",
        data: {
            readTimes: 300,
            getTime: getNowFormatDate()
        },
    }).then((res) => {
        return res;
    });
};

//任务列表
var gettask = async function() {
    return await post({
        url: "task/get_all_task_list",
        data: {},
    }).then((res) => {
        return res;
    });
};

async function hbooker() {
    let result = "【刺猬猫小说】：";
    a = await sign();
    if (a.code == 100000 || a.code == 340001) {
        a = Math.ceil(Math.random() * 10000);
        for (i = a; i < a + 20; i++) {
            await record(i++); //阅读10章
        }
        //浏览20间贴
        await view();
        //阅读60min
        await addr();
        await addr();
        await addr();
        //浏览插画区5min
        await addb();
        let res = await gettask();
        tasklist = res.data.daily_task_list;
        for (i in tasklist) {
            taskname = tasklist[i].name;
            status = tasklist[i].is_finished == 1 ? "已完成" : "未完成";
            result += `${taskname}：${status}  ||  `;
        }
    } else {
        result = a && a.tip
        console.log(a);
    }
    console.log(result);
    return result;
}

module.exports = hbooker;