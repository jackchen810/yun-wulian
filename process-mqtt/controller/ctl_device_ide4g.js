'use strict';
const MqttSubHandle = require("../../mqttclient/subscribe/mqtt_sub.js");
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');


// 监听器 #1
const updateDeviceInfo = async function (device_name, josnObj) {
    logger.info('Hello updateDeviceInfo:', JSON.stringify(josnObj));

    //更新到设备数据库，sysinfo库
    //SysinfoTable
    var mytime = new Date();
    var wherestr = { 'device_name': device_name};
    var updatestr = {
        'device_name': device_name,
        'device_local': josnObj['sn'],
        'device_link_status': 'online',
        'update_time':dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
        'sort_time':mytime.getTime(),
        'logs': [],
        'data': josnObj['data'],
    };

    DB.GatewayIDE4gTable.findOneAndUpdate(wherestr, updatestr).exec(function (err, doc) {
        if (doc == null){
            logger.info('doc is null');
            DB.GatewayIDE4gTable.create(updatestr);
        }
    });
};

// 监听器 #1
const updatDeviceStatus = async function (device_name, status) {
    //logger.info('Hello updatDeviceStatus:', status);
    var mytime = new Date();

    //更新到设备数据库
    var wherestr = {'device_name': device_name};
    var updatestr = {
        'device_name': device_name,
        'device_link_status': status,
        'update_time':dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
        'sort_time':mytime.getTime(),
        'logs': [],
    };

    var query = await DB.GatewayIDE4gTable.findOne(wherestr).exec();
    if (query != null){
        //复制数组，logs记录上下线日志
        updatestr['logs'] = query['logs'].slice();
        updatestr['logs'].push(updatestr['update_time'] + ' ' + status);
        if (updatestr['logs'].length > 10){
            updatestr['logs'].shift();  //删除数组第一个元素
        }
        await DB.GatewayIDE4gTable.findByIdAndUpdate(query['_id'], updatestr).exec();
    }
};


//监听事件some_event
MqttSubHandle.addLoopListener('post', updateDeviceInfo);
MqttSubHandle.addLoopListener('$SYS', updatDeviceStatus);
