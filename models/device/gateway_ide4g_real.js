'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
// 此表定义为设备元，表示PLC，只能仪表，只能模块等设备的书架
// 设备的一些实时书架，设备的标识
const gatewayDataSchema = new mongoose.Schema({
    devunit_name:String,  //key, 设备元的名称
    devunit_id:String,   //设备元的id，例如标识的plcid，  物通博联上报的devId
    gateway_sn: {type: String, default: ''},    //网关的sn， 设备书架的通道， 金大万翔使用mac地址（大写），物通博联使用sn标识
    devunit_local: {type: String, default: ''},    //设备位置
    devunit_type: String,   //设备型号
    devunit_link_status: String,   //设备链路状态
    devunit_run_status: String,   //设备运行状态
    devunit_enable_write: Number,   //0, disable   1, enable

    update_time:String, //状态更新时间
    data: Mixed,   //数据
    logs: Array,   //一些上下线的日志信息，辅助定位问题，记录5条
    sort_time:Number, //排序时间戳，
});



const Gateway_Real_Table = mongoose.model('Gateway_Real_Table', gatewayDataSchema);


//导出模块
module.exports = Gateway_Real_Table;