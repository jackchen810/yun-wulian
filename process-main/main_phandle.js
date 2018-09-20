'use strict';
const fork = require('child_process').fork;


//console.log('[main] create mqtt process...');



//创建一个工作进程
const https_p = fork('./process-https/https_main.js');
https_p.on('message', function () {
    console.log('[main] recv https message, pid =', process.pid);
});



//导出模块
module.exports = https_p;
