<div align="center"> 
<h1 align="center">签到盒</h1>

[![GitHub stars](https://img.shields.io/github/stars/wenmoux/checkbox?style=flat-square)](https://github.com/wenmoux/checkbox)
[![GitHub forks](https://img.shields.io/github/forks/wenmoux/checkbox?style=flat-square)](https://github.com/wenmoux/checkbox/network)
[![GitHub issues](https://img.shields.io/github/issues/wenmoux/checkbox?style=flat-square)](https://github.com/wenmoux/checkbox/issues)
![GitHub issues](https://img.shields.io/github/languages/code-size/wenmoux/checkbox?style=flat-square)
</div>

# 简介
一些常用网站以及app的签到,有用的话点个star⭐️呗  
[点这里加TG群](https://t.me/wenmou_car)  
需要什么签到可以去提[issues](https://github.com/wenmoux/checkbox/issues),也欢迎PR  
关于代码为什么这么烂:  
开始写的时候就不知道js是啥，也不了解编程，全靠百度，以及抄大佬的代码
 ![运行结果](https://cdn.jsdelivr.net/gh/Wenmoux/wenpic/other/1367573175823623.png)
# 签到列表
<details>
<summary>查看签到列表</summary>

 - [x] [人人视频(安卓端) ](https://mobile.rr.tv/fe/#/invite/phone)福利|签到|答题|开宝箱 抄[@chavyleung](https://github.com/chavyleung/scripts/tree/master/rrtv)
 - [x] [WPS邀请](https://zt.wps.cn/2018/clock_in?csource=pc_clock_oldactivity) 邀请好友,需小程序手动打卡,抄自[@lepecoder/checkin](https://github.com/lepecoder/checkin)
 - [x] [时光相册](https://web.everphoto.cn/)每日签到
 - [x] [书香门第](http://www.txtnovel.top/?fromuser=lu66666)每日签到
 - [x] [多看阅读app](http://www.duokan.com/m/product)每日任务薅书豆+自动延期 保底6k+ (大概
 - [x] [绅士领域](https://hk.hksslyapp.xyz/mz_pbl/app_down/)每日签到得硬币
 - [x] [ucloud社区](https://uclub.ucloud.cn/invite/478)每日签到得积分
 - [x] [网易蜗牛读书](https://du.163.com/static/activity/new_rank/index.html?user=8cf097eb09724ec5b5389a262f069a14)每日签到
 - [x] [香网小说](http://sc.xiang5.com/2.2/invite/share?uid=5563201)每日签到
 - [x] [吾爱破解](www.52pojie.com)签到
 - [x] [网易云游戏](https://cloudgame.webapp.163.com/newer.html?invite_code=R6522U)每日签到得免费时长
 - [x] [晋江小说网](https://m.jjwxc.com/invite/index?novelid=2911400&inviteid=11581969)每日签到,得月石
 - [x] [什么值得买](smzdm.com)网页端每日签到
 - [x] 橙光游戏app每日签到+登陆奖励领取
 - [x] [龙空](lkong.cn)每日签到
 - [x] [NGA论坛](http://bbs.nga.cn/)每日签到
 - [x] [SF轻小说app](http://book.sfacg.com)每日签到+每日任务
 - [x] [CSDN](https://www.csdn.net/)每日签到+抽奖
 - [x] [mt论坛](https://bbs.binmt.cc/?fromuid=14593)每日签到
 - [x] [经管之家](https://bbs.pinggu.org/?fromuid=11925701)每日签到
 - [ ] ~~哔哩哔哩每日白嫖硬币活动（夏日音乐季 手书嘉年华 14+）九月初结束~~
 - [x] [好游快爆](https://huodong3.3839.com/n/hykb/friend/yaoqing.php?u=21039293)全任务(签到，分享/下载/体验游戏，抖音任务，邀请下载，照料好友),下载安装后首页搜索99999领取新人福利,爆米花可兑换实物周边,虚拟兑换码等
 - [x] [猫耳FM](https://m.missevan.com)每日任务
 - [x] [爱好论坛](https://www.aihao.cc)早中晚打卡以及全勤领取
 - [x] [刺猬猫](https://wap.ciweimao.com/)每日任务(除了订阅章节)
 - [x] [acfun](https://activity.acfun.cn/invite-share?userId=3941489&activityType=default&page_source=resource_slot_invite_friend_tips&sid=9e0a35788902e0db)每日签到/投🍌/点赞/直播扭蛋
 - [x] [传奇GM论坛](https://www.diygm.com)
 - [x] [一亩三分地](https://www.1point3acres.com/bbs/?fromuid=702784)每日签到答题,需要填写[联众打码](https://www.jsdati.com/)账号密码 
 - [x] [次元狗](https://www.acgndog.com/)每日签到
</details>

 

# 使用方法 (懂得自然懂 bushi  

[教程：关于如何使用termux运行签到盒那件事](https://www.1oner.cn/archives/121/)  
termux可以使用crontab设置定时任务  
关于如何使用云函数
下载代码 把index.js删掉 tscf.js改成index.js然后导入云函数就好了(我只用过腾讯云函数 其它的不知道  
如果提示找不到入口函数 大概率是你压缩包多套了一层( ´艸｀)



下载源码,安装依赖在config.yml文件内填入对应cookies(不要更改原有格式,index.js文件里自行按照格式添加需要的任务,运行
   ```       
      git clone https://github.com/Wenmoux/checkbox.git
      cd /sdcard/checkbox (这里还是要看你的路径)
      npm install
      node index.js
   ```   


# other
<details>
<summary>更新日志</summary>

- 2021-03-13 好游快爆增加临时任务 粉丝福利任务,记得去app中首页分别搜索123444,80080 25525 630630 79979进行qq号绑定哦！！
- 2021-03-12
  - 新增[一亩三分地](https://www.1point3acres.com/bbs/?fromuid=702784)每日签到答题,需要填写[联众打码](https://www.jsdati.com/)账号密码
  - 新增[次元狗](https://www.acgndog.com/)每日签到
  - 删除uclub社区签到
- 2021-03-11 增加[传奇GM论坛](https://www.diygm.com)每日签到
- 2021-03-07 增加qmsg/coolpush/server酱推送
- 2021-03-04 更新acfun直播扭蛋任务,需要手动先观看30s直播！ 
- 2021-03-03 新增[Acfun](https://activity.acfun.cn/invite-share?userId=3941489&activityType=default&page_source=resource_slot_invite_friend_tips&sid=9e0a35788902e0db)每日签到任务
- 2021-02-25 增加[刺猬猫](https://wap.ciweimao.com/)每日任务
- 2021-02-23 增加[爱好论坛](https://www.aihao.cc)早中晚打卡以及全勤领取
- 2021-02-20 更新好游快爆抢兑脚本,可兑换所有商品
- 2021-02-18 新增[猫耳FM](https://m.missevan.com)每日任务
- 2021-01-22 新增wps群集结活动
- 2021-01-19 [SF轻小说app](http://book.sfacg.com)每日签到+每日任务
- 2021-01-08 [CSDN](https://www.csdn.net/)增加抽奖(每签到5天增加一次抽奖机会)
- 2021-01-03 橙光游戏增加每日分享,可自定义游戏id
- 2021-01-01 新增[mt论坛](https://bbs.binmt.cc/?fromuid=14593)每日签到
- 2020-12-31 
  - 新增[NGA论坛](http://bbs.nga.cn/)每日签到
  - 新增[CSDN](https://www.csdn.net/)每日签到
- 2020-12-30 新增[经管之家](https://bbs.pinggu.org/?fromuid=11925701)
- 2020-12-29 新增[龙空](lkong.cn)每日签到
- 2020-12-25 多看阅读增加获取大转盘次数
- 2020-12-22 新增[网易云游戏平台](https://cloudgame.webapp.163.com/newer.html?invite_code=R6522U)每日签到
-  ...

</details> 



# 致谢

[@chavyleung](https://github.com/chavyleung/scripts/tree/master/rrtv)  
[@lepecoder](https://github.com/lepecoder/checkin)  
[@zsakvo](https://github.com/zsakvo)  


# 支持一下

  ![支持一下](https://cdn.jsdelivr.net/gh/Wenmoux/wenpic/qrcode/wx_rewardqrcode.png)

# 免责申明
该项目仅供学习使用，严禁用于商业用途，由此造成的一切后果，本人概不负责。
