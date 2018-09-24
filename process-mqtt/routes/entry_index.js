'use strict';


const MqttDispatchHandle = require('../message/mqtt_dispatch.js');
const config = require('config-lite');


//mqtt router
 function mqtt_router(client) {
     //订阅 1) 上下线   2） 上报的sysinfo
     client.subscribe(config.mqtt.node_topic + 'clients/#',{qos:1});
     //client.subscribe(config.mqtt.node_topic,{qos:1});
     client.subscribe('yunWL/+/post/#',{qos:1});
     //client.subscribe('$SYS/#',{qos:1});
     //client.subscribe('YunWL/+/CMD_GET/',{qos:1});

     client.on('message', MqttDispatchHandle.onMessage);
     //client.on('message', MqttDispatchHandle.onMessage);

     //监听进程消息
     //process.on('message', MqttDispatchHandle.onMessage_sysinfo);

     console.log('[mqtt] load router, pid =', process.pid);
}



//导出模块
module.exports = mqtt_router;