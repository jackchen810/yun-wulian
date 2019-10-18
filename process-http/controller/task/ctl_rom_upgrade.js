'use strict';

const DB = require( "../../../models/models.js");
const dtime = require( 'time-formater');
const config = require( "config-lite");
const logger = require( '../../../logs/logs.js');
const MqttPubHandle = require('../../../mqttclient/publish/mqtt_pub.js');
const MqttSubHandle = require("../../../mqttclient/subscribe/mqtt_sub.js");

//const schedule = require('node-schedule');


class RomUpgradeHandle {
	constructor(){

        console.log('RomUpgradeHandle constructor...');

        this.sysupgrade_update_status = this.sysupgrade_update_status.bind(this);
        this.sysupgrade_before_process = this.sysupgrade_before_process.bind(this);
        this.sysupgrade_before_cover_old_task = this.sysupgrade_before_cover_old_task.bind(this);
        this.list_sysupgrade_filter_mac = this.list_sysupgrade_filter_mac.bind(this);
        this.list_sysupgrade = this.list_sysupgrade.bind(this);
        this.add_sysupgrade = this.add_sysupgrade.bind(this);
        /*
        this.romSysupgradeMode2Process = this.romSysupgradeMode2Process.bind(this);
        this.romSysupgradeMode2Sysinfo = this.romSysupgradeMode2Sysinfo.bind(this);
        this.romSysupgradeMode2DevOnling = this.romSysupgradeMode2DevOnling.bind(this);
        */
        this.recv_sysinfo = false;
	}


    async sysupgrade_update_status(req, res, next){
        logger.info('task sysupgrade_update_status');

        //更新一下失败状态，放在回应之后是为了用户体验
        var wherestr = { 'cmd_item':'firmware', 'task_result':'running'};
        var queryList = await DB.TaskTable.find(wherestr).exec();

        //logger.info(doc);
        var t1 = Date.now()
        for (var i = 0; i < queryList.length; i++) {
            var t2 = new Date(queryList[i]['task_stop_at']).getTime();

            if (t1 > t2){
                var updatestr = {
                    "task_result": "fail",
                    "task_result_info": "任务超时失败",   //结果信息
                    "task_finish_at":dtime().format('YYYY-MM-DD HH:mm:ss'),
                };
                await DB.TaskTable.findByIdAndUpdate(queryList[i]['_id'], updatestr).exec();
            }
        }

        next();
    }


