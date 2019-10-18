'use strict';


const MqttDispatchHandle = require('../message/mqtt_dispatch.js');
const config = require('config-lite');


//mqtt router
 function mqtt_router(client) {
     //订阅 1) 上下线   2） 上报的sysinfo
     // 设备订阅发布原则：
     // 订阅：yunWL/jinxi_1/post/plc   目的/ 源设备/ class/ devtype
     // 订阅：yunWL/jinxi_1/post/plc   目的/ 源设备/ class/ devtype
     // 订阅：yunAC/MAC/CMD_EXE/shell   目的/ 源设备/ cmd/ cmd name
     // 发布 jinxi_1/yunAC/CMD_EXE/reboot
     // 发布 MAC/yunAC/CMD_EXE/reboot
     // 源设备要唯一代表该设备
     client.subscribe(config.mqtt.node_topic + 'clients/#',{qos:1});
     //client.subscribe(config.mqtt.node_topic,{qos:1});
     client.subscribe('yunWL/+/post/#',{qos:1});
     client.subscribe('yunADJC/+/post/#',{qos:1});
     client.subscribe('yunWTBL/+/post/#',{qos:1});
     client.subscribe('yunJDWX/+/post/#',{qos:1});
     client.subscribe('yunAC/+/CMD_EXE/#',{qos:1});
     //client.subscribe('$SYS/#',{qos:1});
     //client.subscribe('yunWL/+/CMD_GET/',{qos:1});

     client.on('message', MqttDispatchHandle.onMessage);
     //client.on('message', MqttDispatchHandle.onMessage);

     //监听进程消息
     //process.on('message', MqttDispatchHandle.onMessage_sysinfo);

     console.log('[mqtt] load router, pid =', process.pid);
}



//导出模块
module.exports = mqtt_router;