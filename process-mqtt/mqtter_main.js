'use strict';
const logger = require( '../logs/logs.js');
logger.info('[mqtt] create mqtt process..., arg2:'+ process.argv[2], ',pid =', process.pid);



const mqttClient = require('../mqttclient/mqttclient.js');
const mqtt_router = require('./routes/mqtt_route_entry.js');
const config = require('config-lite');
const  mqtterRxTx = require("./mqtter_rxtx");


require('../mongodb/db.js');
require("./controller/mqtt_gateway_ide4g.js");
require("./controller/mqtt_gateway_wtbl4g.js");
require("./controller/mqtt_gateway_jdwx4g.js");





//注册mqtt分发
mqtt_router(mqttClient);

//甚至基于Node.js的Mosca。
//https://github.com/mcollina/mosca



process.on('unhandledRejection', (reason, p) => {
    logger.info("[mqtt] Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});


process.on('uncaughtException', (err) => {
    logger.error("[mqtt] uncaughtException：", err);
});


//监听进程消息, //进程通讯服务
process.on('message', mqtterRxTx.onMessage);