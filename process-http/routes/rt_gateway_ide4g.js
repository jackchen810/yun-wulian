'use strict';

const express = require('express');
const Gateway = require('../controller/device/ctl_gateway_ide4g.js');
const router = express.Router();

console.log("enter route of gateway_ide4g");


router.all('/data/list',  Gateway.list);
//router.all('/count', Account.getAdminCount);
//router.all('/update/avatar/:admin_id', Account.updateAvatar);

module.exports = router;
