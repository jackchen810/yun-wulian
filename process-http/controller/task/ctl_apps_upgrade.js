'use strict';

const MqttPubHandle = require('../../../mqttclient/publish/mqtt_pub.js');
const DB = require( "../../../models/models.js");
const logger = require( '../../../logs/logs.js');
const fs = require("fs");
const path = require('path');

const schedule = require('node-schedule');
logger.info('enter here mangehndle');




class ManageHnd {
    constructor(){
    }
    async shell(req, res, next){
        logger.info('apps shell');
        try{
            var route_mac = req.body.route_mac;
            var admin_id = req.session.admin_id;
            var admin = await DB.AdminModel.findOne({user_id:admin_id});
            if(!admin){
                logger.info('该用户不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'USER_NOT_EXIST',
                    extra: '用户不存在'
                });
                return;
            }
            var user_name = admin.user_account;
            var cmd = req.body.cmd;
            logger.info('form body:',route_mac,user_name,cmd);
            var TaskTable = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
            await MqttPubHandle.CMD_EXE.shell(TaskTable,cmd);
            logger.info('shell成功');
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'shell ok'});
        }catch(err){
            logger.info('shell失败');
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
    async shell64(req, res, next){
        logger.info('apps shell64');
        try{
            var route_mac = req.body.route_mac;
            var admin_id = req.session.admin_id;
            var admin = await DB.AdminModel.findOne({user_id:admin_id});
            if(!admin){
                logger.info('该用户不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'USER_NOT_EXIST',
                    extra: '用户不存在'
                });
                return;
            }
            var user_name = admin.user_account;
            var cmd = req.body.cmd;
            logger.info('form body:',route_mac,user_name,cmd);
            var TaskTable = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
            await MqttPubHandle.CMD_EXE.shell64(TaskTable,cmd);
            logger.info('shell64成功');
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'shell64 ok'});
        }catch(err){
            logger.info('shell64失败');
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
    async script(req, res, next){
        logger.info('apps script');
        try{
            var route_mac = req.body.route_mac;
            var user_account = req.session.user_account;
            var operator = req.body.operator;
            var mode = req.body.script_mode;
            var expired_time = req.body.expired_time;
            var exec_time = req.body.exec_time;
            var admin = await DB.AdminModel.findOne({user_account:user_account});
            if(!admin){
                logger.info('该用户未登录');
                res.send({
                    ret_code: 1001,
                    ret_msg: 'ERROR_SESSION',
                    extra: '用户未登录'
                });
                return;
            }
            var script_name = req.body.script_name;
            var script = await DB.ScriptTable.findOne({script_name});
            if(!script) {
                logger.info('SCRIPT不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'SCRIPT_NOT_EXIST',
                    extra: 'SCRIPT不存在'
                });
                return;
            }
            var url_route = "scripts/" + script_name;
            var port = req.protocol ==='https' ? 443: 80;
            var md5 = script.script_md5 + " " +script_name;
            var additions = {'mode': mode, 'script_name': script_name};
            logger.info('form body:',route_mac,script_name);
            var TaskTable = MqttPubHandle.createTaskHandle(user_account, operator, route_mac);
            if(mode === '1'){
                exec_time = -1;
                MqttPubHandle.setTaskTime(TaskTable, expired_time, exec_time);
                MqttPubHandle.setTaskAdditions(TaskTable, additions);
                await MqttPubHandle.CMD_EXE.script(TaskTable, port, url_route, md5);
            }else if(mode === '2'){
                logger.info('script_install at mode 2');
                exec_time = -1;
                MqttPubHandle.setTaskTime(TaskTable, expired_time, exec_time);
                MqttPubHandle.setTaskAdditions(TaskTable, additions);
                await MqttPubHandle.CMD_EXE.script(TaskTable, port, url_route, md5);

                /*	var script_callback = async function(mac, jsonObj) {
                        logger.info("start run script_callback");
                        var task = await TaskTable.find({'cmd_item':'remote_cmd','mac':mac});
                        for(var i=0; i < task.length;i++){
                            if(task[i].additions.mode == 2 && task[i].pubsub_status == 'request'){
                                var stop_time = new Date(task[i].task_stop_at).getTime();
                                if(Date.now() < stop_time){
                                    mqttClient.publish(task[i].topic, task[i].request_msg);
                                }else{
                                    await TaskTable.findOneAndUpdate({uuid: task[i].uuid},{$set: {'pubsub_status':'response_fail'}});
                                }
                            }
                        }
                    };
                    var timeout_script = async function(TaskTable) {
                        logger.info('start run timeout_script');
                        logger.info('uuid='+TaskTable.uuid);
                        var task = await TaskTable.find({'uuid':TaskTable.uuid ,'cmd_item':'remote_cmd'});
                        for(var i=0;i < task.length;i++){
                            if(task[i].additions.mode == 2 && task[i].pubsub_status == 'request'){
                                await TaskTable.findOneAndUpdate({'uuid': task[i].uuid, 'mac':task[i].mac, 'pubsub_status':'request'},{$set: {'pubsub_status':'response_fail'}});
                            }
                        }
                    };
                    MqttSubHandle.addLoopListener('$SYS', script_callback);
                    setTimeout(timeout_script,expired_time*60*60*1000,TaskTable);*/
            }else if(mode === '3'){
                logger.info('script_install at mode 3');
                MqttPubHandle.setTaskTime(TaskTable, expired_time, exec_time);
                MqttPubHandle.setTaskAdditions(TaskTable, additions);
                TaskTable.only_create = true;
                await MqttPubHandle.CMD_EXE.script(TaskTable, port, url_route, md5);
                /*	var script_callback = async function(){
                        var stop_time = new Date(TaskTable.task_stop_at).getTime();
                        if(Date.now() < stop_time){
                            await TaskTable.createBatchPublish(TaskTable.uuid, exec_time);
                        }else {
                            schedule.cancelJob(script_id);
                        }
                    };
                    var timeout_script = async function(TaskTable){
                        logger.info('timeout_script run now');
                        var task = await TaskTable.find({'uuid':TaskTable.uuid ,'cmd_item':'remote_cmd'});
                        for(var i=0;i < task.length;i++){
                            if(task[i].additions.mode == 3 && task[i].pubsub_status == 'request'){
                                await TaskTable.findOneAndUpdate({'uuid': task[i].uuid, 'mac':task[i].mac, 'pubsub_status':'request'},{$set: {'pubsub_status':'response_fail'}});
                            }
                        }
                    };

                    var rule = new schedule.RecurrenceRule();
                    rule.hour = exec_time;
                    rule.minute = 0;
                    rule.second = 0;
                    var script_id = schedule.scheduleJob(rule, script_callback);
                    setTimeout(timeout_script,expired_time*60*60*1000,TaskTable);*/
            }
            logger.info('script成功');
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: '下发脚本成功'});
        }catch(err){
            logger.info('script失败');
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
    async script_result(req, res, next){
        logger.info('script_result');
        var page_size = req.body.page_size;
        var current_page = req.body.current_page;
        var user = req.session.user_account;
        var user_type = req.session.user_type;
        if(user_type === 0){
            var query = {'cmd_item':'remote_cmd'};
        }else{
            var query = {'cmd_item':'remote_cmd','user_name': user};
        }
        try{
            if(typeof(page_size) === 'undefined' && typeof(current_page) === 'undefined'){
                var count;
                await TaskTable.distinct('uuid',{'cmd_item':'remote_cmd'}).exec(function(err,sum){
                    count = sum.length;
                });
                var script_task = await TaskTable.aggregate(
                    {$match: query},
                    {$group:{_id:'$uuid',
                            expired_time:{'$first':'$expired_time'},
                            operator_name:{'$first':'$operator_name'},
                            request_timestamp:{'$first':'$request_timestamp'},
                            response_timestamp:{'$first':'$response_timestamp'},
                            upgrade_mode:{'$first':'$additions.mode'},
                            dest_version:{'$first':'$additions.dest_version'},
                            task_stop_at:{'$first':'$task_stop_at'},
                            doc_del_at:{'$first':'$doc_del_at'},
                            mac:{$push:'$mac'},
                            total:{$sum:1}}}).sort({"request_timestamp":-1}).limit(10);
                for(var i = 0; i < script_task.length; i++){
                    script_task[i]['fail_count'] = await TaskTable.find({"uuid":script_task[i]['_id'],"pubsub_status":"response_fail"}).count();
                    script_task[i]['success_count'] = await TaskTable.find({"uuid":script_task[i]['_id'],"pubsub_status":"response_ok"}).count();
                    script_task[i]['running_count'] = script_task[i]['total'] - script_task[i]['fail_count'] - script_task[i]['success_count'];
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: {script_task,count}});
            }else if(page_size > 0 && current_page > 0){
                var script_task = await TaskTable.aggregate(
                    {$match: query},
                    {$group:{_id:'$uuid',
                            expired_time:{'$first':'$expired_time'},
                            operator_name:{'$first':'$operator_name'},
                            request_timestamp:{'$first':'$request_timestamp'},
                            response_timestamp:{'$first':'$response_timestamp'},
                            upgrade_mode:{'$first':'$additions.mode'},
                            dest_version:{'$first':'$additions.dest_version'},
                            task_stop_at:{'$first':'$task_stop_at'},
                            doc_del_at:{'$first':'$doc_del_at'},
                            mac:{$push:'$mac'},
                            total:{$sum:1}}})
                    .sort({"request_timestamp":-1})
                    .skip(Number((current_page - 1)*page_size))
                    .limit(Number(page_size));
                for(var i = 0; i < script_task.length; i++){
                    script_task[i]['fail_count'] = await TaskTable.find({"uuid":script_task[i]['_id'],"pubsub_status":"response_fail"}).count();
                    script_task[i]['success_count'] = await TaskTable.find({"uuid":script_task[i]['_id'],"pubsub_status":"response_ok"}).count();
                    script_task[i]['running_count'] = script_task[i]['total'] - script_task[i]['fail_count'] - script_task[i]['success_count'];
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: {script_task}});
            }else{
                res.send({ret_code: -1, ret_msg: 'PARAM_ERROR', extra: '参数错误'});
            }
        }catch(err){
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
    async script_detail(req, res, next){
        var uuid = req.body.uuid;
        var page_size = req.body.page_size;
        var current_page = req.body.current_page;
        try{
            if(typeof(page_size) === 'undefined' && typeof(current_page) === 'undefined'){
                var count = await TaskTable.count({'cmd_item':'remote_cmd', 'uuid':uuid});
                var script_task = await TaskTable.find({'cmd_item':'remote_cmd', 'uuid':uuid},
                    {request_msg:0,response_msg:0,topic:0}).lean().sort({"request_timestamp":-1}).limit(10);
                for(var i=0; i < script_task.length; i++){
                    var device = await DB.DeviceManageTable.findOne({'mac': script_task[i].mac});
                    if(device){
                        script_task[i].device_status = device.status;
                    }
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: {script_task,count}});
            }else if(page_size > 0 && current_page > 0){
                var script_task = await TaskTable.find({'cmd_item':'remote_cmd', 'uuid':uuid},
                    {request_msg:0,response_msg:0,topic:0})
                    .lean()
                    .sort({"request_timestamp":-1})
                    .skip(Number((current_page - 1)*page_size)).limit(Number(page_size));
                for(var i=0; i < script_task.length; i++){
                    var device = await DB.DeviceManageTable.findOne({'mac': script_task[i].mac});
                    if(device){
                        script_task[i].device_status = device.status;
                    }
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: {script_task}});
            }else{
                res.send({ret_code: -1, ret_msg: 'PARAM_ERROR', extra: '参数错误'});
            }
        }catch(err){
            res.send({ret_code: -1, ret_msg: 'Failed', extra: err.message});
        }
    }
    async script_detail_detail(req, res, next){
        try{
            var uuid = req.body.uuid;
            var mac = req.body.mac;
            var script_task = await TaskTable.find({'cmd_item':'remote_cmd', 'uuid':uuid, 'mac': mac},
                {request_msg:1,response_msg:1});
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: script_task});
        }catch(err){
            res.send({ret_code: -1, ret_msg: 'Failed', extra: err.message});
        }
    }
    async script_query(req, res, next){
        logger.info('script_query');
        var query_mac = req.body.filter.mac;
        var page_size = req.body.page_size;
        var current_page = req.body.current_page;
        var user = req.session.user_account;
        var user_type = req.session.user_type;
        try{
            if(typeof(query_mac) === 'undefined'){
                res.send({ret_code: -1, ret_msg: 'PARAM_ERROR', extra: '请指定查询的mac'});
                return;
            }
            if(user_type === 1){
                var query = {'cmd_item':'remote_cmd','user_name': user,'mac':query_mac};
            }else{
                var query = {'cmd_item':'remote_cmd','mac':query_mac};
            }
            if(typeof(page_size) === 'undefined' && typeof(current_page) === 'undefined'){
                var script_task = [];
                var task_ids = await TaskTable.find(query,{'uuid': 1, '_id': 0});
                for(var i=0; i < task_ids.length; i++){
                    var task = await TaskTable.aggregate(
                        {$match:{'uuid': task_ids[i].uuid}},
                        {$group:{_id:'$uuid',
                                expired_time:{'$first':'$expired_time'},
                                operator_name:{'$first':'$operator_name'},
                                request_timestamp:{'$first':'$request_timestamp'},
                                response_timestamp:{'$first':'$response_timestamp'},
                                upgrade_mode:{'$first':'$additions.upgrade_mode'},
                                dest_version:{'$first':'$additions.dest_version'},
                                task_stop_at:{'$first':'$task_stop_at'},
                                doc_del_at:{'$first':'$doc_del_at'},
                                mac:{$push:'$mac'},
                                total:{$sum:1}}}).sort({"request_timestamp":-1});
                    script_task[i] = task[0];
                    script_task[i]['fail_count'] = await TaskTable.count({"uuid":task['_id'],"pubsub_status":"response_fail"});
                    script_task[i]['success_count'] = await TaskTable.count({"uuid":task['_id'],"pubsub_status":"response_ok"});
                    script_task[i]['running_count'] = script_task[i]['total'] - script_task[i]['fail_count'] - script_task[i]['success_count'];
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: script_task});
            }else if(page_size > 0 && current_page > 0){
                var script_task = [];
                var task_ids = await TaskTable.find(query,{'uuid': 1, '_id': 0}).sort({"request_timestamp":-1});
                for(var i=0,j=((current_page -1)* page_size); j < (current_page * page_size) && j < task_ids.length; i++,j++){
                    var task = await TaskTable.aggregate(
                        {$match:{'cmd_item':'remote_cmd', 'uuid': task_ids[i].uuid}},
                        {$group:{_id:'$uuid',
                                expired_time:{'$first':'$expired_time'},
                                operator_name:{'$first':'$operator_name'},
                                request_timestamp:{'$first':'$request_timestamp'},
                                response_timestamp:{'$first':'$response_timestamp'},
                                upgrade_mode:{'$first':'$additions.upgrade_mode'},
                                dest_version:{'$first':'$additions.dest_version'},
                                task_stop_at:{'$first':'$task_stop_at'},
                                doc_del_at:{'$first':'$doc_del_at'},
                                mac:{$push:'$mac'},
                                total:{$sum:1}}})
                        .sort({"request_timestamp":-1});
                    script_task[i] = task[0];
                    script_task[i]['fail_count'] = await TaskTable.count({"uuid":task['_id'],"pubsub_status":"response_fail"});
                    script_task[i]['success_count'] = await TaskTable.count({"uuid":task['_id'],"pubsub_status":"response_ok"});
                    script_task[i]['running_count'] = script_task[i]['total'] - script_task[i]['fail_count'] - script_task[i]['success_count'];
                }
                //	if(i >= ((current_page -1) * page_size) && i < (current_page * page_size))
                //		task.push(script_task);
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: script_task});
            }else{
                res.send({ret_code: -1, ret_msg: 'PARAM_ERROR', extra: '参数错误'});
            }
        }catch(err){
            res.send({ret_code: -1, ret_msg: 'Failed', extra: err.message});
        }
    }
    async apps(req, res, next){
        logger.info('task add apps sysupgrade');

    }

    async apps_result(req, res, next){
        logger.info('apps_result');
        var page_size = req.body.page_size;
        var current_page = req.body.current_page;
        var user = req.session.user_account;
        var user_type = req.session.user_type;
        if(user_type === 0){
            var query = {'cmd_item':'apps'};
        }else{
            var query = {'cmd_item':'apps','user_name': user};
        }
        try{
            if(typeof(page_size) === 'undefined' && typeof(current_page) === 'undefined'){
                var count
                await TaskTable.distinct('uuid',{'cmd_item':'apps'}).exec(function(err, sum){
                    count=sum.length;
                });
                var apps_task = await TaskTable.aggregate(
                    {$match:query},
                    {$group:{_id:'$uuid',
                            expired_time:{'$first':'$expired_time'},
                            operator_name:{'$first':'$operator_name'},
                            request_timestamp:{'$first':'$request_timestamp'},
                            response_timestamp:{'$first':'$response_timestamp'},
                            upgrade_mode:{'$first':'$additions.mode'},
                            dest_version:{'$first':'$additions.dest_version'},
                            task_stop_at:{'$first':'$task_stop_at'},
                            doc_del_at:{'$first':'$doc_del_at'},
                            mac:{$push:'$mac'},
                            total:{$sum:1}}}).sort({"request_timestamp":-1}).limit(10);
                for(var i = 0; i < apps_task.length; i++){
                    apps_task[i]['fail_count'] = await TaskTable.find({"uuid":apps_task[i]['_id'],"pubsub_status":"response_fail"}).count();
                    apps_task[i]['success_count'] = await TaskTable.find({"uuid":apps_task[i]['_id'],"pubsub_status":"response_ok"}).count();
                    apps_task[i]['running_count'] = apps_task[i]['total'] - apps_task[i]['fail_count'] - apps_task[i]['success_count'];
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: {apps_task,count}});
            }else if(page_size > 0 && current_page > 0){
                var apps_task = await TaskTable.aggregate(
                    {$match:query},
                    {$group:{_id:'$uuid',
                            expired_time:{'$first':'$expired_time'},
                            operator_name:{'$first':'$operator_name'},
                            request_timestamp:{'$first':'$request_timestamp'},
                            response_timestamp:{'$first':'$response_timestamp'},
                            upgrade_mode:{'$first':'$additions.mode'},
                            dest_version:{'$first':'$additions.dest_version'},
                            task_stop_at:{'$first':'$task_stop_at'},
                            doc_del_at:{'$first':'$doc_del_at'},
                            mac:{$push:'$mac'},
                            total:{$sum:1}}}).sort({"request_timestamp":-1})
                    .skip(Number((current_page - 1)*page_size))
                    .limit(Number(page_size));
                for(var i = 0; i < apps_task.length; i++){
                    apps_task[i]['fail_count'] = await TaskTable.find({"uuid":apps_task[i]['_id'],"pubsub_status":"response_fail"}).count();
                    apps_task[i]['success_count'] = await TaskTable.find({"uuid":apps_task[i]['_id'],"pubsub_status":"response_ok"}).count();
                    apps_task[i]['running_count'] = apps_task[i]['total'] - apps_task[i]['fail_count'] - apps_task[i]['success_count'];
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: {apps_task}});
            }else{
                res.send({ret_code: -1, ret_msg: 'PARAM_ERROR', extra: '参数错误'});
            }
        }catch(err){
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
    async apps_detail(req, res, next){
        var uuid = req.body.uuid;
        var page_size = req.body.page_size;
        var current_page = req.body.current_page;
        try{
            if(typeof(page_size) === 'undefined' && typeof(current_page) === 'undefined'){
                var count = await TaskTable.count({'cmd_item':'apps', 'uuid':uuid});
                var apps_task = await TaskTable.find({'cmd_item':'apps', 'uuid':uuid},{request_msg:0,response_msg:0,topic:0}).lean()
                    .sort({"request_timestamp":-1}).limit(10);
                for(var i=0; i < apps_task.length; i++){
                    var device = await DB.DeviceManageTable.findOne({'mac': apps_task[i].mac});
                    if(device){
                        apps_task[i].device_status = device.status;
                    }
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: {apps_task,count}});
            }else if(page_size > 0 && current_page >0 ){
                var apps_task = await TaskTable.find({'cmd_item':'apps', 'uuid':uuid},{request_msg:0,response_msg:0,topic:0})
                    .lean()
                    .sort({"request_timestamp":-1})
                    .skip(Number((current_page - 1)*page_size)).limit(Number(page_size));
                for(var i=0; i < apps_task.length; i++){
                    var device = await DB.DeviceManageTable.findOne({'mac': apps_task[i].mac});
                    if(device){
                        apps_task[i].device_status = device.status;
                    }
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: {apps_task}});
            }else {
                res.send({ret_code: -1, ret_msg: 'PARAM_ERROR', extra: '参数错误'});
            }
        }catch(err){
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
    async apps_detail_detail(req, res, next){
        try{
            var uuid = req.body.uuid;
            var mac = req.body.mac;
            var apps_task = await TaskTable.findOne({'cmd_item':'apps', 'uuid':uuid, 'mac': mac},
                {request_msg:1,response_msg:1, mac:1});
            var content = JSON.parse(apps_task.request_msg)
            var script = new Buffer(content.content,"base64").toString();
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: {apps_task,script}});
        }catch(err){
            res.send({ret_code: -1, ret_msg: 'Failed', extra: err.message});
        }
    }
    async apps_query(req, res, next){
        logger.info('apps_query');
        var query_mac = req.body.filter.mac;
        var page_size = req.body.page_size;
        var current_page = req.body.current_page;
        var user = req.session.user_account;
        var user_type = req.session.user_type;
        try{
            if(typeof(query_mac) === 'undefined'){
                res.send({ret_code: -1, ret_msg: 'PARAM_ERROR', extra: '请指定查询的mac'});
                return;
            }
            if(user_type === 1){
                var query = {'cmd_item':'apps','user_name': user,'mac':query_mac};
            }else{
                var query = {'cmd_item':'apps','mac':query_mac};
            }
            if(typeof(page_size) === 'undefined' && typeof(current_page) === 'undefined'){
                var apps_task = [];
                var task_ids = await TaskTable.find(query,{'uuid': 1, '_id': 0});
                for(var i=0; i < task_ids.length; i++){
                    var task = await TaskTable.aggregate(
                        {$match:{'cmd_item':'apps','uuid': task_ids[i].uuid}},
                        {$group:{_id:'$uuid',
                                expired_time:{'$first':'$expired_time'},
                                operator_name:{'$first':'$operator_name'},
                                request_timestamp:{'$first':'$request_timestamp'},
                                response_timestamp:{'$first':'$response_timestamp'},
                                upgrade_mode:{'$first':'$additions.upgrade_mode'},
                                dest_version:{'$first':'$additions.dest_version'},
                                task_stop_at:{'$first':'$task_stop_at'},
                                doc_del_at:{'$first':'$doc_del_at'},
                                mac:{$push:'$mac'},
                                total:{$sum:1}}}).sort({"request_timestamp":-1});
                    apps_task[i] = task[0];
                    apps_task[i]['fail_count'] = await TaskTable.count({"uuid":task['_id'],"pubsub_status":"respone_fail"});
                    apps_task[i]['success_count'] = await TaskTable.count({"uuid":task['_id'],"pubsub_status":"respone_ok"});
                    apps_task[i]['running_count'] = apps_task[i]['total'] - apps_task[i]['fail_count'] - apps_task[i]['success_count'];
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: apps_task});
            }else if(page_size > 0 && current_page > 0){
                var apps_task = [];
                var task_ids = await TaskTable.find(query,{'uuid': 1, '_id': 0}).sort({"request_timestamp":-1});
                for(var i=0,j=((current_page -1)* page_size); j < (current_page * page_size) && j < task_ids.length; i++,j++){
                    var task = await TaskTable.aggregate(
                        {$match:{'cmd_item':'apps','uuid': task_ids[j].uuid}},
                        {$group:{_id:'$uuid',
                                expired_time:{'$first':'$expired_time'},
                                operator_name:{'$first':'$operator_name'},
                                request_timestamp:{'$first':'$request_timestamp'},
                                response_timestamp:{'$first':'$response_timestamp'},
                                upgrade_mode:{'$first':'$additions.upgrade_mode'},
                                dest_version:{'$first':'$additions.dest_version'},
                                task_stop_at:{'$first':'$task_stop_at'},
                                doc_del_at:{'$first':'$doc_del_at'},
                                mac:{$push:'$mac'},
                                total:{$sum:1}}})
                        .sort({"request_timestamp":-1});
                    apps_task[i] = task[0];
                    apps_task[i]['fail_count'] = await TaskTable.count({"uuid":task['_id'],"pubsub_status":"respone_fail"});
                    apps_task[i]['success_count'] = await TaskTable.count({"uuid":task['_id'],"pubsub_status":"respone_ok"});
                    apps_task[i]['running_count'] = apps_task[i]['total'] - apps_task[i]['fail_count'] - apps_task[i]['success_count'];
                    //		if(i >= (current_page -1)* page_size && i < (current_page * page_size))
                    //			task.push(apps_task);
                }
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: apps_task});
            }else{
                res.send({ret_code: -1, ret_msg: 'PARAM_ERROR', extra: '参数错误'});
            }
        }catch(err){
            res.send({ret_code: -1, ret_msg: 'Failed', extra: err.message});
        }
    }
    async firmware(req, res, next){
        logger.info('apps firmware');
        try{
            var route_mac = req.body.route_mac;
            var admin_id = req.session.admin_id;
            var admin = await DB.AdminModel.findOne({user_id:admin_id});
            if(!admin){
                logger.info('该用户不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'USER_NOT_EXIST',
                    extra: '用户不存在'
                });
                return;
            }
            var user_name = admin.user_account;
            var firmware_url = req.body.firmware_url;
            var firmware_md5 = req.body.firmware_md5;
            var dest_version = req.body.dest_version;
            logger.info('form body:',route_mac,user_name,firmware_url,firmware_md5,dest_version);
            var TaskTable = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
            await MqttPubHandle.CMD_EXE.firmware(TaskTable,firmware_url,firmware_md5,dest_version);
            logger.info('firmware成功');
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'firmware ok'});
        }catch(err){
            logger.info('firmware失败');
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
    async network(req, res, next){
        logger.info('apps network');
        try{
            var route_mac = req.body.route_mac;
            var admin_id = req.session.admin_id;
            var admin = await DB.AdminModel.findOne({user_id:admin_id});
            if(!admin){
                logger.info('该用户不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'USER_NOT_EXIST',
                    extra: '用户不存在'
                });
                return;
            }
            var user_name = admin.user_account;
            var type = req.body.type;
            logger.info('form body:',route_mac,user_name,type);
            var TaskTable = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
            await MqttPubHandle.CMD_EXE.network(TaskTable,type);
            logger.info('network成功');
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'network ok'});
        }catch(err){
            logger.info('network失败');
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
    async passwd(req, res, next){
        logger.info('apps passwd');
        try{
            var route_mac = req.body.route_mac;
            var admin_id = req.session.admin_id;
            var admin = await DB.AdminModel.findOne({user_id:admin_id});
            if(!admin){
                logger.info('该用户不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'USER_NOT_EXIST',
                    extra: '用户不存在'
                });
                return;
            }
            var user_name = admin.user_account;
            var oldpasswd = req.body.oldpasswd;
            var newpasswd = req.body.newpasswd;
            logger.info('form body:',route_mac,user_name,oldpasswd,newpasswd);
            var TaskTable = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
            await MqttPubHandle.CMD_EXE.passwd(TaskTable,oldpasswd,newpasswd);
            logger.info('passwd成功');
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'passwd ok'});
        }catch(err){
            logger.info('passwd失败');
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
    async superpasswd(req, res, next){
        logger.info('apps superpasswd');
        try{
            var route_mac = req.body.route_mac;
            var admin_id = req.session.admin_id;
            var admin = await DB.AdminModel.findOne({user_id:admin_id});
            if(!admin){
                logger.info('该用户不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'USER_NOT_EXIST',
                    extra: '用户不存在'
                });
                return;
            }
            var user_name = admin.user_account;
            var newpasswd = req.body.newpasswd;
            logger.info('form body:',route_mac,user_name,newpasswd);
            var TaskTable = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
            await MqttPubHandle.CMD_EXE.superpasswd(TaskTable,newpasswd);
            logger.info('superpasswd成功');
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'superpasswd ok'});
        }catch(err){
            logger.info('passwd失败');
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
    async reboot(req, res, next){
        logger.info('manage reboot');
        try{
            var route_mac = req.body.route_mac;
            var user_account = req.session.user_account;
            var admin = await DB.AdminModel.findOne({user_account:user_account});
            if(!admin){
                logger.info('该用户未登录');
                res.send({
                    ret_code: 1001,
                    ret_msg: 'ERROR_SESSION',
                    extra: '用户未登录'
                });
                return;
            }
            logger.info('form body:',route_mac,user_account);
            var taskHandle = MqttPubHandle.createTaskHandle(user_account, user_account, route_mac);
            await MqttPubHandle.CMD_EXE.reboot(taskHandle);
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'reboot device ok'});
        }catch(err){
            logger.info('设备重启失败');
            res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
        }
    }
}
const ManageHandle = new ManageHnd();
module.exports = ManageHandle;
