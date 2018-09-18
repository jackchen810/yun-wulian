'use strict';
const MqttSubHandle = require("../../mqttclient/subscribe/mqtt_sub.js");
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');


// 监听器 #1
const updateSysinfo = async function (mac, josnObj) {
    //logger.info('Hello updateSysinfo:', JSON.stringify(josnObj));

    //更新到设备数据库，sysinfo库
    //SysinfoTable
    var wherestr = { 'mac': josnObj['mac']};
    DB.SysinfoTable.findOneAndUpdate(wherestr, josnObj).exec(function (err, doc) {
        if (doc == null){
            //logger.info('query is null');
            DB.SysinfoTable.create(josnObj);
        }
    });
};

// 监听器 #1
const updateOnlineDevice = async function (mac, josnObj) {
    //logger.info('Hello updateOnlineDevice:', JSON.stringify(josnObj));

    var mytime = new Date();

    //更新到设备数据库， 设备上线，下线
    var wherestr = {'mac': mac};
    var updatestr = {
        'mac': mac,
        'status': 'online',
        'dev_type': josnObj.boardtype,   //设备型号
        'old_rom_version': '',   //	旧的固件版本
        'rom_version': josnObj.fwversion,   //	固件版本
        'printer_status': 'default',   //打印机状态
        'box51_status': 'default',   //51盒子状态
        'update_time':dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
        'sort_time':mytime.getTime()
    };

    //如果采用返回值得形式，必须的await
    var query = await DB.DeviceTable.findOne(wherestr).exec();
    if (query != null){
        if (query['rom_version'] != josnObj.fwversion){
            updatestr['old_rom_version'] = query['rom_version'];
            await DB.DeviceTable.findByIdAndUpdate(query['_id'], updatestr).exec();
        }
        else if (query['dev_type'] != josnObj.boardtype){
            await DB.DeviceTable.findByIdAndUpdate(query['_id'], {'dev_type': josnObj.boardtype}).exec();
        }
    }
    else{
        await DB.DeviceTable.create(updatestr);
    }
};


// 监听器 #1
const updatDeviceStatus = async function (mac, status) {
    //logger.info('Hello updatDeviceStatus:', status);
    var mytime = new Date();

    //更新到设备数据库
    var wherestr = {'mac': mac};
    var updatestr = {
        'mac': mac,
        'status': status,
        'update_time':dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
        'sort_time':mytime.getTime(),
        'logs': [],
    };

    var query = await DB.DeviceTable.findOne(wherestr).exec();
    if (query != null){
        //复制数组，logs记录上下线日志
        updatestr['logs'] = query['logs'].slice();
        updatestr['logs'].push(updatestr['update_time'] + ' ' + status);
        if (updatestr['logs'].length > 10){
            updatestr['logs'].shift();  //删除数组第一个元素
        }
        await DB.DeviceTable.findByIdAndUpdate(query['_id'], updatestr).exec();
    }
};


//监听事件some_event
MqttSubHandle.addLoopListener('sysinfo', updateSysinfo);
MqttSubHandle.addLoopListener('sysinfo', updateOnlineDevice);
MqttSubHandle.addLoopListener('$SYS', updatDeviceStatus);
