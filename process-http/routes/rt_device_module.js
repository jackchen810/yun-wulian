'use strict';

const express = require('express');
const CtlDeviceModule = require('../controller/device/ctl_device_module.js');
const router = express.Router();

console.log("enter route of device module");


router.all('/run/status',  CtlDeviceModule.module_run_status);
router.all('/status/stats',  CtlDeviceModule.project_status_stats);
router.all('/status/module',  CtlDeviceModule.device_info);

module.exports = router;
