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


    run_unit_count: {type: String, default: '0'},    //运行模块数量
    stop_unit_count: {type: String, default: '0'},    //停止模块数量
    fault_unit_count: {type: String, default: '0'},    //故障模块数量


    installed_capacity: {type: String, default: '0'},    //装机容量
    ozone_capacity: {type: String, default: '0'},    //臭氧产量

    comment: String,   //项目备注

    update_time:String, //状态更新时间
    sort_time:Number, //排序时间戳，
});



const ProjectManageTable = mongoose.model('ProjectManageTable', projectSchema);
module.exports = ProjectManageTable;