'use strict';
const BaseProcessTx = require("../prototype/baseProcessTx");
/*
* request 格式：{'head': {'type': this.type, 'action': this.action}, body:message}
* response 格式：{'head': {'type': this.type, 'action': this.action}, body:message}
* */

//策略要继承基类
class mqtterRxTx extends BaseProcessTx {
    constructor(){
        //父类
        super();

        //记录任务id
        this.source = "mqtter";

        //bind
        this.onMessage = this.onMessage.bind(this);

    }


    async onMessage(msg){

        if (typeof msg != 'object'){
            console.log('msg is error');
            this.send({ret_code: 1002, ret_msg: 'FAILED', extra:'type error'});
            return;
        }

        console.log('[mqtter entry] recv request:', JSON.stringify(msg));
        //tradeLog('system', '1', msg);

        //type, action, data
        var head = msg['head'];
        var body = msg['body'];

        //接收主进程发送过来的消息
        if(head.type == 'trade.task') {
            //var response = new FatherRx(head.type, head.action, head.source);

        }
        else if(head.type == 'backtest.task'){
            //var response = new FatherRx(head.type, head.action, head.source);

        }
    }

}


module.exports = new mqtterRxTx();