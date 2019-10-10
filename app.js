'use strict';

const logger = require( './logs/logs.js');

//创建一个工作进程
const http_hnd = require('./process-http/http_phandle.js');
const mqtter_hnd = require('./process-mqtt/mqtter_phandle.js');
const timer_hnd = require("./process-timer/timer_phandle.js");
const https_hnd = require("./process-https/https_phandle.js");

//logger.info('[main] this is main process..., pid =', process.pid);
//require("./process-https/https_main.js");
require('./process-main/main_main.js');

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