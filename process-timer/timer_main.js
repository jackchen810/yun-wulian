'use strict';

const logger = require( '../logs/logs.js');
const  timerRxTx = require("./timer_rxtx.js");
logger.info('[timer] create timer process..., arg2:'+ process.argv[2], ',pid =', process.pid);



require('../mongodb/db.js');
require("./controller/tmr_data_history.js");
require("./controller/tmr_data_alarm.js");





process.on('unhandledRejection', (reason, p) => {
    logger.info("[timer] Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    logger.error("[timer] uncaughtException：", err);
    console.log("[timer] uncaughtException：", err);
});


//监听进程消息, //进程通讯服务
process.on('message', timerRxTx.onMessage);