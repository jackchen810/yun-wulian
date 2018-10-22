'use strict';

const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
const deviceSchema = new mongoose.Schema({
    device_name: {type: String, default: ''},    //设备的中文名称，例如 津西1#高级氧化设备
    device_owner: {type: String, default: ''},   //设备的所属项目， 等同于[project.project_name] 可能多个设备对应同一项目

    device_image: {type: String, default: ''},    //设备图片

    comment: String,   //设备备注

    update_time:String, //状态更新时间
    sort_time:Number, //排序时间戳，
});



const DeviceTable = mongoose.model('DeviceTable', deviceSchema);
module.exports = DeviceTable;