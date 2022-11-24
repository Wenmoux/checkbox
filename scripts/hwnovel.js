token = config.hwnovel.token

const CryptoJS = require("crypto-js");
const axios = require("axios");

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).replaceAll("-", "");
}

function decrypt(data) {
    let key = CryptoJS.enc.Utf8.parse('ZUreQN0E')
    decrypted = CryptoJS.DES.decrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

function encrypt(data) {
    let key = CryptoJS.enc.Utf8.parse('ZUreQN0E')
    encrypted = CryptoJS.DES.encrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
}

function post(options) {
    let timestamp = Math.round(new Date());
    let requestId = guid();
    let param = encrypt(JSON.stringify({
        ...options.data,
        timestamp: timestamp
    }))
    let sign = CryptoJS.MD5(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`))).toString().toUpperCase()
    url = `https://api.hwnovel.com/api/ciyuanji/client/${options.url}`
    return new Promise((resolve, reject) => {
        axios({
                url: url,
                method: "post",
                data: {
                    param,
                    requestId,
                    sign,
                    timestamp
                },
                headers: {
                    channel: "25",
                    deviceno: "0000000000000000",
                    platform: "1",
                    imei: "",
                    targetmodel: "Mi 12",
                    oaid: "",
                    version: "3.2.7",
                    token: token,
                    "user-agent": "Mozilla/5.0 (Linux; Android 11; Pixel 4 XL Build/RP1A.200720.009; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.115 Mobile Safari/537.36"
                }
            })
            .then((response) => {
                resolve(response.data)
            })
    })
}

function get(options) {
    let timestamp = Math.round(new Date());
    let requestId = guid();
    let param = encrypt(JSON.stringify({
        ...options.data,
        timestamp: timestamp
    }))
    let sign = CryptoJS.MD5(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`))).toString().toUpperCase()
    url = `https://api.hwnovel.com/api/ciyuanji/client/${options.url}`
    return new Promise((resolve, reject) => {
        axios({
                url: url,
                method: "get",
                params: {
                    param,
                    requestId,
                    sign,
                    timestamp
                },
                headers: {
                    channel: "25",
                    deviceno: "0000000000000000",
                    platform: "1",
                    imei: "",
                    targetmodel: "Mi 12",
                    oaid: "",
                    version: "3.2.7",
                    token: token,
                    "user-agent": "Mozilla/5.0 (Linux; Android 11; Pixel 4 XL Build/RP1A.200720.009; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.115 Mobile Safari/537.36"
                }
            })
            .then((response) => {
                resolve(response.data)
            })
    })
}

//助力
var zhuli = async function(type) {
    return await post({
        url: "fission/invite/writeInviteCode",
        data: {
            inviteCode: "VCYAF7",
            actionCode: "CYJ_INVITE_SEND_VIP"
        }
    }).then((res) => {
        return res;
    });
};

//加入书架
var shelfbook = async function(type) {
    return await post({
        url: "bookrack/addOrDeleteBookRack",
        data: {
            bookIdList: ["14447"],
            isDelete: type
        }
    }).then((res) => {
        return res;
    });
};

//签到
var sign = async function() {
    return await post({
        url: "sign/sign",
        data: {}
    }).then((res) => {
        return res;
    });
};

//阅读时长
var startread = async function() {
    return await post({
        url: "read/start",
        data: {
            bookId: "10291",
            bookName: "我的黄毛APP",
            startChapter: "2674520",
            startChapterName: "第1章 神奇的APP"
        }
    }).then((res) => {
        return res;
    });
};

var endread = async function(readId) {
    return await post({
        url: "read/end",
        data: {
            bookId: "10291",
            readId: readId,
            endChapter: "3043014",
            endChapterName: "第40章 使用道具",
            chapterCount: "40"
        }
    }).then((res) => {
        return res;
    });
};

//领取奖励
var receive = async function(taskId, rewardId) {
    return await post({
        url: "task/receiveTaskReward",
        data: {
            taskId: taskId,
            rewardId: rewardId
        }
    }).then((res) => {
        return res;
    });
};

//任务列表
var gettask = async function() {
    return await get({
        url: "task/getTaskList",
        data: {}
    }).then((res) => {
        return res;
    });
};

async function hwnovel() {
    let result = "【次元姬小说】：";
    a = await sign();
    console.log(a.msg);
    await zhuli();
    await shelfbook("1");
    await shelfbook("0");
    let res = await gettask();
    tasklist = res.data.daliyTask;
    for (i in tasklist) {
        taskname = tasklist[i].taskName;
        status = tasklist[i].finishNum == 1 ? "已完成" : "未完成";
        if (tasklist[i].finishNum) await receive(tasklist[i].tasklist[i], tasklist[i].rewardId)
        result += `${taskname}：${status}  ||  `;
    }
    console.log(result);
    return result;
}
module.exports = hwnovel;
