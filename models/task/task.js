'use strict';

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    uuid: String,
    mac:String,
    user_name: {type: String, default: null},    //用户就是渠道，一个mac唯一归属于一个用户
    operator_name: String,
    pubsub_status: String,   //request:已发送状态，response_ok：收到路由器回应state=0 状态，response_fail：收到路由器回应state=-1 状态
    topic: String,
    request_msg: String,
    response_msg: String,
    request_timestamp:{type: String, default: null},
    response_timestamp:{type: String, default: null},
    expired_time:Number,  //超时时间，单位：小时， 超时时间后，任务不再执行， 记录不删除可查询， 0表示立即执行任务
    task_stop_at:{type: String, default: null},   //任务停止日期，方便查询，通过expired_time计算出来
    task_finish_at:{type: String, default: null},   //任务完成时间
    doc_del_at:{type: String, default: null},   //记录删除日期，使用mongodb的TTl机制, 这个日期到达后会删除文档记录
    task_status: String,   //revoked:任务已冻结，normal：任务正常运行， stop: 超时后任务设置停止
    task_result: String,   //running:正在运行，success：成功完成，fail：失败， fail:username not match：mac地址无效，不属于该渠道, 由任务拥有者进行更新
    task_result_info: String,   //任务结果信息, 任务失败后，填写详细原因
    task_exec_time: Number,   //任务执行时刻，采用24小时制， 【0-24】, -1表示该字段不使用
    task_exec_count: Number,   //任务执行计数
    cmd_item: String,   //下发命令的item
    sort_time:Number, //排序时间戳， string无法排序
    additions: mongoose.Schema.Types.Mixed,   //附加信息，用户使用
});

//根据超时时间计算超时日期，使用TTL机制
//taskSchema.index({doc_del_at: 1}, { expireAfterSeconds:0 } );



const TaskTable = mongoose.model('TaskTable', taskSchema);
module.exports = TaskTable;