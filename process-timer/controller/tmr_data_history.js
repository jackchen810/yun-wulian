'use strict';
const config = require( "config-lite");
const mongoose = require('mongoose');
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');
const schedule = require('node-schedule');

const keep_record_num = config.keep_record_num;


class GatewayTimerHandle {
	constructor(){

	}


    // 监听器 #1
    async hour1BackupProcess () {
        let mytime = new Date();
        logger.info('hour1 timer out:', dtime(mytime).format('YYYY-MM-DD HH:mm:ss'));

        let update_time = dtime(mytime).format('YYYY-MM-DD HH');

        // 将实时数据存储到历史数据库
        let queryList = await DB.Gateway_Real_Table.find();
        for (let i = 0; i < queryList.length; i++){

            //更新每天的汇总统计
            let devunit_name = queryList[i].devunit_name;
            let wherestr = {
                'devunit_name': devunit_name,
                'update_time': update_time,
            };

            let query = await DB.Gateway_Hour_Table.findOne(wherestr).exec();
            if (query == null){
                let updatestr = {
                    'devunit_name': devunit_name,
                    'update_time': update_time,
                    'sort_time': mytime.getTime(),
                    'data': queryList[i].data,
                };
                DB.Gateway_Hour_Table.create(updatestr);
            }


            // 3. 限制数量
            //存最近60条记录,  记录数可配置：keep_record_num
            let wherestr_2 = { 'devunit_name': devunit_name};
            let amount = await DB.Gateway_Hour_Table.count(wherestr_2);
            if (amount > keep_record_num){
                //删除数据， sort_time  单位：ms
                let old_sort_time = mytime.getTime() - keep_record_num * 3600000;
                let wheredel = { 'devunit_name': devunit_name, 'sort_time': {$lt: old_sort_time}};
                //logger.info('delete record of Gateway_Hour_Table, condition:', wheredel);
                DB.Gateway_Hour_Table.deleteMany(wheredel).exec();
            }

        }



    }


    // 监听器 #2
    async day1BackupProcess () {
        let mytime = new Date();
        logger.info('hour24 timer out:', dtime(mytime).format('YYYY-MM-DD HH:mm:ss'));

        let update_time = dtime(mytime).format('YYYY-MM-DD');

        // 将实时数据存储到历史数据库
        let queryList = await DB.Gateway_Real_Table.find();
        for (let i = 0; i < queryList.length; i++){

            //更新每天的汇总统计
            let devunit_name = queryList[i].devunit_name;
            let wherestr = {
                'devunit_name': devunit_name,
                'update_time': update_time,
            };

            let query = await DB.Gateway_Day_Table.findOne(wherestr).exec();
            if (query == null){
                let updatestr = {
                    'devunit_name': devunit_name,
                    'update_time': update_time,
                    'sort_time': mytime.getTime(),
                    'data': queryList[i].data,
                };
                DB.Gateway_Day_Table.create(updatestr);
            }

            // 2. 限制数量
            //存最近60条记录
            let wherestr_2 = { 'devunit_name': devunit_name};
            let amount = await DB.Gateway_Day_Table.count(wherestr_2);
            if (amount > keep_record_num){
                //删除数据， sort_time  单位：ms
                let old_sort_time = mytime.getTime() - keep_record_num * 86400000;
                let wheredel = { 'devunit_name': devunit_name, 'sort_time': {$lt: old_sort_time}};
                //logger.info('delete record of Gateway_Day_Table, condition:', wheredel);
                DB.Gateway_Day_Table.deleteMany(wheredel).exec();
            }

        }
    }


    // 监听器 #3
    async dataAgeProcess () {
        let mytime = new Date();
        logger.info('data age timer out:', dtime(mytime).format('YYYY-MM-DD HH:mm:ss'));


        // 将实时数据进行老化和去重复
        let queryList = await DB.Gateway_Real_Table.find();
        for (let i = 0; i < queryList.length; i++){

            // 1. 删除实时数据中最近1小时不更新的数据
            //删除数据， sort_time  单位：ms
            let limit_time = mytime.getTime() - 3600000;
            if (queryList[i].sort_time < limit_time) {
                //logger.info('delete record of Gateway_Real_Table, limit_time:', limit_time);
                DB.Gateway_Real_Table.findByIdAndRemove(queryList[i]._id).exec();
            }

            // 2. 去重复数据
            let devunit_name = queryList[i].devunit_name;
            let wherestr = { 'devunit_name': devunit_name};
            let count = await DB.Gateway_Real_Table.count(wherestr);
            if (count > 1){
                DB.Gateway_Real_Table.findByIdAndRemove(queryList[i]._id).exec();
            }

        }
    }

    // 监听器 #4
    async minute10BackupProcess () {
        let mytime = new Date();
        logger.info('minute10 timer out:', dtime(mytime).format('YYYY-MM-DD HH:mm:ss'));

        let update_time = dtime(mytime).format('YYYY-MM-DD HH:mm');
        let prefix = 'y' + mytime.getFullYear();


        // 将实时数据存储到历史数据库
        let queryList = await DB.Gateway_Real_Table.find();
        for (let i = 0; i < queryList.length; i++){

            //更新每天的汇总统计
            let devunit_name = queryList[i].devunit_name;
            // 历史数据表名称： y2018jinxi_2
            // 支持每年新生成一个collection
            let minute10Table = mongoose.model(prefix + devunit_name, DB.historySchema);
            let minute10Model = new minute10Table({
                'devunit_name': devunit_name,
                'update_time': update_time,
                'sort_time': mytime.getTime(),
                'data': queryList[i].data,
            });

            minute10Model.save();
        }
    }
    // 监听器 #4
    async minuteTest () {
        logger.info('minute10 test:', dtime().format('YYYY-MM-DD HH:mm:ss'));
        //var db = mongoose.createConnection(URL);
        //mongoose.createConnection("mongodb://localhost:27017/iotks2018", {useMongoClient:true});
        //dbHnd.createConnection("iotks202020")
    }

}

const gwTimerHnd = new GatewayTimerHandle();

/*
*
官方文档：http://crontab.org/
此模块中中cron有一定的差异，时间取值范围，且有六个字段，其中1秒是最精细的粒度。：
        秒：0-59
        分钟：0-59
        小时：0-23
        天：1-31
        月份：0-11（1月至12月）
        星期几：0-6（周日至周六）
*
* 排列顺序：
  秒 分钟 小时 天 月份 星期几
        *为通配符
        -为时间段连接符
        ,号为分隔符，可以在某一节输入多个值
        /号为步进符
*/


//场景：每小时采样一次，记录历史数据, 0, 30 分的时候，更新两次，增加可靠性
schedule.scheduleJob('0 0,30 * * * *', gwTimerHnd.hour1BackupProcess);
//场景：超时失败, 每天夜里12:00, 中午12:00进行更新, 更新两次，增加可靠性
schedule.scheduleJob('0 0 0,12 * * *', gwTimerHnd.day1BackupProcess);
//场景：每半个小时，实时数据老化一次， 去重一次
schedule.scheduleJob('10 15,35,55 * * * *', gwTimerHnd.dataAgeProcess);
//场景：每10分钟执行一次, 存储历史数据，生成devunit_name 命名的数据集合
schedule.scheduleJob('3 */10 * * * *', gwTimerHnd.minute10BackupProcess);
//场景：test
//schedule.scheduleJob('3 */2 * * * *', gwTimerHnd.minuteTest);

