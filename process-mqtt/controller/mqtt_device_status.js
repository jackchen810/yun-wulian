'use strict';
const config = require( "config-lite");
const MqttSubHandle = require("../../mqttclient/subscribe/mqtt_sub.js");
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');

//每个设备保持记录数
const keep_record_num = config.keep_record_num;


class MqttDeviceStatusHnd {
    constructor(){
        this.updateDeviceStatus = this.updateDeviceStatus.bind(this);

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

const MqttDeviceHnd = new MqttDeviceStatusHnd();


//监听事件some_event
MqttSubHandle.addLoopListener('$SYS', MqttDeviceHnd.updateDeviceStatus);
