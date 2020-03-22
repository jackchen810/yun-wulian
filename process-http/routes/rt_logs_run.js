'use strict';

const express = require('express');
const RunLogHandle = require('../controller/logs/ctl_devlog_run.js');
const Check = require( '../../middlewares/check');
const router = express.Router();


console.log("enter route of run logs");


//获取渠道下的设备信息列表
router.all('/logs/list', RunLogHandle.list);
router.all('/logs/page/list', RunLogHandle.page_list);
router.all('/project/logs/list', RunLogHandle.prj_list);
router.all('/project/logs/page/list', RunLogHandle.prj_page_list);



module.exports = router;
