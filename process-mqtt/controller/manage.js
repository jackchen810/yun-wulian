'use strict';

const mqttClient = require('../../mqttclient/mqttclient.js');
const TaskTable = require('../../models/task/task');
const TaskHandle = require("../../mqttclient/publish/mqtt_task.js");
const MqttSubHandle = require("../../mqttclient/subscribe/mqtt_sub.js");
const logger = require( '../../logs/logs.js');
logger.info('[mqtt] enter here mangehndle');

class ManageUpdateHnd {
    constructor(){
    }

    async mode2_callback(mac, jsonObj){
//	logger.info("start run mode2_callback");
        var task = await TaskTable.find({'mac':mac, $or:[{'cmd_item':'apps'},{'cmd_item':'remote_cmd'}]});
        for(var i=0; i < task.length;i++){
            if(task[i].additions.mode == 2 && task[i].pubsub_status == 'request'){
                var stop_time = new Date(task[i].task_stop_at).getTime();
                if(Date.now() < stop_time){
                    if(task[i].cmd_item == 'apps' && task[i].additions.apps_name == 'mqtt-client' && task[i].additions.apps_version == jsonObj["mqtt-clientversion"]){
                        await TaskTable.findOneAndUpdate({'uuid': task[i].uuid,'mac': task[i].mac,'pubsub_status':'request'},{$set: {'pubsub_status':'response_ok','response_msg':'mqtt-client installed ok!'}});
                    }else{
                        mqttClient.publish(task[i].topic, task[i].request_msg);
                    }
                }else{
                    await TaskTable.findOneAndUpdate({uuid: task[i].uuid},{$set: {'pubsub_status':'response_fail'}});
                }
            }
        }
    }
    async mode3_callback(){
        logger.info('start run mode3_callback');
        var task = await TaskTable.find({$or:[{'cmd_item':'apps'},{'cmd_item':'remote_cmd'}]});
        for(var i=0; i < task.length; i++){
            if(task[i].additions.mode == 3 && task[i].pubsub_status == 'request'){
                var stop_time = new Date(task[i].task_stop_at).getTime();
                if(Date.now() < stop_time){
                    var now = new Date();
                    await TaskHandle.createBatchPublish(task[i].uuid, now.getHours());
                }else{
                    await TaskTable.findOneAndUpdate({uuid: task[i].uuid},{$set: {'pubsub_status':'response_fail'}});
                }
            }
        }
    }
    async mqtt_client_callback(mac, jsonObj) {
        var task = await TaskTable.find({'cmd_item':'apps','mac': mac});
        for(var i=0; i < task.length; i++){
            if(task[i].pubsub_status == 'request' && task[i].additions.apps_name == 'mqtt-client' && task[i].additions.apps_version == jsonObj["mqtt-clientversion"]){
                await TaskTable.findOneAndUpdate({'uuid': task[i].uuid,'mac': task[i].mac,'pubsub_status':'request'},{$set: {'pubsub_status':'response_ok','response_msg':'mqtt-client installed ok!'}});
            }
        }
    }
}
const ManageHandle = new ManageUpdateHnd();

MqttSubHandle.addLoopListener('$SYS', ManageHandle.mode2_callback);
MqttSubHandle.addLoopListener('sysinfo', ManageHandle.mode2_callback);
MqttSubHandle.addLoopListener('sysinfo', ManageHandle.mqtt_client_callback);

