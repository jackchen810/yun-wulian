'use strict';

const express = require('express');
const CtlProjectManage = require('../controller/manage/ctl_project_manage.js');
const router = express.Router();

console.log("enter route of project");


router.all('/list',  CtlProjectManage.project_list);

router.all('/page/list',  CtlProjectManage.project_page_list);
router.all('/array',  CtlProjectManage.project_array);
router.all('/add',  CtlProjectManage.project_add);
router.all('/del',  CtlProjectManage.project_del);
router.all('/status/update',  CtlProjectManage.project_status_update);


module.exports = router;
