'use strict';

const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


//设备建立全量的表，不同设备公用，如果没有的项 填写NA
const projectSchema = new mongoose.Schema({
    project_name:{type: String, default: ''},    //项目名称，建议字母编码
    //project_display_cn: {type: String, default: ''},    //项目的中文名称
    user_account: String,   //项目的管理员，等同于[account.user_account] 可能多个项目对应同一管理员

    project_local: {type: String, default: ''},    //项目的地址
    project_image: {type: String, default: ''},    //项目图片
    project_status: {type: String, default: 'normal'},    //项目状态， normal， hide

    comment: String,   //项目备注

    update_time:String, //状态更新时间
    sort_time:Number, //排序时间戳，
});



const ProjectTable = mongoose.model('ProjectTable', projectSchema);
module.exports = ProjectTable;