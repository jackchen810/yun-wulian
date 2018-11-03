'use strict';

const logger = require( './logs/logs.js');

//创建一个工作进程
require('./process-http/http_phandle.js');
require('./process-mqtt/mqtter_phandle.js');
require("./process-timer/timer_phandle.js");
require("./process-https/https_phandle.js");

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



process.on('unhandledRejection', (reason, p) => {
    logger.info("Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    logger.error("[main] uncaughtException：", err);
});