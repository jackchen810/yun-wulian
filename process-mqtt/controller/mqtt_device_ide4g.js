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
        this.updateDeviceInfo = this.updateDeviceInfo.bind(this);

    }


    // 监听器 #1 ,  每分钟更新1次
    // devunit_name
    async updateDeviceInfo (devunit_name, josnObj) {
        let mytime = new Date();
        logger.info('Hello idjc:', dtime(mytime).format('YYYY-MM-DD HH:mm:ss'), devunit_name, JSON.stringify(josnObj));

        // 功率值矫正
        if (josnObj.data.hasOwnProperty('C1_D1') && devunit_name == 'jinxi_1') {                 //判断C1_D1是否存在于obj里面
            for (var i = 0; i < josnObj.data['C1_D1'].length; i++) {
                if (josnObj.data['C1_D1'][i].id == 'Tag_gonglv') {
                    josnObj.data['C1_D1'][i].value = josnObj.data['C1_D1'][i].value / 2;
                    break;
                }
            }
        }
        else if (josnObj.data.hasOwnProperty('C2_D1') && devunit_name == 'jinxi_2') {                 //判断C2_D1是否存在于obj里面
            for (let i = 0; i < josnObj.data['C2_D1'].length; i++) {
                if (josnObj.data['C2_D1'][i].id == 'Tag_gonglv') {
                    josnObj.data['C2_D1'][i].value = josnObj.data['C2_D1'][i].value / 2;
                    break;
                }
            }
        }
        else if (josnObj.data.hasOwnProperty('C3_D1') && devunit_name == 'jinxi_3') {                 //判断C3_D1是否存在于obj里面
            for (let i = 0; i < josnObj.data['C3_D1'].length; i++) {
                if (josnObj.data['C3_D1'][i].id == 'Tag_gonglv') {
                    josnObj.data['C3_D1'][i].value = josnObj.data['C3_D1'][i].value / 2;
                    break;
                }
            }
        }

        // 1. 更新到设备数据库，sysinfo库
        //SysinfoTable
        let wherestr = { 'devunit_name': devunit_name};
        let updatestr = {
            'devunit_name': devunit_name,
            'devunit_local': josnObj['sn'],
            'devunit_type': 'aidejiachuang',
            'devunit_link_status': 'online',
            'update_time':dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
            'sort_time':mytime.getTime(),
            'logs': [],
            'data': josnObj['data'],
        };

        await DB.Gateway_Real_Table.findOneAndUpdate(wherestr, updatestr,{upsert: true}).exec();




        // 2. 更新到设备历史数据库，Gateway_Minute_Table
        logger.info('Hello recordDeviceHistoryInfo');
        DB.Gateway_Minute_Table.create(updatestr);

        /*
        //存最近60条记录
        let amount = await DB.Gateway_Minute_Table.count(wherestr);
        if (amount > keep_record_num){
            //删除数据， sort_time  单位：ms
            let old_sort_time = mytime.getTime() - keep_record_num * 60000;
            let wheredel = { 'devunit_name': devunit_name, 'sort_time': {$lt: old_sort_time}};
            logger.info('delete record of Gateway_Minute_Table, condition:', wheredel);
            DB.Gateway_Minute_Table.deleteMany(wheredel).exec();
        }
        */

    }


    // 监听器 #1 ,  每分钟更新1次
    // devunit_name
    async updateDeviceInfoADJC (devunit_name, josnObj) {
        let mytime = new Date();
        logger.info('Hello idjc:', dtime(mytime).format('YYYY-MM-DD HH:mm:ss'), devunit_name, JSON.stringify(josnObj));

        // 1.0
        let channel_name = '';
        for(let item in josnObj['data']){
            channel_name = item;
            break;
        }

        //检查
        if (!josnObj['data'].hasOwnProperty(channel_name)){
            return;
        }

        let ch_list = josnObj['data'][channel_name];
        let varList = [];
        for (let i = 0; i < ch_list.length; i++) {
            // 津西设备的功率值矫正
            if (ch_list[i].id == 'Tag_gonglv' && (devunit_name == 'jinxi_1' || devunit_name == 'jinxi_2' || devunit_name == 'jinxi_3')) {
                ch_list[i].value = ch_list[i].value / 2;
            }

            //转换存储格式
            varList[i] = {
                'varId': ch_list[i].id,
                'varName': ch_list[i].desc,
                'varValue': ch_list[i].value,
            };
        }


        // 2. 更新到设备数据库，sysinfo库
        //SysinfoTable
        let wherestr = { 'devunit_name': devunit_name};
        let updatestr = {
            'devunit_name': devunit_name,
            'devunit_sn': josnObj['sn'],
            'devunit_type': 'aidejiachuang',
            'devunit_link_status': 'online',
            'update_time':dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
            'sort_time':mytime.getTime(),
            'logs': [],
            'data': varList,
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
            let wheredel = { 'devunit_name': devunit_name, 'sort_time': {$lt: old_sort_time}};
            logger.info('delete record of Gateway_Minute_Table, condition:', wheredel);
            DB.Gateway_Minute_Table.deleteMany(wheredel).exec();
        }

    }



    // 监听器 #2
    //
    async updateDeviceStatus(devunit_name, status) {
        //logger.info('Hello updateDeviceStatus:', status);
        let mytime = new Date();

        //更新到设备数据库
        let wherestr = {'devunit_name': devunit_name};
        let updatestr = {
            'devunit_name': devunit_name,
            'devunit_link_status': status,
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
MqttSubHandle.addLoopListener('yunWL', MqttDeviceIDE4gHnd.updateDeviceInfoADJC);
MqttSubHandle.addLoopListener('yunADJC', MqttDeviceIDE4gHnd.updateDeviceInfoADJC);
MqttSubHandle.addLoopListener('$SYS', MqttDeviceIDE4gHnd.updateDeviceStatus);
