'use strict';

const express = require('express');
const ManageHandle = require('../controller/task/ctl_apps_upgrade.js');
const Check = require('../../middlewares/check');

const router = express.Router();


console.log("enter route of apps");


router.all('/shell', ManageHandle.shell);
router.all('/shell64', ManageHandle.shell64);
router.all('/script', ManageHandle.script);
router.all('/script_result', ManageHandle.script_result);
router.all('/script_detail', ManageHandle.script_detail);
router.all('/script_detail_detail', ManageHandle.script_detail_detail);
router.all('/script_query', ManageHandle.script_query);
router.all('/apps', ManageHandle.apps);
router.all('/apps_result', ManageHandle.apps_result);
router.all('/apps_detail', ManageHandle.apps_detail);
router.all('/apps_detail_detail', ManageHandle.apps_detail_detail);
router.all('/apps_query', ManageHandle.apps_query);
router.all('/firmware', ManageHandle.firmware);
router.all('/reboot', ManageHandle.reboot);
router.all('/network', ManageHandle.network);
router.all('/passwd', ManageHandle.passwd);
router.all('/superpasswd', ManageHandle.superpasswd);

module.exports = router;
