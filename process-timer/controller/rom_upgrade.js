'use strict';
const TaskHandle = require("../../mqttclient/publish/mqtt_task.js");
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');
const schedule = require('node-schedule');


class RomUpgradeTimerHandle {
	constructor(){

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


}

const RomUpgradeTimerHnd = new RomUpgradeTimerHandle();

//更新升级任务的状态，处理升级模式3， 固件升级模式的处理
//场景：用户定时升级 ,  0, 10 分的时候，下发两次，增加可靠性
schedule.scheduleJob('0 0,10 * * * *', RomUpgradeTimerHnd.romSysupgradeMode3Process);
//场景：超时失败, 每天夜里12:00进行更新， 一般情况sysinifo就已经更新状态了，这个是补漏
schedule.scheduleJob('0 30 0 * * *', RomUpgradeTimerHnd.romSysupgradeTimeoutFailProcess);

