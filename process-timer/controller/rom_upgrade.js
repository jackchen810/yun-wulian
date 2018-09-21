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


    }


    // 监听器 #4 ,升级超时失败处理
    // 升级超时失败处理, 24小时更新一次
    async romSysupgradeTimeoutFailProcess () {
        logger.info('fail chcek timer out:', dtime().format('YYYY-MM-DD HH:mm:ss'));

    }


}

const RomUpgradeTimerHnd = new RomUpgradeTimerHandle();

//更新升级任务的状态，处理升级模式3， 固件升级模式的处理
//场景：用户定时升级 ,  0, 10 分的时候，下发两次，增加可靠性
schedule.scheduleJob('0 0,10 * * * *', RomUpgradeTimerHnd.romSysupgradeMode3Process);
//场景：超时失败, 每天夜里12:00进行更新， 一般情况sysinifo就已经更新状态了，这个是补漏
schedule.scheduleJob('0 30 0 * * *', RomUpgradeTimerHnd.romSysupgradeTimeoutFailProcess);

