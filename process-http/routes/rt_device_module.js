'use strict';

const express = require('express');
const CtlDeviceModule = require('../controller/device/ctl_device_module.js');
const router = express.Router();

console.log("enter route of device module");


router.all('/run/status',  CtlDeviceModule.module_run_status);

module.exports = router;
