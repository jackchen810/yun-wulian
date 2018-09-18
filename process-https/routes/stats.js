'use strict';

const express = require('express');
const StatsHandle = require('../../controller-https/stats/stats.js');
const router = express.Router();


console.log("enter route of stats");


//在线数量
router.all('/online/count', StatsHandle.online_count_by_day);

//开票数量,前两周（每天开票数量），粒度：天
router.all('/invoice/count', StatsHandle.invoice_count_by_day);

//开票趋势, 前24小时的（每小时开票数量） 粒度：小时
router.all('/invoice/trend', StatsHandle.invoice_trend_by_hour);

//位置
router.all('/location/list', StatsHandle.location_list);


//导出模块
module.exports = router;
