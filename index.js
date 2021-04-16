const sendmsg = require("./sendmsg");
const yaml = require("js-yaml");
const fs = require('fs');
const yargs = require('yargs');
let argv = yargs.argv;
global.config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
let signlist = ["lenovo","csdn"]
//自行添加任务 名字看脚本里的文件名 比如csdn.js 就填"csdn"
let signList = (argv._.length) > 0 ? argv._ : signlist
let logs = "";
start(signList);
function start(taskList) {
    return new Promise(async (resolve) => {
        try {
            console.log("任务列表   " + argv._)
            console.log("------------开始签到任务------------");
            for (let i = 0; i < taskList.length; i++) {
                console.log(`任务${i + 1}执行中`);
                let exists = fs.existsSync(`./scripts/${taskList[i]}.js`)
                if (exists) {
                    const task = require(`./scripts/${taskList[i]}.js`);
                    logs +=await task() + "    \n\n";
                } else {
                    logs += `${taskList[i]}  不存在该脚本文件,请确认输入是否有误\n\n`
                    console.log("不存在该脚本文件,请确认输入是否有误")
                }
            }
            console.log("------------任务执行完毕------------\n");
            await sendmsg(logs);
        } catch (err) {
              console.log(err);
        }
        resolve();
    });
}