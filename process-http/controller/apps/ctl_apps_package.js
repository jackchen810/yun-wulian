'use strict';

const DB = require( "../../../models/models.js");
const dtime = require( 'time-formater');
const config = require( "config-lite");
const logger = require( '../../../logs/logs.js');
const fs = require("fs");
const path = require('path');
const formidable = require('formidable');






class PkgHandle {
    constructor(){
        this.upload = this.upload.bind(this);
    }
    async download(req, res, next){
        var pkg_name = req.body.pkg_name;
        try {
            if(!pkg_name) {
                throw new Error('请选择正确的插件');
            }
        }catch(err){
            logger.log('err.message',err);
            res.send({
                ret_code: 1,
                ret_msg: 'PKG_ERROE_PARAM',
                extra: err.message
            });
            return;
        }
        try{
            const pkg = await DB.AppsPkgTable.findOne({pkg_name});
            if(!pkg) {
                logger.log('PKG不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'PKG_NOT_EXIST',
                    extra: 'PKG不存在'
                });
                return;
            }
        }catch(err){
            logger.log('PKG不存在');
            res.send({
                ret_code: 1,
                ret_msg: 'PKG_NOT_EXIST',
                extra: err.message
            });
            return;
        }
        try{
            /*var pkg_path = path.join(config.pkg_dir,pkg_name);
            fs.exists(pkg_path, function(exist){
                if(exist){
                    res.download(pkg_path,pkg_name);
                }else {
                    res.send({ret_code:1, ret_msg:'DOWNLOAD_PKG_FAILED',extra:'下载插件失败'});
                }
            })*/
            var pkg_path = '/packages/'+pkg_name;
            res.send({ret_code:0 , res_msg:'SUCCESS',extra: pkg_path});
            return;
        }catch(err){
            logger.log('下载插件失败');
            res.send({
                ret_code: 1,
                ret_msg: 'DOWNLOAD_PKG_FAILED',
                extra: '下载插件失败'
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

            const {pkg_name, pkg_str_name,  pkg_version, pkg_developer='admin', pkg_info, pkg_md5} = fields;
            try {
                if(!pkg_name) {
                    throw new Error('请选择正确的插件');
                }else if(!pkg_str_name){
                    throw new Error('请输入插件名称');
                }else if(!pkg_version){
                    throw new Error('请输入插件的版本号');
                }else if(!pkg_info){
                    throw new Error('请输入插件说明');
                }
            }catch(err){
                logger.log('err.message',err);
                res.send({
                    ret_code: 1,
                    ret_msg: 'PKG_ERROE_PARAM',
                    extra: err.message
                });
                return;
            }

            try{
                const pkg = await DB.AppsPkgTable.findOne({pkg_name});
                if(pkg) {
                    logger.log('PKG已经存在');
                    res.send({
                        ret_code: 1,
                        ret_msg: 'PKG_HAS_EXIST',
                        extra: 'PKG已经存在'
                    });
                    return;
                }
            }catch(err){
                logger.log('err.message',err);
                res.send({
                    ret_code: 1,
                    ret_msg: 'PKG_HAS_EXIST',
                    extra: 'PKG已经存在'
                });
                return;
            }

            try{
                var repath = path.join(config.pkg_dir,files.file_name.name);
                /*fs.rename(files.file_name.path, repath,function(err){
                    if(err){
                        logger.log('上传插件失败');
                    }else{
                        logger.log('上传插件成功');
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
                                        logger.log('上传插件成功');
                                    }
                                })
                            }
                        })
                    }
                })
            }catch(err){
                logger.log('上传PKG失败');
                res.send({
                    ret_code: 1,
                    ret_msg: 'UPLOAD_PKG_FAILED',
                    extra: '上传插件失败'
                });
                return;
            }

            var mytime =  new Date();
            try{
                const new_pkg = {
                    pkg_name: pkg_name,
                    pkg_str_name: pkg_str_name,
                    pkg_version: pkg_version,
                    pkg_developer: pkg_developer,
                    pkg_info: pkg_info,
                    pkg_create_time: dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
                    pkg_status: 0,
                    pkg_md5:pkg_md5,
                };
                await DB.AppsPkgTable.create(new_pkg);
                logger.log('保存PKG成功');
                res.send({
                    ret_code: 0,
                    ret_msg: 'SAVE_PKG_SUCCESS',
                    extra: '保存PKG成功'
                });
            }catch(err){
                logger.log('保存PKG失败');
                res.send({
                    ret_code: 1,
                    ret_msg: 'SAVE_PKG_FAILED',
                    extra: '保存PKG失败'
                });
                return;
            }
        })
    }
    async release(req, res, next){
        var pkg_name = req.body.pkg_name;
        try {
            if(!pkg_name) {
                throw new Error('请选择正确的插件');
            }
        }catch(err){
            logger.log('err.message',err);
            res.send({
                ret_code: 1,
                ret_msg: 'PKG_ERROE_PARAM',
                extra: err.message
            });
            return;
        }
        try{
            const pkg = await DB.AppsPkgTable.findOne({pkg_name});
            if(!pkg) {
                logger.log('PKG不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'PKG_NOT_EXIST',
                    extra: 'PKG不存在'
                });
                return;
            }else{
                await DB.AppsPkgTable.findOneAndUpdate({pkg_name:pkg_name},{$set:{pkg_status:0}});
                logger.log('PKG已上架');
                res.send({
                    ret_code: 0,
                    ret_msg: 'SUCCESS',
                    extra: 'PKG已上架',
                });
                return;
            }
        }catch(err){
            logger.log('PKG上架失败');
            res.send({
                ret_code: 1,
                ret_msg: 'PKG_RELEASE_FAILED',
                extra: err.message
            });
            return;
        }
    }
    async revoke(req, res, next){
        var pkg_name = req.body.pkg_name;
        try {
            if(!pkg_name) {
                throw new Error('请选择正确的插件');
            }
        }catch(err){
            logger.log('err.message',err);
            res.send({
                ret_code: 1,
                ret_msg: 'PKG_ERROE_PARAM',
                extra: err.message
            });
            return;
        }
        try{
            const pkg = await DB.AppsPkgTable.findOne({pkg_name});
            if(!pkg) {
                logger.log('PKG不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'PKG_NOT_EXIST',
                    extra: 'PKG不存在'
                });
                return;
            }else{
                await DB.AppsPkgTable.findOneAndUpdate({pkg_name:pkg_name},{$set:{pkg_status:1}});
                logger.log('PKG已上架');
                res.send({
                    ret_code: 0,
                    ret_msg: 'SUCCESS',
                    extra: 'PKG已上架',
                });
                return;
            }
        }catch(err){
            logger.log('PKG上架失败');
            res.send({
                ret_code: 1,
                ret_msg: 'PKG_RELEASE_FAILED',
                extra: err.message
            });
            return;
        }
    }
    async del(req, res, next) {
        var pkg_name = req.body.pkg_name;
        try {
            if(!pkg_name) {
                throw new Error('请选择正确的插件');
            }
        }catch(err){
            logger.log('err.message',err);
            res.send({
                ret_code: 1,
                ret_msg: 'PKG_ERROE_PARAM',
                extra: err.message
            });
            return;
        }
        try{
            var pkg = await DB.AppsPkgTable.findOne({pkg_name});
            if(!pkg) {
                logger.log('PKG不存在');
                res.send({
                    ret_code: 1,
                    ret_msg: 'PKG_NOT_EXIST',
                    extra: 'PKG不存在'
                });
                return;
            }else{
                var del_pkg = {'pkg_name': pkg_name};
                await DB.AppsPkgTable.remove(del_pkg, function(err){
                    if(err){
                        logger.log('del pkg occur a error',err);
                    }
                });
                var pkg_path = path.join(config.pkg_dir, pkg_name);
                fs.unlink(pkg_path);
                res.send({ret_code:0, ret_msg:'DEL_PKG_SUCCESS',extra:'删除插件成功'});
            }
        }catch(err){
            logger.log('删除插件失败');
            res.send({
                ret_code: 1,
                ret_msg: 'DEL_PKG_FAILED',
                extra: '删除插件失败'
            });
            return;
        }
    }
    async delpkgs(req, res, next){
        var pkg_str_name = req.body.pkg_str_name;
        var pkg_version = req.body.pkg_version;
        try{
            var allpkgs = await DB.AppsPkgTable.find({pkg_str_name:pkg_str_name, pkg_version:pkg_version});
            for(var i=0; i < allpkgs.length; i++){
                var del_pkg = {'pkg_name': allpkgs[i].pkg_name};
                await DB.AppsPkgTable.remove(del_pkg);
                var pkg_path = path.join(config.pkg_dir,allpkgs[i].pkg_name);
                fs.unlink(pkg_path,function(err){
                    if(err){
                        throw err;
                    }else{
                        logger.log('del pkgs success');
                    }
                });
            }
            res.send({ret_code:0, ret_msg:'SUCCESS', extra:'删除插件组成功'});
        }
        catch(err){
            res.send({ret_code:1, ret_msg:'DEL_ALLPKGS_FAILED', extra:'删除插件组失败'});
        }
        return;
    }
    async list(req, res, next) {
        logger.info('rom list');
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
            var query = await DB.AppsPkgTable.find(filter).sort(sort);
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:query});
        }
        else if (page_size > 0 && current_page > 0) {
            //var ret = await DB.RomTable.findByPage(filter, page_size, current_page, sort);
            var skipnum = (current_page - 1) * page_size;   //跳过数
            var query = await DB.AppsPkgTable.find(filter).sort(sort).skip(skipnum).limit(page_size);
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:query});
        }
        else{
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra:''});
        }
        //logger.info('rom list end');
    }
    async detail(req, res, next){
        logger.log('apps pkg detail');
        try{
            var pkg_str_name = req.body.pkg_str_name;
            var pkg_version = req.body.pkg_version;
            var allpkgs = await DB.AppsPkgTable.find({pkg_str_name:pkg_str_name, pkg_version:pkg_version});
            res.send({
                ret_code: 0,
                ret_msg:'SUCCESS',
                extra: allpkgs
            });
        }catch(err){
            res.send({
                ret_code:-1,
                ret_msg: 'FAILED',
                extra: '获取插件详情失败'
            });
        }
    }
}


const AppsPkgHnd = new PkgHandle();
module.exports = AppsPkgHnd;