'use strict';
const logger = require( '../logs/logs.js');
logger.info('[socket] create socket process..., arg2:'+ process.argv[2], ',pid =', process.pid);

var path = require('path');



const WebSocket = require('ws');
const { json } = require('body-parser');

const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({
    port: 3301
});

wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`);
    ws.on('message', function (datav) {
       
        console.log('datav......'+datav);
        setTimeout(() => {
            const arr = [1.2,1,234,23,67];
            // ws.send(`What's your name?`, (err) => {
            const back = {
                data: arr
            }
            ws.send(JSON.stringify(back), (err) => {
                if (err) {
                    console.log(`[SERVER] error: ${err}`);
                }
            });
        }, 1000);
    })
});

console.log('ws server started at port 3301...');



process.on('unhandledRejection', (reason, p) => {
    logger.info("[socket] Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    logger.error("[socket] uncaughtException：", err);
});


//监听进程消息, //进程通讯服务
//process.on('message', HttpRxTxHandle.onMessage);