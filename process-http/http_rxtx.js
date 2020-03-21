'use strict';
const BaseProcessTx = require("../prototype/baseProcessTx");
const emitter = require("../mqttclient/subscribe/mqtt_event.js");
const logger = require( '../logs/logs.js');
/*
* request 格式：{'head': {'type': this.type, 'action': this.action}, body:message}
* response 格式：{'head': {'type': this.type, 'action': this.action}, body:message}
* */

//策略要继承基类
class httpRxTx extends BaseProcessTx {
    constructor(){
        //父类
        super();

        //记录任务id
        this.source = "http";
        //bind
        this.onMessage = this.onMessage.bind(this);
    }


    async onMessage(msg){

        if (typeof msg != 'object'){
            console.log('msg is error');
            this.send({ret_code: 1002, ret_msg: 'FAILED', extra:'type error'});
            return;
        }

        console.log('[http entry] recv request:', JSON.stringify(msg));
        //tradeLog('system', '1', msg);

        //type, action, data
        var head = msg['head'];
        var josnObj = msg['body'];

        //接收主进程发送过来的消息
        if(head.type == '88') {

            //cmdId = 103  :   数据上报

            //cmdId = 87  :   写变量
            //cmdId = 88  :   写变量返回

            //cmdId = 89  :   读取配置信息
            //cmdId = 90  :   读取配置信息返回
            //数据上报在mqtt进程进行处理


            //mqtt emit的消息只能本进程处理
            //如果restful接口需要接收网关的应答事件，在http进程里订阅了该消息
            //mqtt_route_entry.js文件
            var gwSn = josnObj['gwSn'];
            emitter.emit(gwSn, gwSn, josnObj);
            logger.debug('[http][WTBL] response msg:',gwSn, josnObj);

        }
        else if(head.type == 'backtest.task'){
            //var response = new FatherRx(head.type, head.action, head.source);

        }
    }

}


module.exports = new httpRxTx();