const {makeRequest,getSign} = require("./tool.js")
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const refreshHeartbeat = async (radioDramaId, radioDramaSetId) => {
  const data = `radioDramaId=${radioDramaId}&radioDramaSetId=${radioDramaSetId}`;
  const signedData = `${data}&sign=${getSign(data)}`;
  const endpoint = '/v438/radio/drama/set/heartbeat';
  try {
    const response = await makeRequest('post', endpoint, signedData);
    console.log('广播剧观看心跳刷新结果:', response.h.msg);
    return response.h.msg;
  } catch (error) {
    console.error('广播剧心跳刷新失败:', error);
    throw error;
  }
};
 const getLiveList = async () => {
	const queryParams = 'type=0&genderType=0&pageNo=1&pageSize=20';
	const signedParams = `${queryParams}&sign=${getSign(queryParams)}`;
	const endpoint = `/v436/room/channel/adv/syndication/timeline?${signedParams}`;
	try {
		const response = await makeRequest('get', endpoint);		
		const rooms = response.b.data;
		console.log(rooms)
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
const sendLiveHeartbeat = async (roomId) => {
  const data = `roomId=${roomId}&watchType=0`;
  const signedData = `${data}&sign=${getSign(data)}`; // 使用你的签名函数
  const endpoint = '/v438/room/heartbeat';
  try {
    const response = await makeRequest('post', endpoint, signedData);
    console.log('直播心跳发送结果:', response.h.msg);
    return response.h.msg;
  } catch (error) {
    console.error('直播心跳发送失败:', error);
    throw error;
  }
};
 
async function guaji(){
let watchtimes = 0 
let lid =await  getLiveList()
while(watchtimes<150){
await refreshHeartbeat("1909036435613155394","1917301305605357739")
if(lid ) await sendLiveHeartbeat(lid)
watchtimes++ 
await sleep(30*1000) 
}
return "【克拉漫播】：时长刷新完毕"
}

module.exports = guaji;