'use strict';

const mongoose = require('mongoose');
const DB = require('../models');


const romUpgradeSchema = new mongoose.Schema({
    uuid: String,
    macs:Array,      //mac 地址列表
    total: String,

    user_name: {type: String, default: null},    //用户就是渠道，一个mac唯一归属于一个用户
    operator_name: String,

    expired_time:Number,  //超时时间，单位：小时， 超时时间后，任务不再执行， 记录不删除可查询， 0表示立即执行任务
    upgrade_time: Number,   //任务执行时刻，采用24小时制， 【0-24】, -1表示该字段不使用


    task_status: String,   //revoked:任务已冻结，normal：任务正常运行， stop: 超时后任务设置停止
    task_create_at:{type: String, default: null},   //任务创建日期，方便查询
    task_stop_at:{type: String, default: null},   //任务停止日期，方便查询，通过expired_time计算出来
    doc_del_at:{type: String, default: null},   //记录删除日期，使用mongodb的TTl机制, 这个日期到达后会删除文档记录
    sort_time:Number, //排序时间戳， string无法排序


    upgrade_mode: String,
    dev_type: String,
    dest_version: String,

    fail_count: String,
    success_count: String,
    running_count: String,
});




const RomUpgradeTable = mongoose.model('RomUpgradeTable', romUpgradeSchema);
module.exports = RomUpgradeTable;