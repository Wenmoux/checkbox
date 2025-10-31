# 项目概述

这是一个基于 Node.js 的签到自动化项目，名为“签到盒” (checkbox)。其主要目的是通过执行 JavaScript 脚本来自动完成各种网站和应用程序的每日签到任务，以获取积分、奖励或其他福利。项目支持本地运行、云函数部署以及在青龙面板中使用。

核心功能：
*   **多平台签到**：支持众多网站和 App 的签到脚本，如多看阅读、晋江文学城、AcFun、网易云游戏等（具体列表见 README.md）。
*   **灵活配置**：通过 `config.yml` 文件配置各平台的 Cookie 和其他必要参数。
*   **多种运行方式**：可通过命令行直接运行 (`node index.js`)，指定特定脚本运行，或在青龙面板中定时执行。
*   **消息推送**：支持多种推送方式（如 Telegram、Server 酱、企业微信等）将签到结果通知给用户。
*   **模块化设计**：每个签到任务对应 `scripts` 目录下的一个独立 `.js` 文件，便于维护和扩展。

技术栈：
*   **语言**: JavaScript (Node.js)
*   **依赖管理**: npm
*   **主要依赖库**:
    *   `axios`: 用于发送 HTTP 请求。
    *   `js-yaml`: 用于解析 YAML 配置文件。
    *   `crypto-js`: 用于加密/解密操作（如闪艺脚本中的参数加密）。
    *   `yargs`: 用于处理命令行参数。
    *   `iconv-lite`, `fs`: 辅助库。

# 构建与运行

## 1. 环境准备
*   确保系统已安装 Node.js (建议版本 >= 12) 和 npm。

## 2. 安装依赖
*   在项目根目录下执行以下命令安装所需依赖：
    ```bash
    npm install
    ```
    *   **说明**: 此命令会根据 `package.json` 中的 `dependencies` 列表安装 `axios`, `crypto`, `crypto-js`, `fs`, `iconv-lite`, `js-yaml`, `yargs` 等库。

## 3. 配置文件
*   **复制模板**: 复制 `config.yml.temple` 文件并重命名为 `config.yml`。
*   **编辑配置**: 在 `config.yml` 中填入对应平台的 Cookie 或其他必要信息。注意每个冒号后需保留一个空格，遵循 YAML 格式。
*   **任务列表**: 在 `config.yml` 的 `cbList` 字段中指定需要运行的签到任务名称（即 `scripts` 目录下 `.js` 文件的文件名，不含扩展名），多个任务用 `&` 分隔。例如：`cbList: duokan&everphoto&acfun`。

## 4. 运行方式
*   **默认运行**: 执行 `index.js` 会自动读取 `config.yml` 中的 `cbList` 并运行对应脚本。
    ```bash
    node index.js
    ```
*   **指定脚本运行**: 可在命令行后直接跟上脚本名称（文件名，不含 `.js`），以空格分隔，用于定时任务。
    ```bash
    node index.js acfun csdn
    ```
*   **青龙面板**: 项目支持在青龙面板中使用，通过 `ql repo` 命令拉取仓库，并在青龙的配置文件中设置 Cookie 和任务列表。具体命令见 README.md。

## 5. 测试
*   项目提供了一个简单的测试脚本，用于测试 CSDN 的签到功能。
    ```bash
    npm test
    ```
    *   **说明**: 实际上会执行 `node index.js csdn`。

# 开发约定

*   **脚本命名**: `scripts` 目录下的签到脚本应以 `.js` 结尾，文件名应简洁明了，能反映签到平台名称。
*   **脚本结构**: 每个签到脚本通常导出一个异步函数（如 `module.exports = shanyi`），该函数执行签到逻辑并返回签到结果字符串。
*   **配置读取**: 脚本通过全局变量 `config` (在 `index.js` 或 `checkbox.js` 中加载) 读取 `config.yml` 中对应平台的配置信息。
*   **日志输出**: 脚本内部使用 `console.log` 输出执行过程和结果信息。
*   **错误处理**: 脚本应包含基本的错误处理逻辑，避免因单个脚本错误导致整个签到流程中断。`index.js` 会捕获异常并记录。
*   **推送逻辑**: 脚本本身通常只返回结果字符串。是否推送以及如何推送由 `index.js` 或 `checkbox.js` 中的逻辑根据 `config.yml` 的 `needPush` 和 `Push` 配置决定。
*   **代码风格**: 项目未明确指定统一的代码风格，但现有代码多采用标准的 JavaScript 语法和缩进。
