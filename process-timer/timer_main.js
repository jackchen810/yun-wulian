'use strict';

const logger = require( '../logs/logs.js');
logger.info('[timer] create timer process..., pid =', process.pid);


require('../mongodb/db.js');
require("./controller/tmr_device_ide4g.js");




process.on('unhandledRejection', (reason, p) => {
    logger.info("Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    logger.error("[timer] uncaughtException：", err);
});