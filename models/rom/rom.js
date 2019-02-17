'use strict';

const mongoose = require('mongoose');

const romSchema = new mongoose.Schema({
    file_name: String,    //文件名
    rom_version:{ type: String, default: null },  //rom 版本号
    dev_type: { type: String, default: null },   //设备类型
    ver_type: { type: String, default: null },   //版本类型
    md5_value: { type: String, default: null },  //md5串码
    comment: { type: String, default: null },   //备注说明
    rom_status: { type: String, default: 'revoke' }, //normal:rom上架,revoke:pkg 下架
    create_date: String,
    sort_time:Number, //排序时间戳， string无法排序
    //create_date: { type: Date, default: Date.now },

});




const RomTable = mongoose.model('RomTable', romSchema);
module.exports = RomTable;