'use strict';

module.exports = {
	image_dir:'./public/image',
	firmware_dir:'./public/firmware',
	download_dir:'./public/download',
	pkg_dir:'./public/packages',
	script_dir:'./public/scripts',
	backend_port:'80',
	upload_port:'9100',
	url: 'mongodb://localhost:27017/iotks',
	amount_every_task: '500',
	interval_every_task: '600000',  //单位：ms
	keep_record_num: '120',  //记录的数据数量
	ssl:{
		port: 443,
		key:'../ssl/3640936_dsjiaqi.cn.key',
		cert:'../ssl/3640936_dsjiaqi.cn.pem',
	},
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
			secure:   false,
			maxAge:   2 * 60 * 60 * 1000,
		}
	},
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
};
