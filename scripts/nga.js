const axios = require("axios")
function task() {
    return new Promise(async resolve => {
        try {
            let str=require("../config.json").nga
            let url = 'https://ngabbs.com/nuke.php?&'            
            let res = await axios.post(url,`sign=&access_uid=${str.uid}&t=${Math.round(new Date().getTime()/1000).toString()}&access_token=${str.accesstoken}&    app_id=1010&__act=check_in&__lib=check_in&__output=12` )     
         console.log(res.data.msg)
        } catch (err) {
          console.log(err)
          
        }
        resolve()
    })
}

//task()

module.exports=task