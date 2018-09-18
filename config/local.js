'use strict';

module.exports = {
    local_ip:'192.168.0.117',
    amount_every_task: '2',
    interval_every_task: '30000',  //单位：ms
    mqtt: {
        username: 'wulian',
        protocol:'mqtt',
        rejectUnauthorized: false,  //false
        port: 8883,
        host: 'emqtt.dsjiaqi.cn',
        ca_path: './mqttclient/files',
        key_file : 'yun-client.key',
        cert_file : 'yun-client.crt',
        trusted_ca_list : 'yun-client.ca',
        node_topic: '$SYS/brokers/emq@127.0.0.1/',
    }
}