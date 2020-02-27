'use strict';


const config = require('config-lite');
const emitter = require("../../mqttclient/subscribe/mqtt_event.js");


//消息处理
//emqtt的一些消息在这里处理
//jdwx的网关里上报的消息分不同topic， 回应交互式消息在这里处理，使用yunAC的topic
//wtbl的网关设备里上报的消息是相同topic，订阅同一个设备的，这个消息有些多
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
    //console.log('[http][yunAC] response:', topic, msg_string);

    try {
        var josnObj = JSON.parse(msg_string); //由JSON字符串转换为JSON对象
    }
    catch (err) {
        console.log('[http] yunAC消息出错啦:' + err.message);
        return;
    }

    if (topic_array[0] == 'yunAC') {
        console.log('[http][yunAC] response:', topic, msg_string);
        //console.log('[emqtt][yunAC] response2:', topic, msg_string);

        //解析mac地址
        var router_mac = topic_array[1];
        var task_id = josnObj['id'];

        //1. 发送event:task_id 事件， 任务更新使用
        emitter.emit(task_id, router_mac, josnObj);

    }
    else if (topic_array[0] == 'yunWTBL') {
        var msg_string = message.toString();
        msg_string = msg_string.replace(/(\r\n)|(\n)/gm,"<br>");//把里面的回车换行符替换掉
        //console.log('[http][yunWTBL] response:', topic, msg_string);


        //解析mac地址
        //topic example：yunWTBL/设备名称/post/plc
        var source = topic_array[1];
        var command = topic_array[0];
        var cmdId = josnObj['cmdId'];

        //cmdId = 103  :   数据上报

        //cmdId = 87  :   写变量
        //cmdId = 88  :   写变量返回

        //cmdId = 89  :   读取配置信息
        //cmdId = 90  :   读取配置信息返回
        //数据上报在mqtt进程进行处理
        if (cmdId == 103){
            return;
        }

        //mqtt emit的消息只能本进程处理
        //如果restful接口需要接收网关的应答事件，在http进程里订阅了该消息
        //mqtt_route_entry.js文件
        var gwSn = josnObj['gwSn'];
        emitter.emit(gwSn, gwSn, josnObj);
        //console.log('[http][WTBL] response msg:',gwSn, josnObj);

    }




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
     client.subscribe('yunWTBL/+/#',{qos:1});
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