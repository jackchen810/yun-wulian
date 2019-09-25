'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scriptSchema = new Schema({
	script_name: String,
	script_developer: String,
	script_info: String, //更新说明
	script_create_time: String, 
	script_status: Number, //0:pkg上架,1:pkg 下架
	script_md5: String,
});

const Script = mongoose.model('Script',scriptSchema);
module.exports = Script;