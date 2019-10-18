'use strict';
const logger = require( '../logs/logs.js');
logger.info('[mqtt] create mqtt process..., pid =', process.pid);



const mqttClient = require('../mqttclient/mqttclient.js');
const mqtt_router = require('./routes/mqtt_route_entry.js');
const config = require('config-lite');


require('../mongodb/db.js');
require("./controller/mqtt_device_ide4g.js");
require("./controller/mqtt_device_wtbl4g.js");
require("./controller/mqtt_device_jdwx4g.js");





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