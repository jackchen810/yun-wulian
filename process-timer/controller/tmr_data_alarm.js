'use strict';
const config = require( "config-lite");
const mongoose = require('mongoose');
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');
const schedule = require('node-schedule');



class LogTimerHandle {
	constructor(){
        this.trigger_process = this.trigger_process.bind(this);
        this.trigger_reactor = this.trigger_reactor.bind(this);
        this.minute1_AlarmOperateLogProcess = this.minute1_AlarmOperateLogProcess.bind(this);
        //var s1 = new Set(); // 空Set
        this.trigger_tbl =  new Map();

        //从日志记录里恢复记录信息到内存，hash表记录日志的触发信息，防治统一信息重复记录
        this.recover_run_table();
        this.recover_alarm_table();

	}


    async recover_run_table(){

        //参数有效性检查
        let queryList = await DB.DevunitRunLogsTable.find().sort({"sort_time":1}).limit(200).exec();
        if (queryList.length == 0) {
            return;
        }

        // /实时数据中的变量列表
        for(let n = 0; n < queryList.length; n++) {
            console.log("recover_run_table update_time:", queryList[n].update_time);
            let var_value = queryList[n].var_value;
            let hash_key = queryList[n].dev_cn_name + queryList[n].devunit_name + queryList[n].var_name;
            this.trigger_tbl.set(hash_key, var_value);
        }
	}

    async recover_alarm_table(){

        //参数有效性检查
        let queryList = await DB.DevunitAlarmLogsTable.find().sort({"sort_time":1}).limit(200).exec();
        if (queryList.length == 0) {
            return;
        }

        // /实时数据中的变量列表
        for(let n = 0; n < queryList.length; n++) {
            console.log("recover_alarm_table update_time:", queryList[n].update_time);
            let var_value = queryList[n].var_value;
            let hash_key = queryList[n].dev_cn_name + queryList[n].devunit_name + queryList[n].var_name;
            this.trigger_tbl.set(hash_key, var_value);
        }
    }
    async trigger_reactor(number1, if_operate_symbol, number2){

	    if (if_operate_symbol == '>' && number1 > number2){
            return true;
        }
        else if (if_operate_symbol == '<' && number1 < number2){
            return true;
        }
        else if (if_operate_symbol == '=' && number1 == number2){
            return true;
        }
        else if (if_operate_symbol == '!=' && number1 != number2){
            return true;
        }
        else{
	        return false;
        }

    }



    async trigger_process (devunit_name, varList) {
        let mytime = new Date();
        let update_time = dtime(mytime).format('YYYY-MM-DD HH:mm:ss');


        //console.log("[timer][alarmlog] scan trigger list， devunit_name:", devunit_name);
        let wherestr = {'devunit_name': devunit_name};

        //触发器的列表
        let triggerList = await DB.DevunitTriggerTable.find(wherestr).exec();
        if (triggerList.length == 0){
            return;
        }

        //console.log("[timer][alarmlog] query trigger list::", triggerList);

        //遍历触发器，挨个判断触发项
        for(let m = 0; m < triggerList.length; m++){
            let dev_cn_name = triggerList[m].dev_cn_name;
            let var_name = triggerList[m].var_name;
            let number2 = triggerList[m].if_number;
            let logs_type = triggerList[m].logs_type;
            let if_operate_symbol = triggerList[m].if_symbol;
            let if_true_comment = triggerList[m].if_true_comment;
            let if_false_comment = triggerList[m].if_false_comment;

            console.log("[timer][alarmlog], logs_type:", logs_type, ", var_name:", var_name);
            //let varList = realList.data;
            // /实时数据中的变量列表
            for(let n = 0; n < varList.length; n++){
                if (var_name != varList[n].varName){
                    continue;
                }

                let var_value = varList[n].varValue;
                //let hash_key = { devunit_name: devunit_name,  varName: varName};
                let hash_key = dev_cn_name + devunit_name + var_name;
                //let save_value = this.trigger_tbl.get(hash_key);
                //let aaa = this.trigger_tbl.has(hash_key);
                let save_value = this.trigger_tbl.get(hash_key);


                //console.log("[timer][alarmlog], query hashdata， keys:", this.trigger_tbl.keys());
                //console.log("[timer][alarmlog], query hashdata， aaa:", aaa);
                //console.log("[timer][alarmlog], query hashdata， size:", this.trigger_tbl.size);
                console.log("[timer][alarmlog], query hashdata， hash_key:", hash_key);
                console.log("[timer][alarmlog], query hashdata， save_value:", save_value, ", var_value:", var_value);

                //说明数据和上次没有变化，就不记录日志了
                if (save_value == var_value){
                    continue;
                }
                else{
                    //保存这个数据，hash表
                    //这个hash表防治重复记录日志
                    this.trigger_tbl.set(hash_key, var_value);
                    //let value = this.trigger_tbl.get(hash_key);
                    //console.log("[timer][alarmlog], add tbl， hash_key:", hash_key, ", value:", value);
                }


                // 数据有变化，根据触发条件记录日志
                let updatestr = {
                    'dev_cn_name': dev_cn_name,
                    'devunit_name': devunit_name,
                    'var_name': var_name,
                    'var_value': var_value,
                    'comment': '',
                    'sort_time': mytime.getTime(),
                    'update_time': update_time,
                };

                // 触发器判断， if判断   if true 的判断
                if (this.trigger_reactor(var_value, if_operate_symbol, number2) && if_true_comment.length > 0){
                    //记录日志
                    updatestr['comment'] = if_true_comment;
                }

                // 触发器判断, else 判断
                if ( !this.trigger_reactor(var_value, if_operate_symbol, number2) && if_false_comment.length > 0){
                    //记录日志
                    updatestr['comment'] = if_false_comment;
                }

                // 记录日志到数据库
                if (updatestr['comment'] != ''){
                    console.log("[timer][alarmlog], record log, devunit_name:", devunit_name," comment:", updatestr['comment']);
                    console.log("[timer][alarmlog], record log, logs_type:", logs_type," comment:", updatestr['comment']);

                    if(logs_type == '告警日志') {
                        //生成告警日志
                        DB.DevunitAlarmLogsTable.create(updatestr);
                    }
                    else if(logs_type == '运行日志') {
                        //生成告警日志
                        DB.DevunitRunLogsTable.create(updatestr);
                    }
                }
            }
        }
    }

    // 监听器 #1
    async minute1_AlarmOperateLogProcess () {
        let mytime = new Date();
        logger.info('[timer][alarmlog] minute10 timer out:', dtime(mytime).format('YYYY-MM-DD HH:mm:ss'));
        //return;

        //let update_time = dtime(mytime).format('YYYY-MM-DD HH:mm:ss');

        // 将实时数据存储到历史数据库
        let realList = await DB.Gateway_Real_Table.find();
        for (let i = 0; i < realList.length; i++){

            //按照实时表里有的设备查找触发器进行
            let devunit_name = realList[i].devunit_name;
            let var_list = realList[i].data;
            this.trigger_process(devunit_name, var_list);
        }

    }


}

const logTimerHandle = new LogTimerHandle();

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


//场景：每10分钟执行一次, 存储历史数据，生成devunit_name 命名的数据集合
schedule.scheduleJob('31 * * * * *', logTimerHandle.minute1_AlarmOperateLogProcess);
//场景：test
//schedule.scheduleJob('3 */2 * * * *', gwTimerHnd.minuteTest);

