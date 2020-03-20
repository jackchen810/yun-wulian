'use strict';
const express = require('express');
const CtlTriggerManage = require('../controller/manage/ctl_trigger_manage.js');
const router = express.Router();

console.log("enter route of trigger");


//router.all('/list',  CtlTriggerManage.device_list);
router.all('/page/list',  CtlTriggerManage.trigger_page_list);
router.all('/add',  CtlTriggerManage.trigger_add);
router.all('/del',  CtlTriggerManage.trigger_del);
//router.all('/update',  CtlTriggerManage.device_update);


module.exports = router;
