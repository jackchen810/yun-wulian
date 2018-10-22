'use strict';
const dtime = require( 'time-formater');
const config = require( "config-lite");
const DB = require( "../../../models/models.js");
const logger = require( '../../../logs/logs.js');
const fs = require("fs");
const path = require('path');
//const multiparty = require('multiparty');
const formidable = require('formidable');


class CtlDeviceHandle {
    constructor(){
        //logger.info('init 111');
        //this.tmp_correction_data_hour();
        //this.tmp_correction_data_day();

    }

    async device_list(req, res, next) {

        logger.info('device list');
        //logger.info(req.body);

        //获取表单数据，josn
        let user_account = req.body['user_account'];
        let user_type = req.session.user_type;

        if (!user_account){
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: req.body});
            return;
        }

        logger.info('user_account:', user_account);
        logger.info('user_type:', user_type);

        //
        let wherestr = {};
        if (user_type == 1) {
            wherestr = {'user_account': user_account};
        }

        let queryList = await DB.DeviceTable.find(wherestr).exec();
        res.send({ret_code: 0, ret_msg: '成功', extra: queryList, total: queryList.length});
        logger.info('device list end');
    }


    async device_array(req, res, next) {
        console.log('device array');
        //console.log(req.body);

        let queryList = await DB.DeviceTable.find();
        let deviceList = [];
        for (let i = 0; i < queryList.length; i++){
            deviceList.push(queryList[i]['device_name']);
        }

        res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:deviceList, total:queryList.length});
        console.log('device array end');
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
    async device_add(req, res){

        console.log('device add');
        //console.log(req);

        //生成multiparty对象，并配置上传目标路径
        /*
        fields： 是一个对象（上传名称和值），其属性名的字段名称和值是字段值的数组。
        files ：是一个对象（上传名称和服务器文件路径），其属性名的字段名称和值是文件对象的数组。
        */

        //var form = new multiparty.Form({uploadDir: config.image_dir});
        var fileName = '';
        var uploadedPath = '';
        var form = new formidable.IncomingForm({
            encoding: 'utf-8',
            keepExtensions: true,
            maxFieldsSize: 10 * 1024 * 1024,
            uploadDir: config.image_dir
        });

        var fields = {};   //各个字段值
        form.on('field', function (field, value) {
            console.log('upload field: ', field, value);
            fields[field] = value;
        });

        form.on('file', function (field, file) {
            fileName = file.name;
            uploadedPath = file.path;
            console.log('upload file: ', fileName, uploadedPath);
        });

        form.on('fileBegin', function () {
            console.log('begin upload...');
        });

        form.on('end', function () {
            console.log('upload end: ');
            //console.log(fields);

            //参数有效性检查
            if (!fields.device_name){
                res.send({ret_code: 1002, ret_msg: 'FAILED', extra: '用户输入参数无效'});
                fs.unlinkSync(uploadedPath);
                return;
            }

            DB.DeviceTable.findOne({'device_name': fields.device_name}).exec(function (err, doc) {
                if (doc != null){
                    console.log('the same file already exist');
                    fs.unlinkSync(uploadedPath);
                    res.send({ret_code: 1008, ret_msg: '项目名重复', extra: fields.device_name});
                    return;
                }
                else{
                    var mytime =  new Date();
                    //写入数据库
                    var myDocObj = {
                        "device_name" : fields.device_name,
                        "project_name": fields.project_name,
                        "user_account":  req.session.user_account,

                        "device_image": uploadedPath,
                        "device_status" : 'normal',  //上架

                        "comment" : fields.comment,

                        "update_time": dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
                        'sort_time':mytime.getTime(),
                    };

                    //console.log('romDocObj fields: ', romDocObj);
                    DB.DeviceTable.create(myDocObj);
                    res.send({ret_code: 0, ret_msg: '上传成功', extra: myDocObj});
                    return;
                }
            });

            console.log('new device:', fields.device_name);
        });

        form.on('error', function(err) {
            console.log('upload error', err.toString());
            res.send({ret_code: -1, ret_msg: '上传出错', extra:err});
        });

        form.parse(req);
        console.log('upload ok');
    }

}


module.exports = new CtlDeviceHandle();

