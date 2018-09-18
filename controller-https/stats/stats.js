'use strict';

const DB = require('../../models/models.js');
const dtime = require('time-formater');
const logger = require('../../logs/logs.js');
const schedule = require('node-schedule');


class StatsHandle {
    constructor() {
        //logger.info('init 111');
        //this.update_online_count();
        this.provs = [
            {label:"北京市",value:"北京"},
            {label:"天津市",value:"天津"},
            {label:"河北省",value:"河北"},
            {label:"山西省",value:"山西"},
            {label:"内蒙古",value:"内蒙古"},
            {label:"辽宁省",value:"辽宁"},
            {label:"吉林省",value:"吉林"},
            {label:"黑龙江省",value:"黑龙江"},
            {label:"上海市",value:"上海"},
            {label:"江苏省",value:"江苏"},
            {label:"浙江省",value:"浙江"},
            {label:"安徽省",value:"安徽"},
            {label:"福建省",value:"福建"},
            {label:"江西省",value:"江西"},
            {label:"山东省",value:"山东"},
            {label:"河南省",value:"河南"},
            {label:"湖北省",value:"湖北"},
            {label:"湖南省",value:"湖南"},
            {label:"广东省",value:"广东"},
            {label:"广西",value:"广西"},
            {label:"海南省",value:"海南"},
            {label:"重庆市",value:"重庆"},
            {label:"四川省",value:"四川"},
            {label:"贵州省",value:"贵州"},
            {label:"云南省",value:"云南"},
            {label:"西藏",value:"西藏"},
            {label:"陕西省",value:"陕西"},
            {label:"甘肃省",value:"甘肃"},
            {label:"青海省",value:"青海"},
            {label:"宁夏",value:"宁夏"},
            {label:"新疆",value:"新疆"},
            {label:"台湾省",value:"台湾"},
            {label:"香港",value:"香港"},
            {label:"澳门",value:"澳门"}];

        this.location_list = this.location_list.bind(this);
        this.online_count_by_day = this.online_count_by_day.bind(this);

        logger.info('this.provs', this.provs.length);
        //logger.info('this.provs', this.provs[0]);
        //本地调试, 使用 add by chenzejun
        /*
        if (process.env.NODE_ENV == 'local') {
            this.online_count_add_fake(100);
            this.invoice_count_add_fake(100);
        }
        */

    }


