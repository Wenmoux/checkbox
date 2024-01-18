const axios = require("axios");
var sid = ""
var uid = ""
var cookie = `MEIZUSTORESESSIONID=`
const MeiZu = config.meizu
var nickname = "未命名"
var Mcoin = 0;
let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// 封装meizuGet方法
async function meizuGet(url, data=null, method="get") {
	const config = {
		method: method,
		url: url,
		headers: {
			Referer: "https://www.meizu.cn",
			"local-time": Date.now(),
			"android-app-channel": "meizu",
			"user-agent": "android_app_myplus",
			"android-app-version_name": "6.5.9",
			"android-app-version-code": 50000061,
			cookie
		},
		...(method === 'post' && {
			data
		}),
	};
	try {
	//console.log(config)
		const response = await axios(config);
		return response;
	} catch (error) {
		console.error('请求错误', error.response.data.error);
		return {error:error.response.data.error,code:400};
	}
}

// 获取cookie
/*async function getCookie() {
	const tokenUrl = `https://myplus-api.meizu.cn/myplus-qing/ug/app/start`;
	const response = await meizuGet(tokenUrl, "", 'get');
	if (response && response.data && response.data.code === 200) {
		nickname = response.data.data.member.nickname    
		let rcookie = response.headers["set-cookie"][0]
		scookie = rcookie.split(";")[0]
		cookie += scookie
	}
	return cookie;
}

*/



// 获取access_token
async function getAccessToken() {
  const url = 'https://api.meizu.com/oauth/token';
  const data = new URLSearchParams({
    grant_type: 'remember_me',
    scope: 'trust',
    remember_me: MeiZu.remember,
    client_secret: MeiZu.secret,
    client_id: MeiZu.clientid,
    account_belong: 'MEIZU'
  });

  try {
    const response = await meizuGet(url, data,"post");
    if (response.data && response.data.access_token) {
      console.log('获取access_token成功');
      uid = response.data.user_id
      nickname = response.data.nickname
      return response.data.access_token;
    } else {
      console.error('获取access_token失败', response);
      return null;
    }
  } catch (error) {
 //   console.error('获取access_token时发生错误', error.response.data);
    return null;
  }
}

// 使用access_token获取sid
async function getSid(accessToken) {
  const url = `https://myplus-api.meizu.cn/myplus-login/g/app/login?token=${accessToken}`;
  try {
    const response = await meizuGet(url);
    if (response.data && response.data.code==200) {
      sid = response.data.data[0].value
      console.log('获取sid成功');
      cookie += sid+";"
      return cookie
    } else {
      console.error('获取sid失败', response.data.msg);
      return null;
    }
  } catch (error) {
    console.error('获取sid时发生错误', error);
    return null;
  }
}


async function getCookie() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.error('无法获取access_token');
    return null;
  }
  sid = await getSid(accessToken);
  if (!sid) {
    console.error('无法获取sid');
    return null;
  }
console.log("获取sid成功: "+sid)
  return `MEIZUSTORESESSIONID=${sid};` ;
}


// 查询任务列表函数
async function queryTasks() {
	const url = `https://myplus-api.meizu.cn/myplus-muc/u/user/point/task/M_COIN`;
	try {
		const response = await meizuGet(url, {}, 'post');
		if (response && response.data && response.data.code === 200) {
			console.log('任务列表查询成功');
			Mcoin = response.data.data.mcoin
			return response.data.data.list; // 返回任务列表
		} else {
			console.log('任务列表查询失败', response.data.msg);
			return [];
		}
	} catch (error) {
		console.error('查询任务列表时发生错误', error);
		return [];
	}
}
async function getreply(){
let res = await meizuGet("https://myplus-api.meizu.cn/myplus-qing/ug/comment/rapid/list")
if(res.data.code==200) return res.data.data.list[0]
else return "共赴山海,热爱无界"
}
async function signInMzStore(uid, sid) {
	const url = `https://app.store.res.meizu.com/mzstore/sign/add`;
	const postData = `uid=${uid}&sid=${sid}`;
	const response = await meizuGet(url, postData, "post");
	//console.log(response.data)
}

// 发表主题函数
async function createTopic(title, content, forumId, topicIds) {
	const url = `https://myplus-api.meizu.cn/myplus-qing/u/content/auth/create/v4`;
	const data = {
		ats: [],
		content: `[{\"c\":[{\"id\":\"${topicIds}\",\"n\":\"${title}\",\"c\":[{\"x\":\"\"}],\"t\":\"tc\"}],\"t\":\"p\"}]`,
		deviceName: "M461Q", // 这里可以根据实际情况修改设备名称
		enterId: 0,
		format: 1,
		forumId: forumId,
		forumTagId: 0,
		locationId: 0,
		pollId: 0,
		title: title,
		topicIds: topicIds
	};
	try {
		const response = await meizuGet(url, data, 'post');
		if (response && response.data && response.data.code === 200) {
			console.log(`主题 "${title}" 发表成功，主题ID：${response.data.data.id}`);
		} else {
			console.log(`主题 "${title}" 发表失败`, response.data.msg);
		}
	} catch (error) {
		console.error(`发表主题 "${title}" 时发生错误`, error);
	}
}

// 收藏主题函数
async function addFavorite(contentId) {
	const url = `https://myplus-api.meizu.cn/myplus-qing/u/content/auth/fav/${contentId}?id=${contentId}`;
	try {
		const response = await meizuGet(url, "", 'post');
		if (response && response.data && response.data.code === 200) {
			console.log(`主题ID ${contentId} 收藏成功`);
		} else {
			console.log(`主题ID ${contentId} 收藏失败`, response.data.msg);
		}
	} catch (error) {
		console.error(`收藏主题ID ${contentId} 时发生错误`, error);
	}
}

