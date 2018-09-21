'use strict';
const logger = require( '../logs/logs.js');
logger.info('[mqtt] create mqtt process..., pid =', process.pid);

const mqttClient = require('../mqttclient/mqttclient.js');
const mqtt_router = require('./routes/entry_index.js');
require('../mongodb/db.js');
require("./controller/device_ide4g.js");



//注册mqtt分发
mqtt_router(mqttClient);





process.on('unhandledRejection', (reason, p) => {
    logger.info("Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});


process.on('uncaughtException', (err) => {
    logger.error("[mqtt] uncaughtException：", err);
});