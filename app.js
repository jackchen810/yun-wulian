'use strict';

const logger = require( './logs/logs.js');

//创建一个工作进程
const http_hnd = require('./process-http/http_phandle.js');
const mqtter_hnd = require('./process-mqtt/mqtter_phandle.js');
const timer_hnd = require("./process-timer/timer_phandle.js");
const https_hnd = require("./process-https/https_phandle.js");
const socket_hnd = require("./process-socket/socket_phandle.js");


//注册进程间消息接收
// 进程1 ----》 主进程 （父进程）-----》进程2
// 主进程监听各个消息
http_hnd.on('message', process_message_reactor);
mqtter_hnd.on('message', process_message_reactor);
timer_hnd.on('message', process_message_reactor);
https_hnd.on('message', process_message_reactor);
socket_hnd.on('message', process_message_reactor);

//logger.info('[main] this is main process..., pid =', process.pid);
//require("./process-https/https_main.js");
//创建一个工作进程, 这个是主进程,不使用fork
require('./process-main/main_main.js');
const FatherRxTx = require('./process-main/father_rxtx.js');
//初始化 gateway的发送函数；
FatherRxTx.setSendCallback(process_message_reactor);


//const fork = require('child_process').fork;

//创建一个工作进程
//const app_http = fork('./process-http/http_main.js');
//app_http.on('message', process_message_reactor);
//console.log('create process http');

//创建一个工作进程
//const app_mqtt = fork('./process-mqtt/mqtter_main.js');
//app_mqtt.on('message', process_message_reactor);
//console.log('create process mqtt');


//创建一个工作进程
/*
const app_https = fork('./process-https/https_main.js');
app_https.on('message', process_message_reactor);
console.log('create process https');
*/


//消息混合器
// 父进程接收到进程间消息后通过head 字段的源，目的发送到对应进程
// body携带具体数据部分
/*
* var res = {
*     'head': {'type': type, 'action': action, 'source': 'gateway', 'dest': dest},
*     'body': message,
* }
*/
function process_message_reactor(message) {
   
    var head = message['head'];
    var source = head['source'];
    var dest = head['dest'];

    if (process.env.NODE_ENV == 'development') {
        console.log('[%s ---> %s] message:',  source, dest, JSON.stringify(message));
    }


    //参数有效性检查，如果，不是数组，返回错误
    //可以支持进程间的广播通讯
    var dest_list = [];
    if (Array.isArray(dest)){
        dest_list = dest;
    }
    else{
        dest_list[0] = dest;
    }

    //消息分发， 此代码运行在父进程，调用子进程的发送函数
    for (var i=0; i < dest_list.length; i++){
        head['dest'] = dest_list[i];   //dest替换
        if (dest_list[i] == 'http') {
            http_hnd.send(message);
        }
        else if (dest_list[i] == 'https') {
            https_hnd.send(message);
        }
        else if (dest_list[i] == 'mqtter') {
            mqtter_hnd.send(message);
        }
        else if (dest_list[i] == 'timer') {
            timer_hnd.send(message);
        }
        else if (dest_list[i] == 'father') {
            //父进程，直接调用
            FatherRxTx.onMessage(message);
        }
        else if (dest_list[i] == 'wss') {
            //父进程，直接调用
          
            // http_hnd.send(message);
        }
    }

    return;
}


process.on('exit', (err) => {
    logger.info('main process exit:', err);
    //异常直接退出主进程，外部pm2重启整个进程
    //这里要杀死其它子进程

    //<boolean> 当 subprocess.kill() 已成功发送信号给子进程后会被设置为 true。
    logger.error('http_hnd.killed:', http_hnd.killed);
    // 发送 SIGTERM  到进程
    http_hnd.kill();
    mqtter_hnd.kill();
    timer_hnd.kill();
    https_hnd.kill();
    logger.error('http_hnd.killed:', http_hnd.killed);
});

process.on('close', (err) => {
    logger.error('main process close:', err);
    //异常直接退出主进程，外部pm2重启整个进程
    //这里要杀死其它子进程

    //<boolean> 当 subprocess.kill() 已成功发送信号给子进程后会被设置为 true。
    logger.error('http_hnd.killed:', http_hnd.killed);
    // 发送 SIGTERM  到进程
    http_hnd.kill();
    mqtter_hnd.kill();
    timer_hnd.kill();
    https_hnd.kill();
    logger.error('http_hnd.killed:', http_hnd.killed);
});



process.on('unhandledRejection', (reason, p) => {
    logger.info("Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    logger.error("[main] uncaughtException：", err);
});