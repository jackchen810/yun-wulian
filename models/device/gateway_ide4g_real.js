'use strict';

const mongoose = require('mongoose');
//import cityData from '../../InitData/cities'
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
const gatewayDataSchema = new mongoose.Schema({
    device_name:String,
    device_local: {type: String, default: ''},    //设备位置
    device_type: String,   //设备型号
    device_link_status: String,   //设备链路状态
    device_run_status: String,   //设备运行状态

    update_time:String, //状态更新时间
    data: Mixed,   //数据
    logs: Array,   //一些上下线的日志信息，辅助定位问题，记录5条
    sort_time:Number, //排序时间戳，
});



const GatewayIDE4g_Real_Table = mongoose.model('GatewayIDE4g_Real_Table', gatewayDataSchema);


//导出模块
module.exports = GatewayIDE4g_Real_Table;