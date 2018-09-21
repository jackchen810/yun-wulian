'use strict';

const express = require('express');
const Account = require('../controller/admin/ctl_acount.js');
const Check = require('../../middlewares/check.js');
const router = express.Router();

console.log("enter route of account");

router.all('/login', /*Check.checkAdminStatus,*/ Account.login);
router.all('/register',/*Check.checkSuperAdmin,*/ Account.register);
router.all('/logout', Check.checkAdminStatus,Account.logout);
router.all('/change',/* Check.checkSuperAdmin,*/ Account.changePassword);
router.all('/revoke',Check.checkSuperAdmin, Account.revoke);
router.all('/restore',Check.checkSuperAdmin, Account.restore);
router.all('/list', Check.checkSuperAdmin, Account.getAllAdmin);
//router.all('/count', Account.getAdminCount);
//router.all('/update/avatar/:admin_id', Account.updateAvatar);

module.exports = router;
