'use strict';

//引入事件模块
const logger = require("../../logs/logs.js");
const emitter = require("../../mqttclient/subscribe/mqtt_event.js");



class MqttSubHandle {
    constructor(){
        //console.log('create MqttSubHandle');
        this.addOnceListener = this.addOnceListener.bind(this);
        this.addLoopListener = this.addLoopListener.bind(this);
        this.delLoopListener = this.delLoopListener.bind(this);
    }



    //监听事件some_event
    // 仅适用于但命令任务下发，不适用于批量任务
    // 单次任务
    async addOnceListener(event, listener_callback, timeout){

        //监听事件some_event
        await emitter.once(event, listener_callback);

        setTimeout(function(){
            emitter.emit(event, -1, 'timeout');
        }, timeout);
    }


    //add 监听事件some_event
    // 仅适用于但命令任务下发，不适用于批量任务
    // loop 一般是批量任务，放在mqtt 进程处理合适
    async addLoopListener(event, listener_callback){

        //监听事件some_event
        await emitter.on(event, listener_callback);
    }


    //delete 监听事件some_event
    // 仅适用于但命令任务下发，不适用于批量任务
    async delLoopListener(event, listener_callback){

        //监听事件some_event
        await emitter.removeListener(event, listener_callback);
    }

/*
    async addTaskListener(uuid, uuid_count, listener_callback, timeout){

        var g_uuid_count = 0;

        // 监听器 #1
        var mylistener = function (uuid, mac, ret_message) {
            g_uuid_count++;
            console.log('g_uuid_count:', g_uuid_count, uuid_count);
            if (g_uuid_count >= uuid_count){
                emitter.removeListener(uuid, mylistener);
                emitter.emit(uuid, 0, 'finish');
                console.log('count:', g_uuid_count)
            }
        }

        //监听事件some_event
        await emitter.on(uuid, mylistener);

        //超时时间
        setTimeout(function(){
            emitter.emit(uuid, -1, 'timeout');
        }, timeout);
    }
*/
}


//导出模块
module.exports = new MqttSubHandle();
//module.exports = {};
//exports.MqttSubHnd = new MqttSubHandle();
//exports.Emitter = emitter;
//module.exports = exports;
