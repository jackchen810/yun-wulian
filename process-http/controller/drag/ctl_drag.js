'use strict';
const dtime = require( 'time-formater');
const config = require( "config-lite");
const DB = require( "../../../models/models.js");
const logger = require( '../../../logs/logs.js');
const fs = require("fs");
const path = require('path');
//const multiparty = require('multiparty');
const formidable = require('formidable');
const multiparty = require('multiparty');
const { Db } = require('mongodb');


class DevtypeHandlev {
    constructor() {
        // this.add = this.drag_add.bind(this);
        // this.add = this.drag_list.bind(this);
        // this.del = this.del.bind(this);
        // this.types = this.types.bind(this);
    }
    async drag_add(req, res, next) {
        logger.info('imgup=======================');
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
        // console.log(res.body)
        // console.log('fields')

        form.on('file', function (field, file) {
            fileName = file.name;
            uploadedPath ='http://localhost/'+file.path.substring(7);
            console.log("uploadedPath"+uploadedPath)
            // logger.info('upload file: ', fileName, uploadedPath);
        });

        form.on('fileBegin', function () {
            logger.info('upload fileBegin...');
        });
        form.on('end', function () {
            console.log("end=======================")
            //logger.info("uploadedPath:", uploadedPath);
            //logger.info("fields:", fields);
            // 参数有效性检查
            if (!uploadedPath || !fields.projectname) {
                res.send({ ret_code: 1002, ret_msg: '用户输入参数无效', extra: fields });
                fs.unlinkSync(uploadedPath);
                return;
            }
            DB.HttpDrag.findOne({ 'project_name': fields.projectname }).exec(function (err, doc) {
                console.log("===================ddddddddddd====")
                console.log(doc)
                if (doc != null) {
                    logger.info('the same file already exist');
                    fs.unlinkSync(uploadedPath);
                    res.send({ ret_code: 1008, ret_msg: '项目名重复', extra: fields.projectname });
                    return;
                }
                else {
                    //写入数据库
                    let mytime = new Date();
                    let myDocObj = {
                        "projectname": fields.projectname,
                        "user_account": fields.user_account,
                        "project_showname": fields.project_showname,
                        "project_image": uploadedPath,
                        'dargjsondata':fields.dargjsondata,
                        "comment": fields.comment,
                        "update_time": dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
                        'sort_time': mytime.getTime(),
                    };
                    console.log("=======================")
                    console.log(myDocObj)
                    //logger.info('romDocObj fields: ', romDocObj);
                    DB.HttpDrag.create(myDocObj);
                    res.send({ ret_code: 0, ret_msg: '上传成功', extra: myDocObj });
                    return;
                }
            });

           
        });

        form.on('error', function (err) {
            logger.info('upload error', err.toString());
            res.send({ ret_code: -1, ret_msg: '上传出错', extra: err });
        });

        form.parse(req);
        logger.info('manage upload ok');
    }
   
    async drag_list(req, res, next) {
    
        var page_size = req.body['page_size'];
        var current_page = req.body['current_page'];
        var user_account = req.body['user_account'];
        var project_showname = req.body['project_showname']
        let dargdata={}
        if(project_showname){
            console.log('project_showname' +project_showname)
            dargdata = {
                'project_showname':project_showname
            }
        }else{
            dargdata = {
                'user_account':user_account,
            };
        }
        // console.log('dargdata============',dargdata);
        if (typeof page_size === "undefined" && typeof current_page === "undefined") {
          
            var query = await DB.HttpDrag.find(dargdata).sort({ 'sort_time': -1 });
            res.send({ ret_code: 0, ret_msg: 'SUCCESS', extra: query });
        }
        else if (page_size > 0 && current_page > 0) {
            //var ret = await DB.DevtypeTable.findByPage(condition, page_size, current_page, sort);
        
            var skipnum = (current_page - 1) * page_size;   //跳过数
            // let query = await DB.AccountTable.find({user_belong:user_account}).skip(skipnum).limit(page_size).sort({'user_create_time':-1})
            var query = await DB.HttpDrag.find(dargdata).skip(skipnum).limit(page_size).sort({'sort_time':-1});
            let queryListd = await DB.HttpDrag.find(dargdata); //总数
            res.send({ ret_code: 0, ret_msg: 'SUCCESS', extra: query, total:queryListd.length});
        }
        else {
            res.send({ ret_code: 1002, ret_msg: 'FAILED', extra: '用户名失效' });
        }
        logger.info('devtype list end');

    }

