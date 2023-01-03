/*
cron: 28 8 * * *
new Env('签到盒');
*/
const yaml = require("js-yaml");
const fs = require('fs');
const yargs = require('yargs');
var argv = yargs.argv;
config = null,notify = null,sendmsg = null,signlist = [],logs = "",needPush = true
if (fs.existsSync("./config.yml")) fs.renameSync("./config.yml","./config.yaml")

//自行添加任务 名字看脚本里的文件名 比如csdn.js 就填"csdn"
var cbList = []
if (fs.existsSync("./config.yaml")) config = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
if (fs.existsSync("./sendNotify.js")) notify = require('./sendNotify')
let QL = process.env.QL_DIR
if (QL) {
    console.log("当前是青龙面板,路径："+QL)
    if(fs.existsSync(`/${QL}/config/config.sh`)) console.log("建议更新到最新版青龙再来运行哦,或者手动修改路径叭~")
    cbList = process.env.cbList ? process.env.cbList.split("&") : []
    if (fs.existsSync(`/${QL}/config/config.yaml`)) fs.renameSync(`/${QL}/config/config.yml`,`/${QL}/config/config.yaml`)
    if (!fs.existsSync(`/${QL}/config/config.yaml`)) {
        console.log("您还没有填写cookies配置文件,请配置好再来运行8...\n配置文件路径/ql/config/config.yaml\n如没有文件复制一份config.yaml.temple并改名为config.yaml")
        return;
    } else{
    if(yaml.load) config = yaml.load(fs.readFileSync(`/${QL}/config/config.yaml`, 'utf8'))
    else console.log("亲,您的依赖掉啦,但是没有完全掉 请重装依赖\npnpm install  axios  crypto-js iconv-lite js-yaml yargs\n或者\nnpm install  axios  crypto-js iconv-lite js-yaml yargs")
     }
}
if(config)  sendmsg = require("./sendmsg")
if(config) signlist = config.cbList.split("&")
if(config.needPush&&config.needPush==0) needPush = false
var signList = (argv._.length) > 0 ? argv._ : (cbList.length>0 ? cbList : signlist) 
if (config &&  process.env.TENCENTCLOUD_RUNENV!="SCF") start(signList);
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
                    taskResult = await task()                    
                    if(taskResult&&taskResult.match(/单独通知|登陆|cookie|失效|失败|账号/))  await sendmsg(taskResult)      
                    else logs += taskResult + "    \n\n";              
                } else {
                    logs += `${taskList[i]}  不存在该脚本文件,请确认输入是否有误\n\n`
                    console.log("不存在该脚本文件,请确认输入是否有误")
                }
            }
            console.log("------------任务执行完毕------------\n");
            if(needPush && sendmsg) await sendmsg(logs);            
            if (needPush&&notify) await notify.sendNotify("签到盒", `${logs}\n\n吹水群：https://t.me/wenmou_car`);                      
            else console.log(logs)
        } catch (err) {
            console.log(err);
        }
        resolve();
    });
}

//云函数入口
exports.main_handler = async () => {
  await start(signList);
};
