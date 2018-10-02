'use strict';
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');
const schedule = require('node-schedule');

const keep_record_num = 60;


class GatewayIDE4gTimerHandle {
	constructor(){

	}


    // 监听器 #3
    async ide4gHour1Process () {
        logger.info('hour1 timer out:', dtime().format('YYYY-MM-DD HH:mm:ss'));

        var mytime = new Date();
        var update_time = dtime(mytime).format('YYYY-MM-DD HH:mm');

        // 将实时数据存储到历史数据库
        var queryList = await DB.GatewayIDE4g_Real_Table.find();
        for (var i = 0; i < queryList.length; i++){

            //更新每天的汇总统计
            var wherestr = {
                'device_name': queryList[i].device_name,
                'update_time': update_time,
            };

            var query = await DB.GatewayIDE4g_Hour_Table.findOne(wherestr).exec();
            if (query == null){
                var updatestr = {
                    'device_name': queryList[i].device_name,
                    'update_time': update_time,
                    'sort_time': queryList[i].sort_time,
                    'data': queryList[i].data,
                };
                DB.GatewayIDE4g_Hour_Table.create(updatestr);
            }

            // 2. 限制数量
            //存最近60条记录
            var wherestr = { 'device_name': device_name};
            var amount = await DB.GatewayIDE4g_Hour_Table.count(wherestr);
            if (amount > keep_record_num){
                //删除数据， sort_time  单位：ms
                var old_sort_time = mytime.getTime() - keep_record_num * 60000;
                var wherestr = { 'device_name': device_name, 'sort_time': {$lt: old_sort_time}};
                //logger.info('delete record of GatewayIDE4g_Hour_Table, condition:', wherestr);
                DB.GatewayIDE4g_Hour_Table.deleteMany(wherestr).exec();
            }

        }



    }


    // 监听器 #4
    async ide4gHour24Process () {
        logger.info('hour24 timer out:', dtime().format('YYYY-MM-DD HH:mm:ss'));

        var mytime = new Date();
        var update_time = dtime(mytime).format('YYYY-MM-DD HH');

        // 将实时数据存储到历史数据库
        var queryList = await DB.GatewayIDE4g_Real_Table.find();
        for (var i = 0; i < queryList.length; i++){

            //更新每天的汇总统计
            var wherestr = {
                'device_name': queryList[i].device_name,
                'update_time': update_time,
            };

            var query = await DB.GatewayIDE4g_Day_Table.findOne(wherestr).exec();
            if (query == null){
                var updatestr = {
                    'device_name': queryList[i].device_name,
                    'update_time': update_time,
                    'sort_time': queryList[i].sort_time,
                    'data': queryList[i].data,
                };
                DB.GatewayIDE4g_Day_Table.create(updatestr);
            }

            // 2. 限制数量
            //存最近60条记录
            var wherestr = { 'device_name': device_name};
            var amount = await DB.GatewayIDE4g_Day_Table.count(wherestr);
            if (amount > keep_record_num){
                //删除数据， sort_time  单位：ms
                var old_sort_time = mytime.getTime() - keep_record_num * 60000;
                var wherestr = { 'device_name': device_name, 'sort_time': {$lt: old_sort_time}};
                //logger.info('delete record of GatewayIDE4g_Hour_Table, condition:', wherestr);
                DB.GatewayIDE4g_Day_Table.deleteMany(wherestr).exec();
            }

        }
    }


}

const IDE4gTimerHnd = new GatewayIDE4gTimerHandle();

//场景：每小时采样一次，记录历史数据, 0, 30 分的时候，更新两次，增加可靠性
schedule.scheduleJob('0 0,30 * * * *', IDE4gTimerHnd.ide4gHour1Process);
//场景：超时失败, 每天夜里12:00, 中午12:00进行更新, 更新两次，增加可靠性
schedule.scheduleJob('0 0 0,12 * * *', IDE4gTimerHnd.ide4gHour24Process);

