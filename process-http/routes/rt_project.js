'use strict';

const express = require('express');
const CtlProject = require('../controller/project/ctl_project.js');
const CtlDevice = require('../controller/project/ctl_device.js');
const router = express.Router();

console.log("enter route of project");


router.all('/list',  CtlProject.project_list);
router.all('/add',  CtlProject.project_add);

router.all('/list',  CtlDevice.device_list);
router.all('/add',  CtlDevice.device_add);

module.exports = router;