    async online_count_by_day(req, res, next) {

        logger.info('online list');
        //logger.info(req.body);

        //获取表单数据，josn
        var limit = req.body['limit'];    //限制文档个数
        var user_type = req.session.user_type;
        var user_name = req.body['user_name'];

        if (!limit) {
            limit = 100;
        }

        logger.info('user_name:', user_name);
        logger.info('user_type:', user_type);
        logger.info('limit:', limit);


        var mytime = new Date();
        var newList = [];
        for (var i = 0; i < limit; i++){
            var doc_at_day = dtime(mytime).format('YYYY-MM-DD');
            mytime.setDate(mytime.getDate() - 1);
            var wherestr = {'user_name': user_name, 'doc_create_at': doc_at_day};

            var online_count = 0;
            var query = await DB.onlineDayTable.findOne(wherestr).exec();
            if (query != null){
                online_count = query.online_count;
            }
            var item = {
                "user_name": user_name,
                "online_count": online_count,
                "doc_create_at": doc_at_day
            };
            newList.push(item);
        }


        res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: newList, total: limit});

        logger.info('online list end');
    }


    //开票数量,前两周（每天开票数量），粒度：天
    async invoice_count_by_day(req, res, next) {

        logger.info('invoice list');
        //logger.info(req.body);
        var user_name = req.body['user_name'];
        var limit = req.body['limit'];    //限制文档个数
        var user_type = req.session.user_type;
        var mytime = new Date();

        if (!limit) {
            limit = 100;
        }

        logger.info('user_name:', user_name);
        logger.info('user_type:', user_type);
        logger.info('limit:', limit);


        var newList = [];
        for (var i = 0; i < limit; i++){
            var doc_at_day = dtime(mytime).format('YYYY-MM-DD');
            mytime.setDate(mytime.getDate() - 1);
            if (user_type == 0) {  //超级管理员，所有数量{
                var wherestr = {'doc_create_at': doc_at_day};
            }
            else{
                var wherestr = {'user_name': user_name, 'doc_create_at': doc_at_day};
            }
            var queryList = await DB.InvoiceDayTable.find(wherestr).exec();
            var invoice_count = 0;
            for (var m = 0; m < queryList.length; m++){
                invoice_count += queryList[m].invoice_count;
            }

            var item = {
                "user_name" : user_name,
                "invoice_count" : invoice_count,
                "doc_create_at" : doc_at_day
            }
            newList.push(item);
        }

        res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: newList, total: limit});
        logger.info('invoice list end');
    }



    async invoice_trend_by_hour(req, res, next) {

        logger.info('invoice_trend list');
        //logger.info(req.body);

        //获取表单数据，josn
        var user_name = req.body['user_name'];
        var limit = req.body['limit'];    //限制文档个数
        var user_type = req.session.user_type;
        var mytime = new Date();

        if (!limit) {
            limit = 100;
        }

        logger.info('user_name:', user_name);
        logger.info('user_type:', user_type);
        logger.info('limit:', limit);

        var newList = [];
        for (var i = 0; i < limit; i++){
            var doc_at_hour = dtime(mytime).format('YYYY-MM-DD HH');
            mytime.setHours(mytime.getHours() - 1);
            if (user_type == 0) {  //超级管理员，所有数量{
                var wherestr = {'doc_create_at': doc_at_hour};
            }
            else{
                var wherestr = {'user_name': user_name, 'doc_create_at': doc_at_hour};
            }
            var queryList = await DB.InvoiceHourTable.find(wherestr).exec();
            var invoice_count = 0;
            for (var m = 0; m < queryList.length; m++){
                invoice_count += queryList[m].invoice_count;
            }

            var item = {
                "user_name" : user_name,
                "invoice_count" : invoice_count,
                "doc_create_at" : doc_at_hour
            }
            newList.push(item);
        }

        res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: newList, total: limit});
        logger.info('invoice_trend list end');
    }


    async location_list(req, res, next) {
        logger.info('location_list');

        var newList = [];
        for(var i = 0; i< this.provs.length; i++){
            var total = await DB.DeviceTable.count({location: this.provs[i].value}).exec();
            var item = {
                "name" : this.provs[i].value,
                "value" : total,
            }
            newList.push(item);
        }

        res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: newList});
        logger.info('location_list end');
    }


    async update_online_count() {

        //日期, 1个月后文档删除，任务记录删除
        var del_time = new Date();
        del_time.setMonth(del_time.getMonth() + 1);
        var mytime = new Date();
        var doc_at_day = dtime(mytime).format('YYYY-MM-DD');

        var userList = await DB.AdminModel.find().exec();
        for (var i = 0; i < userList.length; i++) {
            var user_name = userList[i].user_account;
            var user_type = userList[i].user_type;
            if (user_type == 0) {  //超级管理员，所有数量
                var wherestr = {'status': 'online'};
            }
            else {
                var wherestr = {'user_name': user_name, 'status': 'online'};
            }

            //计算数量
            var online_count = await DB.DeviceTable.count(wherestr).exec();
            logger.info("user_name", user_name, "online_count", online_count);

            //写入数据库
            var docObj = {
                "user_name": user_name,
                "online_count": online_count,

                'doc_create_at': doc_at_day,
                'doc_del_at': dtime(del_time).format('YYYY-MM-DD'),
            };
            //更新每天的汇总统计
            var wherestr = { 'user_name':user_name, 'doc_create_at':doc_at_day};
            await DB.onlineDayTable.update(wherestr, docObj, { upsert : true });
        }
    }


    async online_count_add_fake(count) {

        //日期, 1个月后文档删除，任务记录删除
        var del_time = new Date();
        del_time.setMonth(del_time.getMonth() + 1);
        var mytime = new Date();
        var user_name = 'iotks';
        for (var i = 0; i < count; i++) {
            mytime.setDate(mytime.getDate() - 1);
            var doc_at_day = dtime(mytime).format('YYYY-MM-DD');
            logger.info("doc_at_day", doc_at_day);

            //写入数据库
            var docObj = {
                "user_name": user_name,
                "online_count": 1500+ parseInt(500*Math.random()),

                'doc_create_at': doc_at_day,
                'doc_del_at': dtime(del_time).format('YYYY-MM-DD'),
            };
            //更新每天的汇总统计
            var wherestr = { 'user_name':user_name, 'doc_create_at':doc_at_day};
            await DB.onlineDayTable.update(wherestr, docObj, { upsert : true }).exec();
        }
    }


    async invoice_count_add_fake(count) {

        //日期, 1个月后文档删除，任务记录删除
        var del_time = new Date();
        del_time.setMonth(del_time.getMonth() + 1);
        var mytime = new Date();
        var user_name = 'local';
        for (var i = 0; i < count; i++) {
            mytime.setDate(mytime.getDate() - 1);
            var doc_at_day = dtime(mytime).format('YYYY-MM-DD');
            logger.info("doc_at_day", doc_at_day);

            //写入数据库
            //写入数据库
            var docObj = {
                "route_mac": 'D4EEAA223344',
                "user_name": user_name,
                "dev_type": 'ZC9525A',

                "invoice_count": 1500+ parseInt(500*Math.random()),
                "printer_info": '3',

                'doc_create_at': doc_at_day,
                'doc_del_at': dtime(del_time).format('YYYY-MM-DD'),
            };
            //更新每天的汇总统计
            var wherestr = { 'user_name':user_name, 'doc_create_at':doc_at_day};
            await DB.InvoiceDayTable.update(wherestr, docObj, { upsert : true }).exec();
        }
    }

