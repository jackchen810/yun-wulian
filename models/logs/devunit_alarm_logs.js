'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
const devunitAlarmSchema = new mongoose.Schema({
    device_name:String,  //设备名称
    devunit_name:String,  //设备元
    varName:String,  //变量名
    varValue:String,  //变量值
    comment:String, //告警内容

    update_time:String, //告警更新时间
    sort_time:Number, //排序时间戳，
});

const devunitAlarmTable = mongoose.model('devunitAlarmTable', devunitAlarmSchema);

//导出模块
module.exports = devunitAlarmTable;
