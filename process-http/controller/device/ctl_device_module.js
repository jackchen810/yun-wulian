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
        let device_name = req.body['device_name'];
        let channel_name = req.body['channel_name'];

        logger.info('device_name:', device_name);
        logger.info('channel_name:', channel_name);

        let dataList = [];
        let alarmList = [];
        let wherestr = {'device_name': device_name};
        let queryList = await DB.Gateway_Real_Table.find(wherestr).exec();
        //logger.info('queryList:', queryList);
        for (let i = 0; i < queryList.length; i++){

            //查看data的属性, 遍历各个通道（C1_D1）
            for(let key in queryList[i].data){
                //console.log('data key:', key);
                if (key == channel_name) {
                    let tagList = queryList[i].data[key];
                    //遍历各个Tag（Tag_H2O_wendu）
                    for (let m = 0; m < tagList.length; m++) {
                        switch(tagList[m].id)
                        {
                            case 'Tag30_dev_run_1':
                                dataList[0] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_2':
                                dataList[1] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_3':
                                dataList[2] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_4':
                                dataList[3] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_5':
                                dataList[4] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_6':
                                dataList[5] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_7':
                                dataList[6] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_8':
                                dataList[7] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_9':
                                dataList[8] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_10':
                                dataList[9] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_11':
                                dataList[10] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_12':
                                dataList[11] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_13':
                                dataList[12] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_14':
                                dataList[13] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_15':
                                dataList[14] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_16':
                                dataList[15] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_17':
                                dataList[16] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_18':
                                dataList[17] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_19':
                                dataList[18] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_20':
                                dataList[19] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_21':
                                dataList[20] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_22':
                                dataList[21] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_23':
                                dataList[22] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_24':
                                dataList[23] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_25':
                                dataList[24] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_26':
                                dataList[25] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_27':
                                dataList[26] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_28':
                                dataList[27] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_29':
                                dataList[28] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_30':
                                dataList[29] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_31':
                                dataList[30] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_32':
                                dataList[31] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_33':
                                dataList[32] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_34':
                                dataList[33] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_35':
                                dataList[34] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_36':
                                dataList[35] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_37':
                                dataList[36] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_38':
                                dataList[37] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_39':
                                dataList[38] = tagList[m].value;
                                break;
                            case 'Tag30_dev_run_40':
                                dataList[39] = tagList[m].value;
                                break;
                                ///alarm
                            case 'Tag23_p_alarm_1':
                                alarmList[0] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_2':
                                alarmList[1] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_3':
                                alarmList[2] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_4':
                                alarmList[3] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_5':
                                alarmList[4] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_6':
                                alarmList[5] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_7':
                                alarmList[6] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_8':
                                alarmList[7] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_9':
                                alarmList[8] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_10':
                                alarmList[9] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_11':
                                alarmList[10] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_12':
                                alarmList[11] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_13':
                                alarmList[12] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_14':
                                alarmList[13] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_15':
                                alarmList[14] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_16':
                                alarmList[15] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_17':
                                alarmList[16] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_18':
                                alarmList[17] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_19':
                                alarmList[18] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_20':
                                alarmList[19] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_21':
                                alarmList[20] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_22':
                                alarmList[21] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_23':
                                alarmList[22] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_24':
                                alarmList[23] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_25':
                                alarmList[24] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_26':
                                alarmList[25] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_27':
                                alarmList[26] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_28':
                                alarmList[27] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_29':
                                alarmList[28] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_30':
                                alarmList[29] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_31':
                                alarmList[30] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_32':
                                alarmList[31] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_33':
                                alarmList[32] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_34':
                                alarmList[33] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_35':
                                alarmList[34] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_36':
                                alarmList[35] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_37':
                                alarmList[36] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_38':
                                alarmList[37] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_39':
                                alarmList[38] = tagList[m].value;
                                break;
                            case 'Tag23_p_alarm_40':
                                alarmList[39] = tagList[m].value;
                                break;
                        }
                        //next tag
                        continue;
                    }

                    // 符合条件的
                    //logger.info('found:', i, key, channel_name);
                    break;
                }
            }

        }

        //logger.info('dataList:', dataList);
        res.send({ret_code: 0, ret_msg: '成功', extra: {dataList, alarmList}});
        logger.info('device module status end');
    }

}


module.exports = new DeviceModuleHandle();

