    let signList = ["missevan","csdn"]  
    
    //自行添加任务 名字看脚本里的文件名 比如csdn.js 就填"csdn"
    start(signList)
    
                                  
    async function start(taskList) {
    console.log('开始签到任务')          
          for (let i = 0; i < taskList.length; i++) { 
          const task = require(`./scripts/${taskList[i]}.js`)
          console.log(`任务${i+1}执行中`)                                     
          await task()
         }            
          console.log('任务执行完毕')
      }