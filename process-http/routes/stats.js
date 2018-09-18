'use strict';

const express = require('express');
const StatsHandle = require('../controller/stats.js');
const router = express.Router();


console.log("enter route of stats");


//根据设备的MAC地址，查询设备在线状态
router.all('/upload', StatsHandle.upload);
router.all('/stk', StatsHandle.upload_invoice_stk);



//导出模块
module.exports = router;