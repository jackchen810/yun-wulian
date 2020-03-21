'use strict';
const DB = require( "../../../models/models.js");
const dtime = require( 'time-formater');
const config = require( "config-lite");
const logger = require( '../../../logs/logs.js');

//引入事件模块
const events = require("events");

class OperateLogsHandle {
    constructor(){
        //logger.info('init 111');

    }

    async list(req, res, next) {

        logger.info('operate logs list');
        //logger.info(req.body);

        //获取表单数据，josn
        let filter = req.body.hasOwnProperty('filter') ? req.body['filter'] : {};
        let sort = req.body.hasOwnProperty('sort') ? req.body['sort'] : {"sort_time":-1};

        logger.info('filter:', filter, ', sort:', sort);

        //参数有效性检查
        let queryList = await DB.DevunitOperateLogsTable.find(filter).sort(sort).exec();
        if (queryList.length == 0) {
            res.send({ret_code: -1, ret_msg: '数据不存在', extra: ''});
            return;
        }


        res.send({ret_code: 0, ret_msg: '成功', extra: queryList});
        logger.info('operate logs list end');
    }

    async page_list(req, res, next) {
        logger.info('operate logs page list');
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


        //logger.info('page_size:', page_size, ', current_page:', current_page);
        //logger.info('filter:', filter, ', sort:', sort);


        let total = await DB.DevunitOperateLogsTable.count(filter);
        let skipnum = (current_page - 1) * page_size;   //跳过数
        let queryList = await DB.DevunitOperateLogsTable.find(filter).sort(sort).skip(skipnum).limit(page_size).exec();
        res.send({ret_code: 0, ret_msg: '成功', extra: queryList, total: total});
        logger.info('operate logs page list end');
    }
}


module.exports = new OperateLogsHandle();

