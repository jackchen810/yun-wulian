'use strict';

const express = require('express');
const AlarmLogHandle = require('../controller/logs/ctl_devlog_alarm.js');
const Check = require( '../../middlewares/check');
const router = express.Router();


console.log("enter route of alarm logs");


//获取渠道下的设备信息列表
router.all('/logs/list', AlarmLogHandle.list);
router.all('/logs/page/list', AlarmLogHandle.page_list);
router.all('/project/logs/list', AlarmLogHandle.prj_list);
router.all('/project/logs/page/list', AlarmLogHandle.prj_page_list);


module.exports = router;
