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
                console.log('[emqtt][yunWL] response:', topic, msg_string);
            }

            this.onMessage_yunVendor(topic_array, topic, msg_string);
        }
        // 爱德佳创部分设备是使用ntf-8编码的
        else if (topic_array[0] == 'yunADJC') {
            var msg_string = message.toString();
            if (process.env.NODE_ENV == 'local'){
                console.log('[emqtt][yunADJC] response:', topic, msg_string);
            }
            this.onMessage_yunVendor(topic_array, topic, msg_string);
        }
        // yunAC 的命令都是系统及的维护命令
        else if (topic_array[0] == 'yunAC') {
            var msg_string = message.toString();
            //console.log('[emqtt][yunAC] response:', message[89], message[90], message[91],message[92], message[93], message[94], message[95]);
            console.log('[emqtt][yunAC] response:', topic, msg_string);
            msg_string = msg_string.replace(/(\r\n)|(\n)/g,"<br\>");//把里面的回车换行符替换掉
            //console.log('[emqtt][yunAC] response2:', topic, msg_string);
            this.onMessage_yunAC(topic_array, topic, msg_string);
        }
        else {
            //  yunWTBL    yunJDWX  设备
            var msg_string = message.toString();
            //console.log('[emqtt][else] response:', topic, msg_string);
            if (process.env.NODE_ENV == 'local'){
                console.log('[emqtt][else] response:', topic, msg_string);
            }
            this.onMessage_yunVendor(topic_array, topic, msg_string);
        }

    }


    //$SYS 的topic的处理
    //只处理设备连接，断开状态的更新
    async onMssage_SYS(topic_array, topic, message) {

        var client_id = topic_array[4];
        var action = topic_array[5];

        //console.log('emqtt $SYS:', router_mac, action);

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
            console.log('出错啦:' + err.message);
            return;
        }

        console.log('parse response msg:', josnObj.id, josnObj.unixtime);

        //解析mac地址
        var router_mac = topic_array[1];
        var task_id = josnObj['id'];

        //1. 发送event:task_id 事件， 任务更新使用
        emitter.emit(task_id, router_mac, josnObj);
    }


    //yunVendor 的topic的处理
    async onMessage_yunVendor(topic_array, topic, message) {

        try {
            var josnObj = JSON.parse(message); //由JSON字符串转换为JSON对象
        }
        catch (err) {
            console.log('出错啦:' + err.message);
            return;
        }

        //console.log('parse response msg:', josnObj.id, josnObj.item);

        //解析mac地址
        //topic example：yunADJC/jinxi_1/post/plc
        //topic example：yunAC/FFFFFFFFFFFF/post/plc
        //topic example：yunJDWX/jdwx_exec/post/plc
        var source = topic_array[1];
        var command = topic_array[0];

        //1. 发送event:task_id 事件， 任务更新使用
        emitter.emit(command, source, josnObj);
    }


}


//导出模块
module.exports = new MqttDispatchHandle();
