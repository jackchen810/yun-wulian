'use strict';

import express from 'express'
import PkgHandle from '../../controller-https/pkg/pkg.js'
import Check from '../../middlewares/check'
const router = express.Router();


console.log("enter route of pkg");



//下载插件
router.all('/download', Check.checkSuperAdmin, PkgHandle.download);


//上传插件
router.all('/upload', Check.checkSuperAdmin, PkgHandle.upload);

//上传插件上架
//router.all('/release', Check.checkSuperAdmin, PkgHandle.release);

//下架固件，该固件变得不可推送升级。
//router.all('/revoke', Check.checkSuperAdmin,  PkgHandle.revoke);

//删除插件
router.all('/del', Check.checkSuperAdmin, PkgHandle.del);

//删除插件组
router.all('/delpkgs', Check.checkSuperAdmin, PkgHandle.delpkgs);

//根据用户条件，获取插件组列表
router.all('/list', Check.checkAdminStatus, PkgHandle.list);

//根据用户条件，获取插件组详情
router.all('/detail', Check.checkAdminStatus, PkgHandle.detail);


module.exports = router;
