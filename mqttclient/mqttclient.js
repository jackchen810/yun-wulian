'use strict'


/** ************************** IMPORTANT NOTE ***********************************
 The certificate used on this example has been generated for a host named stark.
 So as host we SHOULD use stark if we want the server to be authorized.
 For testing this we should add on the computer running this example a line on
 the hosts file:
 /etc/hosts [UNIX]
 OR
 \System32\drivers\etc\hosts [Windows]
 The line to add on the file should be as follows:
 <the ip address of the server> stark
 ******************************************************************************/
const mqtt = require('mqtt');
const config = require('config-lite');

var fs = require('fs')
var path = require('path')
/*
var KEY = fs.readFileSync(path.join(__dirname, '/files/apfree.key'))
var CERT = fs.readFileSync(path.join(__dirname, '/files/apfree.crt'))
var TRUSTED_CA_LIST = fs.readFileSync(path.join(__dirname, '/files/apfree.ca'))

var PORT = 8883;
//var HOST = 'emqtt.kunteng.org'
var HOST = '192.168.99.227'

var options = {
    protocol:'mqtt',
    port: PORT,
    host: HOST,
    key: KEY,
    cert: CERT,
    rejectUnauthorized: false,
    // The CA list will be used to determine if server is authorized
    ca: TRUSTED_CA_LIST
};
*/

var options = {
    protocol:config.mqtt.protocol,
    port: config.mqtt.port,
    host: config.mqtt.host,

    username: config.mqtt.username,
    key: fs.readFileSync(path.join(config.mqtt.ca_path, config.mqtt.key_file)),
    cert: fs.readFileSync(path.join(config.mqtt.ca_path, config.mqtt.cert_file)),
    rejectUnauthorized: config.mqtt.rejectUnauthorized,
    // The CA list will be used to determine if server is authorized
    ca: fs.readFileSync(path.join(config.mqtt.ca_path, config.mqtt.trusted_ca_list))
};


console.log('ready to connect emqtt');
//console.log(options);

var MqttClient = mqtt.connect(options);


MqttClient.on("connect", function(client) {
    console.log("emqtt connected, pid =", process.pid)
    //MqttClient.message(config.mqtt.node_topic + 'clients/#',{qos:1});
});

MqttClient.on("close", function(client) {
    console.log("emqtt close")
});

MqttClient.on("offline", function(client) {
    console.log("emqtt offline")
});

/**
 * publish - publish <message> to <topic>
 *
 * @param {String} topic - topic to publish to
 * @param {String, Buffer} message - message to publish
 * @param {Object} [opts] - publish options, includes:
 *    {Number} qos - qos level to publish on
 *    {Boolean} retain - whether or not to retain the message
 *    {Boolean} dup - whether or not mark a message as duplicate
 * @param {Function} [callback] - function(err){}
 *    called when publish succeeds or fails
 * @returns {MqttClient} this - for chaining
 * @api public
 *
 * @example client.publish('topic', 'message');
 * @example
 *     client.publish('topic', 'message', {qos: 1, retain: true, dup: true});
 * @example client.publish('topic', 'message', console.log);
 */
mqtt.Client.prototype.publish_batch = function(topic_dmac, topic_src, message, opts, callback){

    //支持批量任务下发
    if(Array.isArray(topic_dmac)) {
        for(var i = 0; i < topic_dmac.length; i++){
            this.publish(topic_dmac[i] + topic_src , message, opts, callback);
        }
    }else {
        console.log(topic_dmac + topic_src);
        this.publish(topic_dmac + topic_src, message, opts, callback);
    }
};


//订阅主题为ｔｅｓｔ的消息
//client.publish('messages', 'Current time is: ' + new Date())
//client.publish('presence', 'hello!')
//订阅主题为test的消息
/*
client.message('YunAC/+/CMD_GET/',{qos:1});
client.on('message', function (topic, message) {
    console.log(topic, message.toString());
});
*/

//export default MqttClient
//导出模块
module.exports = MqttClient;