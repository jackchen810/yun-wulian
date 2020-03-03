'use strict';

const logger = require( '../logs/logs.js');
logger.info('[timer] create timer process..., arg2:'+ process.argv[2], ',pid =', process.pid);


require('../mongodb/db.js');
require("./controller/tmr_rom_upgrade.js");




process.on('unhandledRejection', (reason, p) => {
    logger.info("[timer] Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    logger.error("[timer] uncaughtException：", err);
});