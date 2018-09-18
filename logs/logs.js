'use strict';

const dtime = require('time-formater');
const winston = require('winston');


const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ level: 'info' }),
        new (winston.transports.File)({
            filename: './logs/node.log',
            level: 'info',
            timestamp: () => dtime().format('YYYY-MM-DD HH:mm:ss'),
            handleExceptions: true,
            maxsize: 5242880,
            maxFiles: 10
        })
    ]
});

logger.info('log start...');
/*
logger.log('silly', "127.0.0.1 - there's no place like home");
logger.log('debug', "127.0.0.1 - there's no place like home");
logger.log('verbose', "127.0.0.1 - there's no place like home");
logger.log('info', "127.0.0.1 - there's no place like home");
logger.log('warn', "127.0.0.1 - there's no place like home");
logger.log('error', "127.0.0.1 - there's no place like home");

logger.info("127.0.0.1 - there's no place like home");
logger.warn("127.0.0.1 - there's no place like home");
logger.error("127.0.0.1 - there's no place like home");
*/


//导出模块
module.exports = logger;