'use strict';
const TaskHandle = require("../../mqttclient/publish/mqtt_task.js");
const MqttSubHandle = require("../../mqttclient/subscribe/mqtt_sub.js");
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');



class RomUpgradeUpdateHandle {
	constructor(){

        this.romSysupgradeMode2Process = this.romSysupgradeMode2Process.bind(this);
        this.romSysupgradeMode2Sysinfo = this.romSysupgradeMode2Sysinfo.bind(this);
        this.romSysupgradeMode2DevOnling = this.romSysupgradeMode2DevOnling.bind(this);

        this.recv_sysinfo = false;
	}


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
            //logger.info('query RomUpgradeTable is null');
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

}

const RomUpgradeUpdateHnd = new RomUpgradeUpdateHandle();

//
//更新升级任务的状态，通过sysinfo更新
//场景：更新设备是否升级成功
MqttSubHandle.addLoopListener('sysinfo', RomUpgradeUpdateHnd.romSysupgradeTaskUpdate);


//更新升级任务的状态，处理升级模式2， 固件升级模式的处理
//场景：下发命令时设备不在线，设备上线后自动升级， 监听设备上线信息
MqttSubHandle.addLoopListener('sysinfo', RomUpgradeUpdateHnd.romSysupgradeMode2Sysinfo);
MqttSubHandle.addLoopListener('$SYS', RomUpgradeUpdateHnd.romSysupgradeMode2DevOnling);

