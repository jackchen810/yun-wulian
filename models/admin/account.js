'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
	user_account: String,   //用户账号
    user_region: String,   //用户名称, 渠道名称
    user_type: Number, //0:管理员, 1:用户
    user_belong:String,
	user_password: String,
    user_password_md5: String,
    user_email: String,
	user_phone: String,
    user_wechat: String,

    user_prov: String,
    user_city: String,
    user_detail: String,

	user_create_time: String,
	user_last_login_time: String,
	//user_admin: String,
	user_status: Number, //0:用户正常,1:用户冻结
	user_avatar: {type: String, default: 'default.jpg'},

    user_projects: Array,   //用户拥有的项目
    login_logs: Array,   //一些上下线的日志信息，辅助定位问题，记录5条
});

accountSchema.index({user_id: 1});
const AccountTable = mongoose.model('AccountTable',accountSchema);
module.exports = AccountTable;
