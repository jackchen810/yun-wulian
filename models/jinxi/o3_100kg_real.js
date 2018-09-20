'use strict';

const mongoose = require('mongoose');
//import cityData from '../../InitData/cities'
var ObjectId = mongoose.Schema.Types.ObjectId;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
const deviceSchema = new mongoose.Schema({
    device_name:String,
    device_local: {type: String, default: ''},    //设备位置
    device_type: String,   //设备型号


    O2_tempture: [{ value: String, fault: {type: Boolean, default: false}}], //氧气温度
    O2_flowrate: [{ value: String, fault: Boolean}], //氧气流量
    O2_pressure: [{ value: String, fault: Boolean}],  //氧气压力
    O2_dewpoint: [{ value: String, fault: Boolean}],  //氧气露点


    H2O_tempture_inner: [{ value: String, fault: Boolean}], //内水温度
    H2O_pressure_inner: [{ value: String, fault: Boolean}],  //内水压力


    O3_density: [{ value: String, fault: Boolean}],  //臭氧浓度
    CO_density: [{ value: String, fault: Boolean}],  //一氧化碳检测值



    POWER_status: [{ value: String, fault: Boolean}],  //电源状态，40组设备


    update_time:String, //状态更新时间
    logs: Array,   //一些上下线的日志信息，辅助定位问题，记录5条
    sort_time:Number, //排序时间戳，
});



const DeviceTable = mongoose.model('DeviceTable', deviceSchema);
module.exports = DeviceTable;