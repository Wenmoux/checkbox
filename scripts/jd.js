const axios = require("axios")
function jd() {
  return new Promise(async resolve => {
    try {      let url ='https://cdn.jsdelivr.net/gh/NobyDa/Script/JD-DailyBonus/JD_DailyBonus.js'
               let res = await axios.get(url)
               a = `Key=require("../config.json").jd.cookie`
               script = res.data.replace(/var Key = ''/, a).replace(/ stop = 0/," stop = 1")            
               eval(script)             
    } catch (err) {     
      console.log(err)
    }
    resolve()
  })
}
   
   module.exports=jd