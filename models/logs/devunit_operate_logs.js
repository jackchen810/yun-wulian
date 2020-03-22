'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
const devunitOperateSchema = new mongoose.Schema({
    user_account:String,  //操作者
    dev_cn_name:String,  //设备名称

    devunit_name:String,  //设备元
    var_name:String,  //变量名

    var_value:String,  //变量值
    comment:String, //内容

    update_time:String, //操作时间时间
    sort_time:Number, //排序时间戳，
});

const devunitOperateTable = mongoose.model('devunitOperateTable', devunitOperateSchema);

//导出模块
module.exports = devunitOperateTable;
