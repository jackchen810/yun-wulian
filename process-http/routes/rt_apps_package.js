'use strict';

const express = require('express');
const AppsPkgHandle = require('../controller/apps/ctl_apps_package.js');
const Check = require('../../middlewares/check');

const router = express.Router();


console.log("enter route of pkg");



//下载插件
router.all('/download', Check.checkSuperAdmin, AppsPkgHandle.download);


//上传插件
router.all('/upload', Check.checkSuperAdmin, AppsPkgHandle.upload);

//上传插件上架
//router.all('/release', Check.checkSuperAdmin, AppsPkgHandle.release);

//下架固件，该固件变得不可推送升级。
//router.all('/revoke', Check.checkSuperAdmin,  AppsPkgHandle.revoke);

//删除插件
router.all('/del', Check.checkSuperAdmin, AppsPkgHandle.del);

//删除插件组
router.all('/delpkgs', Check.checkSuperAdmin, AppsPkgHandle.delpkgs);

//根据用户条件，获取插件组列表
router.all('/list', Check.checkAdminStatus, AppsPkgHandle.list);

//根据用户条件，获取插件组详情
router.all('/detail', Check.checkAdminStatus, AppsPkgHandle.detail);


module.exports = router;
