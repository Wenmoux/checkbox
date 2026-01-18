# 麦当劳MCP签到使用说明

## 功能说明

本脚本基于麦当劳MCP协议实现以下功能：
- ✅ 自动查询可领取的优惠券列表
- ✅ 一键领取所有可用优惠券
- ✅ 查询当前拥有的优惠券数量
- ✅ 支持活动日历查询

## 配置步骤

### 1. 申请MCP Token

访问麦当劳MCP开放平台：https://open.mcd.cn/mcp/doc

按照官方文档申请你的MCP Token

### 2. 配置文件

在 `config.yml` 文件中添加以下配置：

```yaml
mcdonald:
  token: YOUR_MCP_TOKEN  # 替换为你申请的MCP Token
```

### 3. 添加到任务列表

在 `config.yml` 中的 `cbList` 中添加 `mcdonald`：

```yaml
cbList: ssly&fishc&mcdonald  # 在已有任务后添加&mcdonald
```

## 运行方式

### 本地运行

```bash
# 运行单个任务
node checkbox.js mcdonald

# 运行所有配置的任务
node checkbox.js
```

### 青龙面板运行

1. 将脚本文件上传到青龙面板
2. 在配置文件中添加麦当劳配置
3. 添加定时任务，命令为：`node checkbox.js mcdonald`

### 云函数运行

按照项目原有的云函数部署方式部署即可

## 实现原理

本脚本使用麦当劳官方提供的MCP Server API：

- **接入地址**：`https://mcp.mcd.cn/mcp-servers/mcd-mcp`
- **认证方式**：Bearer Token (在请求头中携带)
- **协议**：Streamable HTTP

### 调用的MCP工具

1. `available-coupons` - 查询可领取的优惠券列表
2. `auto-bind-coupons` - 一键领取所有可用优惠券
3. `my-coupons` - 查询已领取的优惠券

### 请求格式

```json
{
  "jsonrpc": "2.0",
  "id": 1234567890,
  "method": "tools/call",
  "params": {
    "name": "auto-bind-coupons",
    "arguments": {}
  }
}
```

## 注意事项

⚠️ **重要提示**：

1. 每个Token每分钟最多允许600次请求，超过限制会返回429错误
2. 请妥善保管你的MCP Token，避免泄露
3. 当前仅支持MCP Version 2025-06-18及之前的版本
4. 脚本会自动解析MCP返回的Markdown格式内容

## 运行效果

```
【麦当劳MCP】：发现3张可领取优惠券  成功领取3张  [9.9元薯你最甜, 11.9元麦乐鸡, 北非蛋风味麦满分]  当前共有8张优惠券可用
```

## 技术特点

1. ✨ 基于官方MCP协议，稳定可靠
2. 🚀 自动解析Markdown格式的返回内容
3. 📊 智能提取优惠券数量和名称
4. 🔄 支持批量领取，无需手动操作
5. 📝 详细的日志输出，便于调试

## 开发参考

- [麦当劳MCP官方文档](https://open.mcd.cn/mcp/doc)
- [MCP协议规范](https://modelcontextprotocol.io/)

## 问题反馈

如遇到问题，请提供以下信息：

1. Token是否有效（可通过官方文档测试）
2. 完整的错误日志
3. 配置文件内容（注意隐藏Token）

---

**祝你用餐愉快！🍔🍟**
