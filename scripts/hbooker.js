login_token = config.hbooker.token
account = config.hbooker.account
device_token = config.hbooker.device_token
app_version = config.hbooker.app_version
book_id = config.hbooker.book_id
reader_id = config.hbooker.reader_id

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

const bid = ["100000261", "100346721", "100176787", "100249884", "100157527", "100290836", "100010414", "100323847", "100293922", "100011781", "100270157", "100298957", "100307181", "100160977", "100347557", "100022599", "100224892", "100342877", "100200701", "100223432", "100013655", "100251947", "100323512", "100346080", "100345269", "100330554", "100207022", "100348306", "100338867", "100343334", "100329075", "100267379", "100344061", "100315292", "100109282", "100346435", "100316738", "100327682", "100261359", "100298170", "100341741", "100309334", "100148023", "100186398", "100322590", "100231152", "100001911", "100343604", "100178539", "100112231", "100154036", "100076156", "100196970", "100232509", "100331806", "100278085", "100314027", "100257200", "100189173", "100346496", "100348631", "100290862", "100330253", "100028314", "100319861", "100068373", "100194598", "100064002", "100231168", "100131235", "100000468", "100078988", "100348486", "100200773", "100087840", "100283898", "100294618", "100251912", "100142214", "100307878", "100031172", "100229272", "100220880", "100222145", "100176385", "100230478", "100284074", "100120225", "100347886", "100129433", "100250125", "100232265", "100348240", "100343135", "100192167", "100135962", "100093278", "100276545", "100097482", "100013658"]

const book = {
    data: [{
            bid: "100346721",
            list: ["109614912", "109589642", "109586662", "109589701", "109631032", "109631029", "109625745", "109626991", "109643147", "109638517"]
        },
        {
            bid: "100293922",
            list: ["108315620", "108284663", "108289456", "108294592", "108267077", "108272356", "108239560", "108248456", "108220236", "108215820"]
        },
        {

            bid: "100323512",
            list: ["109012824", "109013007", "108980293", "108989400", "108952587", "108942799", "108933344", "108927340", "108915351", "108904304"]
        },
        {
            bid: "100338867",
            list: ["109363038", "109360440", "109351751", "109340611", "109337642", "109321224", "109325405", "109326171", "109323353", "109319366"]
        },
        {
            bid: "100343334",
            list: ["109562898", "109563193", "109537168", "109541302", "109537184", "109502951", "109499567", "109482527", "109482930", "109476426"]
        }
    ]
}

const bbsId = ["1093254", "1093253", "1093252", "1093225", "1093198", "1093197", "1093196", "1093194", "1093195", "1093181", "1093180", "1093170", "1093150", "1093124", "1093098", "1093096", "1093035", "1093034", "1093033", "1093031", "1093003", "1092970", "1092954", "1092955", "1092929", "1092928", "1092926", "1092924", "1092925", "1092914", "1092905", "1092893", "1092890", "1092886", "1092885", "1092884", "1092882", "1092881", "1092880", "1092879", "1092878", "1092845", "1092838", "1092837", "1092763", "1092762", "1092756", "1092741", "1092740", "1092720", "1092719", "1092706", "1092682", "1092676", "1092644", "1092643", "1092638", "1092637", "1092636", "1092634", "1092633", "1092628", "1092620", "1092602", "1092601", "1092595", "1092592", "1092586", "1092585", "1092578", "1092526", "1092524", "1092522", "1092521", "1092520", "1092518", "1092507", "1092509", "1092508", "1092505", "1092469", "1092452", "1092442", "1092418", "1092371", "1092370", "1092369", "1092368", "1092367", "1092349", "1092343", "1092337", "1092328", "1092299", "1092220", "1092219", "1092197", "1092176", "1092148", "1092147"]

//书架两本
var shelfbook = async function() {
    let random = Math.floor(Math.random() * 99)
    let bookId = bid[random]
    await post({
        url: `bookshelf/favor`,
        data: {
            shelf_id: "",
            book_id: bookId
        }
    })
    await post({
        url: `bookshelf/delete_shelf_book`,
        data: {
            shelf_id: "",
            book_id: bookId
        }
    })
};

//签到
var sign = async function() {
    return await post({
        url: "reader/get_task_bonus_with_sign_recommend",
        data: {
            task_type: 1
        }
    }).then((res) => {
        return res;
    });
};

//获取用户背包
var give = async function () {
    if (book_id) {
        return await post({
            url: "reader/get_my_info",
            data: {
                reader_id: reader_id
            }
        }).then(async (res) => {
            prop_info=res.data.prop_info
            msg = "";
            if (0 != prop_info.rest_recommend) {//推荐票
                return await post({
                    url: "book/give_recommend",
                    data: {
                        book_id: book_id,
                        count: prop_info.rest_recommend
                    }
                }).then((res) => {
                    if(res.code==100000){
                        msg += "投出" + prop_info.rest_recommend + "张推荐票";
                        console.log(msg);
                        return msg;
                    }else{
                        console.log(prop_info);
                        msg += "投推荐票失败";
                        return msg;
                    }
                });
            }
            return msg;
        });
    }
};

//分享插画区帖子
var share_bbs = async function() {
    let random = Math.floor(Math.random() * 99);
    let bbs_id = bbsId[random];
    return await post({
        url: "bbs/share_bbs",
        data: {
            bbs_id: bbs_id
        }
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
        }
    }).then((res) => {
        return res;
    });
};

//浏览20间贴
var view = async function() {
    let cid = Math.ceil(Math.random() * 10000);
    return await post({
        url: "chapter/get_paragraph_tsukkomi_list_new",
        data: {
            count: 1000,
            chapter_id: cid,
            paragraph_index: 5,
            page: 0
        }
    }).then((res) => {
        return res;
    });
};

//阅读60min
var addr = async function() {
    let a = Math.floor(Math.random() * 9);
    let b = Math.floor(Math.random() * 4);
    let bid = book.data[b].bid
    let cid = book.data[b].list[a]
    return await post({
        url: "reader/add_readbook",
        data: {
            readTimes: 1200,
            getTime: getNowFormatDate(),
            book_id: bid,
            chapter_id: cid
        }
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
        }
    }).then((res) => {
        return res;
    });
};

//点赞5个插画区帖子
var dianzan = async function(a) {
    for (let i = 1; i <= 5; i++) {
        let random = Math.floor(Math.random() * 99);
        let bbs_id = bbsId[random];
        await post({
            url: `bbs/unlike_bbs`,
            data: {
                bbs_id: bbs_id
            }
        })
        await post({
            url: `bbs/like_bbs`,
            data: {
                bbs_id: bbs_id
            }
        })
        await post({
            url: `bbs/unlike_bbs`,
            data: {
                bbs_id: bbs_id
            }
        })
    }
};

//任务列表
var gettask = async function() {
    return await post({
        url: "task/get_all_task_list",
        data: {}
    }).then((res) => {
        return res;
    });
};

async function ce() {
    let res = await gettask();
    let a = res.data.daily_task_list[2].task_type;
    switch (a) {
        case "21":
            await dianzan("like");
            break; //点赞5个插画区帖子
        case "19":
            await addb();
            break; //浏览插画区5min
        case "20":
            await share_bbs();
            break; //分享插画区帖子
    }
}

async function hbooker() {
    let result = "【刺猬猫小说】：";
    a = await sign();
    if (a.code == 100000 || a.code == 340001) {
        //阅读60min
        await addr();
        await addr();
        await addr();
        await ce();
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
    b = await give();
    result += b
    console.log(result);
    return result;
}

module.exports = hbooker;