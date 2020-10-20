'use strict';
const dtime = require('time-formater');
const config = require("config-lite");
const DB = require("../../../models/models.js");
const logger = require('../../../logs/logs.js');

class DevtypeHandlev {
    constructor() {

    }
    async sensor_add(req, res, next) {
        let sensor_facility = req.body['sensor_facility'];
        let sensor_pct = req.body['sensor_pct'];
        let sensor_name = req.body['sensor_name'];
        let project_name = req.body['project_name'];
        let sensor_type = req.body['sensor_type'];
        let sensor_No = req.body['sensor_No'];
        let sensor_unit = req.body['sensor_unit'];
        let mytime = new Date();
        let mysensor = {
            sensor_name,
            sensor_type,
            sensor_facility,
            sensor_unit,
            project_name,
            sensor_No,
            sensor_time: dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
            sensor_pct
        }
        await DB.SensorTable.create(mysensor);
        res.send({ ret_code: 200, ret_msg: '添加成功', extra: mysensor });
    }
    async sensor_list(req, res, next) {
        let _id = req.body['_id'];
        let pct_name = req.body['pct_name'];
        let project_name = req.body['project_name'];
        let sensor_facility = req.body['sensor_facility'];
        let sensor_No = req.body['sensor_No'];
        var page_size = req.body['page_size'];
        var current_page = req.body['current_page'];

        var skipnum = (current_page - 1) * page_size;   //跳过数
        let data = {
            project_name,
        }
        if(sensor_facility){
            data.sensor_facility = sensor_facility
        }
        if(sensor_No){
            data.sensor_No = sensor_No
        }
        if(_id){
            var query = await DB.SensorTable.find({_id},{sensor_facility:1,sensor_name:1,sensor_No:1});
            res.send({ ret_code: 200, ret_msg: 'SUCCESS', extra: query});
            return
        }

        if(pct_name){
            var query = await DB.SensorTable.find({project_name:pct_name},{sensor_facility:1, sensor_name:1,sensor_No:1,project_name:1,sensor_unit:1});
                res.send({ ret_code: 200, ret_msg: 'SUCCESS', extra: query});
                return;     
        }
        var query = await DB.SensorTable.find(data).sort({ 'sensor_time': -1 }).skip(skipnum).limit(page_size);
       
        let queryListd = await DB.SensorTable.find(data).exec(); //总数
        res.send({ ret_code: 200, ret_msg: 'SUCCESS', extra: query, total: queryListd.length });
    }
    async sensor_del(req, res, next) {
        let _id = req.body['_id'];
        if (typeof (_id) == "undefined") {
            res.send({ ret_code: 1002, ret_msg: 'FAILED', extra: '参数无效' });
        }
        try {
            var query = await DB.SensorTable.findByIdAndRemove(_id);
            res.send({ ret_code: 200, ret_msg: 'SUCCESS', extra: query });
        } catch (err) {
            res.send({ ret_code: 1004, ret_msg: 'FAILED', extra: err });
        }


    }
    async sensor_change(req, res, next) {
        let _id = req.body['_id'];
        let sensor_facility = req.body['sensor_facility'];
        let sensor_name = req.body['sensor_name'];
        let sensor_type = req.body['sensor_type'];
        let sensor_No = req.body['sensor_No'];
        let sensor_unit = req.body['sensor_unit'];
        let updata = {
            sensor_facility,
            sensor_name,
            sensor_type,
            sensor_No,
            sensor_unit
        }
        if (typeof (_id) == "undefined") {
            res.send({ ret_code: 1002, ret_msg: 'FAILED', extra: '参数无效' });
        }
        await DB.SensorTable.findByIdAndUpdate(_id, updata, function (err) {
            if (err) {
                res.send({ ret_code: 1004, ret_msg: 'FAILED', extra: err });
            } else {
                res.send({ ret_code: 200, ret_msg: 'SUCCESS' });
            }
        })



    }

}

module.exports = new DevtypeHandlev();