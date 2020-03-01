'use strict';
const mongoose = require('mongoose');
const dtime = require( 'time-formater');
const config = require( "config-lite");
const DB = require( "../../../models/models.js");
const logger = require( '../../../logs/logs.js');
const fs = require("fs");
const path = require('path');
const xlsx = require('node-xlsx');
const moment = require('moment');
//const multiparty = require('multiparty');
const formidable = require('formidable');

/* 设备元的管理，以智能设备为key，对齐属性管理 */
class CtlDevUnitManageHandle {
    constructor(){
        //logger.info('init 111');
        //this.tmp_correction_data_hour();
        //this.tmp_correction_data_day();

    }

    async device_list(req, res, next) {

        logger.info('device list');
        //logger.info('req.body', req.body);
        //console.log('headers:', req.headers);
        //console.log('session:', req.session);
        //console.log('sessionID:', req.sessionID);

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

        //if (user_type == 1) {
        //    filter['user_account'] = user_account;
        //}


        logger.info('user_account:', user_account);
        logger.info('user_type:', user_type);
        logger.info('filter:', filter);
        logger.info('sort:', sort);


        let queryList = await DB.DevunitManageTable.find(filter).sort(sort).exec();
        res.send({ret_code: 0, ret_msg: '成功', extra: queryList, total: queryList.length});
        //console.log('queryList:', queryList[0]);
        //logger.info('queryList.length:', queryList.length);
        logger.info('device list end');
    }

    async device_page_list(req, res, next) {
        logger.info('device page list');
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

        if (user_type == 1) {
            filter['user_account'] = user_account;
        }

        logger.info('user_account:', user_account);
        logger.info('user_type:', user_type);
        logger.info('page_size:', page_size);
        logger.info('current_page:', current_page);
        logger.info('filter:', filter);
        logger.info('sort:', sort);


        let skipnum = (current_page - 1) * page_size;   //跳过数
        let queryList = await DB.DevunitManageTable.find(filter).sort(sort).skip(skipnum).limit(page_size).exec();
        res.send({ret_code: 0, ret_msg: '成功', extra: queryList, total: queryList.length});
        //console.log('queryList:', queryList);
        logger.info('device page list end');
    }



