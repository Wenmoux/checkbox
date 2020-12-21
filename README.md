需要什么签到可以提issues

# checkbox  常用网站签到
 - [x] [人人视频(安卓端) ](https://mobile.rr.tv/fe/#/invite/phone)福利|签到|答题|开宝箱 抄[@chavyleung](https://github.com/chavyleung/scripts/tree/master/rrtv)
 - [x]  [WPS](https://zt.wps.cn/2018/clock_in?csource=pc_clock_oldactivity) 邀请好友,需小程序手动打卡,抄自[@lepecoder/checkin](https://github.com/lepecoder/checkin)
 - [x] [时光相册](https://web.everphoto.cn/)每日签到
 - [x] [书香门第](http://www.txtnovel.top/?fromuser=lu66666)每日签到
 - [x] [多看阅读app](http://www.duokan.com/m/product)每日任务薅书豆+自动延期 保底3k+ (大概
 - [x] [绅士领域](https://hk.hksslyapp.xyz/mz_pbl/app_down/)每日签到得硬币
 - [x] [ucloud社区](https://uclub.ucloud.cn/invite/478)每日签到得积分
 - [x] [网易蜗牛读书](https://du.163.com/static/activity/new_rank/index.html?user=8cf097eb09724ec5b5389a262f069a14)每日签到
 - [x] [香网小说](http://sc.xiang5.com/2.2/invite/share?uid=5563201)每日签到
 - [x] [吾爱破解](www.52pojie.com)签到
 - [x] [网易云游戏](https://cloudgame.webapp.163.com/newer.html?invite_code=R6522U)每日签到得免费时长
 - [x] [晋江小说网](https://m.jjwxc.com/invite/index?novelid=2911400&inviteid=11581969)每日签到,得月石
 - [x] [什么值得买](smzdm.com)网页端每日签到
 - [x]  橙光游戏app每日签到+登陆奖励领取
 - [ ]  ~~哔哩哔哩每日白嫖硬币活动（夏日音乐季 手书嘉年华 14+）九月初结束~~
 - [x] [好游快爆](https://m.i3839.com/qd-huodong4.html)全任务(签到，分享/下载/体验游戏，抖音任务，邀请下载，照料好友),邀请码`sdvf180uscf3`

# 使用方法
在config.json文件内填入对应cookis或其它参数,然后
   ```
       node index.js   
   ```

 -  自行在index.js的signList中添加需要的任务,格式自行参考,同时需要require,格式一样
-  如需单独运行某脚本,请注释掉最后的module.xxx这一行并去掉上行xxx()的注释,之后


```
    node xxx.js
```