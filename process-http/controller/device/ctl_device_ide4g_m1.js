'use strict';
const DB = require( "../../../models/models.js");
const dtime = require( 'time-formater');
const config = require( "config-lite");
const logger = require( '../../../logs/logs.js');

//引入事件模块
const events = require("events");

class DeviceIde4gHandle {
    constructor(){
        //logger.info('init 111');
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

        //参数有效性检查
        if(typeof(page_size)==="undefined" && typeof(current_page)==="undefined"){
            var count = await DB.GatewayIDE4g_M1_Table.count(filter);
            var query = await DB.GatewayIDE4g_M1_Table.findOne(filter).sort(sort).limit(10);

            // 功率值矫正
            if (query.data.hasOwnProperty("C1_D1")) {                 //判断C1_D1是否存在于obj里面
                for (var i = 0; i < query.data.C1_D1.length; i++) {
                    if (query.data.C1_D1[i].id == 'Tag_gonglv') {
                        query.data.C1_D1[i].value = query.data.C1_D1[i].value / 2;
                    }
                }
            }
            res.send({ret_code: 0, ret_msg: '成功', extra: {query,count}});
        }
        else if (page_size > 0 && current_page > 0) {
            var skipnum = (current_page - 1) * page_size;   //跳过数
            var query = await DB.GatewayIDE4g_M1_Table.findOne(filter).sort(sort).skip(skipnum).limit(page_size);

            // 功率值矫正
            if (query.data.hasOwnProperty("C1_D1")) {
                for (var i = 0; i < query.data.C1_D1.length; i++) {
                    if (query.data.C1_D1[i].id == 'Tag_gonglv') {
                        query.data.C1_D1[i].value = query.data.C1_D1[i].value / 2;
                    }
                }
            }
            res.send({ret_code: 0, ret_msg: '成功', extra: query.data.C1_D1});
            //console.log('GatewayIDE4g_M1_Table:', query.data.C1_D1);
        }
        else{
            res.send({ret_code: 1002, ret_msg: '用户输入参数无效', extra: ''});
        }

        logger.info('device list end');
    }


}


module.exports = new DeviceIde4gHandle();

