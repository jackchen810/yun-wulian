'use strict';

const express = require('express');
const LogAlarmHandle = require('../controller/logs/ctl_log_alarm.js');
const Check = require( '../../middlewares/check');
const router = express.Router();


console.log("enter route of alarm logs");


//获取渠道下的设备信息列表
router.all('/list', LogAlarmHandle.list);
router.all('/page/list', LogAlarmHandle.page_list);



module.exports = router;