/*
    async update_online_count() {

        //日期, 1个月后文档删除，任务记录删除
        var del_time = new Date();
        del_time.setMonth(del_time.getMonth() + 1);
        var mytime = new Date();
        var del_day = dtime(del_time).format('YYYY-MM-DD');
        var doc_at_day = dtime(mytime).format('YYYY-MM-DD');

        var userList = await DB.AdminModel.find().exec();
        for (var i = 0; i < userList.length; i++) {
            var user_name = userList[i].user_account;
            var user_type = userList[i].user_type;
            if (user_type == 0){  //超级管理员，所有数量
                var wherestr = { 'status':'online'};
                var online_count = await DB.DeviceTable.count(wherestr).exec();
                var wherestr = { 'doc_create_at':doc_at_day};
                var dayList = await DB.InvoiceDayTable.find(wherestr).exec();
                var invoice_count = 0;
                for (var m = 0; m < dayList.length; m++){
                    invoice_count += dayList[m].invoice_count;
                }
            }
            else{
                var wherestr = { 'user_name':user_name, 'status':'online'};
                var online_count = await DB.DeviceTable.count(wherestr).exec();
                var wherestr = { 'user_name':user_name,  'doc_create_at':doc_at_day};
                var dayList = await DB.InvoiceDayTable.find(wherestr).exec();
                var invoice_count = 0;
                for (var m = 0; m < dayList.length; m++){
                    invoice_count += dayList[m].invoice_count;
                }
            }

            //写入数据库
            var docObj = {
                "user_name": user_name,
                "online_count": online_count,
                "invoice_count": invoice_count,

                'doc_create_at': doc_at_day,
                'doc_del_at': del_day,
            };
            //更新每天的汇总统计
            var wherestr = { 'user_name':user_name, 'doc_create_at':doc_at_day};
            await DB.onlineDayTable.update(wherestr, docObj, { upsert : true }).exec();
        }
    }
*/

}

const StatsHnd = new StatsHandle();
//导出模块
module.exports = StatsHnd;

//场景：用户定时升级 ,  每天23:58 生成统计数据
schedule.scheduleJob('0 58 23 * * *', StatsHnd.update_online_count);