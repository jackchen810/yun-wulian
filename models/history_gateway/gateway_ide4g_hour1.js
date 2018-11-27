'use strict';

const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
const gatewayDataSchema = new mongoose.Schema({
    devunit_name:String,
    update_time:String, //状态更新时间

    data: Mixed,   //数据
    sort_time:Number, //排序时间戳，
});


const Gateway_Hour_Table = mongoose.model('Gateway_Hour_Table', gatewayDataSchema);


//导出模块
module.exports = Gateway_Hour_Table;
