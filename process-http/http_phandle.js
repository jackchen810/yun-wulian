'use strict';
const fork = require('child_process').fork;
const logger = require( '../logs/logs.js');


//console.log('[main] create http process...');

//创建一个工作进程
const http_p = fork('./process-http/http_main.js');
http_p.on('message', function () {
    console.log('[main] recv http message, pid =', process.pid);
});


http_p.on('error', (err) => {
    logger.info('http error:', err);
});

http_p.on('exit', (err) => {
    logger.error('http exit:', err);
});

http_p.on('close', (err) => {
    logger.error('http close:', err);
});


//导出模块
module.exports = http_p;

