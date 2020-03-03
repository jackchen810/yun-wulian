'use strict';
const fork = require('child_process').fork;
const logger = require( '../logs/logs.js');


//console.log('[main] create timer process...');



//创建一个工作进程
const timer_p = fork('./process-timer/timer_main.js', ['timer_main']);
timer_p.on('message', function () {
    console.log('[main] recv timer message, pid =', process.pid);
});

timer_p.on('error', (err) => {
    logger.info('timer error:', err);
});

timer_p.on('exit', (err) => {
    logger.error('timer exit:', err);
});

timer_p.on('close', (err) => {
    logger.error('timer close:', err);
    //异常直接退出主进程，外部pm2重启整个进程
    //这里要杀死其它子进程
    //主进程退出
    process.exit(0);
});

//导出模块
module.exports = timer_p;
