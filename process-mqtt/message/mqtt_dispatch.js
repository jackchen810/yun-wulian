'use strict';


//引入事件模块
const logger = require("../../logs/logs.js");
const emitter = require("../../mqttclient/subscribe/mqtt_event.js");
const iconv = require("iconv-lite");


class MqttDispatchHandle {
    constructor(){
        //console.log('create MqttDispatchHandle');
        this.onMessage = this.onMessage.bind(this);
        this.onMssage_SYS = this.onMssage_SYS.bind(this);
        this.onMessage_yunAC = this.onMessage_yunAC.bind(this);
    }

    //消息处理
    //mqtt emit的消息只能本进程处理
    //如果需要接收网关的应答事件，在http进程里订阅了该消息
    async onMessage(topic, message) {

        //var msg_string = message.toString();
        //var msg_string = iconv.decode(message, 'gb2312');
        //if (process.env.NODE_ENV == 'local'){
        //    console.log('[emqtt] response:', topic, msg_string);
        //}

        //分解topic 字段
        var topic_array = topic.split('/');

        if (topic_array[0] == '$SYS') {
            var msg_string = message.toString();
            if (process.env.NODE_ENV == 'local'){
                console.log('[emqtt][$SYS] response:', topic, msg_string);
            }
            this.onMssage_SYS(topic_array, topic, msg_string);
        }
        // 爱德佳创设备是gb2312编码
        else if (topic_array[0] == 'yunWL') {
            var msg_string = iconv.decode(message, 'gb2312');
            if (process.env.NODE_ENV == 'local'){
                logger.debug('[emqtt][yunWL] response:', topic, msg_string);
            }

            this.onMessage_yunVendor(topic_array, topic, msg_string);
        }
        // 爱德佳创部分设备是使用ntf-8编码的
        else if (topic_array[0] == 'yunADJC') {
            var msg_string = message.toString();
            if (process.env.NODE_ENV == 'local'){
                logger.debug('[emqtt][yunADJC] response:', topic, msg_string);
            }
            this.onMessage_yunVendor(topic_array, topic, msg_string);
        }
        // yunAC 的命令都是系统及的维护命令, jdwx设备使用该种方式
        //jdwx网关设备的回应是yunAC，数据上报topic yunJDWX
        else if (topic_array[0] == 'yunAC') {
            var msg_string = message.toString();
            //logger.debug('[emqtt][yunAC] response:', message[89], message[90], message[91],message[92], message[93], message[94], message[95]);
            logger.debug('[emqtt][yunAC] response:', topic, msg_string);
            msg_string = msg_string.replace(/(\r\n)|(\n)/g,"<br\>");//把里面的回车换行符替换掉
            //logger.debug('[emqtt][yunAC] response2:', topic, msg_string);
            this.onMessage_yunAC(topic_array, topic, msg_string);
        }
        else if (topic_array[0] == 'yunWTBL') {
            //  yunWTBL设备
            var msg_string = message.toString();
            logger.debug('[emqtt][yunWTBL] response:', topic, msg_string);
            if (process.env.NODE_ENV == 'local'){
                logger.debug('[emqtt][yunWTBL] response:', topic, msg_string);
            }
            this.onMessage_yunWTBL(topic_array, topic, msg_string);
        }
        else if (topic_array[0] == 'yunJDWX') {
            //  yyunJDWXL设备
            var msg_string = message.toString();
            //logger.debug('[emqtt][yunJDWX] response:', topic, msg_string);
            if (process.env.NODE_ENV == 'local'){
                logger.debug('[emqtt][yunJDWX] response:', topic, msg_string);
            }
            this.onMessage_yunVendor(topic_array, topic, msg_string);
        }
        else {
            //  else  设备
            var msg_string = message.toString();
            //logger.debug('[emqtt][else] response:', topic, msg_string);
            if (process.env.NODE_ENV == 'local'){
                logger.debug('[emqtt][else] response:', topic, msg_string);
            }
            this.onMessage_yunVendor(topic_array, topic, msg_string);
        }

    }


    //$SYS 的topic的处理
    //只处理设备连接，断开状态的更新
    async onMssage_SYS(topic_array, topic, message) {

        var client_id = topic_array[4];
        var action = topic_array[5];

        //logger.debug('emqtt $SYS:', router_mac, action);

        //发送event 事件， data是josn对象格式，内部同一使用josn对象
        if (topic_array[5] == 'connected'){
            emitter.emit('$SYS', client_id, 'online');
        }
        else if(topic_array[5] == 'disconnected'){
            emitter.emit('$SYS', client_id, 'offline');
        }
    }

    //yunAC 的topic的处理
    async onMessage_yunAC(topic_array, topic, message) {

        try {
            var josnObj = JSON.parse(message); //由JSON字符串转换为JSON对象
        }
        catch (err) {
            logger.debug('出错啦:' + err.message);
            return;
        }

        logger.debug('parse response msg:', josnObj.id, josnObj.unixtime);

        //解析mac地址
        var router_mac = topic_array[1];
        var task_id = josnObj['id'];   //uuid

        //1. 发送event:task_id 事件， 任务更新使用
        emitter.emit(task_id, router_mac, josnObj);
    }


    //yunVendor 的topic的处理
    async onMessage_yunVendor(topic_array, topic, message) {

        try {
            var josnObj = JSON.parse(message); //由JSON字符串转换为JSON对象
        }
        catch (err) {
            logger.debug('出错啦:' + err.message);
            return;
        }

        //logger.debug('parse response msg:', josnObj.id, josnObj.item);

        //解析mac地址
        //topic example：yunADJC/jinxi_1/post/plc
        //topic example：yunAC/FFFFFFFFFFFF/post/plc
        //topic example：yunJDWX/jdwx_exec/post/plc
        var source = topic_array[1];
        var command = topic_array[0];

        //1. 发送event:task_id 事件， 任务更新使用
        emitter.emit(command, source, josnObj);
    }


    //yunWTBL 的topic的处理
    async onMessage_yunWTBL(topic_array, topic, message) {

        try {
            var josnObj = JSON.parse(message); //由JSON字符串转换为JSON对象
        }
        catch (err) {
            logger.debug('出错啦:' + err.message);
            return;
        }

        //logger.debug('parse response msg:', josnObj.id, josnObj.item);

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
        //
        //mqtt emit的消息只能本进程处理
        //如果restful接口需要接收网关的应答事件，在http进程里订阅了该消息
        //mqtt_route_entry.js文件
        emitter.emit(command, source, josnObj);
        logger.debug('[emqtt][WTBL] response msg:', cmdId, source, message);
    }

}


//导出模块
module.exports = new MqttDispatchHandle();
