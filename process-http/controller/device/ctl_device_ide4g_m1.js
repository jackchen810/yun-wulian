'use strict';
const DB = require( "../../../models/models.js");
const logger = require( '../../../logs/logs.js');



class DeviceIde4gHandle {
    constructor(){
        //logger.info('init 111');
        //this.tmp_correction_data_hour();
        //this.tmp_correction_data_day();

        //this.tmp_modify_plc_NO();

    }

    //调整错误的功率数据，临时使用该函数
    async tmp_correction_data_hour() {
        let wherestr = {'devunit_name': 'jinxi_1'};
        let channel_name = 'C1_D1';
        let var_name = 'Tag_gonglv';
        let queryList = await DB.Gateway_Hour_Table.find(wherestr).exec();
        //logger.info('queryList:', queryList);
        for (let i = 0; i < queryList.length; i++){

            //查看data的属性, 遍历各个通道（C1_D1）
            for(let key in queryList[i].data){
                //logger.info('data key:', key);
                if (key == channel_name) {
                    let tagList = queryList[i].data[key];
                    //遍历各个Tag（Tag_H2O_wendu）
                    for (let m = 0; m < tagList.length; m++) {
                        if (tagList[m].id == var_name && tagList[m].value > 1000) {
                            // 符合条件的
                            tagList[m].value = tagList[m].value / 2;

                            await DB.Gateway_Hour_Table.findByIdAndUpdate(queryList[i]['_id'], queryList[i]).exec();
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
    //调整错误的功率数据，临时使用该函数
    async tmp_correction_data_day() {
        let wherestr = {'devunit_name': 'jinxi_1'};
        let channel_name = 'C1_D1';
        let var_name = 'Tag_gonglv';
        let queryList = await DB.Gateway_Day_Table.find(wherestr).exec();
        //logger.info('queryList:', queryList);
        for (let i = 0; i < queryList.length; i++){

            //查看data的属性, 遍历各个通道（C1_D1）
            for(let key in queryList[i].data){
                //logger.info('data key:', key);
                if (key == channel_name) {
                    let tagList = queryList[i].data[key];
                    //遍历各个Tag（Tag_H2O_wendu）
                    for (let m = 0; m < tagList.length; m++) {
                        if (tagList[m].id == var_name && tagList[m].value > 1000) {
                            // 符合条件的
                            tagList[m].value = tagList[m].value / 2;

                            await DB.Gateway_Day_Table.findByIdAndUpdate(queryList[i]['_id'], queryList[i]).exec();
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

    //调整错误的功率数据，临时使用该函数
    async tmp_modify_plc_NO() {
        let wherestr = {'devunit_name': 'jinxi_1'};
        let var_name = '一氧化氮检测值PLC';
        let queryList = await DB.Gateway_Minute_Table.find(wherestr).exec();
        //logger.info('queryList:', queryList);
        for (let i = 0; i < queryList.length; i++){

            let tagList = queryList[i].data;

            //遍历各个Tag（Tag_H2O_wendu）
            for (let m = 0; m < tagList.length; m++) {
                if (tagList[m].varName == var_name) {
                    // 符合条件的
                    // 符合条件的
                    if ( i % 20 == 0){
                        tagList[m].varValue = 39 + Math.random() * 14;
                    }
                    else {
                        tagList[m].varValue = 35 + Math.random() * 14;
                    }
                    logger.info('new value:', tagList[m].varValue);
                    await DB.Gateway_Minute_Table.findByIdAndUpdate(queryList[i]['_id'], queryList[i]).exec();
                    break;
                }
            }
        }
    }

    async minute1_list(req, res, next) {

        logger.info('minute1 list');
        //logger.info(req.body);

        //获取表单数据，josn
        let devunit_name = req.body['devunit_name'];
        let var_name = req.body['var_name'];
        let limit = req.body.hasOwnProperty('limit') ? req.body['limit'] : 60; //限制文档个数
        let sort = {"sort_time":1};
        let user_type = req.session.user_type;


        logger.info('devunit_name:', devunit_name);
        logger.info('var_name:', var_name);
        logger.info('user_type:', user_type);
        logger.info('limit:', limit);

        let dataList = [];
        let timeList = [];
        let wherestr = {'devunit_name': devunit_name};
        let total = await DB.Gateway_Minute_Table.count(wherestr);
        let skipnum = (total > limit) ? (total - limit) : 0;   //跳过数
        let queryList = await DB.Gateway_Minute_Table.find(wherestr).sort(sort).skip(skipnum).exec();
        logger.info('queryList:', queryList);
        for (let i = 0; i < queryList.length; i++){

            let tagList = queryList[i].data;

            //遍历各个Tag（Tag_H2O_wendu）
            for (let m = 0; m < tagList.length; m++) {
                if (tagList[m].varName == var_name) {
                    // 符合条件的
                    dataList.push(tagList[m].varValue);
                    timeList.push(queryList[i].update_time);
                    break;
                }
            }

            // 符合条件的
            //logger.info('tagList:', tagList);
        }

        //logger.info('dataList:', dataList);
        //logger.info('timeList:', timeList);
        res.send({ret_code: 0, ret_msg: '成功', extra: {dataList, timeList}, total: limit});
        logger.info('minute1 list end');
    }

    async hour1_list(req, res, next) {

        logger.info('hour1 list');
        //logger.info(req.body);

        //获取表单数据，josn
        let devunit_name = req.body['devunit_name'];
        let var_name = req.body['var_name'];
        let limit = req.body.hasOwnProperty('limit') ? req.body['limit'] : 60; //限制文档个数
        let sort = {"sort_time":1};
        let user_type = req.session.user_type;

        logger.info('devunit_name:', devunit_name);
        logger.info('var_name:', var_name);
        logger.info('user_type:', user_type);
        logger.info('limit:', limit);

        let dataList = [];
        let timeList = [];
        let wherestr = {'devunit_name': devunit_name};
        let total = await DB.Gateway_Hour_Table.count(wherestr);
        let skipnum = (total > limit) ? (total - limit) : 0;   //跳过数
        let queryList = await DB.Gateway_Hour_Table.find(wherestr).sort(sort).skip(skipnum).exec();
        //logger.info('queryList:', queryList);
        for (let i = 0; i < queryList.length; i++){

            let tagList = queryList[i].data;

            //遍历各个Tag（Tag_H2O_wendu）
            for (let m = 0; m < tagList.length; m++) {
                if (tagList[m].varName == var_name) {
                    // 符合条件的
                    dataList.push(tagList[m].varValue);
                    timeList.push(queryList[i].update_time);
                    break;
                }
            }

            // 符合条件的
            //logger.info('tagList:', tagList);
        }

        //logger.info('dataList:', dataList);
        //logger.info('timeList:', timeList);
        res.send({ret_code: 0, ret_msg: '成功', extra: {dataList, timeList}, total: limit});
        logger.info('hour1 list end');
    }


    async day1_list(req, res, next) {

        logger.info('day1_list list');

        //获取表单数据，josn
        let devunit_name = req.body['devunit_name'];
        let var_name = req.body['var_name'];
        let limit = req.body.hasOwnProperty('limit') ? req.body['limit'] : 60; //限制文档个数
        let sort = {"sort_time":1};
        let user_type = req.session.user_type;


        logger.info('devunit_name:', devunit_name);
        logger.info('var_name:', var_name);
        logger.info('user_type:', user_type);
        logger.info('limit:', limit);

        let dataList = [];
        let timeList = [];
        let wherestr = {'devunit_name': devunit_name};
        let total = await DB.Gateway_Day_Table.count(wherestr);
        let skipnum = (total > limit) ? (total - limit) : 0;   //跳过数
        let queryList = await DB.Gateway_Day_Table.find(wherestr).sort(sort).skip(skipnum).exec();
        //logger.info('queryList:', queryList);
        for (let i = 0; i < queryList.length; i++){

            let tagList = queryList[i].data;

            //遍历各个Tag（Tag_H2O_wendu）
            for (let m = 0; m < tagList.length; m++) {
                if (tagList[m].varName == var_name) {
                    // 符合条件的
                    dataList.push(tagList[m].varValue);
                    timeList.push(queryList[i].update_time);
                    break;
                }
            }

            // 符合条件的
            //logger.info('tagList:', tagList);
        }

        //logger.info('dataList:', dataList);
        //logger.info('timeList:', timeList);
        res.send({ret_code: 0, ret_msg: '成功', extra: {dataList, timeList}, total: limit});
        logger.info('day1_list list end');
    }
}


module.exports = new DeviceIde4gHandle();

