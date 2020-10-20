'use strict';

const express = require('express');
const CtldragManage = require('../controller/sensor/ctl_sensor.js');
const router = express.Router();

console.log("enter route of project");


router.all('/add',  CtldragManage.sensor_add);
router.all('/list',  CtldragManage.sensor_list);
router.all('/del',  CtldragManage.sensor_del);
router.all('/change',  CtldragManage.sensor_change);



module.exports = router;
