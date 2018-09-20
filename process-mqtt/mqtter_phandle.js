'use strict';
const fork = require('child_process').fork;
const logger = require( '../logs/logs.js');
const emitter = require("../mqttclient/subscribe/mqtt_event.js");

//console.log('[main] create mqtt process...');



//创建一个工作进程
const mqtt_p = fork('./process-mqtt/mqtter_main.js');
mqtt_p.on('message', function (message) {
    //console.log('[main] recv mqtt message, pid =', process.pid);
    console.log('[main] recv mqtt message, message =', JSON.stringify(message));

    // 发送task 事件， 主进程中使用监听函数监听
    /*
    if (message['task_id']){
        emitter.emit(message['task_id'], message['router_mac'], message['body']);
    }
    */
});

mqtt_p.on('error', (err) => {
    logger.info('mqtt error:', err);
});

mqtt_p.on('exit', (err) => {
    logger.error('mqtt exit:', err);
});

mqtt_p.on('close', (err) => {
    logger.error('mqtt close:', err);
});


//导出模块
module.exports = mqtt_p;
