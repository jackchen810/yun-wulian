'use strict';

const AdminModel = require('../../models/admin/admin');
const DeviceTable = require('../../models/device/device');
const logger = require( '../../logs/logs.js');
const schedule = require('node-schedule');

class adminTimerHnd {
	constructor() {

	}
	async update_admin_device(){
		var Admin = await AdminModel.find();
                for(var i=0; i < Admin.length; i++){
                        Admin[i].user_device_count = await DeviceTable.count({'user_name':Admin[i].user_account});
                        Admin[i].user_online_count = await DeviceTable.count({'user_name':Admin[i].user_account,'status':'online'});
                        await AdminModel.findOneAndUpdate({user_account: Admin[i].user_account},
                                                {$set: {'user_device_count' : Admin[i].user_device_count,
                                                        'user_online_count' : Admin[i].user_online_count}});
                }
	}
}

const AdminTimerHandle = new adminTimerHnd();
schedule.scheduleJob('0 0 * * * *', AdminTimerHandle.update_admin_device);
