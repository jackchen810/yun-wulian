'use strict';


const config = require('config-lite');
const emitter = require("../../mqttclient/subscribe/mqtt_event.js");


//消息处理
function onMessage(topic, message)
{

    //var msg_string = message.toString();
    //var msg_string = iconv.decode(message, 'gb2312');
    //if (process.env.NODE_ENV == 'local'){
    //    console.log('[emqtt] response:', topic, msg_string);
    //}

    //分解topic 字段
    var topic_array = topic.split('/');
    var msg_string = message.toString();
    msg_string = msg_string.replace(/(\r\n)|(\n)/gm,"<br>");//把里面的回车换行符替换掉
    console.log('[http][yunAC] response:', topic, msg_string);

    try {
        var josnObj = JSON.parse(msg_string); //由JSON字符串转换为JSON对象
    }
    catch (err) {
        console.log('[http] yunAC消息出错啦:' + err.message);
        return;
    }

    console.log('parse response msg:', josnObj.id, josnObj.unixtime);

    //解析mac地址
    var router_mac = topic_array[1];
    var task_id = josnObj['id'];

    //1. 发送event:task_id 事件， 任务更新使用
    emitter.emit(task_id, router_mac, josnObj);

}

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

     client.subscribe('yunAC/+/#',{qos:1});
     //client.subscribe('$SYS/#',{qos:1});
     //client.subscribe('yunWL/+/CMD_GET/',{qos:1});

     client.on('message', onMessage);
     //client.on('message', MqttDispatchHandle.onMessage);

     //监听进程消息
     //process.on('message', MqttDispatchHandle.onMessage_sysinfo);

     console.log('[mqtt] load router, pid =', process.pid);
}



//导出模块
module.exports = mqtt_router;