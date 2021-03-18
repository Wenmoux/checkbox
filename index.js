const sendmsg = require("./sendmsg");
const yaml = require("js-yaml");
const fs   = require('fs');
let signList = ["csdn","mt_sign"];
sedmsg = require("./sendmsg")
global.config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
let logs = "";
//自行添加任务 名字看脚本里的文件名 比如csdn.js 就填"csdn"
start(signList);

async function start(taskList) {
  console.log("------------开始签到任务------------");
  for (let i = 0; i < taskList.length; i++) {
    const task = require(`./scripts/${taskList[i]}.js`);
    console.log(`任务${i + 1}执行中`);
    logs += await task() + "    \n\n"
  }
  console.log("------------任务执行完毕------------\n");
   await sendmsg(logs)
}
