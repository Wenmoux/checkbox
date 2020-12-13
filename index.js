 const cg  = require('./scripts/cg')
 //   const wpsdaka  = require('./scripts/wps_invite')
     //  const everphoto  = require('./scripts/everphoto')
   
     signList = [cg] 
    start(signList)
    async function start(task) {
    console.log('开始签到任务')          
          for (let i = 0; i < task.length; i++) { 
          console.log(`任务${i+1}执行中`)                                     
              await task[i]() 
         }            
          console.log('任务执行完毕')
      }