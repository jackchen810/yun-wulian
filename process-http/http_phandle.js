'use strict';
const fork = require('child_process').fork;
const logger = require( '../logs/logs.js');
const config = require('config-lite');
const mqtt_hnd = require('../process-mqtt/mqtter_phandle.js');
//console.log('[main] create http process...');

//创建一个工作进程
const http_p = fork('./process-http/http_main.js');
http_p.on('message', function () {
    //config.process.http_pid = process.pid;
    console.log('[main] recv http message, pid =', process.pid);
    //console.log('[main] recv http message, pid =', config.process.http_pid);
});


http_p.on('error', (err) => {
    logger.info('http error:', err);
});

http_p.on('exit', (err) => {
    logger.error('http exit:', err);
});

http_p.on('close', (err) => {
    logger.error('http close:', err);
    //异常直接退出主进程，外部pm2重启整个进程
    //这里要杀死其它子进程
    if(config.process.http_pid > 0)
    {
        logger.error('ready kill http pid:', config.process.http_pid );
        process.kill(config.process.http_pid);
    }
    if(config.process.https_pid > 0)
    {
        logger.error('ready kill https pid:', config.process.https_pid );
        process.kill(config.process.https_pid);
    }
    if(config.process.mqtter_pid > 0)
    {
        logger.error('ready kill mqtter pid:', config.process.mqtter_pid );
        process.kill(config.process.mqtter_pid);
    }
    if(config.process.timer_pid > 0)
    {
        logger.error('ready kill timer pid:', config.process.timer_pid );
        process.kill(config.process.timer_pid);
    }

    //<boolean> 当 subprocess.kill() 已成功发送信号给子进程后会被设置为 true。
    logger.error('mqtt_hnd.killed:', mqtt_hnd.killed);
    // 发送 SIGHUP 到进程
    mqtt_hnd.kill();
    logger.error('mqtt_hnd.killed:', mqtt_hnd.killed);
    process.exit(0);
});


//导出模块
module.exports = http_p;

