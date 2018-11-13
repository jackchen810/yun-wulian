'use strict';
const config = require('config-lite');
const dtime = require( 'time-formater');
const mqttClient = require('../mqttclient.js');
const DB = require( "../../models/models.js");
const logger = require( '../../logs/logs.js');
const fs = require("fs");
const path = require('path');


class TaskPublishHandle {
    constructor(){
        this.createTaskAndPublish = this.createTaskAndPublish.bind(this);
        this.createBatchTask = this.createBatchTask.bind(this);
        this.taskCheckUser = this.taskCheckUser.bind(this);
        this.createBatchPublish = this.createBatchPublish.bind(this);
        this.createBatchPublish_slice = this.createBatchPublish_slice.bind(this);
    }

    //创建批量任务，以mac数组方式下发
    async createTaskAndPublish(taskHandle, pubJsonObj, opts, callback){

        logger.info('createTaskAndPublish begin, uuid:', taskHandle['uuid']);

        //参数有效性检查，如果，不是数组，返回错误
        if (!(Array.isArray(taskHandle.dest_macs))) {
            throw "dest_macs field is not array";
            return;
        }

        //支持不创建任务， 只推送命令
        if ("only_publish" in taskHandle) {
            //支持批量任务下发
            var message = JSON.stringify(pubJsonObj);
            for (var i = 0; i < taskHandle.dest_macs.length; i++) {
                var topic = taskHandle.dest_macs[i] + taskHandle.topic_cmd;
                mqttClient.publish(topic, message, opts, callback);
                logger.info('[only] mqtt publish:', topic, message);
            }
            return;
        }

        //判断是否大于每个任务允许的数量, 如果大于分解后下发，不大于就直接下发
        await this.createBatchTask(taskHandle, pubJsonObj);

        //任务检查，如果对应的mac地址不属于该渠道，直接设置结果为失败
        //await this.taskCheckUser(taskHandle['uuid'], taskHandle['user_name']);

        //如果需要发布，仅仅需要创建任务，例如检查到不在线不需要发布
        if ("only_create" in taskHandle) {
            return;
        }

        //判断是否大于每个任务允许的数量, 如果大于分解后下发，不大于就直接下发
        if (taskHandle.dest_macs.length <= config.amount_every_task) {
            await this.createBatchPublish(taskHandle['uuid'], -1);
        }
        else{
            await this.createBatchPublish_slice(taskHandle['uuid']);
        }

        logger.info('createTaskAndPublish end');
    };



    //taskHandle.dest_macs 是数组
    async createSectionTask(taskHandle, pubJsonObj){
        logger.info('1.createSectionTask:');
        var message = JSON.stringify(pubJsonObj);

        //logger.info(' mytime:', mytime.toGMTString(), taskHandle.expired_time);
        //logger.info('createBatchTask:', taskHandle.dest_macs);

        //支持批量任务下发
        for (var i = 0; i < taskHandle.dest_macs.length; i++) {
            var topic = taskHandle.dest_macs[i] + taskHandle.topic_cmd;

            // add task to db
            var wherestr = {'uuid': taskHandle.uuid, 'mac': taskHandle.dest_macs[i]};
            var taskDocObj = {
                "uuid": taskHandle.uuid,
                "mac": taskHandle.dest_macs[i],
                "user_name": taskHandle.user_name,
                "operator_name": taskHandle.operator_name,
                "pubsub_status": 'request',
                "topic": topic,
                "request_msg": message,
                "response_msg": null,
                "request_timestamp": taskHandle.task_create_at,
                "response_timestamp": null,
                "doc_del_at": taskHandle.doc_del_at,
                "expired_time": taskHandle.expired_time,
                "task_stop_at": taskHandle.task_stop_at,
                "task_exec_time": taskHandle.task_exec_time,
                "task_exec_count":0, //任务执行计数
                "task_status": 'normal',    //revoked:任务已冻结，normal：任务正常运行
                "task_result": (taskHandle.task_result == null) ? 'running' : taskHandle.task_result,    //running:正在运行，success：成功完成，fail：失败
                "task_result_info": (taskHandle.task_result == null) ? null : taskHandle.task_result_info,    //任务结果信息
                "task_finish_at": (taskHandle.task_result == null) ? null : taskHandle.task_create_at,  //如果有了任务结果就设置完成时间
                "cmd_item": pubJsonObj['item'],    //命令item
                "additions": taskHandle.additions,   //记录一些附加信息，固件升级时，记录升级的目的版本号
                "sort_time": new Date(taskHandle.task_create_at).getTime(),   //排序时间戳，等于request_timestamp
            };

            //不采用更新机制，升级时下发升级命令后会继续下发查询，更新的话会覆盖掉升级命令记录
            //firmare 命令
            //sysinfo 命令
            //await DB.TaskTable.findOneAndUpdate(wherestr, taskDocObj).exec(function (err, doc)
            var query = await DB.TaskTable.findOne(wherestr).exec();
            if (query != null) {
                return;
            }
            await DB.TaskTable.create(taskDocObj);
            //var query = await DB.TaskTable.find({'uuid': taskHandle.uuid, 'task_result': 'running'}).exec();
            //logger.info('query TaskTable:', query);
        }

        //保证添加完成后返回
        logger.info('1.createSectionTask, end');
        return;
    }


