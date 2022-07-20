/*
 * @Author: Hellager
 * @Date: 2022-06-23 11:29:02
 * @LastEditTime: 2022-06-25 17:10:20
 * @LastEditors: Hellager
 */
const axios = require('axios');
const dayjs = require('dayjs');
const qs = require('qs');
const { config } = require('yargs');

/** dependencies **/
class logger {
    constructor () {

    }

    info(msg) {
        const current_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        console.log(`${current_time} info ${msg}`);
    }

    warning(msg) {
        const current_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        console.log(`${current_time} warning ${msg}`);       
    }

    error(msg) {
        const current_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        console.log(`${current_time} error ${msg}`);            
    }
}

log = new logger();

var sharedArrayBuffer_for_sleep = new SharedArrayBuffer( 4 ) ;
var sharedArray_for_sleep = new Int32Array( sharedArrayBuffer_for_sleep ) ;

var sleep = function( n ) {
    Atomics.wait( sharedArray_for_sleep , 0 , 0 , n * 1000 ) ;
}
/*************** */
const error_msg_list = [];

const request_headers = {
    'Accept': '*/*',
    'Host': 'api.weibo.cn',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
    'User-Agent': 'WeiboOverseas/4.7.8 (iPhone; iOS 15.5; Scale/3.00)',
}

function random_range(min, max) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * min + 1, 10);
        break;

        case 2:
            return parseInt(Math.random() * (max - min + 1) + min, 10);
        break;

        default:
            return 0;
        break;
    }
}

function form_params(data, type) {
    let params = {}

    if (data === '') {
        log.error(`数据为空, 类型为 ${type}`)
        error_msg_list.push(`数据为空, 类型为 ${type}`);
        return false;
    }

    if (type === 'cookie') {
        data.split('&').forEach((item, index) => {

            const split_item = item.split('=');
    
            params[split_item[0]] = split_item[1];
        })   

        return params;
    } else if (type === 'sign_action') {
        let cookie = form_params(CURRENT_COOKIE, 'cookie');
        let request_url = data.slice(data.indexOf('request_url=') + 'request_url='.length, data.indexOf('%26container_id'));

        const abort_property = ['containerid', 'extparam', 'page', 'v_f'];
        const cookie_order = ['aid', 'c', 'from', 'gsid', 'i', 'lang', 'request_url', 's', 'ua', 'v_p'];
        abort_property.forEach(item => {
            Reflect.deleteProperty(cookie, item);
        });
        cookie.request_url = request_url;

        cookie_order.forEach(item => {
            params[item] = cookie[item];
        })
        return params;
    } else if (type === 'profile') {
        let cookie = {}

        data.split('&').forEach((item, index) => {

            const split_item = item.split('=');
    
            cookie[split_item[0]] = split_item[1];
        })   

        const abort_property = ['containerid', 'extparam', 'page', 'v_f'];
        const cookie_order = ['aid', 'c', 'from', 'gsid', 'i', 'lang', 's', 'ua', 'v_p'];
        abort_property.forEach(item => {
            Reflect.deleteProperty(cookie, item);
        });

        cookie_order.forEach(item => {
            params[item] = cookie[item];
        })

        return qs.stringify(params);
    }  else {
        try {
            data.split('&').forEach((item, index) => {

                const split_item = item.split('=');

                params[split_item[0]] = split_item[1];
            })
        }
        catch (err){
            log.error(err);
        }
        return params;       
    }
}

