'use strict';

const express = require('express');
const GatewayReal = require('../controller/device/ctl_device_ide4g_real.js');
const GatewayM1 = require('../controller/device/ctl_device_ide4g_m1.js');
const router = express.Router();

console.log("enter route of gateway_ide4g");


router.all('/data/list',  GatewayReal.list);
router.all('/m1/list',  GatewayReal.list);
//router.all('/update/avatar/:admin_id', Account.updateAvatar);

module.exports = router;