    async list_sysupgrade_filter_mac(req, res, next){
        logger.info('task list_sysupgrade_filter_mac');
        //logger.info(req.body);

        //获取表单数据，josn
        var page_size = req.body['page_size'];
        var current_page = req.body['current_page'];
        var sort = req.body['sort'];
        var mac = req.body['filter']['mac'];


        // 如果没有定义排序规则，添加默认排序
        if(typeof(sort)==="undefined"){
            logger.info('sort undefined');
            sort = {"sort_time":-1};
        }

        var upgradeList = await DB.RomUpgradeTable.find().sort(sort);
        //logger.info('task sysupgrade list length', upgradeList.length);

        //查询计数, 计算运行计数，失败计数，成功计数
        var resultList = [];
        for (var i = 0; i < upgradeList.length; i++) {

            // 没有找到, 不包含数组元素
            if (upgradeList[i]['macs'].includes(mac) == false){
                continue;
            }

            // 找到后， 添加到数组中去
            var total = upgradeList[i]['macs'].length;
            var fail_count = await DB.TaskTable.count({"uuid": upgradeList[i]['uuid'], "task_result":"fail"});
            var success_count = await DB.TaskTable.count({"uuid": upgradeList[i]['uuid'], "task_result":"success"});
            var running_count = total - success_count - fail_count;

            var updatestr = {
                "total" : total,
                "fail_count" : fail_count,
                "success_count" : success_count,
                "running_count" : running_count,
            };

            await DB.RomUpgradeTable.findByIdAndUpdate(upgradeList[i]['_id'], updatestr);

            // 特别注意: 增加3个字段，与前端一致，字段按照前端修改
            var item = {
                "_id" : upgradeList[i]['uuid'],
                "user_name" : upgradeList[i]['user_name'],
                "operator_name" : upgradeList[i]['operator_name'],
                "mac" : upgradeList[i]['macs'],
                "request_timestamp" : upgradeList[i]['task_create_at'],
                "upgrade_mode" : upgradeList[i]['upgrade_mode'],
                "total" : total,
                "fail_count" : fail_count,
                "success_count" : success_count,
                "running_count" : running_count,
            };

            resultList.push(item);
        }

        //logger.info('page_size', page_size, 'current_page', current_page);

        //参数有效性检查
        if(typeof(page_size)==="undefined" || typeof(current_page)==="undefined"){
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:resultList});
        }
        else if (page_size > 0 && current_page > 0) {
            var skipnum = (current_page - 1) * page_size;   //跳过数
            var newList = resultList.slice(skipnum, skipnum + page_size);
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:newList});
        }
        else{
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:resultList});
        }

        logger.info('task sysupgrade list end');
    }


    async list_sysupgrade(req, res, next){
        logger.info('task sysupgrade list');
        //logger.info(req.body);

        //获取表单数据，josn
        var page_size = req.body['page_size'];
        var current_page = req.body['current_page'];
        var sort = req.body['sort'];
        var filter = req.body['filter'];


        // 如果没有定义排序规则，添加默认排序
        if(typeof(sort)==="undefined"){
            logger.info('sort undefined');
            sort = {"sort_time":-1};
        }

        // 如果没有定义排序规则，添加默认排序
        if(typeof(filter)==="undefined"){
            logger.info('sort undefined');
            filter = {};
        }
        else if ('mac' in filter){
            this.list_sysupgrade_filter_mac(req, res, next);
            return;
        }


        //参数有效性检查
        if(typeof(page_size)==="undefined" && typeof(current_page)==="undefined"){
	    var count = await DB.RomUpgradeTable.count(filter)
            var upgradeList = await DB.RomUpgradeTable.find(filter).sort(sort).limit(10);
        }
        else if (page_size > 0 && current_page > 0) {
            var skipnum = (current_page - 1) * page_size;   //跳过数
            var upgradeList = await DB.RomUpgradeTable.find(filter).sort(sort).skip(skipnum).limit(page_size);
        }
        else{
            var upgradeList = await DB.RomUpgradeTable.find(filter).sort(sort).limit(10);
        }
	
        //查询计数, 计算运行计数，失败计数，成功计数
        var resultList = [];
        for (var i = 0; i < upgradeList.length; i++) {
            var total = upgradeList[i]['macs'].length;
            var fail_count = await DB.TaskTable.count({"uuid": upgradeList[i]['uuid'], "task_result":"fail"});
            var success_count = await DB.TaskTable.count({"uuid": upgradeList[i]['uuid'], "task_result":"success"});
            var running_count = total - success_count - fail_count;

            var updatestr = {
                "total" : total,
                "fail_count" : fail_count,
                "success_count" : success_count,
                "running_count" : running_count,
            };

            await DB.RomUpgradeTable.findByIdAndUpdate(upgradeList[i]['_id'], updatestr);

            //特别注意: 增加3个字段，与前端一致，字段按照前端修改
            var item = {
                "_id" : upgradeList[i]['uuid'],
                "user_name" : upgradeList[i]['user_name'],
                "operator_name" : upgradeList[i]['operator_name'],
                "mac" : upgradeList[i]['macs'],
                "request_timestamp" : upgradeList[i]['task_create_at'],
                "upgrade_mode" : upgradeList[i]['upgrade_mode'],
                "total" : total,
                "fail_count" : fail_count,
                "success_count" : success_count,
                "running_count" : running_count,
            };

            resultList.push(item);
        }

        res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:{resultList,count}});
        logger.info('task sysupgrade list end');
    }



    async list_detail(req, res, next){
        logger.info('task list_detail');
        //logger.info(req.body);

        try {
        	var page_size = req.body['page_size'];
        	var current_page = req.body['current_page'];
        	var sort = req.body['sort'];

        	if(typeof(sort)==="undefined"){
            		logger.info('sort undefined');
            		sort = {"sort_time":-1};
        	}

            	var uuid = req.body['uuid'];
            	var wherestr = {'uuid': uuid};

            	var upgrade = await DB.RomUpgradeTable.findOne(wherestr).exec();
            	if (upgrade == null)    throw "任务不存在";

            	var resultList = [];
        	//var queryList = await DB.TaskTable.find(wherestr).sort(sort);
        	if(typeof(page_size)==="undefined" && typeof(current_page)==="undefined"){
			var count = await DB.TaskTable.count(wherestr);
            		var queryList = await DB.TaskTable.find(wherestr).sort(sort).limit(10);
        	}
        	else if (page_size > 0 && current_page > 0) {
            		var skipnum = (current_page - 1) * page_size;   //跳过数
            		var queryList = await DB.TaskTable.find(wherestr).sort(sort).skip(skipnum).limit(page_size);
        	}
        	else{
            		var queryList = await DB.TaskTable.find(wherestr).sort(sort);
        	}

            	for (var i = 0; i < queryList.length; i++) {

                	var device = await DB.DeviceTable.findOne({'mac': queryList[i]['mac']}).exec();


                //特别注意: 与前端一致，字段按照前端修改
                var item = {
                    "_id" : queryList[i]['uuid'],
                    "user_name" : queryList[i]['user_name'],
                    "operator_name" : queryList[i]['operator_name'],
                    "mac" : queryList[i]['mac'],

                    "pubsub_status": queryList[i]['pubsub_status'],
                    "topic": queryList[i]['topic'],
                    "request_msg": queryList[i]['request_msg'],
                    "response_msg": queryList[i]['response_msg'],
                    "request_timestamp": queryList[i]['request_timestamp'],
                    "response_timestamp": queryList[i]['response_timestamp'],
                    "doc_del_at": queryList[i]['doc_del_at'],
                    "expired_time": queryList[i]['expired_time'],
                    "task_exec_time": queryList[i]['task_exec_time'],
                    "task_exec_count": queryList[i]['task_exec_count'],
                    "task_stop_at": queryList[i]['task_stop_at'],
                    "task_status": queryList[i]['task_status'],
                    "task_result": queryList[i]['task_result'],
                    "task_result_info": queryList[i]['task_result_info'],
                    "task_finish_at": queryList[i]['task_finish_at'],
                    "cmd_item": queryList[i]['cmd_item'],
                    "sort_time": queryList[i]['sort_time'],

                    //有不一致的字段
                    "upgrade_mode" : upgrade['upgrade_mode'],
                    "old_version" : (device == null) ?  '' : device['old_rom_version'],
                    "dest_version" : upgrade['dest_version'],
                    "dev_type" : upgrade['dev_type'],
                };

                resultList.push(item);
            }
		if(typeof(page_size)==="undefined" && typeof(current_page)==="undefined"){
        	    res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:{resultList,count}});
		}else if (page_size > 0 && current_page > 0) {
        	    res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:{resultList}});
		}
        }catch(err){
            logger.info('获取数据失败');
            res.send({ret_code: 1004, ret_msg: '获取数据失败', extra: err});
            return;
        }

        logger.info('task list_detail end');
    }





    //新建任务（固件升级）有效性检查
    async add_sysupgrade_check(req, res, next) {
        logger.info('task check');
        if (process.env.NODE_ENV === 'local') {
            var user_account = 'chenzejun-test';   //调试环境
        }
        else {
            if ('user_account' in req.session) {
                var user_account = req.session.user_account;
            }
            else {
                res.send({ret_code: 4001, ret_msg: 'FAILED', extra: '用户名无效'});
                return;
            }
        }

        //2.检查固件情况
        var firmware_file = req.body['firmware_file'];
        var wherestr = { 'file_name':firmware_file};
        var query = await DB.RomTable.findOne(wherestr).exec();
        if (query == null){
            res.send({ret_code: 1012, ret_msg: 'FAILED', extra: '固件名无效'});
            return;
        }
        else{
            if (query['rom_status'] == 'revoke'){
                res.send({ret_code: 1003, ret_msg: 'FAILED', extra: '固件已下架'});
                return;
            }
        }

        //3.检查设备情况，是否在线
        var expired_time = req.body['expired_time'];
        var upgrade_time = req.body['upgrade_time'];
        var upgrade_mode = req.body['upgrade_mode'];
        if (upgrade_mode == '3') {
            //参数有效性检查
            if (upgrade_time > 23) {
                res.send({ret_code: -1, ret_msg: 'fail', extra: 'upgrade_time 设置范围[0-24]'});
                return;
            }

            if (expired_time < 24) {
                res.send({ret_code: -1, ret_msg: 'fail', extra: 'expired_time 设置范围[24-*]'});
                return;
            }
        }

        next();
    }


    //升级模式附加值处理
    async sysupgrade_before_process(req, res, taskHandle){

        logger.info('sysupgrade_before_process');
        //获取表单数据，josn
        var expired_time = req.body['expired_time'];
        var dest_version = req.body['dest_version'];
        var upgrade_mode = req.body['upgrade_mode'];
        var upgrade_time = req.body['upgrade_time'];
        var dev_type = req.body['dev_type'];

        //升级模式处理
        if (upgrade_mode == '1') {
            expired_time = 0;    //实时下发的超时时间未0, 这里强制清零
            upgrade_time = -1;
        }
        else if (upgrade_mode == '2') {
            upgrade_time = -1;
        }

        //设置任务的时间选项
        await MqttPubHandle.setTaskTime(taskHandle, expired_time, upgrade_time);

        //写入数据库
        var wherestr = {'uuid': taskHandle.uuid};
        var taskUpgradeObj = {
            "uuid": taskHandle.uuid,
            "macs": taskHandle.dest_macs,
            //"total": taskHandle.dest_macs.length,
            "user_name": taskHandle.user_name,
            "operator_name": taskHandle.operator_name,
            "task_status": 'normal',

            ///////////////和task 表中的字段一致
            "expired_time": taskHandle.expired_time,
            "task_stop_at": taskHandle.task_stop_at,
            "upgrade_time": upgrade_time,   //[0-24]

            "doc_del_at": taskHandle.doc_del_at,   //
            ////////////////////////////////

            'upgrade_mode': upgrade_mode,
            'dev_type': dev_type,
            'dest_version': dest_version,

            "task_create_at": taskHandle.task_create_at,
            //排序时间戳，等于task_create_at
            "sort_time": new Date(taskHandle.task_create_at).getTime(),
        };

        //不采用更新机制，升级时下发升级命令后会继续下发查询，更新的话会覆盖掉升级命令记录
        var query = await DB.RomUpgradeTable.findOne(wherestr).exec();
        if (query != null) {
            return;
        }
        await DB.RomUpgradeTable.create(taskUpgradeObj);
        return 0;
    }


    // 添加升级任务时对旧任务的处理
    async sysupgrade_before_cover_old_task(taskHandle){

        var macs = taskHandle.dest_macs;

        //遍历所有的定时任务的mac对象
        for(var i = 0; i < macs.length; i++) {
            var wherestr = {'mac':macs[i], 'cmd_item': 'firmware', 'task_result':'running'};
            var updatestr = {
                "task_result":"fail",   //success;   fail;
                "task_result_info": "新任务覆盖旧任务",   //结果信息
                "task_finish_at":dtime().format('YYYY-MM-DD HH:mm:ss'),
            };
            await DB.TaskTable.findOneAndUpdate(wherestr, updatestr).exec();
        }
        return 0;
    }


    //升级模式处理， 升级任务下发后的处理
    async sysupgrade_after_process(req, res, taskHandle){

        logger.info('sysupgrade_after_process');

        //获取表单数据，josn
        var upgrade_mode = req.body['upgrade_mode'];

        //升级模式处理
        if (upgrade_mode == '1') {
            var macs = taskHandle.dest_macs;

            //遍历所有的定时任务的mac对象
            for(var i = 0; i < macs.length; i++) {
                var device = await DB.DeviceTable.findOne({'mac': macs[i], 'status':'online'}).exec();
                if (device != null) {
                    //设备在线
                    continue;
                }

                //更新设备
                var wherestr = {'mac':macs[i], 'uuid':taskHandle.uuid, 'task_result':'running'};
                var updatestr = {
                    "task_result":"fail",   //success;   fail;
                    "task_result_info": "设备不在线",   //结果信息
                    "task_finish_at":dtime().format('YYYY-MM-DD HH:mm:ss'),
                };
                await DB.TaskTable.findOneAndUpdate(wherestr, updatestr).exec();
                logger.info('update task_result fail');
            }
        }
        //logger.info('sysupgrade_addtions_add_type', query);
    }


    //新建任务（固件升级）
    async add_sysupgrade(req, res){
        logger.info('task add rom sysupgrade');
        var host = req.hostname;
        if (process.env.NODE_ENV == 'local') {
            host = config.local_ip;   //支持本地调试，pc的内网ip
            req.session.user_account = 'test-chen';
        }


        //获取表单数据，josn
        var route_macs = req.body['route_mac'];
        var operator_name = req.body['operator_name'];
        var expired_time = req.body['expired_time'];
        var firmware_file = req.body['firmware_file'];

        //路由器md5的格式是这样的，必须加2个空格 + 文件名
        var firmware_md5 = req.body['firmware_md5'] + "  " + firmware_file;
        var dev_type = req.body['dev_type'];
        var dest_version = req.body['dest_version'];
        var reflash = req.body['reflash'];

        //firmware_url
        var firmware_url = req.protocol + "://" + host + "/firmware/" + firmware_file;
        //logger.info(req.hostname , req.url, req.protocol, req.ip);
        logger.info('firmware_url:', firmware_url, firmware_md5);
        logger.info('form para:', route_macs, operator_name, expired_time, firmware_file, firmware_md5, dest_version);

        //支持批量任务下发
        var taskHandle = await MqttPubHandle.createTaskHandle(req.session.user_account, operator_name, route_macs);
        await MqttPubHandle.setTaskAdditions(taskHandle, dest_version);

        //获取additions, 失败返回
        await this.sysupgrade_before_process(req, res, taskHandle);

        // 旧的运行任务的处理
        await this.sysupgrade_before_cover_old_task(taskHandle);

        //执行固件升级命令
        var taskid = await MqttPubHandle.CMD_EXE.firmware(taskHandle, firmware_url, firmware_md5, reflash, dev_type, dest_version);
        //res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: taskid});

        //获取additions, 失败返回
        //await this.sysupgrade_after_process(req, res, taskHandle);

        // 监听器, 更新任务结果，在updateResponse 中
        // 正常升级过程中没有回应消息，需要起定时器进行查询升级结果
        var listener = async function (mac, josnObj) {
            //logger.info('Hello listener:', josnObj);
            //timeout, 命令下发后，router进行升级，不回应该消息，timeout认为success
            if (mac == -1) {
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: taskid});
            }
            //成功的状态为0
            else if (josnObj['state'] == "0") {
                res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: josnObj});
            }
            else{
                res.send({ret_code: -1, ret_msg: 'FAILED', extra: josnObj});
                return;
            }

            // 5分钟钟后， 发送sysinfo，目的查看版本号是否更新，这个
            var taskHand = MqttPubHandle.createPublishHandle(route_macs)
            await setTimeout(function(){
                MqttPubHandle.CMD_GET.sysinfo(taskHand);
            }, 300000);
        };
        //监听下发任务的结果
        await MqttSubHandle.addOnceListener(taskHandle['uuid'], listener, 1000);

    }

