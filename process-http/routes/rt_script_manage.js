'use strict';

const express = require('express');
const scriptHandle = require('../controller/script/ctl_script_manage.js');
const Check = require('../../middlewares/check');
const router = express.Router();


console.log("enter route of script");



//下载插件

router.all('/download', Check.checkSuperAdmin, scriptHandle.download);


//上传插件
router.all('/upload', Check.checkSuperAdmin, scriptHandle.upload);

//上传插件上架
router.all('/release', Check.checkSuperAdmin, scriptHandle.release);

//下架固件，该固件变得不可推送升级。
router.all('/revoke', Check.checkSuperAdmin, scriptHandle.revoke);

//删除插件
router.all('/del', Check.checkSuperAdmin, scriptHandle.del);

//根据用户条件，获取插件列表
router.all('/list', Check.checkAdminStatus, scriptHandle.list);


module.exports = router;
