'use strict';


//引入事件模块
const logger = require("../../logs/logs.js");
const emitter = require("../../mqttclient/subscribe/mqtt_event.js");


class MqttDispatchHandle {
    constructor(){
        //console.log('create MqttDispatchHandle');
        this.onMessage = this.onMessage.bind(this);
        this.onMssage_SYS = this.onMssage_SYS.bind(this);
        this.onMessage_YunAC = this.onMessage_YunAC.bind(this);
    }

    //消息处理
    async onMessage(topic, message) {

        var msg_string = message.toString();
        if (process.env.NODE_ENV == 'local'){
            console.log('[emqtt] response:', topic, msg_string);
        }

        //分解topic 字段
        var topic_array = topic.split('/')

        if (topic_array[0] == '$SYS') {
            //MqttDispatchHandle.prototype.Md5555(6);
            this.onMssage_SYS(topic_array, topic, msg_string);
        }
        else {
            this.onMessage_YunAC(topic_array, topic, msg_string);
        }
    }


    //$SYS 的topic的处理
    //只处理设备连接，断开状态的更新
    async onMssage_SYS(topic_array, topic, message) {

        var client_id = topic_array[4];
        var client_id_array = client_id.split('_');

        //router mac
        var router_mac = client_id_array[0];
        var action = topic_array[5];

        //console.log('emqtt $SYS:', router_mac, action);

        //发送event 事件， data是josn对象格式，内部同一使用josn对象
        if (topic_array[5] == 'connected'){
            emitter.emit('$SYS', router_mac, 'online');
        }
        else if(topic_array[5] == 'disconnected'){
            emitter.emit('$SYS', router_mac, 'offline');
        }
    }

    //$YunAC 的topic的处理
    async onMessage_YunAC(topic_array, topic, message) {

        try {
            var josnObj = JSON.parse(message); //由JSON字符串转换为JSON对象
        }
        catch (err) {
            console.log('出错啦:' + err.message);
            return;
        }

        //console.log('parse response msg:', josnObj.id, josnObj.item);

        //解析mac地址
        var router_mac = topic_array[1];
        var task_id = josnObj['id'];
        var item = josnObj['item'];


        // 记录日志
        if (topic_array[2] == 'CMD_EXE' && item != 'shell') {
            logger.info('mqtt response:', topic, msg_string);
        }


        //1. 发送event:task_id 事件， 任务更新使用
        emitter.emit(task_id, router_mac, josnObj);

        // 1.1 送到主进程, 主进程的处理需要接收改消息
        //logger.info('process connected:', process.connected);
        if (process.connected) {
            process.send({
                "dest": "main",
                "source": "mqtt",
                "task_id": task_id,
                "router_mac": router_mac,
                "body": josnObj
            });
        }

        //主动上报sysyinifo, 查询的sysinfo
        if (item == 'sysinfo') {
            //channel_2.4无法转换成对象属性, 重新生成josn数据
            var msg_string = message.replace(/channel_2.4/g, 'channel_2_4');
            var josnObj = JSON.parse(msg_string); //由JSON字符串转换为JSON对象
        }

        //2. 发送event:item 事件， 具体使用者可以接收
        emitter.emit(item, router_mac, josnObj);

        //3. 发送event:task 事件， 任务更新使用
        if (task_id != 'ROMSYNC') {
            emitter.emit('task', router_mac, josnObj, message);
        }
    }


}


//导出模块
module.exports = new MqttDispatchHandle();
