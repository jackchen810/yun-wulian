'use strict';
const fork = require('child_process').fork;


//console.log('[main] create mqtt process...');



//创建一个工作进程
const https_p = fork('./process-https/https_main.js');
https_p.on('message', function () {
    console.log('[main] recv https message, pid =', process.pid);
});


https_p.on('error', (err) => {
    logger.info('https error:', err);
});

https_p.on('exit', (err) => {
    logger.error('https exit:', err);
});

https_p.on('close', (err) => {
    logger.error('https close:', err);
});


//导出模块
module.exports = https_p;
