/*
cron: 28 8 * * *
new Env('签到盒');
*/
const sendmsg = require("./sendmsg");
const yaml = require("js-yaml");
const fs = require('fs');
const yargs = require('yargs');
var argv = yargs.argv;
config = null
cbList = []
if (fs.existsSync("./config.yml")) config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
notify = null
if (fs.existsSync("./sendNotify.js")) notify = require('./sendNotify')
let QL = process.env.QL_DIR
if (QL) {
    console.log("当前是青龙面板,路径："+QL)
    cbList = process.env.cbList ? process.env.cbList.split("&") : []
    if (!fs.existsSync(`/${QL}/config/config.yml`)) {
        console.log("您还没有填写cookies配置文件,请配置好再来运行8...")
        return;
    } else config = yaml.load(fs.readFileSync(`/${QL}/config/config.yml`, 'utf8'));
}
var signlist = ["ssly"]
//自行添加任务 名字看脚本里的文件名 比如csdn.js 就填"csdn"
var signList = (argv._.length) > 0 ? argv._ : (cbList.length>0 ? cbList : signlist)
var logs = "";
if (config) start(signList);
function start(taskList) {
    return new Promise(async (resolve) => {
        try {     
            console.log("任务个数  " + signList.length)
            console.log("------------开始签到任务------------");
            for (let i = 0; i < taskList.length; i++) {
                console.log(`任务${i + 1}执行中`);
                let exists = fs.existsSync(`./scripts/${taskList[i]}.js`)
                if (exists) {
                    const task = require(`./scripts/${taskList[i]}.js`);
                    logs += await task() + "    \n\n";
                } else {
                    logs += `${taskList[i]}  不存在该脚本文件,请确认输入是否有误\n\n`
                    console.log("不存在该脚本文件,请确认输入是否有误")
                }
            }
            console.log("------------任务执行完毕------------\n");
            await sendmsg(logs);
            if (notify) await notify.sendNotify("签到盒", `${logs}\n\n吹水群：https://t.me/wenmou_car`);
        } catch (err) {
            console.log(err);
        }
        resolve();
    });
}