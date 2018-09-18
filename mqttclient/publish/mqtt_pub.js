'use strict';
import mongoose from 'mongoose';
import mqttClient from '../../mqttclient/mqttclient.js';
import TaskHandle from "../../mqttclient/publish/mqtt_task.js"
import dtime from "time-formater";
import config from 'config-lite';



function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

// uuid
function createTaskId() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}




/******************************************************/
class CMD_GET {
    constructor() {

    }

    //共有方法, 发布主题为sysinfo的消息
    async sysinfo(taskHnd){
        var cmdJsonObj = {
            "item":"sysinfo",
            "id": taskHnd.uuid,
        };

        //console.log('send pub:',taskHnd.dest_macs, ", dest_macs is array:", Array.isArray(taskHnd.dest_macs));

        taskHnd.topic_cmd = '/YunAC/CMD_GET/';
        await TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }


}
/******************************************************/
class CMD_SYNC {
    constructor() {

    }

    //共有方法
    async sysync(taskHnd, domainlist_set, maclist_w_set, maclist_b_set, iplist_set, pandomain_add){

        
        var cmdJsonObj = {
            "item":"sysync",
            "id": taskHnd.uuid,
            "domainlist_set":domainlist_set,
            "maclist_w_set":maclist_w_set,
            "maclist_b_set":maclist_b_set,
            "iplist_set":iplist_set,
            "pandomain_add":pandomain_add,
        };

        //console.log(taskHnd,cmdJsonObj);
        taskHnd.topic_cmd = '/YunAC/CMD_SYNC/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }
}
/******************************************************/
class CMD_EXE {
    constructor() {

    }

