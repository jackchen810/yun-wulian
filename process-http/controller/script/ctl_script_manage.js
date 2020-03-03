'use strict';

const DB = require( "../../../models/models.js");
const dtime = require( 'time-formater');
const config = require( "config-lite");
const logger = require( '../../../logs/logs.js');
const fs = require("fs");
const path = require('path');
const formidable = require('formidable');


class ScriptHandle {
    constructor(){
		this.upload = this.upload.bind(this);
    }
    async download(req, res, next){
		var script_name = req.body.script_name;
		try {
			if(!script_name) {
				throw new Error('请选择正确的脚本');
			}
		}catch(err){
			logger.info('err.message',err);
			res.send({
				ret_code: 1,
				ret_msg: 'PKG_ERROE_PARAM',
				extra: err.message
			});
			return;
		}
		try{
			const script = await DB.ScriptTable.findOne({script_name});
			if(!script) {
				logger.info('SCRIPT不存在');
				res.send({
					ret_code: 1,
					ret_msg: 'SCRIPT_NOT_EXIST',
					extra: 'SCRIPT不存在'
				});
				return;
			}
		}catch(err){
			logger.info('SCRIPT不存在');
			res.send({
				ret_code: 1,
				ret_msg: 'SCRIPT_NOT_EXIST',
				extra: err.message
			});
			return;
		}
		try{
			var script_path = path.join(config.script_dir, script_name);
			fs.exists(script_path, function(exist){
				if(exist){
					res.download(script_path, script_name);
				}else {
					res.send({ret_code:1, ret_msg:'DOWNLOAD_SCRIPT_FAILED',extra:'下载脚本失败'});
				}
			});
			return;
		}catch(err){
			logger.info('下载脚本失败');
			res.send({
				ret_code: 1,
				ret_msg: 'DOWNLOAD_SCRIPT_FAILED',
				extra: '下载脚本失败'
			});
			return;
		}
    }
    async upload(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if(err) {
				res.send({
					ret_code: 1,
					ret_msg: 'PKG_DATA_ERROR',
					extra: '表单信息错误'
				});
				return;
			}

			const {script_name, script_developer='admin', script_info, script_md5} = fields;
			try {
				if(!script_name) {
					throw new Error('请选择正确的插件');
				}
			}catch(err){
				logger.info('err.message',err);
				res.send({
					ret_code: 1,
					ret_msg: 'SCRIPT_ERROE_PARAM',
					extra: err.message
				});
				return;
			}

			try{
				const script = await DB.ScriptTable.findOne({script_name});
				if(script) {
					logger.info('SCRIPT已经存在');
					res.send({
						ret_code: 1,
						ret_msg: 'SCRIPT_HAS_EXIST',
						extra: 'SCRIPT已经存在'
					});
					return;
				}
			}catch(err){
				logger.info('err.message',err);
				res.send({
					ret_code: 1,
					ret_msg: 'SCRIPT_HAS_EXIST',
					extra: 'SCRIPT已经存在'
				});
				return;
			}

			try{
				var repath = path.join(config.script_dir,files.file_name.name);
				/*fs.rename(files.file_name.path, repath, function(err){
					if(err){
						logger.info('上传脚本失败');
					}else{
						logger.info('上传脚本成功');
					}
				});*/
				fs.readFile(files.file_name.path, function(err,data){
					if(err){
						throw err;
					}else{
						fs.writeFile(repath, data,function(err){
							if(err){
								throw err;
							}else{
								fs.unlink(files.file_name.path,function(err){
									if(err){
										throw err;
									}else{
										logger.log('上传脚本成功');
									}
								})
							}
						})
					}
				})
			}catch(err){
				logger.info('上传SCRIPT失败');
				res.send({
					ret_code: 1,
					ret_msg: 'UPLOAD_SCRIPT_FAILED',
					extra: '上传脚本失败'
				});
				return;
			}

            var mytime =  new Date();
			try{
				const newScript = {
					script_name: script_name,
					script_developer: script_developer,
					script_info: script_info,
					script_create_time: dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
					script_status: 0,
					script_md5: script_md5,
				};
				await DB.ScriptTable.create(newScript);
				logger.info('保存SCRIPT成功');
				res.send({
					ret_code: 0,
					ret_msg: 'SAVE_SCRIPT_SUCCESS',
					extra: '保存SCRIPT成功'
				});
				return;
			}catch(err){
				logger.info('保存SCRIPT失败');
				res.send({
					ret_code: 1,
					ret_msg: 'SAVE_SCRIPT_FAILED',
					extra: '保存SCRIPT失败'
				});
				return;
			}
		})
    }
    async release(req, res, next){
		var script_name = req.body.script_name;
		try {
			if(!script_name) {
				throw new Error('请选择正确的脚本');
			}
		}catch(err){
			logger.info('err.message',err);
			res.send({
				ret_code: 1,
				ret_msg: 'SCRIPT_ERROE_PARAM',
				extra: err.message
			});
			return;
		}
		try{
			const script = await DB.ScriptTable.findOne({script_name});
			if(!script) {
				logger.info('SCRIPT不存在');
				res.send({
					ret_code: 1,
					ret_msg: 'SCRIPT_NOT_EXIST',
					extra: 'SCRIPT不存在'
				});
				return;
			}else{
				await DB.ScriptTable.findOneAndUpdate({script_name:script_name},{$set:{script_status:0}});
				logger.info('SCRIPT已上架');
				res.send({
					ret_code: 0,
					ret_msg: 'SUCCESS',
					extra: 'SCRIPT已上架',
				});
				return;
			}
		}catch(err){
			logger.info('SCRIPT上架失败');
			res.send({
				ret_code: 1,
				ret_msg: 'SCRIPT_RELEASE_FAILED',
				extra: err.message
			});
			return;
		}
		}
		async revoke(req, res, next){
		var script_name = req.body.script_name;
		try {
			if(!script_name) {
				throw new Error('请选择正确的插件');
			}
		}catch(err){
			logger.info('err.message',err);
			res.send({
				ret_code: 1,
				ret_msg: 'SCRIPT_ERROE_PARAM',
				extra: err.message
			});
			return;
		}
		try{
			const script = await DB.ScriptTable.findOne({script_name});
			if(!script) {
				logger.info('SCRIPT不存在');
				res.send({
					ret_code: 1,
					ret_msg: 'SCRIPT_NOT_EXIST',
					extra: 'SCRIPT不存在'
				});
				return;
			}else{
				await DB.ScriptTable.findOneAndUpdate({script_name:script_name},{$set:{script_status:1}});
				logger.info('SCRIPT已上架');
				res.send({
					ret_code: 0,
					ret_msg: 'SUCCESS',
					extra: 'SCRIPT已上架',
				});
				return;
			}
		}catch(err){
			logger.info('SCRIPT上架失败');
			res.send({
				ret_code: 1,
				ret_msg: 'SCRIPT_RELEASE_FAILED',
				extra: err.message
			});
			return;
		}
		}
		async del(req, res, next) {
		var script_name = req.body.script_name;
		try {
			if(!script_name) {
				throw new Error('请选择正确的脚本');
			}
		}catch(err){
			logger.info('err.message',err);
			res.send({
				ret_code: 1,
				ret_msg: 'SCRIPT_ERROE_PARAM',
				extra: err.message
			});
			return;
		}
		try{
			var script = await DB.ScriptTable.findOne({script_name});
			if(!script) {
				logger.info('SCRIPT不存在');
				res.send({
					ret_code: 1,
					ret_msg: 'SCRIPT_NOT_EXIST',
					extra: 'SCRIPT不存在'
				});
				return;
			}else{
				var delScript = {'script_name': script_name};
				await DB.ScriptTable.remove(delScript, function(err){
					if(err){
						logger.info('del script occur a error',err);
					}
				});
				var script_path = path.join(config.script_dir, script_name);
				fs.unlink(script_path);
				res.send({ret_code:0, ret_msg:'DEL_SCRIPT_SUCCESS',extra:'删除脚本成功'});
				return;
			}
		}catch(err){
			logger.info('删除脚本失败');
			res.send({
				ret_code: 1,
				ret_msg: 'DEL_SCRIPT_FAILED',
				extra: '删除脚本失败'
			});
			return;
		}
    }
    async list(req, res, next) {
        logger.info('script list');
        //logger.info(req.body);

        //获取表单数据，josn
        var page_size = req.body['page_size'];
        var current_page = req.body['current_page'];
        var sort = req.body['sort'];
        var filter = req.body['filter'];

        // 如果没有定义排序规则，添加默认排序
        if(typeof(sort)==="undefined"){
            logger.info('sort undefined');
            sort = {"sort_time":-1};
        }

        // 如果没有定义排序规则，添加默认排序
        if(typeof(filter)==="undefined"){
            logger.info('filter undefined');
            filter = {};
        }

        //参数有效性检查
        if(typeof(page_size)==="undefined" && typeof(current_page)==="undefined"){
            var query = await DB.ScriptTable.find(filter).sort(sort);
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:query});
        }
        else if (page_size > 0 && current_page > 0) {
            //var ret = await DB.RomTable.findByPage(filter, page_size, current_page, sort);
            var skipnum = (current_page - 1) * page_size;   //跳过数
            var query = await DB.ScriptTable.find(filter).sort(sort).skip(skipnum).limit(page_size);
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:query});
        }
        else{
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra:''});
        }
        //logger.info('rom list end');
    }
}


const ScriptHnd = new ScriptHandle();
module.exports = ScriptHnd;