    async device_array(req, res, next) {
        console.log('device array');
        //console.log(req.body);

        let queryList = await DB.DevunitManageTable.find();
        let deviceList = [];
        for (let i = 0; i < queryList.length; i++){
            deviceList.push(queryList[i]['device_name']);
        }

        res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:deviceList, total:queryList.length});
        console.log('device array end');
    }


    async device_cn_array(req, res, next) {
        console.log('device cn array');
        //console.log(req.body);

        let queryList = await DB.DevunitManageTable.find();
        let deviceCnList = [];
        for (let i = 0; i < queryList.length; i++){
            deviceCnList.push(queryList[i]['device_name']);
        }

        res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:deviceCnList, total:queryList.length});
        console.log('device cn array end');
    }

    async device_del(req, res, next) {

        logger.info('device del');
        //logger.info(req.body);

        //获取表单数据，josn
        let _id = req.body['_id'];

        //参数有效性检查
        if (!_id){
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: req.body});
            return;
        }

        logger.info('_id:', _id);

        let query = await DB.DevunitManageTable.findByIdAndRemove(_id).exec();

        //删除文件
        try {
            console.log('del image:', query['device_image']);
            fs.unlinkSync(query['device_image']);
        }catch(err){
            console.log('del image fail');
        }
        res.send({ret_code: 0, ret_msg: '成功', extra: query});
        logger.info('device del end');
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
    async device_add(req, res, next){
        logger.info('device add');
        //console.log(req);

        //获取表单数据，josn
        var device_name = req.body['device_name'];
        var devunit_name = req.body['devunit_name'];
        var project_name = req.body['project_name'];
        var gateway_vendor = req.body['gateway_vendor'];
        var gateway_sn = req.body['gateway_sn'];
        var comment = req.body['comment'];

        //console.log(fields);
        logger.info('device_name:', device_name);
        logger.info('devunit_name:', devunit_name);
        logger.info('project_name:', project_name);
        logger.info('gateway_vendor:', gateway_vendor);
        logger.info('gateway_sn:', gateway_sn);


        //参数有效性检查
        if (!device_name){
            res.send({ret_code: 1002, ret_msg: 'FAILED', extra: '用户输入参数无效'});
            return;
        }

        var query = await DB.DevunitManageTable.findOne({'device_name': device_name}).exec() ;
        if (query != null){
            console.log('the same file already exist');
            res.send({ret_code: 1008, ret_msg: '项目名重复', extra: device_name});
            return;
        }

        let mytime =  new Date();
        //写入数据库
        let myDocObj = {
            "device_name" : device_name,
            "devunit_name" : devunit_name,
            "project_name": project_name,
            "gateway_vendor" : gateway_vendor,
            "gateway_sn" : gateway_sn,
            "user_account":  req.session.user_account,

            "device_image": 'reverse',
            "device_status" : 'normal',  //上架

            "comment" : comment,

            "update_time": dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
            'sort_time':mytime.getTime(),
        };

        //console.log('romDocObj fields: ', romDocObj);
        DB.DevunitManageTable.create(myDocObj);
        res.send({ret_code: 0, ret_msg: '添加成功', extra: myDocObj});
        console.log('device add ok');
    }
    async device_add_bak(req, res){

        console.log('device add');
        //console.log(req);

        //生成multiparty对象，并配置上传目标路径
        /*
        fields： 是一个对象（上传名称和值），其属性名的字段名称和值是字段值的数组。
        files ：是一个对象（上传名称和服务器文件路径），其属性名的字段名称和值是文件对象的数组。
        */

        //let form = new multiparty.Form({uploadDir: config.image_dir});
        let fileName = '';
        let uploadedPath = '';
        let form = new formidable.IncomingForm({
            encoding: 'utf-8',
            keepExtensions: true,
            maxFieldsSize: 10 * 1024 * 1024,
            uploadDir: config.image_dir
        });

        let fields = {};   //各个字段值
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

            DB.DevunitManageTable.findOne({'device_name': fields.device_name}).exec(function (err, doc) {
                if (doc != null){
                    console.log('the same file already exist');
                    fs.unlinkSync(uploadedPath);
                    res.send({ret_code: 1008, ret_msg: '项目名重复', extra: fields.device_name});
                    return;
                }
                else{
                    let mytime =  new Date();
                    //写入数据库
                    let myDocObj = {
                        "device_name" : fields.device_name,
                        "devunit_name" : fields.devunit_name,
                        "project_name": fields.project_name,
                        "gateway_vendor" : fields.gateway_vendor,
                        "user_account":  req.session.user_account,

                        "device_image": uploadedPath,
                        "device_status" : 'normal',  //上架

                        "comment" : fields.comment,

                        "update_time": dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
                        'sort_time':mytime.getTime(),
                    };

                    //console.log('romDocObj fields: ', romDocObj);
                    DB.DevunitManageTable.create(myDocObj);
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
    async device_update(req, res, next) {

        logger.info('device update');
        //logger.info(req.body);

        //获取表单数据，josn
        let list_data = req.body['list_data'];

        //参数有效性检查
        if (!list_data){
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: req.body});
            return;
        }

        logger.info('list_data:', list_data);

        for (let i = 0; i < list_data.length; i++){
            let _id = list_data[i]['_id'];
            await DB.DevunitManageTable.findByIdAndUpdate(_id, list_data[i]).exec();
        }

        res.send({ret_code: 0, ret_msg: '成功', extra: ''});
        logger.info('device update end');
    }
    async create_data(req, res,next){
        logger.info('device create');

        //获取表单数据，josn
        let data_num = req.body['data_num'];
        let devunit_name = req.body['devunit_name'];
        logger.info('data_num:', data_num);
        logger.info('devunit_name:', devunit_name);


        let mytime = new Date();
        //删除数据， sort_time  单位：ms
        let limit_time = mytime.getTime() - 3600000;
        let prefix = 'yt' + mytime.getFullYear();
        let update_time = dtime(mytime).format('YYYY-MM-DD HH:mm');
        let minute10Table = mongoose.model(prefix + devunit_name, DB.historySchema);


        // 将实时数据存储到历史数据库
        let queryList = await DB.Gateway_Minute_Table.find();
        for (let i = 0; i < queryList.length; i++){

            //更新每天的汇总统计
            let devunit_name = queryList[i].devunit_name;
            // 历史数据表名称： y2018jinxi_2
            // 支持每年新生成一个collection
            let minute10Table = mongoose.model(prefix + devunit_name, DB.historySchema);
            let minute10Model = new minute10Table({
                'devunit_name': devunit_name,
                'update_time': update_time,
                'sort_time': mytime.getTime(),
                'data': queryList[i].data,
            });

            minute10Model.save();
        }


        console.log('文件已被保存');
        res.send({ret_code:0, ret_msg:'SUCCESS',extra: file_path});
    }

    async export_data(req, res,next){
        logger.info('device export');

        //获取表单数据，josn
        let data_range = req.body['data_range'];
        let devunit_name = req.body['devunit_name'];

        if(!data_range || data_range == '') {
            res.send({ret_code: 1,ret_msg: 'data_range 字段为空',extra: ''});
            return;
        }

        if(!devunit_name || devunit_name == '') {
            res.send({ret_code: 1,ret_msg: 'devunit_name 字段为空',extra: ''});
            return;
        }

        logger.info('data_range:', data_range);
        logger.info('devunit_name:', devunit_name);

        let mytime = new Date();
        let prefix = 'y' + mytime.getFullYear();
        let file_path='download/'+ prefix + devunit_name +'.xlsx';
        let local_path='./public/'+ file_path;

        //删除旧的文件
        try {
            fs.unlinkSync(local_path);
        }catch(err){
        }


        let minute10Table = mongoose.model(prefix + devunit_name, DB.historySchema);

        //let user = req.body.user_account;
        let queryList = await minute10Table.find().exec();
        let sheetLine=[];

        logger.info('queryList.length:', queryList.length);
        for(let i = 0; i< queryList.length; i++) {

            if (i == 0){
                let varName=['时间'];
                let dataList = queryList[i].data;
                for (let j = 0; j < dataList.length; j++) {
                    varName.push(dataList[j].varName);
                }

                //console.log('varName...', varName.toString());
                sheetLine.push(varName);
            }

            let varValue=[];
            //第一列，时间
            varValue.push(queryList[i].update_time);
            let dataList = queryList[i].data;
            for (let j = 0; j < dataList.length; j++) {
                varValue.push(dataList[j].varValue);
            }

            //console.log('varValue...', varValue.toString());
            sheetLine.push(varValue);
        }

        /*
        // 写入excel之后是一个三行两列的表格
        var data2 = [
            varName,   //第一行，变量名称
            ['zhang san', '10'],
            ['li si', '11']
        ];
        */
        console.log('xlsx.build....', sheetLine.length);
        //console.log('xlsx.build....', sheetLine[0].toString());
        //console.log('xlsx.build....', sheetLine[1].toString());
        let fileData = xlsx.build([
            {
                name:'sheet1',
                data: sheetLine
            }
        ]);

        //console.log('写文件....');
        //let time = moment().format('YYYYMMDDHHMMSS');
        //let file_path='/download/'+ time +'.xlsx';
        //let local_path = './public'+file_path;
        //fs.writeFileSync(local_path, fileData,{'flag':'w'});

        fs.writeFile(local_path, fileData, (err) => {
            if(err)
                console.log('写文件操作失败');
            else {
                console.log('写文件操作成功');
            }
        });



        console.log('文件已被保存');
        res.send({ret_code:0, ret_msg:'SUCCESS',extra: file_path});
    }

    /*
    * // Include modules.
var xlsx = require('node-xlsx');
var fs = require('fs');

// 写入excel之后是一个一行两列的表格
var data1 = [
['name', 'age']
];

// 写入excel之后是一个三行两列的表格
var data2 = [
['name', 'age'],
['zhang san', '10'],
['li si', '11']
];

var buffer = xlsx.build([
  {
      name:'sheet1',
      data:data1
  }, {
      name:'sheet2',
      data:data2
  }
  ]);

fs.writeFileSync('book.xlsx', buffer, {'flag':'w'}); // 如果文件存在，覆盖

    *
    * */
}


module.exports = new CtlDevUnitManageHandle();

