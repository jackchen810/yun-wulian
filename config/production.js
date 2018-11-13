'use strict';

module.exports = {
    mqtt: {
        username: 'wulian',
        protocol:'mqtt',
        rejectUnauthorized: false,  //false
        port: 8883,
        host: 'localhost',   //通过mqtt acl 防止其它用户连接并下发控制命令
        ca_path: './mqttclient/files',
        key_file : 'yun-client.key',
        cert_file : 'yun-client.crt',
        trusted_ca_list : 'yun-client.ca',
        node_topic: '$SYS/brokers/emq@127.0.0.1/',
    }
};