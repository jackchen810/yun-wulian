'use strict';
const config = require( "config-lite");
const MqttSubHandle = require("../../mqttclient/subscribe/mqtt_sub.js");
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');

//每个设备保持记录数
const keep_record_num = config.keep_record_num;


class MqttDeviceIDE4gHandle {
    constructor(){

    }


    // 监听器 #1 ,  每分钟更新1次
    // device_name
    async updateDeviceInfo (device_name, josnObj) {
        logger.info('Hello idjc updateDeviceInfo:', device_name, JSON.stringify(josnObj));

        // 功率值矫正
        if (josnObj.data.hasOwnProperty('C1_D1') && device_name == 'jinxi_1') {                 //判断C1_D1是否存在于obj里面
            for (var i = 0; i < josnObj.data['C1_D1'].length; i++) {
                if (josnObj.data['C1_D1'][i].id == 'Tag_gonglv') {
                    josnObj.data['C1_D1'][i].value = josnObj.data['C1_D1'][i].value / 2;
                    break;
                }
            }
        }
        else if (josnObj.data.hasOwnProperty('C2_D1') && device_name == 'jinxi_2') {                 //判断C2_D1是否存在于obj里面
            for (let i = 0; i < josnObj.data['C2_D1'].length; i++) {
                if (josnObj.data['C2_D1'][i].id == 'Tag_gonglv') {
                    josnObj.data['C2_D1'][i].value = josnObj.data['C2_D1'][i].value / 2;
                    break;
                }
            }
        }
        else if (josnObj.data.hasOwnProperty('C3_D1') && device_name == 'jinxi_3') {                 //判断C3_D1是否存在于obj里面
            for (let i = 0; i < josnObj.data['C3_D1'].length; i++) {
                if (josnObj.data['C3_D1'][i].id == 'Tag_gonglv') {
                    josnObj.data['C3_D1'][i].value = josnObj.data['C3_D1'][i].value / 2;
                    break;
                }
            }
        }

        // 1. 更新到设备数据库，sysinfo库
        //SysinfoTable
        let mytime = new Date();
        let wherestr = { 'device_name': device_name};
        let updatestr = {
            'device_name': device_name,
            'device_local': josnObj['sn'],
            'device_type': 'aidejiachuang',
            'device_link_status': 'online',
            'update_time':dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
            'sort_time':mytime.getTime(),
            'logs': [],
            'data': josnObj['data'],
        };

        DB.Gateway_Real_Table.findOneAndUpdate(wherestr, updatestr).exec(function (err, doc) {
            if (doc == null){
                logger.info('doc is null');
                DB.Gateway_Real_Table.create(updatestr);
            }
        });




        // 2. 更新到设备历史数据库，Gateway_Minute_Table
        logger.info('Hello recordDeviceHistoryInfo');
        DB.Gateway_Minute_Table.create(updatestr);


        //存最近60条记录
        let amount = await DB.Gateway_Minute_Table.count(wherestr);
        if (amount > keep_record_num){
            //删除数据， sort_time  单位：ms
            let old_sort_time = mytime.getTime() - keep_record_num * 60000;
            let wheredel = { 'device_name': device_name, 'sort_time': {$lt: old_sort_time}};
            logger.info('delete record of Gateway_Minute_Table, condition:', wheredel);
            DB.Gateway_Minute_Table.deleteMany(wheredel).exec();
        }

    }


    // 监听器 #2
    //
    async updateDeviceStatus(device_name, status) {
        //logger.info('Hello updateDeviceStatus:', status);
        let mytime = new Date();

        //更新到设备数据库
        let wherestr = {'device_name': device_name};
        let updatestr = {
            'device_name': device_name,
            'device_link_status': status,
            'update_time':dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
            'sort_time':mytime.getTime(),
            'logs': [],
        };

        let query = await DB.Gateway_Real_Table.findOne(wherestr).exec();
        if (query != null){
            //复制数组，logs记录上下线日志
            updatestr['logs'] = query['logs'].slice();
            updatestr['logs'].push(updatestr['update_time'] + ' ' + status);
            if (updatestr['logs'].length > 10){
                updatestr['logs'].shift();  //删除数组第一个元素
            }
            await DB.Gateway_Real_Table.findByIdAndUpdate(query['_id'], updatestr).exec();
        }
    };


}

const MqttDeviceIDE4gHnd = new MqttDeviceIDE4gHandle();


//监听事件some_event
MqttSubHandle.addLoopListener('yunWL', MqttDeviceIDE4gHnd.updateDeviceInfo);
MqttSubHandle.addLoopListener('$SYS', MqttDeviceIDE4gHnd.updateDeviceStatus);
