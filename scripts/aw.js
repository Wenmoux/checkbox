// 爱吾游戏宝盒全能自动脚本 v4.0 - 兼容依赖版本
// 配置文件字段：config.aiwu.*
const axios = require('axios');
const crypto = require('crypto');
// querystring 是 Node.js 内置模块，无需 require

// =====================================================================
// 1. 配置和常量定义
// =====================================================================
const USER_CONFIG = {
    VersionCode: config.aiwu.VersionCode || "2050902",
    Serial: config.aiwu.Serial || "", // 设备序列号
    Phone: config.aiwu.Phone || "",
    PhoneCP: config.aiwu.PhoneCP || "",
    Channel: config.aiwu.Channel || "25az",
    VIPSign: config.aiwu.VIPSign || "",
    AppPackageName: config.aiwu.AppPackageName || "com.aiwu.market",
    oaid: config.aiwu.oaid || "",
    android_id: config.aiwu.android_id || "",
    isLogin: config.aiwu.isLogin || "1",
    UserId: config.aiwu.UserId || "" // 用户ID
};

const BASE_URL = "https://service.25game.com/v2";
const API = {
    TASK: "/User/MyTask.aspx",   // 日常任务 & 领奖
    BBS:  "/BBS/BBSPost.aspx"    // 论坛签到
};

const HEADERS = {
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'User-Agent': 'okhttp-okgo/jeasonlzy',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'service.25game.com',
    'Connection': 'Keep-Alive',
    'Accept-Encoding': 'gzip'
};

// =====================================================================
// 2. 工具函数
// =====================================================================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 部分反转字符串
function partialReverse(str) {
    let arr = str.split('');
    for (let i = 0; i < 16; i += 2) {
        let j = 31 - i;
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr.join('');
}

// 生成签名
function generateSignature(params, timestamp) {
    const finalParams = { ...params, Time: timestamp };
    const sortedKeys = Object.keys(finalParams).sort();
    
    let javaString = "";
    sortedKeys.forEach(key => {
        let val = finalParams[key];
        if (val === undefined || val === null) val = "";
        javaString += `${key}=${val}&`;
    });

    const salt = "Wlb=wlbnb&Key=AppKey";
    const remainder = parseInt(timestamp, 10) % 8;
    const rawString = `${javaString}${salt}${timestamp}${remainder}`;

    const md5Step1 = crypto.createHash('md5').update(rawString).digest('hex');
    const reversedStr = partialReverse(md5Step1);
    return crypto.createHash('md5').update(reversedStr).digest('hex');
}

// 构建查询字符串
function buildQueryString(data) {
    return Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');
}

// =====================================================================
// 3. 网络请求封装
// =====================================================================
async function sendRequest(apiPath, businessParams = {}) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const requestParams = { ...USER_CONFIG, ...businessParams };
    const sign = generateSignature(requestParams, timestamp);
    
    const bodyData = { 
        ...requestParams, 
        Time: timestamp, 
        Sign: sign 
    };

    try {
        const response = await axios.post(BASE_URL + apiPath, buildQueryString(bodyData), {
            headers: HEADERS
        });
        return response.data;
    } catch (error) {
        console.error(`[请求异常] ${apiPath}: ${error.message}`);
        return null;
    }
}

// =====================================================================
// 4. 业务逻辑函数
// =====================================================================
async function runDailyTasks() {
    const logs = ["执行日常活跃任务"];
    
    const tasks = [
        { name: "每日签到", act: "DailyLogin" },
        { name: "云游戏打卡", act: "DailyCloudGame" },
        { name: "每日搜索", act: "DailySearchGame" },
        { name: "每日分享", act: "DailyShare" },
        { name: "每日下载", act: "DailyDown" },
    ];

    for (const t of tasks) {
        const res = await sendRequest(API.TASK, { Act: t.act });
        logs.push(`${t.name}: ${res?.Message || (res ? "完成" : "失败")}`);
        await sleep(1200);
    }

    // 广告需要看2次
    for (let i = 1; i <= 2; i++) {
        const res = await sendRequest(API.TASK, { Act: 'DailyLookAd' });
        logs.push(`观看广告第${i}次: ${res?.Message || "完成"}`);
        await sleep(2000);
    }
    
    return logs;
}

async function runBbsSign() {
    const logs = ["执行论坛版块签到"];
    const sessionIds = [5, 6, 12, 13]; // 常见版块ID

    for (const id of sessionIds) {
        const res = await sendRequest(API.BBS, { 
            Act: "SignSession", 
            SessionId: id 
        });
        
        if (res?.Code === "0") {
            logs.push(`签到版块[ID:${id}]: ${res.Message}`);
        } else {
            logs.push(`签到版块[ID:${id}]: ${res?.Message || "失败"}`);
        }
        await sleep(1500);
    }
    
    return logs;
}

async function runClaimRewards() {
    const logs = ["检查并领取奖励"];
    const res = await sendRequest(API.TASK, {});
    
    if (!res || !res.Data) {
        logs.push("获取任务列表失败");
        return logs;
    }

    let claimCount = 0;
    for (const task of res.Data) {
        const name = task.TaskNum;
        if (name == "每日登录") continue;
        const cur = parseInt(task.CompleteNum);
        const total = parseInt(task.TotalNum);
        const isReceived = (task.isReward === "True");
        const taskNo = task.TaskNo;

        if (cur >= total && !isReceived && taskNo) {
            const claim = await sendRequest(API.TASK, {
                TaskNo: taskNo,
                Act: 'ReceiveAward'
            });
            
            if (claim?.Code === "0") {
                logs.push(`领取[${name}]: 成功 金币+${claim.RewardGold}, 经验+${claim.RewardExp}`);
                claimCount++;
            } else {
                logs.push(`领取[${name}]: 失败 ${claim?.Message}`);
            }
            await sleep(1000);
        }
    }

    if (claimCount === 0) logs.push("没有可领取的奖励");
    return logs;
}

// =====================================================================
// 5. 主函数 - 适配checkbox.js模板
// =====================================================================
async function main() {
    let result = "【爱吾游戏宝盒】：";
    const allLogs = [];
    
    try {
        // 验证必要配置
        if (!USER_CONFIG.UserId || !USER_CONFIG.Serial) {
            return result + "请先配置UserId和Serial参数";
        }
        
        // 执行日常任务
        const dailyLogs = await runDailyTasks();
        allLogs.push(...dailyLogs);
        
        // 执行论坛签到
        const bbsLogs = await runBbsSign();
        allLogs.push(...bbsLogs);
        
        // 领取奖励
        const rewardLogs = await runClaimRewards();
        allLogs.push(...rewardLogs);
        
        // 汇总结果
        const successCount = allLogs.filter(log => 
            log.includes("成功") || 
            log.includes("完成") || 
            log.includes("金币+")
        ).length;
        
        result += `任务执行完成，成功项: ${successCount}/${allLogs.length -3}`;
        
        // 将详细日志作为第二行（如果需要）
        const detailLogs = allLogs.map(log => `    ${log}`).join('\n');
        if (detailLogs) {
            result += `\n详细:\n${detailLogs}`;
        }
        
    } catch (error) {
        console.error("脚本执行出错:", error);
        result += "脚本执行异常: " + error.message;
    }
    
    return result;
}

// =====================================================================
// 6. 导出模块
// =====================================================================
module.exports = main;