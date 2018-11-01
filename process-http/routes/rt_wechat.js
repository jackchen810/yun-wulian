'use strict';

const express = require('express');
const CtlWechatLogin = require('../controller/wechat/ctl_wechat_login.js');
const router = express.Router();

console.log("enter route of wechat");


router.all('/jscode2session',  CtlWechatLogin.jscode2session);
router.all('/user2session',  CtlWechatLogin.user2session);


module.exports = router;
