'use strict';
const dtime = require( 'time-formater');
const config = require( "config-lite");
const DB = require( "../../../models/models.js");
const logger = require( '../../../logs/logs.js');
const fs = require("fs");
const path = require('path');
//const multiparty = require('multiparty');
const formidable = require('formidable');


class ProjectManageTable {
    constructor(){
        //logger.info('init 111');
        //this.tmp_correction_data_hour();
        //this.tmp_correction_data_day();
    }
    async project_list(req, res, next) {

        logger.info('manage list');
        //logger.info(req.body);

        //获取表单数据，josn
        let filter = req.body.hasOwnProperty('filter') ? req.body['filter'] : {};
        let sort = req.body.hasOwnProperty('sort') ? req.body['sort'] : {};
        let user_account = req.session.user_account;
        let user_type = req.session.user_type;

        //参数有效性检查
        if (!user_account){
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: req.body});
            return;
        }

        //普通1级用户， 查找所属的项目
        if (user_type == 1) {
            let wherestr = {'user_account': user_account};
            let query = await DB.AccountTable.findOne(wherestr).exec();
            logger.info('[manage] get result:', query);
            if (query != null){
                logger.info('[manage] get Own property', query['user_projects']);
                filter['project_name'] = { $in: query['user_projects']};
            }
            else{
                res.send({ret_code: 0, ret_msg: '成功', extra: query, total:0});
                logger.info('manage page list end');
                return;
            }
        }

        logger.info('user_account:', user_account, ', user_type:', user_type);
        logger.info('filter:', filter, ', sort:', sort);
        let queryList = await DB.ProjectManageTable.find(filter).sort(sort).exec();
        res.send({ret_code: 0, ret_msg: '成功', extra: queryList, total: queryList.length});
        logger.info('manage list end'+ queryListd.length);
    }


    async project_page_list(req, res, next) {
        logger.info('manage page list');
        //logger.info(req.body);

        //获取表单数据，josn
        let page_size = req.body['page_size'];
        let current_page = req.body['current_page'];
        let filter = req.body.hasOwnProperty('filter') ? req.body['filter'] : {};
        let sort = req.body.hasOwnProperty('sort') ? req.body['sort'] : {"sort_time":-1};
        let user_account = req.session.user_account;
        let user_type = req.session.user_type;

        //参数有效性检查
        if (!page_size || !current_page){
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: req.body});
            return;
        }

        //普通1级用户， 查找所属的项目
        if (user_type == 1) {
            let wherestr = {'user_account': user_account};
            let query = await DB.AccountTable.findOne(wherestr).exec();
            logger.info('[manage] get result:', query);
            if (query != null){
                 logger.info('[manage] get Own property', query['user_projects']);
                 filter['project_name'] = { $in: query['user_projects']};
            }
            else{
                res.send({ret_code: 0, ret_msg: '成功', extra: query, total:0});
                logger.info('manage page list end');
                return;
            }
        }

        logger.info('user_account:', user_account, ', user_type:', user_type);
        logger.info('page_size:', page_size, ', current_page:', current_page);
        logger.info('filter:', filter, ', sort:', sort);

        let skipnum = (current_page - 1) * page_size;   //跳过数
        let queryList = await DB.ProjectManageTable.find(filter).sort(sort).skip(skipnum).limit(page_size).exec();
        let queryListd = await DB.ProjectManageTable.find().exec(); //总数
        res.send({ret_code: 0, ret_msg: '成功', extra: queryList, total: queryListd.length});
        logger.info('manage page list end');
    }



    async project_array(req, res, next) {
        logger.info('manage array');
        //logger.info(req.body);

        let queryList = await DB.ProjectManageTable.find();
        let projectList = [];
        for (let i = 0; i < queryList.length; i++){
            projectList.push(queryList[i]['project_name']);
        }

        res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:projectList, total:queryList.length});
        logger.info('manage array end');
    }

    async project_del(req, res, next) {

        logger.info('manage del');
        //logger.info(req.body);

        //获取表单数据，josn
        let _id = req.body['_id'];

        //参数有效性检查
        if (!_id){
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: req.body});
            return;
        }

        logger.info('_id:', _id);

        let query = await DB.ProjectManageTable.findByIdAndRemove(_id).exec();

        //删除文件
        try {
            logger.info('del image:', query['project_image']);
            fs.unlinkSync(query['project_image']);
        }catch(err){
            logger.info('del image fail');
        }
        res.send({ret_code: 0, ret_msg: '成功', extra: query});
        logger.info('manage del end');
    }



    async project_status_update(req, res, next) {

        logger.info('manage hide');
        //logger.info(req.body);

        //获取表单数据，josn
        let project_status = req.body['project_status'];
        let _id = req.body['_id'];

        //参数有效性检查
        if (!_id || !project_status){
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: req.body});
            return;
        }

        logger.info('_id:', _id);
        logger.info('project_status:', project_status);

        let updatestr = {'project_status': project_status};
        let query = await DB.ProjectManageTable.findByIdAndUpdate(_id, updatestr).exec();
        res.send({ret_code: 0, ret_msg: '成功', extra: query});
        logger.info('manage hide end');
    }




    //1.fs.writeFile(filename,data,[options],callback); 创建并写入文件
    /**
     * filename, 必选参数，文件名
     * data, 写入的数据，可以字符或一个Buffer对象
     * [options],flag 默认‘2’,mode(权限) 默认‘0o666’,encoding 默认‘utf8’
     * callback  回调函数，回调函数只包含错误信息参数(err)，在写入失败时返回。
     */


    //2.readFile(filename,[options],callback); 读取文件内容
    //字符串方式读取文件
    /**
     * filename, 必选参数，文件名
     * [options],可选参数，可指定flag 默认为‘r’，encoding 默认为null，在读取的时候，需要手动指定
     * callback 读取文件后的回调函数，参数默认第一个err,第二个data 数据
     */
    async project_add(req, res, next){
       
        logger.info('imgup=======================');
        //logger.info(req);

        //生成multiparty对象，并配置上传目标路径
        /*
        fields： 是一个对象（上传名称和值），其属性名的字段名称和值是字段值的数组。
        files ：是一个对象（上传名称和服务器文件路径），其属性名的字段名称和值是文件对象的数组。
        */

        //var form = new multiparty.Form({uploadDir: config.image_dir});
        let fileName = '';
        let uploadedPath = '';
        let form = new formidable.IncomingForm({
            encoding: 'utf-8',
            keepExtensions: true,  //保持原有扩展名
            maxFieldsSize: 2 * 1024 * 1024,
            uploadDir: config.image_dir
        });

        let fields = {};   //各个字段值
        form.on('field', function (field, value) {
            logger.info('upload field: ', field, value);
            fields[field] = value;
        });

        form.on('file', function (field, file) {
            fileName = file.name;
            uploadedPath = file.path;
            logger.info('upload file: ', fileName, uploadedPath);
        });

        form.on('fileBegin', function () {
            logger.info('upload fileBegin...');
        });

        form.on('end', function () {
            logger.info('upload end: ');
            //logger.info("uploadedPath:", uploadedPath);
            //logger.info("fields:", fields);

            //参数有效性检查
            if (!uploadedPath || !fields.project_name){
                res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: fields});
                fs.unlinkSync(uploadedPath);
                return;
            }

            DB.ProjectManageTable.findOne({'project_name': fields.project_name}).exec(function (err, doc) {
                if (doc != null){
                    logger.info('the same file already exist');
                    fs.unlinkSync(uploadedPath);
                    res.send({ret_code: 1008, ret_msg: '项目名重复', extra: fields.project_name});
                    return;
                }
                else{
                    //写入数据库
                    let mytime =  new Date();
                    let myDocObj = {
                        "project_name" : fields.project_name,
                        "user_account": fields.user_account,

                        "project_local": fields.project_local,
                        "project_image": uploadedPath,
                        "project_status" : 'normal',  //上架

                        "comment" : fields.comment,

                        "update_time": dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
                        'sort_time':mytime.getTime(),
                    };

                    //logger.info('romDocObj fields: ', romDocObj);
                    DB.ProjectManageTable.create(myDocObj);
                    res.send({ret_code: 0, ret_msg: '上传成功', extra: myDocObj});
                    return;
                }
            });

            logger.info('new manage:', fields.project_name);
        });

        form.on('error', function(err) {
            logger.info('upload error', err.toString());
            res.send({ret_code: -1, ret_msg: '上传出错', extra:err});
        });

        form.parse(req);
        logger.info('manage upload ok');
    }

}


module.exports = new ProjectManageTable();

