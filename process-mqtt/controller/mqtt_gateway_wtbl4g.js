'use strict';
const config = require( "config-lite");
const MqttSubHandle = require("../../mqttclient/subscribe/mqtt_sub.js");
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');
const mqtt_rxtx = require( '../mqtter_rxtx.js');

//每个设备保持记录数
const keep_record_num = config.keep_record_num;


class MqttDeviceWTBL4gHndle {
    constructor(){
        //var s1 = new Set(); // 空Set
        this.hash_data =  new Map();

        this.deviceMessageProcess = this.deviceMessageProcess.bind(this);
        this.updateDeviceInfo = this.updateDeviceInfo.bind(this);
        //this.hash_data = this.hash_data.bind(this);

    }


    // 监听器 #1 ,  每分钟更新1次
    // devunit_name
    async deviceMessageProcess (devunit_name, josnObj) {

        if (!josnObj.hasOwnProperty('cmdId')){
            return;
        }


        //cmdId = 103  :   数据上报

        //cmdId = 87  :   写变量
        //cmdId = 88  :   写变量返回

        //cmdId = 89  :   读取配置信息
        //cmdId = 90  :   读取配置信息返回
        //数据上报在mqtt进程进行处理
        switch (josnObj['cmdId']){
            case 103:
                if (josnObj.hasOwnProperty('devList')){
                    this.updateDeviceInfo(devunit_name, josnObj);
                }
                break;
            case 88:
                //将命令行的回应消息发到http进程
                mqtt_rxtx.send(josnObj, "88", "response", "http");
                break;
            case 1:
                break;
        }


    }

    // 监听器 #1 ,  每分钟更新1次
    // devunit_name
    async updateDeviceInfo (dev_name, josnObj) {
        let mytime = new Date();
        logger.info('Hello wtbl:', dtime(mytime).format('YYYY-MM-DD HH:mm:ss'), dev_name, JSON.stringify(josnObj));
        //console.log('gwSn:', josnObj['gwSn']);

        // 1. 更新到设备数据库，sysinfo库
        //SysinfoTable， 这里使用devNo合成
        let devunit_name = dev_name + '_' + josnObj['devList'][0]['devNo'];
        let devunit_id = josnObj['devList'][0]['devId'];

        let map_value_obj = this.hash_data.get(devunit_name);
        //console.log('map_value_obj:', map_value_obj);
        if(!map_value_obj){
            map_value_obj = {
                'devunit_name': devunit_name,
                'list_data': new Map(),   //hash表中, 示例{ varName: '故障信号36',varValue: '0',readTime: '2020-03-19 23:25:10',varId: 70,isWarn: 0 }
                'update_time':mytime.getTime(),
            };
        }

        /// 向hash表中添加数据
        for(let item of josnObj['devList'][0]['varList']) {
            //console.log('item:', item);
            //{key, value}，{key, value}
            map_value_obj['list_data'].set(item.varName, item);
        }

        //console.log('add list length:', josnObj['devList'][0]['varList'].length);
        //console.log('map_value_obj size:', map_value_obj['list_data'].size);
        //console.log('map_value_obj set[]:', [...map_value_obj['list_data'].values()]);


        // 1.保存到hash表中
        this.hash_data.set(devunit_name, map_value_obj);

        // 防止重复进入，wtbl数据网关上送如果太大会拆分成两个包
        if (map_value_obj['list_data'].get('update_time') + 30000 > mytime.getTime()){
            logger.info('Hello wtbl exit, repeat into');
            return;
        }

        //var maplist = map_value_obj['list_data'].values();
        //console.log('map_value_obj set[]:', maplist);

        // 1. 更新到设备数据库，Gateway_Real_Table
        let wherestr = { 'devunit_name': devunit_name};
        let updatestr = {
            'devunit_name': devunit_name,
            'devunit_id': devunit_id,
            'devunit_local': devunit_name,
            'gateway_sn': josnObj['gwSn'],
            'devunit_type': 'wutongbolian',
            'devunit_link_status': 'online',
            'update_time':dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
            'sort_time':mytime.getTime(),
            'logs': [],
            'data': [...map_value_obj['list_data'].values()],   //集合
        };

        //console.log('Gateway_Real_Table data:', updatestr['data']);
        //console.log('Gateway_Real_Table data:', map_value_obj['list_data'].values());
        await DB.Gateway_Real_Table.findOneAndUpdate(wherestr, updatestr,{upsert: true}).exec();


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


        //4.将命令行的回应消息发到timer进程，做告警和动作的日志记录
        //mqtt_rxtx.send([...maplist], "realdata", "trigger", "timer");


        logger.info('Hello wtbl exit');
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

const MqttDeviceWTBL4gHnd = new MqttDeviceWTBL4gHndle();


//监听事件some_event
MqttSubHandle.addLoopListener('yunWTBL', MqttDeviceWTBL4gHnd.deviceMessageProcess);
//MqttSubHandle.addLoopListener('$SYS', MqttDeviceWTBL4gHnd.updateDeviceStatus);
