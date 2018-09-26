'use strict';
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');
const schedule = require('node-schedule');


class GatewayIDE4gTimerHandle {
	constructor(){

	}


    // 监听器 #3
    async ide4gHour1Process () {
        logger.info('hour1 timer out:', dtime().format('YYYY-MM-DD HH:mm:ss'));

        var queryList = await DB.GatewayIDE4g_Real_Table.find();
        for (var i = 0; i < queryList.length; i++){
            logger.info('hour1 timer out:');

            var updatestr = {
                'device_name': queryList[i].device_name,
                'update_time': queryList[i].update_time,
                'sort_time': queryList[i].sort_time,
                'data': queryList[i].data,
            };

            DB.GatewayIDE4g_Hour_Table.create(updatestr);
        }

    }


    // 监听器 #4
    async ide4gHour24Process () {
        logger.info('hour24 timer out:', dtime().format('YYYY-MM-DD HH:mm:ss'));

        var queryList = await DB.GatewayIDE4g_Real_Table.find();
        for (var i = 0; i < queryList.length; i++){
            logger.info('hour1 timer out:');

            var updatestr = {
                'device_name': queryList[i].device_name,
                'update_time': queryList[i].update_time,
                'sort_time': queryList[i].sort_time,
                'data': queryList[i].data,
            };

            DB.GatewayIDE4g_Day_Table.create(updatestr);
        }
    }


}

const IDE4gTimerHnd = new GatewayIDE4gTimerHandle();

//场景：每小时采样一次，记录历史数据
schedule.scheduleJob('0 0 * * * *', IDE4gTimerHnd.ide4gHour1Process);
//场景：超时失败, 每天夜里12:00进行更新
schedule.scheduleJob('0 30 0 * * *', IDE4gTimerHnd.ide4gHour24Process);

