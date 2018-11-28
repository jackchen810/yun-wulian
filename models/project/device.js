'use strict';

const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
const deviceManageSchema = new mongoose.Schema({
    device_name: {type: String, default: ''},    //设备的名称，例如 津西1#高级氧化设备

    devunit_no: {type: String, default: ''},    //通道的数据库字段名称，例如 C1_D1, 爱德设备,  设备单元号, 暂时不用
    devunit_name: {type: String, default: ''},    //设备的数据库字段，例如 jinxi_1

    project_name: {type: String, default: ''},   //设备的所属项目， 等同于[project.project_name] 可能多个设备对应同一项目
    user_account: {type: String, default: ''},   //用户账号

    gateway_vendor: {type: String, default: ''},   //网关厂商

    device_image: {type: String, default: ''},    //设备图片
    device_status: {type: String, default: 'normal'},    //设备状态， normal， hide
    device_ability: {type: Number, default: 0},    //设备能力，例如 300kg O3/h

    comment: String,   //设备备注

    update_time:String, //状态更新时间
    sort_time:Number, //排序时间戳，
});



const DeviceManageTable = mongoose.model('DeviceManageTable', deviceManageSchema);
module.exports = DeviceManageTable;