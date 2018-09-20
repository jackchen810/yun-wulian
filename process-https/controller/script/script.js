'use strict';

import scriptModel from '../../models/script/script';
import logger from '../../logs/logs.js'
import formidable from 'formidable';
import fs from 'fs';
import config from 'config-lite';
import path from 'path';
import dtime from 'time-formater';

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
		const script = await scriptModel.findOne({script_name});
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
			const script = await scriptModel.findOne({script_name});
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

		try{
			const newScript = {
				script_name: script_name,
				script_developer: script_developer,
				script_info: script_info,
				script_create_time: dtime().format('YYYY-MM-DD HH:mm'),
				script_status: 0,
				script_md5: script_md5,
			};
			await scriptModel.create(newScript);
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
		const script = await scriptModel.findOne({script_name});
		if(!script) {
			logger.info('SCRIPT不存在');
			res.send({
				ret_code: 1,
				ret_msg: 'SCRIPT_NOT_EXIST',
				extra: 'SCRIPT不存在'
			});
			return;
		}else{
			await scriptModel.findOneAndUpdate({script_name:script_name},{$set:{script_status:0}});
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
		const script = await scriptModel.findOne({script_name});
		if(!script) {
			logger.info('SCRIPT不存在');
			res.send({
				ret_code: 1,
				ret_msg: 'SCRIPT_NOT_EXIST',
				extra: 'SCRIPT不存在'
			});
			return;
		}else{
			await scriptModel.findOneAndUpdate({script_name:script_name},{$set:{script_status:1}});
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
		var script = await scriptModel.findOne({script_name});
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
			await scriptModel.remove(delScript, function(err){
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
	var page_size = req.body.page_size;
	var current_page = req.body.current_page;
	try {
		if(typeof(page_size) === 'undefined' && typeof(current_page) === 'undefined'){
			var allScript = await scriptModel.find({},'-_id').sort({id: -1});
			res.send({
				ret_code: 0,
				ret_msg:'SUCCESS',
				extra: allScript
			});
			return;
		}else if(page_size > 0 && current_page > 0){
			var allScript = await scriptModel.find({},'-_id')
						.sort({id: -1})
						.skip(Number((current_page - 1)*page_size))
						.limit(Number(page_size));
			res.send({
				ret_code: 0,
				ret_msg:'SUCCESS',
				extra: allScript
			});
			return;
		}else {
			res.send({ret_code: 1, ret_msg: 'PARAM_ERROR', extra: '参数错误'});
			return;
		}
	}catch(err){
		logger.info('获取脚本列表失败', err);
		res.send({
			ret_code: 1,
			ret_msg: 'ERROR_GET_SCRIPT_LIST',
			extra:'获取脚本列表失败'
		});
		return;
	}
    }
}

export default new ScriptHandle()