/*
    // 监听器 #1
    //此监听器更新任务状态，下发任务时，延时3次下发sysinfo查询
    //这里通过监听sysinfo进行更新
    async romSysupgradeTaskUpdate (mac, josnObj) {
        //logger.info('Hello romSysupgradeTaskUpdate:');
        //logger.info('Hello romSysupgradeTaskUpdate:', JSON.stringify(josnObj));

        //更新到任务数据库，更新是否升级ok, 这里采用sysinfo触发更新
        // 更新response msg, 如果升级ok的话就不更新
        //数据库字段 comment 记录要升级到的版本号。如果一致，说明升级ok
        var wherestr = {'mac':mac, 'cmd_item':'firmware', 'task_result':'running'};
        var query = await DB.TaskTable.findOne(wherestr).exec();
        if (query == null){
            //logger.info('firmware sysinfo TaskTable query null');
            return;
        }

        //任务是否已经成功，更新状态
        if (josnObj['fwversion'] == query['additions']){
            var updatestr = {
                "task_result":"success",   //success;   fail;
                "task_result_info": "任务执行成功",   //结果信息
                "task_finish_at":dtime().format('YYYY-MM-DD HH:mm:ss'),
            };

            // 如果回应消息为空, 记录 sysinfo
            if (query['response_msg'] == null){
                updatestr['response_msg'] = JSON.stringify(josnObj);
                updatestr['response_timestamp'] = dtime().format('YYYY-MM-DD HH:mm:ss');
            }

            //logger.info('update task_result', query['uuid']);
            await DB.TaskTable.findByIdAndUpdate(query['_id'], updatestr).exec();
            return;
        }

        //任务是否已经停止, 如果停止，更新成fail
        var t1 = Date.now()
        var t2 = new Date(query['task_stop_at']).getTime();
        if (t1 >= t2) {
            var updatestr = {
                "task_result":"fail",   //success;   fail;
                "task_result_info": "任务超时失败",   //结果信息
                "task_finish_at":dtime().format('YYYY-MM-DD HH:mm:ss'),
            };

            //logger.info('task already stop', mac);
            await DB.TaskTable.findByIdAndUpdate(query['_id'], updatestr).exec();
            return;
        }

    }



    // 升级模式2
    //这里通过监听sysinfo进行更新
    // 监听设备是否上线，如果未升级成功，上线后推送命令
    async romSysupgradeMode2Process (mac) {
        //logger.info('Hello romSysupgradeMode2Process:');
        //检查版本是否一致，支持用户自动升级模式
        //如果不一致，就执行保存的升级命令, 用户设备上线，会报ROMSYNC
        // 注意，更新任务状态要保证先执行

        //需要定时升级的, 正在运行的, 查看该任务是否升级模式2
        var wherestr = { 'upgrade_mode':'2', 'task_status':'normal'};
        var upgradeList = await DB.RomUpgradeTable.find(wherestr).exec();
        if (upgradeList.length  == 0){
            logger.info('query RomUpgradeTable is null');
            return;
        }

        for(var i = 0; i < upgradeList.length; i++) {
            var uuid = upgradeList[i]['uuid'];
            //logger.info('upgrade mode 2, mac:', mac);

            //1.查找超时的 running 态的任务，设置成fail
            var query = await DB.TaskTable.findOne({ 'uuid': uuid, 'mac': mac, 'task_result':'running'}).exec();
            if (query  == null){
                //logger.info('query task db is null');
                continue;
            }

            //2.防止重复下发， 1分钟内不下发， 第一次下发有可能设备不在线
            var t1 = Date.now()    //60000 ms
            var t3 = new Date(query['request_timestamp']).getTime();
            if (t1 < t3 + 60000 && query['task_exec_count'] > 1) {   //60000 ms
                logger.info('mode 2, send already in 1 minute, ignore', uuid);
                continue;
            }

            //升级失败次数大于5
            if (query['task_exec_count'] > 5) {
                logger.info('mode 2, upgrade count > 5, stop', uuid);
                var updatestr = {
                    "task_result":"fail",   //success;   fail;
                    "task_result_info": "重复升级超过5次",   //结果信息
                    "task_finish_at":dtime().format('YYYY-MM-DD HH:mm:ss'),
                };

                await DB.TaskTable.findByIdAndUpdate(query['_id'], updatestr).exec();
                continue;
            }

            //执行对应的升级任务, 如果mac不属于该任务，直接返回
            await TaskHandle.createBatchPublish(uuid, -1, mac);
        }
    }




    // 监听器 #3 ,定时间点升级， 升级模式3
    // 查看是否到达定时时间，到达后推送命令
    async romSysupgradeMode3Process () {
        logger.info('upgrade mode 3 timer out:', dtime().format('YYYY-MM-DD HH:mm:ss'));

        var mytime = new Date();

        //需要定时升级的, 正在运行的
        var wherestr = { 'upgrade_time': mytime.getHours(), 'upgrade_mode':'3', 'task_status':'normal'};
        var upgradeList = await DB.RomUpgradeTable.find(wherestr).exec();
        if (upgradeList.length  == 0){
            logger.info('query db is null');
            return;
        }

        //logger.info(query);
        for(var i = 0; i < upgradeList.length; i++) {
            var uuid = upgradeList[i]['uuid'];

            //任务是否已经停止
            var t1 = Date.now()
            var t2 = new Date(upgradeList[i]['task_stop_at']).getTime();
            if (t1 >= t2) {
                logger.info('task already stop', uuid);
                continue;
            }

            //执行对应的升级任务
            await TaskHandle.createBatchPublish(uuid, upgradeList[i]['upgrade_time']);
        }

    }


    // 监听器 #4 ,升级超时失败处理
    // 升级超时失败处理, 24小时更新一次
    async romSysupgradeTimeoutFailProcess () {
        logger.info('fail chcek timer out:', dtime().format('YYYY-MM-DD HH:mm:ss'));

        //需要定时升级的, 正在运行的
        var wherestr = { 'task_status':'normal'};
        var upgradeList = await DB.RomUpgradeTable.find(wherestr).exec();
        if (upgradeList.length  == 0){
            logger.info('query task db is null');
            return;
        }

        //logger.info(query);
        for(var i = 0; i < upgradeList.length; i++) {
            var uuid = upgradeList[i]['uuid'];

            //任务是否已经停止
            var t1 = Date.now();
            var t2 = new Date(upgradeList[i]['task_stop_at']).getTime();
            if (t1 < t2) {
                logger.info('task is running', uuid);
                continue;
            }

            //1.查找超时的 running 态的任务，设置成fail
            var queryList = await DB.TaskTable.find({ 'uuid': uuid, 'task_result':'running'}).exec();
            if (queryList.length  == 0){
                logger.info('query task db is null');
                return;
            }

            //遍历所有uuid对应的task对象， 都设置成fail
            for(var m = 0; m < queryList.length; m++) {
                var updatestr = {
                    "task_status":"stop",   //任务停止;
                    "task_result":"fail",   //success;   fail;
                    "task_result_info": "任务超时失败",   //结果信息
                    "task_finish_at":dtime().format('YYYY-MM-DD HH:mm:ss'),
                };

                //logger.info('updateTaskContent entry', wherestr);
                await DB.TaskTable.findByIdAndUpdate(queryList[m]['_id'], updatestr).exec();
            }

            //2.更新RomUpgradeTable表的状态
            await DB.RomUpgradeTable.findByIdAndUpdate(upgradeList[i]['_id'], { 'task_status':'stop'}).exec();
        }
    }

    // 监听器 #5  升级模式2
    //rom 升级2 设备上线处理，场景网线插拔导致上线后，要重新通过sysinfo 触发升级模式2处理
    async romSysupgradeMode2Sysinfo (mac, josnObj) {

        if (josnObj['id'] != 'ROMSYNC'){
            return;
        }

        this.recv_sysinfo = true;

        //上线通过sysyifno信息， 重启场景， 延时1.5秒，保证任务状态更新完成
        var self = this;
        setTimeout(function(){
            self.romSysupgradeMode2Process(mac);
        },1500);
    }

    // 监听器 #6  升级模式2
    //rom 升级2 设备上线处理，场景网线插拔导致上线后，要重新通过sysinfo 触发升级模式2处理
    async romSysupgradeMode2DevOnling (mac, status) {

        if (status == 'offline'){
            return;
        }

        //上线， 分两种， 1，报sysyinfo   2， 不报sysinfo
        // 如果是重启上线，先报online， 再报sysyinfo， 延时120秒
        this.recv_sysinfo = false;
        var self = this;
        setTimeout(function(){
            //console.log('recv_sysinfo:', self.recv_sysinfo);
            // online之后150秒内， 没有收到sysinfo
            if (self.recv_sysinfo == false) {
                self.romSysupgradeMode2Process(mac);
            }
        },120000);
    }
*/
}

