'use strict';

const express = require('express');
const CtlProject = require('../controller/project/ctl_project.js');
const router = express.Router();

console.log("enter route of project");


router.all('/list',  CtlProject.project_list);
router.all('/array',  CtlProject.project_array);
router.all('/add',  CtlProject.project_add);
router.all('/del',  CtlProject.project_del);
router.all('/hide',  CtlProject.project_hide);
router.all('/resume',  CtlProject.project_resume);


module.exports = router;
