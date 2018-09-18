'use strict';
import MqttPubHandle from '../../mqttclient/publish/mqtt_pub';
import MqttSubHandle from "../../mqttclient/subscribe/mqtt_sub";
import mqttClient from '../../mqttclient/mqttclient.js';
import AdminModel from '../../models/admin/admin'
import ScriptModel from '../../models/script/script'
import TaskTable from '../../models/task/task';
import DeviceTable from '../../models/device/device';
import TaskHandle from '../../mqttclient/publish/mqtt_task.js'
import logger from '../../logs/logs.js'
import fs from 'fs';
import path from 'path';
const schedule = require('node-schedule');
logger.info('enter here mangehndle');

class ManageHnd {
    constructor(){
    }
    async sysinfo(req, res, next){
	logger.info('manage sysinfo');
	try{
		var user_account = req.session.user_account;
		var route_mac = req.body.route_mac;
		if(route_mac.length === 17){
			route_mac = route_mac.replace(/:/g,'').toUpperCase();
		}
		if(!user_account){
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
		await MqttPubHandle.CMD_GET.sysinfo(taskHandle);
		logger.info('sysinfo成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'sysinfo ok'});
	}catch(err){
		logger.info('sysinfo失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async sysync(req, res, next){
	logger.info('manage sysync');
	try{
		var admin_id = req.session.admin_id;
		var route_mac = req.body.route_mac;
		var admin = await AdminModel.findOne({user_id:admin_id});
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
		var domainlist_set = req.body.domainlist_set;
		var maclist_w_set = req.body.maclist_w_set;
		var maclist_b_set = req.body.maclist_b_set;
		var iplist_set = req.body.iplist_set;
		var pandomain_add = req.body.pandomain_add;
		logger.info('form body:',route_mac,user_name,domainlist_set,maclist_w_set,maclist_b_set,iplist_set,pandomain_add);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SYNC.sysync(taskHandle,domainlist_set,maclist_w_set,maclist_b_set,iplist_set,pandomain_add);
		logger.info('sysync成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'sysync ok'});
	}catch(err){
		logger.info('sysync失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async networkinfo(req, res, next){
	logger.info('manage networkinfo');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
		var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.networkinfo(taskHandle);
		logger.info('获取网络信息成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'get network info ok'});
	}catch(err){
		logger.info('获取网络信息失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async wireless(req, res, next){
    	logger.info('manage wireless');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var ssid = req.body.ssid;
        if(!ssid){
            ssid = '';
		}

		//channel_2
		var channel_2 = req.body.channel_2;
        if(!channel_2){
            channel_2 = '';
        }

        //channel_5
		var channel_5 = req.body.channel_5;
        if(!channel_5){
            channel_5 = '';
        }

        //修改密码
		var encryption = req.body.encryption;
        if(!encryption){
            encryption = '';
        }


		var key = req.body.key;
        if(!key){
            key = '';
        }


		logger.info('form body:',route_mac,user_name,ssid,channel_2,channel_5,encryption,key);
		/*admin_id 需要根据admin_id来进行相应的修改*/
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.wireless(taskHandle,ssid, channel_2, channel_5, encryption, key);
		logger.info('无线修改成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'modify wireless ok'});
	}catch(err){
		logger.info('修改无线失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async reboot(req, res, next){
	logger.info('manage reboot');
	try{
		var route_mac = req.body.route_mac;
		var user_account = req.session.user_account;
                var admin = await AdminModel.findOne({user_account:user_account});
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
    async TX_power(req, res, next){
	logger.info('manage tx_power');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var value_2 = req.body.value_2;
		var value_5 = req.body.value_5;
		logger.info('form body:',route_mac,user_name,value_2,value_5);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.TX_power(taskHandle,value_2,value_5);
		logger.info('修改功率成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'modify wireless txpower ok'});
	}catch(err){
		logger.info('修改功率失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async rsyslogserverIP(req, res, next){
	logger.info('manage rsyslogserverIp');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var ip = req.body.ip;
		logger.info('form body:',route_mac,user_name,ip);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.rsyslogserverIP(taskHandle,ip);
		logger.info('修改rsyslogserverIP成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'modify rsyslogserverIP ok'});
	}catch(err){
		logger.info('修改rsyslogserverIP失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async wifidog(req, res, next){
	logger.info('manage wifidog');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var hostname = req.body.hostname;
		var port = req.body.port;
		var path = req.body.path;
		logger.info('form body:',route_mac,user_name,hostname,port,path);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.wifidog(taskHandle,hostname,port,path);
		logger.info('修改wifidog成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'modify wifidog ok'});
	}catch(err){
		logger.info('修改wifidog失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async wifidog_check(req, res, next){
	logger.info('manage wifidog_check');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.wifidog_check(taskHandle);
		logger.info('wifidog_check成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'wifidog_check ok'});
	}catch(err){
		logger.info('wifidog_check失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async WD_wired_pass(req, res, next){
	logger.info('manage WD_wired_pass');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var enable = req.body.enable;
		logger.info('form body:',route_mac,user_name,enable);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.WD_wired_pass(taskHandle,enable);
		logger.info('WD_wired_pass成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'WD_wired_pass ok'});
	}catch(err){
		logger.info('WD_wired_pass失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async WD_roam_switch(req, res, next){
	logger.info('manage WD_roam_switch');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var enable = req.body.enable;
		logger.info('form body:',route_mac,user_name,enable);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.WD_roam_switch(taskHandle,enable);
		logger.info('WD_roam_switch成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'WD_roam_switch ok'});
	}catch(err){
		logger.info('WD_roam_switch失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async WD_NOAUTH(req, res, next){
	logger.info('manage WD_NOAUTH');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var enable = req.body.enable;
		logger.info('form body:',route_mac,user_name,enable);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.WD_NOAUTH(taskHandle,enable);
		logger.info('WD_NOAUTH成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'WD_NOAUTH ok'});
	}catch(err){
		logger.info('WD_NOAUTH失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async mosquittoserverIP(req, res, next){
	logger.info('manage mosquittoserverIP');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var ip = req.body.ip;
		logger.info('form body:',route_mac,user_name,ip);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.mosquittoserverIP(taskHandle,ip);
		logger.info('mosquittoserverIP成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'mosquittoserverIP ok'});
	}catch(err){
		logger.info('mosquittoserverIP失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async shell(req, res, next){
	logger.info('manage shell');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.shell(taskHandle,cmd);
		logger.info('shell成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'shell ok'});
	}catch(err){
		logger.info('shell失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async shell64(req, res, next){
	logger.info('manage shell64');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.shell64(taskHandle,cmd);
		logger.info('shell64成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'shell64 ok'});
	}catch(err){
		logger.info('shell64失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async script(req, res, next){
	logger.info('manage script');
	try{
		var route_mac = req.body.route_mac;
		var user_account = req.session.user_account;
		var operator = req.body.operator;
		var mode = req.body.script_mode;
		var expired_time = req.body.expired_time;
		var exec_time = req.body.exec_time;
                var admin = await AdminModel.findOne({user_account:user_account});
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
		var script = await ScriptModel.findOne({script_name});
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
		var taskHandle = MqttPubHandle.createTaskHandle(user_account, operator, route_mac);
		if(mode === '1'){
			exec_time = -1;
			MqttPubHandle.setTaskTime(taskHandle, expired_time, exec_time);
			MqttPubHandle.setTaskAdditions(taskHandle, additions);
			await MqttPubHandle.CMD_EXE.script(taskHandle, port, url_route, md5);
		}else if(mode === '2'){
			logger.info('script_install at mode 2');
			exec_time = -1;
			MqttPubHandle.setTaskTime(taskHandle, expired_time, exec_time);
			MqttPubHandle.setTaskAdditions(taskHandle, additions);
			await MqttPubHandle.CMD_EXE.script(taskHandle, port, url_route, md5);
			
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
			var timeout_script = async function(taskHandle) {
				logger.info('start run timeout_script');
				logger.info('uuid='+taskHandle.uuid);
				var task = await TaskTable.find({'uuid':taskHandle.uuid ,'cmd_item':'remote_cmd'});
				for(var i=0;i < task.length;i++){
					if(task[i].additions.mode == 2 && task[i].pubsub_status == 'request'){
						await TaskTable.findOneAndUpdate({'uuid': task[i].uuid, 'mac':task[i].mac, 'pubsub_status':'request'},{$set: {'pubsub_status':'response_fail'}});
					}
				}
			};
			MqttSubHandle.addLoopListener('$SYS', script_callback);
			setTimeout(timeout_script,expired_time*60*60*1000,taskHandle);*/
		}else if(mode === '3'){
			logger.info('script_install at mode 3');
			MqttPubHandle.setTaskTime(taskHandle, expired_time, exec_time);
			MqttPubHandle.setTaskAdditions(taskHandle, additions);
			taskHandle.only_create = true;
			await MqttPubHandle.CMD_EXE.script(taskHandle, port, url_route, md5);
		/*	var script_callback = async function(){
				var stop_time = new Date(taskHandle.task_stop_at).getTime();
				if(Date.now() < stop_time){
					await TaskHandle.createBatchPublish(taskHandle.uuid, exec_time);
				}else {
					schedule.cancelJob(script_id);
				}
			};
			var timeout_script = async function(taskHandle){
				logger.info('timeout_script run now');
				var task = await TaskTable.find({'uuid':taskHandle.uuid ,'cmd_item':'remote_cmd'});
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
			setTimeout(timeout_script,expired_time*60*60*1000,taskHandle);*/
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
				var device = await DeviceTable.findOne({'mac': script_task[i].mac});
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
				var device = await DeviceTable.findOne({'mac': script_task[i].mac});
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
	logger.info('manage apps');
	try{
		var route_mac = req.body.route_mac;
		var mode = req.body.pkg_mode;
		var expired_time = req.body.expired_time;
		var operator = req.body.operator;
		var exec_time = req.body.exec_time;
		var logo = req.body.logo;
		var user_account = req.session.user_account;
                var admin = await AdminModel.findOne({user_account:user_account});
                if(!admin){ 
                        logger.info('该用户不存在');
                        res.send({
                                ret_code: 1,
                                ret_msg: 'USER_NOT_EXIST',
                                extra: '用户不存在'
                        });
                        return;
                }
		var pkg_name = req.body.pkg_str_name + "_" + req.body.pkg_version;
		var pkg_file = await fs.readFileSync(path.join(__dirname,'apps.sh'),"utf8");
		var last_file = pkg_file.replace(/apps_name/g, pkg_name);
		var content = new Buffer(last_file).toString('base64');
		var additions = {'mode': mode, 'apps_name': req.body.pkg_str_name, 'apps_version': req.body.pkg_version,'operator':req.body.operator};
		logger.info('form body:',route_mac,req.body.pkg_str_name,req.body.pkg_version,logo);
		var taskHandle = MqttPubHandle.createTaskHandle(user_account, operator, route_mac);
		if(mode === '1'){
			exec_time = -1;
			MqttPubHandle.setTaskTime(taskHandle, expired_time, exec_time);
			MqttPubHandle.setTaskAdditions(taskHandle, additions);
			await MqttPubHandle.CMD_EXE.apps(taskHandle,logo,content);
		}else if(mode === '2'){
			logger.info('Apps_install at mode 2');
			exec_time = -1;
			MqttPubHandle.setTaskTime(taskHandle, expired_time, exec_time);
			MqttPubHandle.setTaskAdditions(taskHandle, additions);
			await MqttPubHandle.CMD_EXE.apps(taskHandle,logo,content);

/*			var apps_callback = async function(mac, jsonObj) {
				logger.info("start run apps_callback");
				var task = await TaskTable.find({'cmd_item':'apps','mac':mac});
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
			var timeout_callback = async function(taskHandle) {
				logger.info('start run timeout_callback');
				logger.info('uuid='+taskHandle.uuid);
				var task = await TaskTable.find({'uuid':taskHandle.uuid ,'cmd_item':'apps'});
				for(var i=0;i < task.length;i++){
					if(task[i].additions.mode == 2 && task[i].pubsub_status == 'request'){
						await TaskTable.findOneAndUpdate({'uuid': task[i].uuid, 'mac':task[i].mac, 'pubsub_status':'request'},{$set: {'pubsub_status':'response_fail'}});
					}
				}				
			};
			MqttSubHandle.addLoopListener('$SYS', apps_callback);
			setTimeout(timeout_callback,expired_time*60*60*1000,taskHandle);
		*/
		}else if(mode === '3'){
			logger.info('Apps_install at mode 3');
			MqttPubHandle.setTaskTime(taskHandle, expired_time, exec_time);
			MqttPubHandle.setTaskAdditions(taskHandle, additions);
			taskHandle.only_create = true;
			await MqttPubHandle.CMD_EXE.apps(taskHandle,logo,content);
	/*
			var apps_callback = async function(){
				var stop_time = new Date(taskHandle.task_stop_at).getTime();
				if(Date.now() < stop_time){
					logger.info('timer_callback run now');
				//	MqttPubHandle.setTaskTime(taskHandle, expired_time, -1);
				//	MqttPubHandle.setTaskAdditions(taskHandle, additions);
				//	await MqttPubHandle.CMD_EXE.apps(taskHandle,logo,content);
					await TaskHandle.createBatchPublish(taskHandle.uuid, exec_time);
				}else {
					schedule.cancelJob(job_id);
				}
			};
			var timeout_apps = async function(taskHandle){
				logger.info('timeout_callback run now');
				var task = await TaskTable.find({'uuid':taskHandle.uuid ,'cmd_item':'apps'});
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
			var apps_id = schedule.scheduleJob(rule, apps_callback);
			setTimeout(timeout_apps,expired_time*60*60*1000,taskHandle);*/
		}
		logger.info('apps成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: '下发插件成功'});
	}catch(err){
		logger.info('apps失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
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
				var device = await DeviceTable.findOne({'mac': apps_task[i].mac});
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
				var device = await DeviceTable.findOne({'mac': apps_task[i].mac});
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
	logger.info('manage firmware');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.firmware(taskHandle,firmware_url,firmware_md5,dest_version);
		logger.info('firmware成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'firmware ok'});
	}catch(err){
		logger.info('firmware失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async network(req, res, next){
	logger.info('manage network');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.network(taskHandle,type);
		logger.info('network成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'network ok'});
	}catch(err){
		logger.info('network失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async passwd(req, res, next){
	logger.info('manage passwd');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.passwd(taskHandle,oldpasswd,newpasswd);
		logger.info('passwd成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'passwd ok'});
	}catch(err){
		logger.info('passwd失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async superpasswd(req, res, next){
	logger.info('manage superpasswd');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_EXE.superpasswd(taskHandle,newpasswd);
		logger.info('superpasswd成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'superpasswd ok'});
	}catch(err){
		logger.info('passwd失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async domainlist_set(req, res, next){
	logger.info('manage domainlist_set');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.domainlist_set(taskHandle,content);
		logger.info('domainlist_set成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'domainlist_set ok'});
	}catch(err){
		logger.info('domainlist_set失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async domainlist_del(req, res, next){
	logger.info('manage domainlist_del');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.domainlist_del(taskHandle,content);
		logger.info('domainlist_del成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'domainlist_del ok'});
	}catch(err){
		logger.info('domainlist_del失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async domainlist_clear(req, res, next){
	logger.info('manage domainlist_clear');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.domainlist_clear(taskHandle);
		logger.info('domainlist_clear成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'domainlist_clear ok'});
	}catch(err){
		logger.info('domainlist_clear失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async pandomain_add(req, res, next){
	logger.info('manage pandomain_add');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.pandomain_add(taskHandle,content);
		logger.info('pandomain_add成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'pandomain_add ok'});
	}catch(err){
		logger.info('pandomain_add失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async pandomain_del(req, res, next){
	logger.info('manage pandomain_del');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.pandomain_del(taskHandle,content);
		logger.info('pandomain_del成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'pandomain_del ok'});
	}catch(err){
		logger.info('pandomain_del失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async pandomain_clear(req, res, next){
	logger.info('manage pandomain_clear');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.pandomain_clear(taskHandle);
		logger.info('pandomain_clear成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'pandomain_clear ok'});
	}catch(err){
		logger.info('pandomain_clear失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async iplist_set(req, res, next){
	logger.info('manage iplist_set');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.iplist_set(taskHandle,content);
		logger.info('iplist_set成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'iplist_set ok'});
	}catch(err){
		logger.info('iplist_set失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async iplist_clear(req, res, next){
	logger.info('manage iplist_clear');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.iplist_clear(taskHandle);
		logger.info('iplist_clear成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'iplist_clear ok'});
	}catch(err){
		logger.info('iplist_clear失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async maclist_w_set(req, res, next){
	logger.info('manage maclist_w_set');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.maclist_w_set(taskHandle,content);
		logger.info('maclist_w_set成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'maclist_w_set ok'});
	}catch(err){
		logger.info('maclist_w_set失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async maclist_w_del(req, res, next){
	logger.info('manage maclist_w_del');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.maclist_w_del(taskHandle,content);
		logger.info('maclist_w_del成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'maclist_w_del ok'});
	}catch(err){
		logger.info('maclist_w_del失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async maclist_w_clear(req, res, next){
	logger.info('manage maclist_w_clear');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.maclist_w_clear(taskHandle);
		logger.info('maclist_w_clear成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'maclist_w_clear ok'});
	}catch(err){
		logger.info('maclist_w_clear失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async maclist_b_set(req, res, next){
	logger.info('manage maclist_b_set');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.maclist_b_set(taskHandle,content);
		logger.info('maclist_b_set成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'maclist_b_set ok'});
	}catch(err){
		logger.info('maclist_b_set失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async maclist_b_del(req, res, next){
	logger.info('manage maclist_b_del');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.maclist_b_del(taskHandle,content);
		logger.info('maclist_b_del成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'maclist_b_del ok'});
	}catch(err){
		logger.info('maclist_b_del失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async maclist_b_clear(req, res, next){
	logger.info('manage maclist_b_clear');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.maclist_b_clear(taskHandle);
		logger.info('maclist_b_clear成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'maclist_b_clear ok'});
	}catch(err){
		logger.info('maclist_b_clear失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async maclist_b_reset(req, res, next){
	logger.info('manage maclist_b_reset');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.maclist_b_reset(taskHandle,content);
		logger.info('maclist_b_reset成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'maclist_b_reset ok'});
	}catch(err){
		logger.info('maclist_b_reset失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async channelpath_set(req, res, next){
	logger.info('manage channelpath_set');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.channelpath_set(taskHandle,content);
		logger.info('channelpath_set成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'channelpath_set ok'});
	}catch(err){
		logger.info('channelpath_set失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async channelpath_clear(req, res, next){
	logger.info('manage channelpath_clear');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.channelpath_clear(taskHandle);
		logger.info('channelpath_clear成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'channelpath_clear ok'});
	}catch(err){
		logger.info('channelpath_clear失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async blist_mac_get(req, res, next){
	logger.info('manage blist_mac_get');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.blist_mac_get(taskHandle);
		logger.info('blist_mac_get成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'blist_mac_get ok'});
	}catch(err){
		logger.info('blist_mac_get失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async blist_mac_set(req, res, next){
	logger.info('manage blist_mac_set');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.blist_mac_set(taskHandle,content);
		logger.info('blist_mac_set成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'blist_mac_set ok'});
	}catch(err){
		logger.info('blist_mac_set失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async blist_mac_del(req, res, next){
	logger.info('manage blist_mac_del');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.blist_mac_del(taskHandle,content);
		logger.info('blist_mac_del成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'blist_mac_del ok'});
	}catch(err){
		logger.info('blist_mac_del失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async blist_mac_clear_all(req, res, next){
	logger.info('manage blist_mac_clear_all');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.blist_mac_clear_all(taskHandle);
		logger.info('blist_mac_clear_all成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'blist_mac_clear_all ok'});
	}catch(err){
		logger.info('blist_mac_clear_all失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async blist_domain_get(req, res, next){
	logger.info('manage blist_domain_get');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.blist_domain_get(taskHandle);
		logger.info('blist_domain_get成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'blist_domain_get ok'});
	}catch(err){
		logger.info('blist_domain_get失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async blist_domain_set(req, res, next){
	logger.info('manage blist_domain_set');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var content = req.body.content;
		logger.info('form body:',route_mac,user_name,content);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.blist_domain_set(taskHandle,content);
		logger.info('blist_domain_set成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'blist_domain_set ok'});
	}catch(err){
		logger.info('blist_domain_set失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async blist_domain_clear_all(req, res, next){
	logger.info('manage blist_domain_clear_all');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		logger.info('form body:',route_mac,user_name);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.blist_domain_clear_all(taskHandle);
		logger.info('blist_domain_clear_all成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'blist_domain_clear_all ok'});
	}catch(err){
		logger.info('blist_domain_clear_all失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async qos_show(req, res, next){
	logger.info('manage qos_show');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var client_list = req.body.client_list;
		var ip_rule = req.body.ip_rule;
		var in_net_rule = req.body.in_net_rule;
		var vip_mac = req.body.vip_mac;
		var black_mac = req.body.black_mac;
		logger.info('form body:',route_mac,user_name,client_list,ip_rule,in_net_rule,vip_mac,black_mac);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.qos_show(taskHandle,client_list,ip_rule,in_net_rule,vip_mac,black_mac);
		logger.info('qos_show成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'qos_show ok'});
	}catch(err){
		logger.info('qos_show失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async qos_setting(req, res, next){
	logger.info('manage qos_setting');
	try{
		var route_mac = req.body.route_mac;
		var admin_id = req.session.admin_id;
                var admin = await AdminModel.findOne({user_id:admin_id});
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
		var ip_rule = req.body.ip_rule;
		var in_net_rule = req.body.in_net_rule;
		var vip_mac = req.body.vip_mac;
		var black_mac = req.body.black_mac;
		logger.info('form body:',route_mac,user_name,ip_rule,in_net_rule,vip_mac,black_mac);
		var taskHandle = MqttPubHandle.createTaskHandle(user_name, admin_id, route_mac);
		await MqttPubHandle.CMD_SET.qos_setting(taskHandle,ip_rule,in_net_rule,vip_mac,black_mac);
		logger.info('qos_setting成功');
		res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'qos_setting ok'});
	}catch(err){
		logger.info('qos_setting失败');
		res.send({ret_code: -1, ret_msg: 'FAILED', extra: err.toString()});
	}
    }
    async mode2_callback(mac, jsonObj){
//	logger.info("start run mode2_callback");
	var task = await TaskTable.find({'mac':mac, $or:[{'cmd_item':'apps'},{'cmd_item':'remote_cmd'}]});
	for(var i=0; i < task.length;i++){
		if(task[i].additions.mode == 2 && task[i].pubsub_status == 'request'){
                      var stop_time = new Date(task[i].task_stop_at).getTime();
			if(Date.now() < stop_time){
				if(task[i].cmd_item == 'apps' && task[i].additions.apps_name == 'mqtt-client' && task[i].additions.apps_version == jsonObj["mqtt-clientversion"]){
					await TaskTable.findOneAndUpdate({'uuid': task[i].uuid,'mac': task[i].mac,'pubsub_status':'request'},{$set: {'pubsub_status':'response_ok','response_msg':'mqtt-client installed ok!'}});	
				}else{
					mqttClient.publish(task[i].topic, task[i].request_msg);
				}
			}else{
				await TaskTable.findOneAndUpdate({uuid: task[i].uuid},{$set: {'pubsub_status':'response_fail'}});
			}
		}
	}
    }
    async mode3_callback(){
	logger.info('start run mode3_callback');
	var task = await TaskTable.find({$or:[{'cmd_item':'apps'},{'cmd_item':'remote_cmd'}]});
	for(var i=0; i < task.length; i++){
		if(task[i].additions.mode == 3 && task[i].pubsub_status == 'request'){
			var stop_time = new Date(task[i].task_stop_at).getTime();
			if(Date.now() < stop_time){
				var now = new Date();
				await TaskHandle.createBatchPublish(task[i].uuid, now.getHours());
			}else{
				await TaskTable.findOneAndUpdate({uuid: task[i].uuid},{$set: {'pubsub_status':'response_fail'}});
			}
		}
	}
    }
    async timeout_callback() {
//	logger.info('start run timeout_callback');
	var task = await TaskTable.find({$or:[{'cmd_item':'remote_cmd'},{'cmd_item':'apps'}]});
	for(var i=0;i < task.length;i++){
		if((task[i].pubsub_status == 'request') && (task[i].additions.mode ==2 || task[i].additions.mode ==3)){
			var stop_time = new Date(task[i].task_stop_at).getTime();
			if(Date.now() > stop_time){
				await TaskTable.findOneAndUpdate({'uuid': task[i].uuid,'pubsub_status':'request'},{$set: {'pubsub_status':'response_fail'}}); 
			}
		}
	}
    }
    async mqtt_client_callback(mac, jsonObj) {
	var task = await TaskTable.find({'cmd_item':'apps','mac': mac});
	for(var i=0; i < task.length; i++){
		if(task[i].pubsub_status == 'request' && task[i].additions.apps_name == 'mqtt-client' && task[i].additions.apps_version == jsonObj["mqtt-clientversion"]){
			await TaskTable.findOneAndUpdate({'uuid': task[i].uuid,'mac': task[i].mac,'pubsub_status':'request'},{$set: {'pubsub_status':'response_ok','response_msg':'mqtt-client installed ok!'}});
		}
	}
    }
}
const ManageHandle = new ManageHnd();
//export default new ManageHandle()
export default ManageHandle;
/*
MqttSubHandle.addLoopListener('$SYS', ManageHandle.mode2_callback);
MqttSubHandle.addLoopListener('sysinfo', ManageHandle.mode2_callback);
MqttSubHandle.addLoopListener('sysinfo', ManageHandle.mqtt_client_callback);
schedule.scheduleJob('0 0 * * * *', ManageHandle.mode3_callback);
schedule.scheduleJob('0 0 * * * *', ManageHandle.timeout_callback);
*/