const RomUpgradeHnd = new RomUpgradeHandle();
module.exports = RomUpgradeHnd;

//更新升级任务的状态，处理升级模式3， 固件升级模式的处理
//场景：用户定时升级 ,  0, 10 分的时候，下发两次，增加可靠性
//schedule.scheduleJob('0 0,10 * * * *', RomUpgradeHnd.romSysupgradeMode3Process);
//场景：超时失败, 每天夜里12:00进行更新， 一般情况sysinifo就已经更新状态了，这个是补漏
//schedule.scheduleJob('0 30 0 * * *', RomUpgradeHnd.romSysupgradeTimeoutFailProcess);

//
//更新升级任务的状态，通过sysinfo更新
//场景：更新设备是否升级成功
//MqttSubHandle.addLoopListener('sysinfo', RomUpgradeHnd.romSysupgradeTaskUpdate);


//更新升级任务的状态，处理升级模式2， 固件升级模式的处理
//场景：下发命令时设备不在线，设备上线后自动升级， 监听设备上线信息
//MqttSubHandle.addLoopListener('sysinfo', RomUpgradeHnd.romSysupgradeMode2Sysinfo);
//MqttSubHandle.addLoopListener('$SYS', RomUpgradeHnd.romSysupgradeMode2DevOnling);

