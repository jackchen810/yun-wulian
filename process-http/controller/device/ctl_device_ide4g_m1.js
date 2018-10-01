'use strict';
const DB = require( "../../../models/models.js");
const logger = require( '../../../logs/logs.js');



class DeviceIde4gHandle {
    constructor(){
        //logger.info('init 111');
        this.update_data_hour();
        //this.update_data_day();

    }

    async update_data_hour() {
        let wherestr = {'device_name': 'jinxi_1'};
        let channel_name = 'C1_D1';
        let tag_name = 'Tag_gonglv';
        let queryList = await DB.GatewayIDE4g_Hour_Table.find(wherestr).exec();
        //logger.info('queryList:', queryList);
        for (var i = 0; i < queryList.length; i++){

            //查看data的属性, 遍历各个通道（C1_D1）
            for(var key in queryList[i].data){
                //console.log('data key:', key);
                if (key == channel_name) {
                    var tagList = queryList[i].data[key];
                    //遍历各个Tag（Tag_H2O_wendu）
                    for (var m = 0; m < tagList.length; m++) {
                        if (tagList[m].id == tag_name && tagList[m].value > 1000) {
                            // 符合条件的
                            tagList[m].value = tagList[m].value / 2;

                            await DB.GatewayIDE4g_Hour_Table.findByIdAndUpdate(queryList[i]['_id'], queryList[i]).exec();
                            break;
                        }
                    }

                    // 符合条件的
                    logger.info('update:', i, key, channel_name);
                    break;
                }
            }

        }
    }

    async update_data_day() {
        let wherestr = {'device_name': 'jinxi_1'};
        let channel_name = 'C1_D1';
        let tag_name = 'Tag_gonglv';
        let queryList = await DB.GatewayIDE4g_Day_Table.find(wherestr).exec();
        //logger.info('queryList:', queryList);
        for (var i = 0; i < queryList.length; i++){

            //查看data的属性, 遍历各个通道（C1_D1）
            for(var key in queryList[i].data){
                //console.log('data key:', key);
                if (key == channel_name) {
                    var tagList = queryList[i].data[key];
                    //遍历各个Tag（Tag_H2O_wendu）
                    for (var m = 0; m < tagList.length; m++) {
                        if (tagList[m].id == tag_name && tagList[m].value > 1000) {
                            // 符合条件的
                            tagList[m].value = tagList[m].value / 2;

                            await DB.GatewayIDE4g_Day_Table.findByIdAndUpdate(queryList[i]['_id'], queryList[i]).exec();
                            break;
                        }
                    }

                    // 符合条件的
                    logger.info('update:', i, key, channel_name);
                    break;
                }
            }

        }
    }

    async minute1_list(req, res, next) {

        logger.info('minute1 list');
        //logger.info(req.body);

        //获取表单数据，josn
        var device_name = req.body['device_name'];
        var channel_name = req.body['channel_name'];
        var tag_name = req.body['tag_name'];
        var limit = req.body['limit'];    //限制文档个数
        var user_type = req.session.user_type;

        if (!limit) {
            limit = 100;
        }

        logger.info('device_name:', device_name);
        logger.info('channel_name:', channel_name);
        logger.info('tag_name:', tag_name);
        logger.info('user_type:', user_type);
        logger.info('limit:', limit);

        var dataList = [];
        var timeList = [];
        var wherestr = {'device_name': device_name};
        var queryList = await DB.GatewayIDE4g_M1_Table.find(wherestr).limit(limit).exec();
        //logger.info('queryList:', queryList);
        for (var i = 0; i < queryList.length; i++){

            //查看data的属性, 遍历各个通道（C1_D1）
            for(var key in queryList[i].data){
                //console.log('data key:', key);
                if (key == channel_name) {
                    var tagList = queryList[i].data[key];
                    //遍历各个Tag（Tag_H2O_wendu）
                    for (var m = 0; m < tagList.length; m++) {
                        if (tagList[m].id == tag_name) {
                            // 符合条件的
                            dataList.push(tagList[m].value);
                            timeList.push(queryList[i].update_time);
                            break;
                        }
                    }

                    // 符合条件的
                    logger.info('found:', i, key, channel_name);
                    break;
                }
            }

        }

        logger.info('dataList:', dataList);
        logger.info('timeList:', timeList);
        res.send({ret_code: 0, ret_msg: '成功', extra: {dataList, timeList}, total: limit});
        logger.info('minute1 list end');
    }

