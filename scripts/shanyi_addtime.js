const yaml = require("js-yaml");
const fs= require("fs");
global.config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
const task=require("./syapi").task
const jm=require("./syapi").jm



async function addtime(){
 let res = await task("获取任务列表", "/?m=user&op=daily_task&ac=index", "")
 let list= res.data.task_limit_time_list
 id= list[0].status==1?list[0].game_id:list[1].game_id
task("观看 "+id, "/?m=user&op=index&ac=add_user_play_time", `minute=W%2FWdZKs5lJhcLOK5XBhwXA%3D&gid=${encodeURIComponent(jm(id))}`)
}

addtime()