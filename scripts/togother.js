const axios = require('axios');

// 请求头配置
const headers = {
    'Authorization': config.togother.authorization, // 请替换成你实际的Token
    'User-Agent': 'Dart/3.9 (dart:io)',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
};

// 签到请求
const checkIn = async () => {
    const endpoint = 'https://togother.autooj.cn/api/check_in/daily';
    try {
        const response = await axios.post(endpoint, {}, { headers });
        
        // 检查请求是否成功
        if (response.status === 200 && response.data.code === 1) {
            return `签到: 成功\n积分: ${response.data.data.points_earned}`;
        } else {
            return `签到: 失败\n失败原因: ${response.data.detail || '未知错误'}`;
        }
    } catch (error) {
        // 捕获请求错误
        if (error.response) {
            return `签到: 失败\n失败原因: ${error.response.data.detail || '未知错误'}`;
        } else {
            return `签到: 失败\n失败原因: ${error.message}`;
        }
    }
};

// 查询签到状态
const getCheckInStatus = async () => {
    const endpoint = 'https://togother.autooj.cn/api/check_in/status';
    try {
        const response = await axios.get(endpoint, { headers });
        
        // 检查请求是否成功
        if (response.status === 200 && response.data.code === 1) {
            const { checked_in_today, total_check_ins, available_points } = response.data.data;
            const message = checked_in_today ? 
                `今天已经签到` : 
                `今天未签到`;
            return `签到状态: ${message}\n签到总天数: ${total_check_ins}\n可用积分: ${available_points}`;
        } else {
            return `签到状态查询失败\n失败原因: ${response.data.detail || '未知错误'}`;
        }
    } catch (error) {
        // 捕获请求错误
        if (error.response) {
            return `签到状态查询失败\n失败原因: ${error.response.data.detail || '未知错误'}`;
        } else {
            return `签到状态查询失败\n失败原因: ${error.message}`;
        }
    }
};

// 主任务执行
const task = async () => {
    let resultMessage = '';
    try {
        // 执行签到请求
        const checkInMsg = await checkIn();
        resultMessage += `【一起看】：\n${checkInMsg}\n\n`;

        // 查询签到状态
        const statusMsg = await getCheckInStatus();
        resultMessage += `${statusMsg}\n`;

        // 返回任务执行结果
        return resultMessage;
    } catch (error) {
        return `【一起看】：\n任务执行失败\n失败原因: ${error.message}`;
    }
};

// 执行任务并返回结果
module.exports = task;