// 评论主题函数
async function addComment(contentId, comment) {
	const url = `https://myplus-api.meizu.cn/myplus-qing/u/comment/add/v2`;
	const data = {
		ats: [],
		content: await getreply(),
		contentId: contentId,
		createTime: Math.floor(Date.now() / 1000), // 当前时间的Unix时间戳
		deviceName: "M461Q", // 这里可以根据实际情况修改设备名称
		isChp: 0,
		parentId: 0,
		replyId: 0,
		replyUid: 0
	};
	try {
		const response = await meizuGet(url,
			data, 'post', data);
		if (response && response.data && response.data.code === 200) {
			console.log(`主题ID ${contentId} 评论成功`);
		} else {
			console.log(`主题ID ${contentId} 评论失败`, response.data.msg);
		}
	} catch (error) {
		console.error(`评论主题ID ${contentId} 时发生错误`, error);
	}
}

// 关注用户函数
async function followUser(uid) {
	const url = `https://myplus-api.meizu.cn/myplus-qing/u/member/follow?uid=${uid}`;
	try {
		const response = await meizuGet(url, "", 'post');
		if (response && response.data && response.data.code === 200) {
			console.log(`用户ID ${uid} 关注成功`);
		} else {
			console.log(`用户ID ${uid} 关注失败`, response.data.msg);
		}
	} catch (error) {
		console.error(`关注用户ID ${uid} 时发生错误`, error);
	}
}



async function addLike(id) {
	const url = `https://myplus-api.meizu.cn/myplus-qing/u/like/content/add?id=${id}`;
	try {
		const response = await meizuGet(url,"", 'get');
		if (response && response.data && response.data.code === 200) {
			console.log(`帖子ID ${id} 点赞成功`);
		} else {
			console.log(`帖子ID ${id} 点赞失败`, response.data.msg);
		}
	} catch (error) {
		console.error(`点赞帖子ID ${id} 时发生错误`, error);
	}
}



// 获取论坛文章的函数
async function getForumArticles() {
	const url = "https://myplus-api.meizu.cn/myplus-qing/ug/topic/content?currentPage=0&topicId=534&sortType=2";
	try {
		const response = await meizuGet(url, "", 'get');
		if (response && response.data && response.data.data && response.data.data.rows) {
			const articles = response.data.data.rows.slice(1, 11)
				.map(article => {
					return {
						id: article.id,
						title: article.title,
						uid: article.uid
					};
				});
			return articles;
		} else {
			console.log('没有获取到文章列表');
			return [];
		}
	} catch (error) {
		console.error('获取文章列表失败', error);
		return [];
	}
}

async function signIn() {
	const url = `https://myplus-api.meizu.cn/myplus-muc/u/user/signin`;
	let res = await meizuGet(url, "", "post");
	if (res && res.data.code == 200) {
		msg = `煤球奖励+${res.data.data.mcoin}，已连续签到${res.data.data.continuous}天`;
	} else {
		msg = res.data.msg + "[可能已签到]";
	}
	console.log(msg)
	return msg
}

// 关注用户函数

async function followUsers(userList) {
	for (let i = 0; i < Math.min(3, userList.length); i++) {
		await followUser(userList[i].uid); 
		await sleep(5000);
	}
}

// 点赞函数
async function likePosts(postList) {
	for (let i = 0; i < Math.min(10, postList.length); i++) {
		await addLike(postList[i].id); // 
		await sleep(5000);
	}
}

// 收藏主题函数
async function favoriteTopics(topicList) {
	for (let i = 0; i < Math.min(3, topicList.length); i++) {
		await addFavorite(topicList[i].id); 
		await sleep(5000);
	}
}

async function addComments(topicList) {
	for (let i = 0; i < Math.min(3, topicList.length); i++) {
		await addComment(topicList[i].id); 
		await sleep(5000);
	}
}

// 任务
async function meizu() {
	let signMsg = ""
	try {
		const cookie = await getCookie();
		if (!cookie) {
			msg = '获取cookie失败';
			return "【魅族社区】：" + msg;
		}
		signMsg = await signIn();
		const arList = await getForumArticles()
		const tasks = await queryTasks();
		for (const task of tasks) {
			if (!task.complete) { // 如果任务未完成
				console.log("去执行任务：" + task.taskName)
				switch (task.taskName) {
					case '每日签到':		
						await signIn();
						break;
					case '点赞':
						await likePosts(arList)
						break;
					case '关注用户':
					    await followUser(129768998);
						await followUsers(arList);
						break;
					case '发表评论':
						await addComments(arList)
						break;
					case '收藏主题':
						await favoriteTopics(arList)
						break;
					case '发布主题':
						await createTopic("小鸟说早早早", "你为什么背上炸药包", 22, 534)
						break;									
					default:
						console.log(`没有定义任务 "${task.taskName}" 的执行操作，跳过`);
						break;
				}
			} else console.log("已完成")
		}
		await signInMzStore(uid, sid)
		await queryTasks()
	} catch (err) {
		msg = `签到接口请求错误`;
		console.log(err);
	}
	return `【魅族社区(${nickname})】：\n    签到： ${signMsg}\n    煤球：${Mcoin}`;
}
//meizu()
module.exports = meizu;