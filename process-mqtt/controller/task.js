'use strict';
const MqttSubHandle = require("../../mqttclient/subscribe/mqtt_sub.js");
const DB = require( "../../models/models.js");
const dtime = require( 'time-formater');
const logger = require( '../../logs/logs.js');

var updateResponse = async function (mac, josnObj, jsonMsg) {
    //logger.info('Hello updateResponse:', jsonMsg);

    //uuid 有效性检查
    var uuid = josnObj['id'];
    if (uuid[8] != '-' && uuid[13] != '-' && uuid[18] != '-' && uuid[23] != '-'){
        return;
    }

    //logger.info('newJsonMsg',newJsonMsg);
    var wherestr = {'uuid': uuid, 'mac': mac, 'pubsub_status': 'request'};

    //成功的状态为0
    if (josnObj['state'] == '0'){
        var updatestr = {
            //response ok;   response fail
            //"task_result":不在这里更新,  //任务是全流程状态，pubsub_status 仅表示路由器回应的状态
            "pubsub_status":"response_ok",
            'response_msg': jsonMsg,
            'response_timestamp':dtime().format('YYYY-MM-DD HH:mm:ss'),
        };
    }
    else if (josnObj['state'] == '-1'){
        var updatestr = {
            //response ok;   response fail
            //"task_result":不在这里更新,  //任务是全流程状态，pubsub_status 仅表示路由器回应的状态
            "pubsub_status":"response_fail",
            'response_msg': jsonMsg,
            'response_timestamp':dtime().format('YYYY-MM-DD HH:mm:ss'),
        };
    }
    else{
        var updatestr = {
            'response_msg': jsonMsg,
            'response_timestamp':dtime().format('YYYY-MM-DD HH:mm:ss'),
        };
    }

    // 更新response msg, 如果升级ok的话就不更新
    await DB.TaskTable.findOneAndUpdate(wherestr, updatestr).exec();
};


//监听事件some_event, 更新mqtt的回应状态
MqttSubHandle.addLoopListener('task', updateResponse);