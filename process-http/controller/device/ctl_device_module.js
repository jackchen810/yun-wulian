'use strict';
const DB = require( "../../../models/models.js");
const logger = require( '../../../logs/logs.js');



class DeviceModuleHandle {
    constructor(){
        //logger.info('init 111');

    }


    async module_run_status(req, res, next) {

        logger.info('device module status');
        //logger.info(req.body);

        //获取表单数据，josn
        let devunit_name = req.body['devunit_name'];

        logger.info('devunit_name:', devunit_name);

        let dataList = [];
        let alarmList = [];
        let wherestr = {'devunit_name': devunit_name};
        let queryList = await DB.Gateway_Real_Table.find(wherestr).exec();
        //logger.info('queryList:', queryList);
        for (let i = 0; i < queryList.length; i++){

            let tagList = queryList[i].data;
            //遍历各个Tag（Tag_H2O_wendu）
            for (let m = 0; m < tagList.length; m++) {
                switch(tagList[m].varName)
                {
                    case '臭氧发生器模块启动1':
                        dataList[0] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动2':
                        dataList[1] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动3':
                        dataList[2] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动4':
                        dataList[3] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动5':
                        dataList[4] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动6':
                        dataList[5] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动7':
                        dataList[6] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动8':
                        dataList[7] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动9':
                        dataList[8] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动10':
                        dataList[9] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动11':
                        dataList[10] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动12':
                        dataList[11] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动13':
                        dataList[12] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动14':
                        dataList[13] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动15':
                        dataList[14] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动16':
                        dataList[15] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动17':
                        dataList[16] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动18':
                        dataList[17] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动19':
                        dataList[18] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动20':
                        dataList[19] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动21':
                        dataList[20] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动22':
                        dataList[21] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动23':
                        dataList[22] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动24':
                        dataList[23] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动25':
                        dataList[24] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动26':
                        dataList[25] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动27':
                        dataList[26] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动28':
                        dataList[27] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动29':
                        dataList[28] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动30':
                        dataList[29] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动31':
                        dataList[30] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动32':
                        dataList[31] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动33':
                        dataList[32] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动34':
                        dataList[33] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动35':
                        dataList[34] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动36':
                        dataList[35] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动37':
                        dataList[36] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动38':
                        dataList[37] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动39':
                        dataList[38] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动40':
                        dataList[39] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动41':
                        dataList[40] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动42':
                        dataList[41] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动43':
                        dataList[42] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动44':
                        dataList[43] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动45':
                        dataList[44] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动46':
                        dataList[45] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动47':
                        dataList[46] = tagList[m].varValue;
                        break;
                    case '臭氧发生器模块启动48':
                        dataList[47] = tagList[m].varValue;
                        break;
                        ///alarm
                    case '故障信号1':
                        alarmList[0] = tagList[m].varValue;
                        break;
                    case '故障信号2':
                        alarmList[1] = tagList[m].varValue;
                        break;
                    case '故障信号3':
                        alarmList[2] = tagList[m].varValue;
                        break;
                    case '故障信号4':
                        alarmList[3] = tagList[m].varValue;
                        break;
                    case '故障信号5':
                        alarmList[4] = tagList[m].varValue;
                        break;
                    case '故障信号6':
                        alarmList[5] = tagList[m].varValue;
                        break;
                    case '故障信号7':
                        alarmList[6] = tagList[m].varValue;
                        break;
                    case '故障信号8':
                        alarmList[7] = tagList[m].varValue;
                        break;
                    case '故障信号9':
                        alarmList[8] = tagList[m].varValue;
                        break;
                    case '故障信号10':
                        alarmList[9] = tagList[m].varValue;
                        break;
                    case '故障信号11':
                        alarmList[10] = tagList[m].varValue;
                        break;
                    case '故障信号12':
                        alarmList[11] = tagList[m].varValue;
                        break;
                    case '故障信号13':
                        alarmList[12] = tagList[m].varValue;
                        break;
                    case '故障信号14':
                        alarmList[13] = tagList[m].varValue;
                        break;
                    case '故障信号15':
                        alarmList[14] = tagList[m].varValue;
                        break;
                    case '故障信号16':
                        alarmList[15] = tagList[m].varValue;
                        break;
                    case '故障信号17':
                        alarmList[16] = tagList[m].varValue;
                        break;
                    case '故障信号18':
                        alarmList[17] = tagList[m].varValue;
                        break;
                    case '故障信号19':
                        alarmList[18] = tagList[m].varValue;
                        break;
                    case '故障信号20':
                        alarmList[19] = tagList[m].varValue;
                        break;
                    case '故障信号21':
                        alarmList[20] = tagList[m].varValue;
                        break;
                    case '故障信号22':
                        alarmList[21] = tagList[m].varValue;
                        break;
                    case '故障信号23':
                        alarmList[22] = tagList[m].varValue;
                        break;
                    case '故障信号24':
                        alarmList[23] = tagList[m].varValue;
                        break;
                    case '故障信号25':
                        alarmList[24] = tagList[m].varValue;
                        break;
                    case '故障信号26':
                        alarmList[25] = tagList[m].varValue;
                        break;
                    case '故障信号27':
                        alarmList[26] = tagList[m].varValue;
                        break;
                    case '故障信号28':
                        alarmList[27] = tagList[m].varValue;
                        break;
                    case '故障信号29':
                        alarmList[28] = tagList[m].varValue;
                        break;
                    case '故障信号30':
                        alarmList[29] = tagList[m].varValue;
                        break;
                    case '故障信号31':
                        alarmList[30] = tagList[m].varValue;
                        break;
                    case '故障信号32':
                        alarmList[31] = tagList[m].varValue;
                        break;
                    case '故障信号33':
                        alarmList[32] = tagList[m].varValue;
                        break;
                    case '故障信号34':
                        alarmList[33] = tagList[m].varValue;
                        break;
                    case '故障信号35':
                        alarmList[34] = tagList[m].varValue;
                        break;
                    case '故障信号36':
                        alarmList[35] = tagList[m].varValue;
                        break;
                    case '故障信号37':
                        alarmList[36] = tagList[m].varValue;
                        break;
                    case '故障信号38':
                        alarmList[37] = tagList[m].varValue;
                        break;
                    case '故障信号39':
                        alarmList[38] = tagList[m].varValue;
                        break;
                    case '故障信号40':
                        alarmList[39] = tagList[m].varValue;
                        break;
                    case '故障信号41':
                        alarmList[40] = tagList[m].varValue;
                        break;
                    case '故障信号42':
                        alarmList[41] = tagList[m].varValue;
                        break;
                    case '故障信号43':
                        alarmList[42] = tagList[m].varValue;
                        break;
                    case '故障信号44':
                        alarmList[43] = tagList[m].varValue;
                        break;
                    case '故障信号45':
                        alarmList[44] = tagList[m].varValue;
                        break;
                    case '故障信号46':
                        alarmList[45] = tagList[m].varValue;
                        break;
                    case '故障信号47':
                        alarmList[46] = tagList[m].varValue;
                        break;
                    case '故障信号48':
                        alarmList[47] = tagList[m].varValue;
                        break;
                }
                //next tag
                continue;
            }

        }

        //logger.info('dataList:', dataList);
        res.send({ret_code: 0, ret_msg: '成功', extra: {dataList, alarmList}});
        logger.info('device module status end');
    }
    async project_status_stats(req, res, next) {

        logger.info('device project status stats');
        //logger.info(req.body);


        //获取表单数据，josn
        let project_name = req.body['project_name'];
        logger.info('project_name:', project_name);


        let run_unit_count = 0;
        let stop_unit_count = 0;
        let fault_unit_count = 0;
        let wherestr = {'project_name': project_name};
        let devList = await DB.DeviceManageTable.find(wherestr).exec();
        for (let p = 0; p < devList.length; p++) {
            //console.log('devunit_name:', devList[p]['devunit_name']);

            let wherestr = {'devunit_name': devList[p]['devunit_name']};
            let queryList = await DB.Gateway_Real_Table.find(wherestr).exec();
            //logger.info('queryList:', queryList);
            for (let i = 0; i < queryList.length; i++) {

                let tagList = queryList[i].data;
                //遍历各个Tag（Tag_H2O_wendu）
                for (let m = 0; m < tagList.length; m++) {
                    if (tagList[m]['varName'].indexOf('臭氧发生器模块启动') >=0 ){
                        //console.log('varName:', tagList[m]['varName']);

                        if (tagList[m]['varValue'] == '1.000' || tagList[m]['varValue'] == '1'){
                            run_unit_count++;
                        }
                        else{
                            stop_unit_count++;
                        }
                    }
                    if (tagList[m]['varName'].indexOf('故障信号') >=0 ){
                        //console.log('varName:', tagList[m]['varName']);

                        if (tagList[m]['varValue'] == '1.000' || tagList[m]['varValue'] == '1'){
                            fault_unit_count++;
                        }
                    }
                }
            }
        }

        let stats = {
            'run_unit_count':run_unit_count,
            'stop_unit_count':stop_unit_count,
            'fault_unit_count':fault_unit_count,
            'total_power':(run_unit_count + stop_unit_count)*20,
            'ozone_provide':(run_unit_count + stop_unit_count)*2.5,
        };
        logger.info('stats:', stats);
        res.send({ret_code: 0, ret_msg: '成功', extra: stats});
        logger.info('device project status end');
    }
    async device_info(req, res, next) {

        logger.info('device info');
        //logger.info(req.body);


        //获取表单数据，josn
        let device_name = req.body['device_name'];
        let devunit_name = req.body['devunit_name'];
        logger.info('device_name:', device_name);
        logger.info('devunit_name:', devunit_name);

        let wherestr = {'devunit_name': devunit_name};
        let queryList = await DB.Gateway_Real_Table.find(wherestr).exec();
        //logger.info('queryList:', queryList);
        for (let i = 0; i < queryList.length; i++) {

            let tagList = queryList[i].data;
            //遍历各个Tag（Tag_H2O_wendu）
            for (let m = 0; m < tagList.length; m++) {
                if (tagList[m]['varName'].indexOf('功率给定值') >=0 ){
                    //console.log('varName:', tagList[m]['varName']);

                    if (tagList[m]['varValue'] == '1.000' || tagList[m]['varValue'] == '1'){
                        run_unit_count++;
                    }
                    else{
                        stop_unit_count++;
                    }
                }
            }
        }


        logger.info('stats:', stats);
        res.send({ret_code: 0, ret_msg: '成功', extra: stats});
        logger.info('device info end');
    }
}


module.exports = new DeviceModuleHandle();

