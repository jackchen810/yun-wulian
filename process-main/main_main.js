'use strict';

const logger = require( '../logs/logs.js');
logger.info('[main] create main process..., pid =', process.pid);


require('../mongodb/db.js');
//require("./controller/o3_100kg_real.js");
//require("./controller/s7_smart_plc.js");





process.on('unhandledRejection', (reason, p) => {
    logger.info("[main] Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    logger.error("[main] uncaughtException：", err);
});