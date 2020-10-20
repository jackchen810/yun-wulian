'use strict';

const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
const deviceUnitManageSchema = new mongoose.Schema({
    dev_cn_name: {type: String, default: ''},    //设备的名称，例如 津西1#高级氧化设备
    devunit_id: {type: String, default: ''},    //通道的数据库字段名称，例如 C1_D1, 爱德设备,  设备单元号, 暂时不用
                                                     //设备元的id，例如标识的plcid，  物通博联上报的devId
    devunit_name: {type: String, default: ''},    //设备的数据库字段，例如 jinxi_1

    project_name: {type: String, default: ''},   //设备的所属项目， 等同于[manage.project_name] 可能多个设备对应同一项目
    user_account: {type: String, default: ''},   //用户账号

    gateway_vendor: {type: String, default: ''},   //网关厂商
    gateway_sn: {type: String, default: ''},   //网关标识，可以是MAC地址，物通博联：网关序列号

    device_image: {type: String, default: ''},    //设备图片
    device_status: {type: String, default: 'normal'},    //设备状态， normal， hide
    device_ability: {type: String, default: ''},    //设备能力，例如 300kg O3/h
    device_power: {type: String, default: ''},    //设备功率，例如 800kw

    comment: String,   //设备备注

    update_time:String, //状态更新时间
    sort_time:Number, //排序时间戳，
});



const DevunitManageTable = mongoose.model('DevunitManageTable', deviceUnitManageSchema);
module.exports = DevunitManageTable;