    //共有方法
    async networkinfo(taskHnd){
        
        var cmdJsonObj = {
            "item":"networkinfo",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async wireless(taskHnd, ssid, channel_2, channel_5, encryption, key){
        
        var cmdJsonObj = {
            "item":"wireless",
            "id": taskHnd.uuid,
            "ssid":ssid,
            "channel_2.4": channel_2,
            "channel_5": channel_5,
            "encryption": encryption,
            "key":key,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async TX_power(taskHnd, value_2, value5){
        
        var cmdJsonObj = {
            "item":"TX_power",
            "id": taskHnd.uuid,
            "value_2":value_2,
            "value5": value5,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async rsyslogserverIP(taskHnd, ip){
        
        var cmdJsonObj = {
            "item":"rsyslogserverIP",
            "id": taskHnd.uuid,
            "ip":ip,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async wifidog(taskHnd, hostname, port, path){
        
        var cmdJsonObj = {
            "item":"wifidog",
            "id": taskHnd.uuid,
            "hostname":hostname,
            "port":port,
            "path":path,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async wifidog_check(taskHnd){
        
        var cmdJsonObj = {
            "item":"wifidog",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async WD_wired_pass(taskHnd, enable){
        
        var cmdJsonObj = {
            "item":"WD_wired_pass",
            "id": taskHnd.uuid,
            "enable":enable,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async WD_roam_switch(taskHnd, enable){
        var cmdJsonObj = {
            "item":"WD_roam_switch",
            "id": taskHnd.uuid,
            "enable":enable,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async WD_NOAUTH(taskHnd, enable){
        
        var cmdJsonObj = {
            "item":"WD_NOAUTH",
            "id": taskHnd.uuid,
            "enable":enable,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async mosquittoserverIP(taskHnd, ip){
        
        var cmdJsonObj = {
            "item":"mosquittoserverIP",
            "id": taskHnd.uuid,
            "ip":ip,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async shell(taskHnd, cmd){
        
        var cmdJsonObj = {
            "item":"shell",
            "id": taskHnd.uuid,
            "cmd":cmd,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async shell64(taskHnd, cmd){
        
        var cmdJsonObj = {
            "item":"shell64",
            "id": taskHnd.uuid,
            "cmd":cmd,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async script(taskHnd, port, url_route, md5){
        
        var cmdJsonObj = {
            "item":"remote_cmd",
            "id": taskHnd.uuid,
            "port": port,
	    "url_route": url_route,
            "md5":md5,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async apps(taskHnd, logo, content){
        
        var cmdJsonObj = {
            "item":"apps",
            "id": taskHnd.uuid,
            "log_opt":"1",
            "logo":logo,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async firmware(taskHnd, firmware_url, firmware_md5, reflash, dest_version){

        var cmdJsonObj = {
            "item":"firmware",
            "id": taskHnd.uuid,
            "sfile":firmware_url,
            "md5":firmware_md5,
            "reflash":reflash,
            "dest_version":dest_version,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        await TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async reboot(taskHnd){
        
        var cmdJsonObj = {
            "item":"reboot",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async network(taskHnd, type){
        
        var cmdJsonObj = {
            "item":"network",
            "id": taskHnd.uuid,
            "type":type,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async passwd(taskHnd, oldpasswd, newpasswd){
        
        var cmdJsonObj = {
            "item":"passwd",
            "id": taskHnd.uuid,
            "oldpasswd":oldpasswd,
            "newpasswd":newpasswd,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async superpasswd(taskHnd, newpasswd){
        
        var cmdJsonObj = {
            "item":"superpasswd",
            "id": taskHnd.uuid,
            "newpasswd":newpasswd,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_EXE/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }
}

/******************************************************/
class CMD_SET {
    constructor() {

    }

    //共有方法
    async domainlist_set(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"domainlist_set",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async domainlist_del(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"domainlist_del",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async domainlist_clear(taskHnd){
        
        var cmdJsonObj = {
            "item":"domainlist_clear",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async pandomain_add(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"pandomain_add",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async pandomain_del(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"pandomain_del",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async pandomain_clear(taskHnd){
        
        var cmdJsonObj = {
            "item":"pandomain_clear",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async iplist_set(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"iplist_set",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async iplist_clear(taskHnd){
        
        var cmdJsonObj = {
            "item":"iplist_clear",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async maclist_w_set(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"maclist_w_set",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async maclist_w_del(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"maclist_w_del",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async maclist_w_clear(taskHnd){
        
        var cmdJsonObj = {
            "item":"maclist_w_clear",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async maclist_b_set(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"maclist_b_set",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async maclist_b_del(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"maclist_b_del",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async maclist_b_clear(taskHnd){
        
        var cmdJsonObj = {
            "item":"maclist_b_clear",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async maclist_b_reset(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"maclist_b_reset",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }
    async channelpath_set(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"channelpath_set",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async channelpath_clear(taskHnd){
        
        var cmdJsonObj = {
            "item":"channelpath_clear",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }


    async blist_mac_get(taskHnd) {
        
        var cmdJsonObj = {
            "item": "blist_mac_get",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async blist_mac_set(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"blist_mac_set",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async blist_mac_del(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"blist_mac_del",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async blist_mac_clear_all(taskHnd) {
        
        var cmdJsonObj = {
            "item": "blist_mac_clear_all",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }



    async blist_domain_get(taskHnd) {
        
        var cmdJsonObj = {
            "item": "blist_domain_get",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async blist_domain_set(taskHnd, content){
        
        var cmdJsonObj = {
            "item":"blist_domain_set",
            "id": taskHnd.uuid,
            "content":content,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async blist_domain_clear_all(taskHnd){
        var cmdJsonObj = {
            "item":"blist_domain_clear_all",
            "id": taskHnd.uuid,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        //TaskHandle.createTaskAndPublish(taskHnd, '/YunAC/CMD_SET/' ,cmdJsonObj);
    }

    async qos_show(taskHnd, client_list, ip_rule, in_net_rule, vip_mac, black_mac){
        
        var cmdJsonObj = {
            "item":"blist_domain_set",
            "id": taskHnd.uuid,
            "client_list":client_list,
            "ip_rule":ip_rule,
            "in_net_rule":in_net_rule,
            "vip_mac":vip_mac,
            "black_mac": black_mac,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }

    async qos_setting(taskHnd, ip_rule, in_net_rule, vip_mac, black_mac){
        
        var cmdJsonObj = {
            "item":"blist_domain_clear_all",
            "id": taskHnd.uuid,
            "ip_rule":ip_rule,
            "in_net_rule":in_net_rule,
            "vip_mac":vip_mac,
            "black_mac": black_mac,
        };

        taskHnd.topic_cmd = '/YunAC/CMD_SET/';
        TaskHandle.createTaskAndPublish(taskHnd ,cmdJsonObj);
        return taskHnd.uuid;
    }
}

//mqtt 命令
function MqttPubHandle() {
    this.BATCH_CMD_GET = this.CMD_GET = new CMD_GET();
    this.BATCH_CMD_SYNC = this.CMD_SYNC = new CMD_SYNC();
    this.BATCH_CMD_EXE = this.CMD_EXE = new CMD_EXE();
    this.BATCH_CMD_SET = this.CMD_SET = new CMD_SET();

}

//设置任务时间选项 ，可选
MqttPubHandle.prototype.setTaskTime = function (taskHnd, expired_time, exec_time) {

    //10年后文档删除，任务记录删除， 单位：年
    var doc_del_time = 10;

    //default =30 day, 单位：小时
    if (typeof(expired_time)=="undefined" || expired_time == null) {
        expired_time = 720;
    }

    if (expired_time >= doc_del_time*365*24) {
        return null, "expired_time is too large"
    }


    var stop_time = new Date();
    if (expired_time == 0) {
        stop_time.setMinutes(stop_time.getMinutes() + 8);
    }
    else{
        stop_time.setHours(stop_time.getHours() + Number(expired_time));
    }

    taskHnd["expired_time"] = expired_time;
    taskHnd["task_exec_time"] = exec_time;
    taskHnd["task_stop_at"] = dtime(stop_time).format('YYYY-MM-DD HH:mm:ss');
};

//设置任务addtions ，可选
MqttPubHandle.prototype.setTaskAdditions = function (taskHnd, additions) {

    //记录一些附加信息，固件升级时，记录升级的目的版本号， 升级模式等
    taskHnd["additions"] = ((typeof(additions)=="undefined") ? null : additions);

};

//设置任务失败，参数：失败原因 ，可选
MqttPubHandle.prototype.setTaskAFaulure = function (taskHnd, fail_reason) {

    //记录一些附加信息，固件升级时，记录升级的目的版本号， 升级模式等
    taskHnd["task_result_info"] = ((typeof(fail_reason)=="undefined") ? '升级失败' : fail_reason);
    taskHnd["task_result"] = 'fail';

};


//需要创建任务使用这个handle
//expired_time 如果null 采用default 值 720小时
//comment default null
//用户 id 和 operator_name 可以不一致
MqttPubHandle.prototype.createTaskHandle = function (user_name, operator_name, dmac) {

    //10年后文档删除，任务记录删除， 单位：年
    var doc_del_time = 10;

    if (typeof(operator_name)=="undefined") {
        operator_name = null;
    }

    //去掉空格， 分割成数组形式
    //"60ACC800ADA2,      60ACC800ADA3, 60ACC800ADA4" ----------》[ '60ACC800ADA2', '60ACC800ADA3', '60ACC800ADA4' ]
    var mac_array = dmac.replace(/[ ]/g, "").replace(/(\r\n)|(\n)/g, ",").split(/[;,]/);
    //去掉最后的空数组元素，如果输入60ACC800ADA2，分割是最后一个元素是''
    if (mac_array[mac_array.length-1] == ''){
        mac_array.pop();
    }
    //数组去重，使用set
    var mac_set_array = Array.from(new Set(mac_array));

    //日期
    var del_time = new Date();
    del_time.setFullYear(del_time.getFullYear() + doc_del_time);

    //console.log('1111111', mac_array);
    //console.log('2222222', mac_set_array);

    //默认是8分钟，为了判断任务不回应的时候超时失败
    var stop_time = new Date();
    stop_time.setMinutes(stop_time.getMinutes() + 8);


    var taskHnd = {
        "uuid": guid(),
        "user_name": user_name,   //用户名，就是渠道名称, user_account
        "operator_name": operator_name,
        "dest_macs": mac_set_array,   //dmac支持数组形式，例如[ '60ACC800ADA2', '60ACC800ADA3', '60ACC800ADA4' ]

        "expired_time": 0,   //default =30 day, 单位：小时
        //任务记录删除时间, 暂时不起作用，如果起作用 models.task.task.js中需要设置TTL：taskSchema.index({doc_del_at: 1}, { expireAfterSeconds:0 } );
        "doc_del_at": dtime(del_time).format('YYYY-MM-DD HH:mm:ss'),   //任务记录删除时间
        "task_stop_at": dtime(stop_time).format('YYYY-MM-DD HH:mm:ss'),   //任务超时时间
        "task_create_at": dtime(new Date()).format('YYYY-MM-DD HH:mm:ss'),   //任务创建时间

        //任务执行时刻【0-24】
        "task_exec_time" : -1,

        //记录一些附加信息，固件升级时，记录升级的目的版本号， 升级模式等
        "additions": null,
        //记录任务结果信息
        "task_result": null,
        "task_result_info": null,
    };

    return taskHnd;
};

//不需要创建任务使用这个handle
MqttPubHandle.prototype.createPublishHandle = function (dmac) {
    //去掉空格， 分割成数组形式
    //"60ACC800ADA2,      60ACC800ADA3, 60ACC800ADA4" ----------》[ '60ACC800ADA2', '60ACC800ADA3', '60ACC800ADA4' ]
    var mac_array = dmac.replace(/[ ]/g, "").replace(/(\r\n)|(\n)/g, ",").split(/[;,]/);
    //去掉最后的空数组元素，如果输入60ACC800ADA2，分割是最后一个元素是''
    if (mac_array[mac_array.length-1] == ''){
        mac_array.pop();
    }
    //数组去重，使用set
    var mac_set_array = Array.from(new Set(mac_array));

    var taskHnd = {
        "uuid": guid(),
        "dest_macs": mac_set_array,   //dmac支持数组形式，例如[ '60ACC800ADA2', '60ACC800ADA3', '60ACC800ADA4' ]
        "only_publish": 1,
    };

    return taskHnd;
};

module.exports = new MqttPubHandle();
//var MqttPubHandle = new MqttPubHnd();
//export {createTaskHandle, MqttPubHandle};

