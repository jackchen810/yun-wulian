'use strict';
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
//本表记录变量变化后需要输出的内容
const devunitTriggerSchema = new mongoose.Schema({
    devunit_name:String,  //设备元名称，key1
    var_name:String,  //变量名称，key2

    dev_cn_name:String,  //设备名称，中文信息， 界面显示使用

    if_number:String,  //变量需要比较的值
    if_symbol:String, //操作符号，等于，不等于，小于，大于
    if_true_comment:String, //  判断正确输出的内容
    if_false_comment:String, //判断错误输出的内容

    logs_type:String, //日志类型， run，alarm

    update_time:String, //状态更新时间
    sort_time:Number, //排序时间戳，
});



const devunitTriggerTable = mongoose.model('devunitTriggerTable', devunitTriggerSchema);

//导出模块
module.exports = devunitTriggerTable;
