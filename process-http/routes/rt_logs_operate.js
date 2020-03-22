'use strict';

const express = require('express');
const OpLogHandle = require('../controller/logs/ctl_operate_log.js');
const Check = require( '../../middlewares/check');
const router = express.Router();


console.log("enter route of run logs");


//获取渠道下的设备信息列表
router.all('/logs/list', OpLogHandle.list);
router.all('/logs/page/list', OpLogHandle.page_list);
router.all('/project/logs/list', OpLogHandle.prj_list);
router.all('/project/logs/page/list', OpLogHandle.prj_page_list);



module.exports = router;
