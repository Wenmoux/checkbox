const axios = require('axios');

async function voapi() {
    let result = '【voapi】'; // 初始化结果字符串

    try {
        // 从 config 中读取 token
        const token = config.voapi.token;

        if (!token) {
            const errorMsg = `${result}-未找到有效的token配置`;
            console.log(errorMsg);
            // 确保返回字符串
            return String(errorMsg);
        }

       console.log(token);
        // 设置请求头
        const headers = {
            'Authorization': token, // 直接使用配置中的完整 token 值
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
        };

        // 发送 POST 请求
        const response = await axios.post('https://demo.voapi.top/api/check_in', {}, { headers });

        // 处理响应 - 根据实际返回结构优化
        // 成功响应示例: {"code":0,"msg":"签到成功","data":{"checkin_days":1}}
        if (response.data && response.data.code === 0) {
            const msg = response.data.msg || '签到成功';
            // 尝试从 data 中提取更多信息，例如连续签到天数
            let extraInfo = '';
            if (response.data.data) {
                if (response.data.data.checkin_days !== undefined) {
                    extraInfo += `，连续签到 ${response.data.data.checkin_days} 天`;
                }
                // 可以在这里添加对 data 中其他字段的处理
            }
            result += `${msg}${extraInfo}`;
            console.log(result);
        } else {
            // 失败响应示例: {"code":1,"msg":"今天已经签到过了"}
            const msg = response.data.msg || response.data.message || '未知错误';
            result += `签到失败: ${msg}`;
            console.log(result);
        }
    } catch (error) {
        console.error('【voapi】签到请求失败:', error.message);
        result += `签到请求失败: ${error.message}`;
        // 异常时，返回的结果字符串会包含 "失败" 或 "出错"，这会匹配 checkbox.js 中的单独推送条件
    } finally {
        // 在 finally 块中确保返回值是字符串类型
        // 这可以防止任何意外的非字符串返回值导致主程序出错
        const finalResult = String(result);
        // console.log('Final result type:', typeof finalResult, 'Value:', finalResult); // 调试用
        return finalResult;
    }
}

// 确保模块导出的是一个函数
module.exports = voapi;