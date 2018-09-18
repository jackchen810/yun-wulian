'use strict';

//创建事件监听的一个对象
const events = require("events");


//导出模块
module.exports = new events.EventEmitter();
