const axios = require("axios")

const headers = {
    Authorization: config.hscy.authorization,
    Cookie: `b2_token=${config.hscy.authorization.slice(7)}`
};
let result = "【黑丝次元】：";
let nickname = "";
let nowCredit = 0;

function getUserInfo() {
    return new Promise(async (resolve) => {
        try {
            const url = `https://heisi.moe/wp-json/b2/v1/getUserInfo`;
            let res = await axios.post(url, "", {headers});
            nickname = res.data.user_data.name;
            nowCredit = res.data.user_data.credit;
            result += `\n[${nickname}]当前积分：${nowCredit}`;
        } catch (err) {
            console.log(err)
            result += "\n获取用户信息失败！！ ";
            console.log(result);
        }
        resolve();
    });
}

function sign() {
    return new Promise(async (resolve) => {
        try {
            const url = `https://heisi.moe/wp-json/b2/v1/userMission`;
            let res = await axios.post(url, "", {headers});
            let credit = res.data.credit ? res.data.credit : res.data
            console.log(`签到成功，获得：` + credit + "分");
            result += ` || 签到成功，获得：` + credit + "分";
        } catch (err) {
            console.log(err)
            result += " || 签到失败，已签到过或其它未知原因！！ ";
            console.log(result);
        }
        resolve();
    });
}

function submitComment() {
    return new Promise(async (resolve) => {
        try {
            const url = `https://heisi.moe/wp-json/b2/v1/commentSubmit`;
            // 0-2500随机评论
            let data = `comment_post_ID=${Math.round(Math.random() * (2500 - 0) + 0)}&author=${encodeURI(nickname)}&comment=%E5%A5%BD%E7%9C%8B&comment_parent=0&img%5BimgUrl%5D=&img%5BimgId%5D=`
            let res = await axios.post(url, data, {headers});
            console.log(`[${nickname}]评论成功`);
            result += ` || [${nickname}]评论成功`;
        } catch (err) {
            console.log(err)
            result += " || 评论失败,已评论过或其它未知原因！！ ";
            console.log(result);
        }
        resolve();
    });
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function hscy() {
    await getUserInfo();
    await sleep(1000);
    await sign();
    await sleep(1000);
    for (let i = 0; i < 5; i++) {
        await submitComment();
        await sleep(61000); // 延迟，否则太快评论不上
    }
    await getUserInfo();
    return result;
}

module.exports = hscy;