    async hour1_list(req, res, next) {

        logger.info('hour1 list');
        //logger.info(req.body);

        //获取表单数据，josn
        var device_name = req.body['device_name'];
        var channel_name = req.body['channel_name'];
        var tag_name = req.body['tag_name'];
        var limit = req.body['limit'];    //限制文档个数
        var user_type = req.session.user_type;

        if (!limit) {
            limit = 100;
        }

        logger.info('device_name:', device_name);
        logger.info('channel_name:', channel_name);
        logger.info('tag_name:', tag_name);
        logger.info('user_type:', user_type);
        logger.info('limit:', limit);

        var dataList = [];
        var timeList = [];
        var wherestr = {'device_name': device_name};
        var queryList = await DB.GatewayIDE4g_Hour_Table.find(wherestr).limit(limit).exec();
        //logger.info('queryList:', queryList);
        for (var i = 0; i < queryList.length; i++){

            //查看data的属性, 遍历各个通道（C1_D1）
            for(var key in queryList[i].data){
                //console.log('data key:', key);
                if (key == channel_name) {
                    var tagList = queryList[i].data[key];
                    //遍历各个Tag（Tag_H2O_wendu）
                    for (var m = 0; m < tagList.length; m++) {
                        if (tagList[m].id == tag_name) {
                            // 符合条件的
                            dataList.push(tagList[m].value);
                            timeList.push(queryList[i].update_time);
                            break;
                        }
                    }

                    // 符合条件的
                    //logger.info('found:', i, key, channel_name);
                    break;
                }
            }

        }

        logger.info('dataList:', dataList);
        logger.info('timeList:', timeList);
        res.send({ret_code: 0, ret_msg: '成功', extra: {dataList, timeList}, total: limit});
        logger.info('hour1 list end');
    }


    async day1_list(req, res, next) {

        logger.info('day1_list list');

        //获取表单数据，josn
        var device_name = req.body['device_name'];
        var channel_name = req.body['channel_name'];
        var tag_name = req.body['tag_name'];
        var limit = req.body['limit'];    //限制文档个数
        var user_type = req.session.user_type;

        if (!limit) {
            limit = 100;
        }

        logger.info('device_name:', device_name);
        logger.info('channel_name:', channel_name);
        logger.info('tag_name:', tag_name);
        logger.info('user_type:', user_type);
        logger.info('limit:', limit);

        var dataList = [];
        var timeList = [];
        var wherestr = {'device_name': device_name};
        var queryList = await DB.GatewayIDE4g_Day_Table.find(wherestr).limit(limit).exec();
        //logger.info('queryList:', queryList);
        for (var i = 0; i < queryList.length; i++){

            //查看data的属性, 遍历各个通道（C1_D1）
            for(var key in queryList[i].data){
                //console.log('data key:', key);
                if (key == channel_name) {
                    var tagList = queryList[i].data[key];
                    //遍历各个Tag（Tag_H2O_wendu）
                    for (var m = 0; m < tagList.length; m++) {
                        if (tagList[m].id == tag_name) {
                            // 符合条件的
                            dataList.push(tagList[m].value);
                            timeList.push(queryList[i].update_time);
                            break;
                        }
                    }

                    // 符合条件的
                    //logger.info('found:', i, key, channel_name);
                    break;
                }
            }

        }

        logger.info('dataList:', dataList);
        logger.info('timeList:', timeList);
        res.send({ret_code: 0, ret_msg: '成功', extra: {dataList, timeList}, total: limit});
        logger.info('day1_list list end');
    }
}


module.exports = new DeviceIde4gHandle();

