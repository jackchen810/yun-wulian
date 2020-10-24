'use strict';
const fork = require('child_process').fork;
const logger = require( '../logs/logs.js');
//const config = require('config-lite');
//const mqtt_hnd = require('../process-mqtt/mqtter_phandle.js');
//console.log('[main] create socket process...');

//创建一个工作进程
const socket_p = fork('./process-socket/socket_main.js', ['socket_main']);
socket_p.on('message', function () {
    //config.process.socket_pid = process.pid;
    console.log('[main] recv socket message, pid =', process.pid);
    //console.log('[main] recv socket message, pid =', config.process.socket_pid);
});


socket_p.on('error', (err) => {
    logger.info('socket error:', err);
});

socket_p.on('exit', (err) => {
    logger.error('socket exit:', err);
});

socket_p.on('close', (err) => {
    logger.error('socket close:', err);
    //异常直接退出主进程，外部pm2重启整个进程
    //这里要杀死其它子进程
    //主进程退出
    process.exit(0);
});


//导出模块
module.exports = socket_p;