    async drag_typelist(req, res, next) {
        var page_size = req.body['page_size'];
        var current_page = req.body['current_page'];
        var project_showname = req.body['project_showname']
       
        var dargdata = {
            "project_showname": project_showname,
        };

        if (typeof (page_size) === "undefined" && typeof (current_page) === "undefined") {
            var query = await DB.HttpDrag.find(dargdata).sort(sort);
            res.send({ ret_code: 0, ret_msg: 'SUCCESS', extra: query });
        }
        else if (page_size > 0 && current_page > 0) {
            //var ret = await DB.DevtypeTable.findByPage(condition, page_size, current_page, sort);
            var skipnum = (current_page - 1) * page_size;   //跳过数
          
            var query = await DB.HttpDrag.find(dargdata).sort({ 'create_date': -1 }).skip(skipnum).limit(page_size);
            let queryListd = await DB.HttpDrag.find(dargdata).exec(); //总数
            res.send({ ret_code: 0, ret_msg: 'SUCCESS', extra: query, total: queryListd.length });
        }
        else {
            res.send({ ret_code: 1002, ret_msg: 'FAILED', extra: '用户名失效' });
        }
        logger.info('devtype list end');

    }
    async drag_idlist(req, res, next) {

        var id = req.body['id'];
        var dargdata = {
            "_id": id,
        };
        console.log("===================")
        let query = await DB.HttpDrag.find(dargdata);

        if (query) {
            console.log("===================")
            res.send({ ret_code: 200, ret_msg: 'SUCCESS', extra: query });
        } else {
            res.send({ ret_code: 0, ret_msg: 'FAILED', extra: '参数不对' });
        }

        logger.info('devtype list end');

    }
    async drag_del(req, res, next) {
        //获取表单数据，josn
        var id = req.body['id'];
        console.log('req.id', id);
        //参数有效性检查
        if (typeof (id) === "undefined") {
            res.send({ ret_code: 1002, ret_msg: 'FAILED', extra: '参数无效' });
            return;
        }
        try {
            var query = await DB.HttpDrag.findByIdAndRemove(id);
            res.send({ ret_code: 200, ret_msg: 'SUCCESS', extra: query });
        } catch (err) {
            res.send({ ret_code: 1004, ret_msg: 'FAILED', extra: err });
        }

    }

    async project_imgadd(req, res, next) {
        console.log("=================");
        let form = new multiparty.Form();
        form.uploadDir="./public/image";
        // form.keepExtensions=true;   //是否保留后缀
    
        form.parse(req,function(err,fields,files){  //其中fields表示你提交的表单数据对象，files表示你提交的文件对象
            var hid = {
                _id:fields.id[0]
                }
            var fpath = {
                'project_image':"http://localhost"+files.file[0].path.substring(6)
            }
          
            let query = DB.HttpDrag.findByIdAndUpdate(hid, fpath,
                function(err){
                    if (err){
                        res.send({ ret_code: 0, ret_msg: 'FAILED', extra: err });
                    }else{
                        res.send({ ret_code: 200, ret_msg: 'SUCCESS', extra: query });
                    }
                   
                })  
        
            })

    }

    async project_content_change(req, res, next) {
        var comment = req.body['comment'];
        var dargjsondata = req.body['dargjsondata'];
        var id = req.body['id'];
        var project_showname = req.body['project_showname'];
        var projectname = req.body['projectname'];
        
        var hid = {
            _id:id
            }
        let updata = {
            comment:comment,
            dargjsondata:dargjsondata,
            project_showname:project_showname,
            projectname:projectname
        }
        console.log(dargjsondata);
        DB.HttpDrag.findByIdAndUpdate(hid, updata,
            function(err){
                if (err){
                    res.send({ ret_code: 0, ret_msg: 'FAILED', extra: err });
                }else{
                    res.send({ ret_code: 200, ret_msg: 'SUCCESS' });
                }   
            })

    }
    async drag_adduser(req,res,next){

        let mytime = new Date();

      
        var user_account = req.body['user_account'];

        var project_showname = req.body['project_showname'];
        var user_password = req.body['user_password'];
        var user_phone = req.body['user_phone'];
        var user_region = req.body['user_region'];
        var user_prov = req.body['user_prov'];
        var user_city = req.body['user_city'];
        var user_address = req.body['user_address'];
        var update_time= dtime(mytime).format('YYYY-MM-DD HH:mm')
        var sort_time =  mytime.getTime()
        let quser = await DB.AccountTable.find({user_account:user_account})
        console.log(quser[0]._id.toString());
        // if(quser){
        //     console.log(quser);
        // }
        let ndata ={
            account_id:quser[0]._id.toString(),
            user_account,
            project_showname,
            user_password,
            user_prov,
            user_city,
            user_address,
            user_phone,
            user_region,
            update_time,
            sort_time
        }
        DB.HttpDraguser.create(ndata)
        res.send({ ret_code: 200, ret_msg: '注册成功', extra: ndata })


    }
    async drag_userlist(req, res, next) {

        var user_account = req.body['user_account'];
        var page_size = req.body['page_size'];
        var current_page = req.body['current_page'];
        let skipnum = (current_page - 1) * page_size;   //跳过数
        // let quse = await DB.AccountTable.find({user_account:user_account}).exec()
        if(page_size){
            let query = await DB.AccountTable.find({user_belong:user_account}).skip(skipnum).limit(page_size).sort({'user_create_time':-1})
            let queryListd =await DB.AccountTable.find({user_belong:user_account})
            res.send({ ret_code: 200, ret_msg: 'SUCCESS',extra:query,total: queryListd.length });
        }else{
            
            let query =await DB.AccountTable.find({user_belong:user_account})
            res.send({ ret_code: 200, ret_msg: 'SUCCESS',extra:query});
        }
      
      
       
    }
    async drag_userlogin(req, res, next) {
        var project_showname = req.body['project_showname'];
        var user_password_md5 = req.body[''];
        let ndata={
            user_password_md5,
            user_password
        }
        // let quse = await DB.AccountTable.find({user_account:user_account}).exec()
        let query =await DB.HttpDraguser.find({ndata},{_id:0}).exec();
        let queryd = await DB.HttpDraguser.find({ndata},{_id:0}).exec();
        if(query){

            res.send({ ret_code: 200, ret_msg: 'SUCCESS'});
        }else{
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效'})
        }
        
       
    }

}


module.exports = new DevtypeHandlev();