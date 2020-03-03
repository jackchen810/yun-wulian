'use strict';

const dtime = require('time-formater');
const winston = require('winston');
console.log('process is:'+ process.argv[2], ',LOG env =', process.env.LOG);



const logger = new (winston.Logger)({
    transports: [
        //new (winston.transports.Console)({ level: 'info' }),
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


/*
默认情况下，仅在默认logger设置控制台传输。传输使用console和文件. 您可以通过add（）和remove（）方法添加或删除传输：

https://github.com/winstonjs/winston/blob/master/docs/transports.md  是transports的文档地址.

winston.add(winston.transports.File, { filename: 'somefile.log' });    //这里是将日志信息放到somefile.log文件中

winston.remove(winston.transports.Console);  //这个只是将日志信息打印出来
* */

/*  根据启动时的环境变量 添加出输出到控制台 */
if (process.env.LOG == process.argv[2]){

    console.log(process.argv[2]+ " add to console output");
    //这里是将日志信息放到somefile.log文件中
    logger.add(winston.transports.Console, { level: 'debug' });
}
else if (process.env.LOG == 'all'){
    //这里是将日志信息放到somefile.log文件中
    console.log(process.argv[2]+ " add to console output");
    logger.add(winston.transports.Console, { level: 'debug' });
}

logger.info('log start...', process.argv[2]);
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