    //taskHandle.createBatchTask 是数组
    async createBatchTask(taskHandle, pubJsonObj){

        //判断是否大于每个任务允许的数量, 如果大于分解后下发，不大于就直接下发
        if (taskHandle.dest_macs.length <= config.amount_every_task) {

            await this.createSectionTask(taskHandle, pubJsonObj);
            return;
        }
        else {

            //复制一个数值处理，必须复制, 进行分任务下发
            var dmacs = taskHandle.dest_macs.slice(0);
            var exec_time = -1;

            //1.0支持批量任务下发, 创建批量任务
            for (var i = 0; i < dmacs.length; i = i + config.amount_every_task) {
                //数据中切片数据，生成新的数组
                taskHandle.dest_macs = dmacs.slice(i, i + config.amount_every_task);
                taskHandle.task_exec_time = exec_time;
                //logger.info('taskHnd:', taskHnd, dmacs, current);

                await this.createSectionTask(taskHandle, pubJsonObj);
                exec_time--;    ///这个方便定时器，定时分批次处理任务
            }
        }
    }


    //taskHandle.dest_macs 是数组
    //任务可以设置失败，如果设置task_result fail，将不再发布
    async taskCheckUser(uuid, user_name) {
        logger.info('2.taskCheckUser:');

        //需要定时升级的, 正在运行的
        var wherestr = {'uuid': uuid, 'task_result': 'running'};
        var queryList = await DB.TaskTable.find(wherestr).exec();
        if (queryList.length == 0) {
            logger.info('taskCheckUser query task db is null');
            return;
        }

        //logger.info('taskCheckUser, length:', queryList.length);

        //遍历所有的定时任务的mac对象， 执行publish
        for (var i = 0; i < queryList.length; i++) {

            //1.普通管理员用户名和渠道不匹配，失败
            //超级管理员则可以下发
            var admin = await DB.AdminModel.findOne({'user_account': user_name});
            if (admin == null) {
                logger.info('taskCheckUser, query null');
                continue;
            }

            //logger.info('taskCheckUser:admin', admin);
            if (admin.user_type == 0) { //超级管理员则可以下发
                continue;
            }

            //logger.info('taskCheckUser:user_name', user_name);
            //2.查找渠道和任务的用户名是否匹配，如果不匹配，设置失败
            var device = await DB.DeviceTable.findOne({'mac': queryList[i]['mac']}).exec();
            if (device == null) {
                var updatestr = {
                    "task_result": "fail",   //success;   fail;
                    "task_result_info": "设备是未知设备",   //结果信息
                    "task_finish_at": dtime().format('YYYY-MM-DD HH:mm:ss'),
                };

                await DB.TaskTable.findByIdAndUpdate(queryList[i]['_id'], updatestr).exec();
                logger.info('device unknown:', user_name);
                continue;
            }

            //用户名不匹配
            if (device['user_name'] != user_name) {
                var updatestr = {
                    "task_result": "fail",   //success;   fail;
                    "task_result_info": "用户名和设备渠道不匹配",   //结果信息
                    "task_finish_at": dtime().format('YYYY-MM-DD HH:mm:ss'),
                };

                await DB.TaskTable.findByIdAndUpdate(queryList[i]['_id'], updatestr).exec();
                logger.info('user_name not match, name1:', device['user_name'], 'name2', user_name);
            }
        }

        //保证添加完成后返回
        logger.info('2.taskCheckUser, end');
        return;
    }



    //taskHandle.dest_macs 是数组
    async createBatchPublish(uuid, exec_time, mac){
        logger.info('3.createBatchPublish:');

        if (typeof(mac)=="undefined") {
            var wherestr = {'uuid': uuid, 'task_exec_time': exec_time, 'task_result': 'running'};
            logger.info('publish by uuid', uuid);
        }
        else{
            //支持指定mac 方式推送任务
            var wherestr = {'uuid': uuid, 'mac': mac, 'task_exec_time': exec_time, 'task_result': 'running'};
            logger.info('publish by uuid', uuid,  'mac:', mac);
        }

        //需要定时升级的, 正在运行的, 如果taskCheckUser 检查失败就不发送命令
        var queryList = await DB.TaskTable.find(wherestr).exec();
        if (queryList.length == 0) {
            logger.info('createBatchPublish query db is null');
            return 1;
        }

        //logger.info('createBatchPublish, length:', queryList.length);

        //遍历所有的定时任务的mac对象， 执行publish
        for (var i = 0; i < queryList.length; i++) {
            var topic = queryList[i]['topic'];
            var request_msg = queryList[i]['request_msg'];

            //执行升级
            //下发命令
            logger.info('mqtt publish:', topic, request_msg);
            //logger.info('mqtt publish:', topic, request_msg);
            mqttClient.publish(topic, request_msg);

            //更新命令请求时间
            var create_time = new Date();
            var updatestr = {
                "task_exec_count": queryList[i]['task_exec_count']+1,
                "request_timestamp": dtime(create_time).format('YYYY-MM-DD HH:mm:ss'),
                "sort_time": create_time.getTime(),   //排序时间戳，等于request_timestamp
            };

            await DB.TaskTable.findByIdAndUpdate(queryList[i]['_id'], updatestr).exec();
        }

        //保证添加完成后返回
        logger.info('3.createBatchPublish, end');
        return 0;
    };


    //taskHandle.dest_macs 是数组
    async createBatchPublish_slice(uuid){
        //3.0 任务发布 publish
        // 监听器, 间隔interval_every_task 时间，发送amount_every_task 数量的任务
        var listener = async function (current) {
            logger.info('Hello timer process publish, current=', current);

            var ret = await this.createBatchPublish(uuid, current);

            //任务还没有完成，继续起定时器
            //2.启动定时器，执行剩余任务，时间根据配置文件
            if (ret == 0) {
                current--;
                logger.info('start timer, current=', current);
                setTimeout(listener, config.interval_every_task, current);
                return;
            }
            else {
                logger.info('stop task publish timer');
                return;
            }
        }

        //3.0.先执行一次定时任务， 从exec_time=-1的doc开始执行
        listener(-1);
        return;
    }

}

module.exports = new TaskPublishHandle();


