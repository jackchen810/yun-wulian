'use strict';
const mongoose = require('mongoose');
const dtime = require( 'time-formater');
const config = require( "config-lite");
const DB = require( "../../../models/models.js");
const logger = require( '../../../logs/logs.js');
const fs = require("fs");



/* 设备元的管理，以智能设备为key，对齐属性管理 */
class CtlTriggerManageHandle {
    constructor(){
        //logger.info('init 111');
        //this.tmp_correction_data_hour();
        //this.tmp_correction_data_day();

    }

    async trigger_list(req, res, next) {

        logger.info('trigger list');
        //logger.info('req.body', req.body);
        //logger.info('headers:', req.headers);
        //logger.info('session:', req.session);
        //logger.info('sessionID:', req.sessionID);

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


        let queryList = await DB.DevunitTriggerTable.find(filter).sort(sort).exec();
        res.send({ret_code: 0, ret_msg: '成功', extra: queryList, total: queryList.length});
        //logger.info('queryList:', queryList[0]);
        //logger.info('queryList.length:', queryList.length);
        logger.info('trigger list end');
    }

    async trigger_page_list(req, res, next) {
        logger.info('trigger page list');
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
        let queryList = await DB.DevunitTriggerTable.find(filter).sort(sort).skip(skipnum).limit(page_size).exec();
        res.send({ret_code: 0, ret_msg: '成功', extra: queryList, total: queryList.length});
        //logger.info('queryList:', queryList);
        logger.info('trigger page list end');
    }



    async trigger_array(req, res, next) {
        logger.info('trigger array');
        //logger.info(req.body);

        let queryList = await DB.DevunitTriggerTable.find();
        let deviceList = [];
        for (let i = 0; i < queryList.length; i++){
            deviceList.push(queryList[i]['device_name']);
        }

        res.send({ret_code: 0, ret_msg: 'SUCCESS', extra:deviceList, total:queryList.length});
        logger.info('trigger array end');
    }


    async trigger_del(req, res, next) {

        logger.info('trigger del');
        //logger.info(req.body);

        //获取表单数据，josn
        let _id = req.body['_id'];

        //参数有效性检查
        if (!_id){
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: req.body});
            return;
        }

        logger.info('_id:', _id);

        let query = await DB.DevunitTriggerTable.findByIdAndRemove(_id).exec();
        res.send({ret_code: 0, ret_msg: '成功', extra: query});
        logger.info('trigger del end');
    }


    async trigger_add(req, res, next){
        logger.info('trigger add');
        //logger.info(req);

        //获取表单数据，josn
        var device_name = req.body['device_name'];
        var devunit_name = req.body['devunit_name'];
        var var_name = req.body['var_name'];
        var var_value = req.body['var_value'];
        var if_number = req.body['if_number'];
        var if_symbol = req.body['if_symbol'];
        var if_true_comment = req.body['if_true_comment'];
        var if_false_comment = req.body['if_false_comment'];
        var logs_type = req.body['logs_type'];

        //logger.info(fields);
        logger.info('devunit_name:', devunit_name, ', logs_type:', logs_type);
        logger.info('var_name:', var_name, ', var_value:', var_value);
        logger.info('if_symbol:', if_symbol, ', if_number:', if_number);
        logger.info('if_true_comment:', if_true_comment, ', if_false_comment', if_false_comment);


        //参数有效性检查
        if (!devunit_name){
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: req.body});
            return;
        }


        let mytime =  new Date();
        //写入数据库
        let myDocObj = {
            "device_name" : device_name,
            "devunit_name" : devunit_name,
            "var_name" : var_name,
            //"var_value" : var_value,
            "if_number": if_number,
            "if_symbol" : if_symbol,
            "if_true_comment" : if_true_comment,
            "if_false_comment" : if_false_comment,
            "logs_type": logs_type,

            "update_time": dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
            'sort_time':mytime.getTime(),
        };

        let wherestr = {
            "devunit_name" : devunit_name,
            "var_name" : var_name,
            "if_number": if_number,
            "if_symbol" : if_symbol,
        };

        let query = await DB.DevunitTriggerTable.findOne(wherestr);
        if (query == null){
            DB.DevunitTriggerTable.create(myDocObj);
            res.send({ret_code: 0, ret_msg: '添加成功', extra: wherestr});
        }
        else{
            res.send({ret_code: 1001, ret_msg: '触发器重复，无法添加', extra: wherestr});
        }

        logger.info('device add ok');
    }
    async trigger_update(req, res, next) {

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
            await DB.DevunitTriggerTable.findByIdAndUpdate(_id, list_data[i]).exec();
        }

        res.send({ret_code: 0, ret_msg: '成功', extra: ''});
        logger.info('device update end');
    }


}


module.exports = new CtlTriggerManageHandle();