async function get_follow_list(cookie) {
    log.info('开始获取超话列表');

    let page = '1'
    let since_id = ''

    let follow_list = []

    let data = form_params(cookie, 'cookie');

    const base_url = 'https://api.weibo.cn/2/cardlist';

    let res_obj = {};

    while (true) {
        sleep(random_range(10, 15));

        data['v_f'] = page;
        data['since_id'] = since_id;

        const isSuccess = await axios({
            method: 'get',
            url: base_url,
            headers: request_headers,
            params: data,
            timeout: 3000,
        })
        .then(res => {
            res_obj = res.data;

            if (res_obj.errno != undefined) {
                log.info(`获取超话列表第 ${page} 页数据失败, 错误提示：${res_obj.errmsg}`)
                error_msg_list.push(`获取超话列表第 ${page} 页数据失败, 错误提示：${res_obj.errmsg}`);
                return;
            }
    
            let card_group = res_obj.cards[0].card_group;
            let card_list_info = res_obj.cardlistInfo;
    
            since_id = card_list_info.since_id;
            try {
                page = JSON.parse(since_id).page.toString();
            } catch {
                page = (parseInt(page) + 1).toString(); 
            }

            for (const item of card_group) {
                if (item.card_type === '8') {
                    const page_index = item.itemid.slice(item.itemid.indexOf('follow_super_follow_') + 'follow_super_follow_'.length, item.itemid.length);
                    const topic = {
                        title: item.title_sub,
                        level: item.desc1.slice(item.desc1.indexOf('.') + 1, item.desc1.length),
                        sign_status: item.buttons[0].name,
                        sign_action: item.buttons[0].name === '已签' ? '' : item.buttons[0].params.action,
                        since_id: since_id,
                        page: page_index.split('_')[0],
                    }

                    follow_list.push(topic);
                }                
            }

            log.info(`获取超话列表第 ${page-1} 页数据成功`);            
        })
        .catch(err => {
            log.error(`获取超话列表第 ${page} 页数据失败. 错误提示：${err}`)
            error_msg_list.push(`获取超话列表第 ${page} 页数据失败, 错误提示：${err}`);
        })

        if (since_id === '' || isSuccess === false || since_id === '0') {
            break;
        }
    }

    return follow_list;
}

async function sign_topic(topic_list) {
    log.info('开始执行签到');
    
    const base_url = 'https://api.weibo.cn/2/page/button';
    const list_length = topic_list.length;

    for (let i = 0; i < topic_list.length; i++) {
        const item = topic_list[i];
        const index = i + 1;

        if (item.sign_status === '已签') {
            log.info(`超话 ${item.title} 已签到 ${index} / ${list_length}`);
        } else {
            let sign_params = form_params(item.sign_action, 'sign_action');

            sleep(random_range(15, 30));
            await axios({
                method: 'get',
                url: base_url,
                headers: request_headers,
                params: sign_params,
                timeout: 3000
            }).then(res => {
                let res_obj = res.data;

                if (res_obj.errno != undefined) {
                    log.error(`超话 ${item.title} 签到失败 ${index} / ${list_length}, 错误提示：${res_obj.errmsg}`);
                    error_msg_list.push(`超话 ${item.title} 签到失败 ${index} / ${list_length}, 错误提示：${res_obj.errmsg}`);
                } else {
                    if (res_obj.msg === '已签到') {
                        item.sign_status = '已签';
                        log.info(`超话 ${item.title} 签到成功 ${index} / ${list_length}`);
                    }
                }
            })
            .catch(err => {
                log.error(`超话 ${item.title} 签到失败 ${index} / ${list_length}, 错误提示：${err}`);
                error_msg_list.push(`超话 ${item.title} 签到失败 ${index} / ${list_length}, 错误提示：${err}`);
            })
        }        
    }

    log.info('当前用户列表签到执行完成');
    return topic_list;
}

async function form_result(res) {
    let total_success = 0;
    let total_failed = 0;
    let content = ``;

    for (let i = 0; i < res.length; i++) {
        const item = res[i];
        const data = item.data;

        let total_topic = data.length;
        let signed_topic = 0;
        let failed_topic_list = [];
        data.forEach(item => item.sign_status === '已签' ? signed_topic++ : failed_topic_list.push(item.title));

        let failed_content = ''
        if (failed_topic_list.length != 0) {
            total_failed++;
            let start_with = ' 签到❌ \n';

            failed_topic_list.forEach(item => {
                start_with = start_with + '    ' + item + '\n'; 
            })

            failed_content = start_with;
        } else {
            total_success++;
        }

        content = content.concat(` 签到✅ ${signed_topic} / ${total_topic} \n`);
        content = failed_topic_list.length === 0 ? content.concat('\n') :  content.concat(failed_content + '\n');
   }

   return content;
}

async function weibo() {
    let msg = " 【微博超话】:\n";
    log.info('微博超话签到脚本开始执行');

    if (config.weibo === '') {
        msg += "    Cookie 缺失";
    } else {
        const follow_list = await get_follow_list(config.weibo);

        if (follow_list.length === 0) {
            log.warning('无待签到列表');
            msg += "    无待签到列表\n";
            return;
        }

        const sign_result = await sign_topic(follow_list);
        msg += await form_result(sign_result);
    }

    return msg;
}

module.exports = weibo;