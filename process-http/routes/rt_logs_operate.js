'use strict';

const express = require('express');
const OpLogHandle = require('../controller/logs/ctl_operate_log.js');
const Check = require( '../../middlewares/check');
const router = express.Router();


console.log("enter route of run logs");


//获取渠道下的设备信息列表
router.all('/list', OpLogHandle.list);
router.all('/page/list', OpLogHandle.page_list);



module.exports = router;
