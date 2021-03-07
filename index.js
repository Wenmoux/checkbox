const sendmsg = require("./sendmsg");

let signList = ["acfun","aihao","cg","cg163","csdn","du163","duokan","everphoto","hbooker","hykb","jjwxc","lkong","missevan","mt_sign","nga","pingu","rrsp","sfacg","smzdm","ssly","sxmd","uclub","w2pj","wps_invite","xiang5"];
sedmsg = require("./sendmsg")
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
