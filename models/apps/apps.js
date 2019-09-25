'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pkgSchema = new Schema({
	pkg_name: String,
	pkg_str_name: String,
	pkg_version: String,
	pkg_developer: String,
	pkg_info: String, //更新说明
	pkg_create_time: String,
	pkg_status: Number, //0:pkg上架,1:pkg 下架
	pkg_md5: String,
});

const Apps = mongoose.model('Apps',pkgSchema);
module.exports = Apps;
