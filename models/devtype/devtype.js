'use strict';

const mongoose = require('mongoose');

const devtypeSchema = new mongoose.Schema({
    dev_name: String,   //设备型号
    dev_vendor: String,   //设备厂商
    chip_type: String,   //芯片类型
    chip_vendor: String,   //芯片厂商
    comment: String,   //备注说明
    create_date:String, //创建时间
    sort_time:Number, //排序时间戳， string无法排序
    // create_date: { type: Date, default: Date.now },

});


const DevtypeTable = mongoose.model('DevtypeTable', devtypeSchema);
module.exports = DevtypeTable;