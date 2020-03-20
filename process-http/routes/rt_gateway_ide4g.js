'use strict';

const express = require('express');
const GatewayReal = require('../controller/device/ctl_device_unit_real.js');
const GatewayM1 = require('../controller/device/ctl_device_unit_m1.js');
const router = express.Router();

console.log("enter route of gateway_ide4g");


router.all('/data/list',  GatewayReal.real_list);
router.all('/page/list',  GatewayReal.page_list);
router.all('/real/data',  GatewayReal.real_data);
router.all('/minute1/list',  GatewayM1.minute1_list);
router.all('/hour1/list',  GatewayM1.hour1_list);
router.all('/day1/list',  GatewayM1.day1_list);



router.all('/module/run/status',  GatewayM1.day1_list);
//router.all('/update/avatar/:admin_id', Account.updateAvatar);

module.exports = router;
