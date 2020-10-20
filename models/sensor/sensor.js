'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
   
    sensor_facility:String,//传感器归属设备
    sensor_name:String,   //传感器 名称
    sensor_type: String,//传感器 类型
    sensor_No: String,//传感器 id
    project_name: String,//传感器归属项目
    sensor_isweb: {type: Boolean, default: true},//传感器 是否联网
    sensor_is: {type: Boolean, default: true},//传感器 是否显示
    sensor_unit:String, //传感器 单位
    sensor_img:String, //传感器 图片
    sensor_time:String, //传感器 时间
  
});


const SensorTable = mongoose.model('SensorTable',accountSchema);
module.exports = SensorTable;
