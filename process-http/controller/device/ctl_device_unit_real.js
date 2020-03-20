'use strict';
const DB = require( "../../../models/models.js");
const dtime = require( 'time-formater');
const config = require( "config-lite");
const logger = require( '../../../logs/logs.js');

//引入事件模块
const events = require("events");

class DeviceUnitRealHandle {
    constructor(){
        //logger.info('init 111');
        // 功率值矫正

    }

    async list(req, res, next) {

        logger.info('device list');
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

        var total = await DB.Gateway_Real_Table.count(filter);

        //参数有效性检查
        if(typeof(page_size)==="undefined" && typeof(current_page)==="undefined"){
            var query = await DB.Gateway_Real_Table.findOne(filter).sort(sort).limit(10);
            res.send({ret_code: 0, ret_msg: '成功', extra: query.data, total: query.data.length});
        }
        else if (page_size > 0 && current_page > 0) {
            var skipnum = (current_page - 1) * page_size;   //跳过数
            var query = await DB.Gateway_Real_Table.findOne(filter).sort(sort).skip(skipnum).limit(page_size);
            res.send({ret_code: 0, ret_msg: '成功', extra: query.data, total: query.data.length});
            //logger.info('Gateway_Real_Table:', query.data.C1_D1);
        }
        else{
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: ''});
        }

        logger.info('device list end');
    }

    async real_list(req, res, next) {

        logger.info('device real list');
        //logger.info(req.body);

        //获取表单数据，josn
        let filter = req.body.hasOwnProperty('filter') ? req.body['filter'] : {};
        let sort = req.body.hasOwnProperty('sort') ? req.body['sort'] : {"sort_time":-1};

        logger.info('filter:', filter, ', sort:', sort);

        let query = await DB.Gateway_Real_Table.findOne(filter).sort(sort).exec();
        if (!query) {
            res.send({ret_code: -1,ret_msg: '数据不存在',extra: ''});
            return;
        }


        res.send({ret_code: 0, ret_msg: '成功', extra: query.data, total: query.data.length});
        logger.info('device real list end');
    }


    async page_list(req, res, next) {
        logger.info('device real page list');
        //logger.info(req.body);

        //获取表单数据，josn
        let page_size = req.body['page_size'];
        let current_page = req.body['current_page'];
        let filter = req.body.hasOwnProperty('filter') ? req.body['filter'] : {};
        let sort = req.body.hasOwnProperty('sort') ? req.body['sort'] : {"sort_time":-1};


        //参数有效性检查
        if (!page_size || !current_page){
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: req.body});
            return;
        }


        logger.info('page_size:', page_size, ', current_page:', current_page);
        logger.info('filter:', filter, ', sort:', sort);


        let skipnum = (current_page - 1) * page_size;   //跳过数
        let query = await DB.Gateway_Real_Table.findOne(filter).sort(sort).skip(skipnum).limit(page_size).exec();
        res.send({ret_code: 0, ret_msg: '成功', extra: query.data, total: query.data.length});
        logger.info('device real page list end');
    }


    async real_data(req, res, next) {

        logger.info('device real data');
        //logger.info(req.body);

        //获取表单数据，josn
        let filter = req.body.hasOwnProperty('filter') ? req.body['filter'] : {};
        let sort = req.body.hasOwnProperty('sort') ? req.body['sort'] : {"sort_time":-1};


        logger.info('filter:', filter, 'sort:', sort);


        let query = await DB.Gateway_Real_Table.findOne(filter).sort(sort).exec();
        if (query == null){
            res.send({ret_code: -1, ret_msg: '设备数据不存在', extra: []});
        }
        else {
            res.send({ret_code: 0, ret_msg: '成功', extra: query});
        }
        logger.info('device real data end');
    }

}


module.exports = new DeviceUnitRealHandle();

