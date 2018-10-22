'use strict';

const express = require('express');
const CtlDevice = require('../controller/project/ctl_device.js');
const router = express.Router();

console.log("enter route of project");


router.all('/list',  CtlDevice.device_list);
router.all('/add',  CtlDevice.device_add);
//router.all('/del',  CtlDevice.project_del);
//router.all('/hide',  CtlDevice.project_hide);
//router.all('/resume',  CtlDevice.project_resume);


module.exports = router;
