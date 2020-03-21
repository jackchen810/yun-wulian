'use strict';

const express = require('express');
const AlarmLogHandle = require('../controller/logs/ctl_devlog_alarm.js');
const Check = require( '../../middlewares/check');
const router = express.Router();


console.log("enter route of alarm logs");


//获取渠道下的设备信息列表
router.all('/list', AlarmLogHandle.list);
router.all('/page/list', AlarmLogHandle.page_list);



module.exports = router;
