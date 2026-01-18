const axios = require("axios");

// 从配置文件读取
const token = config.mcdonald.token;
const baseURL = "https://mcp.mcd.cn/mcp-servers/mcd-mcp";

let result = "【麦当劳MCP】：";

// 通用请求函数
function request(toolName, args = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            const requestBody = {
                jsonrpc: "2.0",
                id: Date.now(),
                method: "tools/call",
                params: {
                    name: toolName,
                    arguments: args
                }
            };

            const res = await axios.post(baseURL, requestBody, { headers });

            if (res.data && res.data.result) {
                resolve(res.data.result);
            } else if (res.data && res.data.error) {
                reject(new Error(res.data.error.message || "请求失败"));
            } else {
                resolve(res.data);
            }
        } catch (err) {
            console.error("请求失败:", err.message);
            reject(err);
        }
    });
}

// 查询可领取的优惠券列表
async function getAvailableCoupons() {
    try {
        const res = await request("available-coupons");
        return res;
    } catch (err) {
        result += "查询优惠券列表失败: " + err.message + "  ";
        return null;
    }
}

// 一键领取所有优惠券
async function autoBindCoupons() {
    try {
        const res = await request("auto-bind-coupons");
        return res;
    } catch (err) {
        result += "一键领券失败: " + err.message + "  ";
        return null;
    }
}

// 查询我的优惠券
async function getMyCoupons() {
    try {
        const res = await request("my-coupons");
        return res;
    } catch (err) {
        result += "查询我的优惠券失败: " + err.message + "  ";
        return null;
    }
}

// 查询活动日历
async function getCampaignCalendar(specifiedDate = null) {
    try {
        const args = specifiedDate ? { specifiedDate } : {};
        const res = await request("campaign-calender", args);
        return res;
    } catch (err) {
        result += "查询活动日历失败: " + err.message + "  ";
        return null;
    }
}

// 解析MCP返回的文本内容
function parseTextContent(toolResult) {
    if (!toolResult || !toolResult.content) return "";

    const textContent = toolResult.content.find(item => item.type === "text");
    return textContent ? textContent.text : "";
}

// 主函数
async function mcdonald() {
    return new Promise(async (resolve) => {
        try {
            // 1. 查询可领取的优惠券
            console.log("正在查询可领取的优惠券...");
            const availableCoupons = await getAvailableCoupons();
            if (availableCoupons) {
                const availableText = parseTextContent(availableCoupons);
                console.log(availableText);

                // 统计可领取的券数量
                const unreceivedMatches = availableText.match(/状态：未领取/g);
                const unreceivedCount = unreceivedMatches ? unreceivedMatches.length : 0;

                if (unreceivedCount > 0) {
                    result += `发现${unreceivedCount}张可领取优惠券  `;

                    // 2. 一键领取所有优惠券
                    console.log("正在一键领取优惠券...");
                    const bindResult = await autoBindCoupons();
                    if (bindResult) {
                        const bindText = parseTextContent(bindResult);
                        console.log(bindText);

                        // 提取成功领取的数量
                        const successMatch = bindText.match(/成功.*?(\d+).*?张/s);
                        if (successMatch) {
                            result += `成功领取${successMatch[1]}张  `;
                        }

                        // 提取优惠券名称
                        const couponNameMatches = bindText.match(/✅.*?\*\*(.+?)\*\*/g);
                        if (couponNameMatches) {
                            const couponNames = couponNameMatches.map(match => {
                                const nameMatch = match.match(/\*\*(.+?)\*\*/);
                                return nameMatch ? nameMatch[1] : "";
                            }).filter(name => name);

                            if (couponNames.length > 0) {
                                result += `[${couponNames.join(", ")}]  `;
                            }
                        }
                    }
                } else {
                    result += "暂无可领取的新优惠券  ";
                }
            }

            // 3. 查询我的优惠券统计
            console.log("正在查询我的优惠券...");
            const myCoupons = await getMyCoupons();
            if (myCoupons) {
                const myText = parseTextContent(myCoupons);
                console.log(myText);

                // 提取总优惠券数
                const totalMatch = myText.match(/共.*?(\d+).*?张/);
                if (totalMatch) {
                    result += `当前共有${totalMatch[1]}张优惠券可用`;
                }
            }

        } catch (err) {
            console.error(err);
            result += "执行失败: " + err.message;
        }

        console.log(result);
        resolve(result);
    });
}

module.exports = mcdonald;
