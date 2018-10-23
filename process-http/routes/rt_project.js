'use strict';

const express = require('express');
const CtlProject = require('../controller/project/ctl_project.js');
const router = express.Router();

console.log("enter route of project");


router.all('/list',  CtlProject.project_list);
router.all('/page/list',  CtlProject.project_page_list);
router.all('/array',  CtlProject.project_array);
router.all('/add',  CtlProject.project_add);
router.all('/del',  CtlProject.project_del);
router.all('/status/update',  CtlProject.project_status_update);


module.exports = router;
