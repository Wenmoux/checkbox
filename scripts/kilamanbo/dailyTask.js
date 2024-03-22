let klmsg = "【克拉漫播】：\n"
let uid = ""
let titles =[]
const {makeRequest,getSign} = require("./tool.js")
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


const checkIn = async () => {
	const endpoint = '/v424/user/checkIn';
	const data = 'timeZoneStr=Asia%2FShanghai&uid=-1&sign=';
	try {
		const response = await makeRequest('post', endpoint, data);
		const msg = response?.h?.msg;
//		console.log(response);
		return msg;
	} catch (error) {
		const msg = error.response ?.data?.h ?.msg || error.message;
		console.error(msg);
		return msg;
	}
};


 
const queryBeanBalance = async () => {
  const endpoint = '/v438/account/balance';
  try {
    const response = await makeRequest('get', endpoint); // 发送GET请求
    if (response.h.code === 200) {
      console.log('红豆余额查询成功:', response.b.gold);
      return response.b.gold; // 返回红豆余额
    } else {
      console.log('红豆余额查询失败:', response.h.msg);
      return response.h.msg;
    }
  } catch (error) {
    console.error('红豆余额查询失败:', error);
    throw error;
  }
};
 


const ft = async (introduce) => {
	const endpoint = '/v433/imgtxt/new/add';
    const data = {
		"groupActivityId": 0,
		"imgList": [],
		"introduce": introduce,
		"source": 1
	}	
	try {
		const response = await makeRequest('post', endpoint, data, true);
		//  console.log(response)  
		msg = response ?.h ?.msg;
		// console.log(JSON.stringify(response.b));
		if (response.b) {
			id = response.b.imgTxtResp.id
			console.log(response.b.imgTxtResp)
			console.log(`发帖 ${id}  ${introduce}`)
	//		uid = response.b.imgTxtResp.userResp.id
			await sleep(3000)
			let data = `dynamicId=${id}&type=38`
			let signedData = `${data}&sign=${getSign(data)}`;
			let rss = await makeRequest('post', '/v435/dynamic/info/delete', signedData)
		}
		//  return  msg;
	} catch (error) {
		 msg = error.response ?.data ?.h ?.msg || error.message;
		console.error(msg);
		//   return msg;
	}
};

const cx = async (r) => {
	const endpoint = '/v433/user/level/info?uid=';
	const data = 'uid=';
	try {
		const response = await makeRequest('get', endpoint);
//		console.log(response)
		const msg = response.b;
		console.log("获取个人信息成功")     
		uid = msg.id
	    if(r)klmsg += `    昵称：${msg.nickname}\n    等级：Lv${msg.level}(${msg.levelInfo.exp}/${msg.levelInfo.nextExp})\n`
	//	console.log(msg)
	} catch (error) {
		const msg = error.response ?.data ?.h ?.msg || error.message;
		console.error("获取个人信息失败：" + msg);
		if(r)klmsg += msg
		//  return "【克拉漫播】：" + msg;
	}
};
const complete = async (bid, objectId) => {
	const data = `missionBizId=${bid}&objectId=${objectId}&bizType=12&probe=0`;
	const sign = getSign(data);
	const signedData = `${data}&sign=${sign}`;
	const endpoint = '/v424/user/daily/mission/complete';
	const response = await makeRequest('post', endpoint, signedData);
	console.log(response.h.msg);
};
const getVideo = async () => {
	const endpoint = '/v433/small/video/plant/grass/timeline?pageNo=1&pageSize=10';
	const response = await makeRequest('get', endpoint);
	return response.b.data;
};
const getExp = async (id) => {
	console.log("去领宝箱：", id)
	const data = `giftPackType=${id}`
	const endpoint = `/v435/user/gift/pack/get?giftPackType=${id}&sign=${getSign(data)}`;
	const response = await makeRequest('get', endpoint);
	console.log(response ?.h ?.msg);
};


const getLiveList = async () => {
	const queryParams = 'type=0&genderType=0&pageNo=1&pageSize=20';
	const signedParams = `${queryParams}&sign=${getSign(queryParams)}`;
	const endpoint = `/v436/room/channel/adv/syndication/timeline?${signedParams}`;
	try {
		const response = await makeRequest('get', endpoint);		
		const rooms = response.b.data;
		if (rooms && rooms.length > 0) {
			console.log("获取成功，直播间id: " + rooms[0].roomResq.roomIdStr)			
			return rooms[0].roomResq.roomIdStr; 
		}
		return null;
	} catch (error) {
		console.error('获取直播列表失败:', error);
		throw error;
	}
};

const getRedPacketId = async (roomId) => {
	const queryParams = `roomId=${roomId}&sourceType=17009`;
	const signedParams = `${queryParams}&sign=${getSign(queryParams)}`;
	const endpoint = `/v436/red/packet/list/of/room?${signedParams}`;
//	console.log(endpoint)
	try {
		const response = await makeRequest('get', endpoint);
		//  console.log(response)
		const packets = response.b.sendRedPacketInfoList;
		if (packets && packets.length > 0) {
			   console.log("获取成功，红包id: "+packets[0].id)
			return "" + packets[0].id; // 返回第一个红包的ID
		}else console.log("暂未查询到红包id")
		return null;
	} catch (error) {
		console.error('获取红包ID失败:', error);
		throw error;
	}
}

const claimRedPacket = async (roomId, packetId, uid) => {
	const data = `uid=${uid}&roomId=${roomId}&id=${packetId}&type=1`;
	const signedData = `${data}&sign=${getSign(data)}`;
	console.log(data)
	const endpoint = '/v436/red/packet/get/lead/flow';
	try {
		const response = await makeRequest('post', endpoint, signedData);
		
		console.log('领取红包结果:', response.h.msg);
		return response.h.msg;
	} catch (error) {
		console.error('领取红包失败:', error);
		throw error;
	}
};
 
const claimDailyFoxGift = async () => {
  const endpoint = '/v438/radio/drama/fox/gift/daily/mission/award';
  try {
    const response = await makeRequest('post', endpoint); // 注意这里不需要发送任何数据
    if (response.h.code === 200) {
      console.log('领取成功:', response.b.awardTips);
      return response.b;
    } else {
      console.log('领取失败:', response.h.msg);
      return response.h.msg;
    }
  } catch (error) {
    console.error('留爪领取失败:', error);
    throw error;
  }
};
 

const task = async () => {
	let checkinMsg = await checkIn();
	let vList = await getVideo();
	for (let i = 0; i < 5; i++) {
		console.log(`看视频：${vList[i].videoResp.introduce}`)
		titles[i] =vList[i].videoResp.introduce 
		await complete("21", vList[i].videoResp.idStr);
		await complete("4", vList[i].videoResp.idStr);
	}
	for (k of [1, 2, 3]) {
		await ft(titles[k])
	}
	await claimDailyFoxGift()
	await cx()	
	
	let rid = await getLiveList()
	let pid = await getRedPacketId(rid)
	if(pid)await claimRedPacket(rid, pid, uid)
	for (c of [1, 2, 3]) await getExp(c)
	await cx(true)
	let bean = await queryBeanBalance()
	klmsg +=`    红豆：${bean}\n    签到：${checkinMsg}`
	return klmsg
};
module.exports = task;