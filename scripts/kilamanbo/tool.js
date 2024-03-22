const axios = require('axios');
const md5 = require("crypto-js")
	.MD5;
const BASE_URL = 'https://api.kilamanbo.com/api';
const headers = {
	ua: config.kilamanbo.ua,
	"_c": 20,
	"x-auth-token": config.kilamanbo.authtoken
};

const makeRequest = async (method, endpoint, data = '', json = null) => {
	const url = `${BASE_URL}${endpoint}`;
	try {
		if (json) headers["Content-Type"] = "application/json"
		else headers["Content-Type"] = 'application/x-www-form-urlencoded'
		const response = await axios({
			method: method,
			url: url,
			data: data,
			headers: headers
		});
		return response.data;
	} catch (error) {
		console.error(`Error with ${method.toUpperCase()} request to ${endpoint}`, error);
		throw error;
	}
};
const getSign = (data) => {
	var str = data.split("&")
		.sort()
		.join("&");
	return md5("nJi9o;/" + str)
		.toString();
};

module.exports = {makeRequest,getSign};