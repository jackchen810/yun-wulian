'use strict';

const express = require('express');
const DevtypeHandle = require('../controller/devtype/ctl_devtype.js');
const Check = require( '../../middlewares/check');
const router = express.Router();


console.log("enter route of devtype");


//获取渠道下的设备信息列表
router.all('/list', DevtypeHandle.list);

//添加设备
router.all('/add',Check.checkSuperAdmin, DevtypeHandle.add);

//根据设备MAC，删除设备(此功能是否只允许管理员使用)
router.all('/del', Check.checkSuperAdmin, DevtypeHandle.del);

//获取坤腾IoT管理平台的设备型号
router.all('/types', DevtypeHandle.types);



module.exports = router;
