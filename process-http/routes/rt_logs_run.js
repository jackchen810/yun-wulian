'use strict';

const express = require('express');
const RunLogHandle = require('../controller/logs/ctl_devlog_run.js');
const Check = require( '../../middlewares/check');
const router = express.Router();


console.log("enter route of run logs");


//获取渠道下的设备信息列表
router.all('/list', RunLogHandle.list);
router.all('/page/list', RunLogHandle.page_list);



module.exports = router;
