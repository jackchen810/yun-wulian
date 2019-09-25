'use strict';

const DB = require( "../../../models/models.js");
const dtime = require( 'time-formater');
const config = require( "config-lite");
const logger = require( '../../../logs/logs.js');



class DevtypeHandle {
    constructor(){
        this.list = this.list.bind(this);
        this.add = this.add.bind(this);
        this.del = this.del.bind(this);
        this.types = this.types.bind(this);

    }

    async list(req, res, next) {

        logger.info('devtype list');
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

        // 如果没有定义过滤规则，添加默认过滤
        if(typeof(filter)==="undefined"){
            logger.info('filter undefined');
            filter = {};
        }

        //参数有效性检查
        if(typeof(page_size)==="undefined" && typeof(current_page)==="undefined"){
            var query = await DB.DevtypeTable.find(filter).sort(sort);
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: query});
        }
        else if (page_size > 0 && current_page > 0) {
            //var ret = await DB.DevtypeTable.findByPage(condition, page_size, current_page, sort);
            var skipnum = (current_page - 1) * page_size;   //跳过数
            var query = await DB.DevtypeTable.find(filter).sort(sort).skip(skipnum).limit(page_size);
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: query});
        }
        else{
            res.send({ret_code: 1002, ret_msg: 'FAILED', extra: '用户输入参数无效'});
        }
        logger.info('devtype list end');
    }

    async add(req, res, next){

        logger.info('devtype add');
        var dev_name = req.body['dev_name'];
        var dev_vendor = req.body['dev_vendor'];
        var chip_type = req.body['chip_type'];
        var chip_vendor = req.body['chip_vendor'];
        var comment =  req.body['comment'];


        //参数有效性检查
        if (typeof(dev_name) === "undefined" || dev_name == ""
            || typeof(dev_vendor) === "undefined" || dev_vendor == ""
            || typeof(chip_type) === "undefined" || chip_type == ""
            || typeof(chip_vendor) === "undefined" || chip_vendor == "") {
            res.send({ret_code: 1002, ret_msg: 'FAILED', extra: '用户输入参数无效'});
            return;
        }


        var mytime = new Date();
        //获取表单数据，josn
        try{
            //写入数据库
            var devtypeDocObj = {
                "dev_name": dev_name,
                "dev_vendor": dev_vendor,
                "chip_type": chip_type,
                "chip_vendor": chip_vendor,
                "comment": comment,
                'create_date': dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
                'sort_time':mytime.getTime(),
            };

            var query = await DB.DevtypeTable.create(devtypeDocObj);
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:query})
        }catch(err){
            logger.info('获取数据失败');
            res.send({ret_code: 1004, ret_msg: 'FAILED', extra:err});
        }
    }

    async del(req, res, next) {

        logger.info('devtype delete');
        //logger.info(req.body);

        //获取表单数据，josn
        var id = req.body['_id'];

        //参数有效性检查
        if(typeof(id)==="undefined"){
            res.send({ret_code: 1002, ret_msg: 'FAILED', extra:'用户输入参数无效'});
            return;
        }

        try{
            var query = await DB.DevtypeTable.findByIdAndRemove (id);
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:query});
        }catch(err){
            res.send({ret_code: 1004, ret_msg: 'FAILED', extra:err});
        }
        logger.info('devtype delete end');
    }

    //查找设备型号列表
    async types(req, res, next) {
        logger.info('devtype types');
        //logger.info(req.body);
        try{
            var query = await DB.DevtypeTable.distinct ('dev_name');
            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:query});
        }catch(err){
            res.send({ret_code: 1004, ret_msg: 'FAILED', extra:err});
        }
        logger.info('devtype delete end');
    }


}

//导出模块
module.exports = new DevtypeHandle();