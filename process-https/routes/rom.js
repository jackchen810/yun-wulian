'use strict';

import express from 'express'
import RomHandle from '../../controller-https/rom/rom.js'
import Check from '../../middlewares/check'
//var mutipart= require('connect-multiparty');

const router = express.Router();
//form表单需要的中间件。
//var mutipartMiddeware = mutipart();


console.log("enter route of rom");


//下载固件
router.all('/download', RomHandle.download);
router.all('/download/check', RomHandle.download_check);

//下架固件，该固件变得不可推送升级。
router.all('/revoke', Check.checkSuperAdmin, RomHandle.revoke);

//将发行固件上传到平台, form表单需要的中间件处理
//app.use(mutipart({uploadDir:'./linshi'}));
router.all('/upload', Check.checkSuperAdmin, RomHandle.upload);

//根据用户条件，获取固件列表
router.all('/list', RomHandle.list);

//删除固件
router.all('/del', Check.checkSuperAdmin, RomHandle.del);

//固件上传成功后，该固件需上架才能推送
router.all('/release', Check.checkSuperAdmin, RomHandle.release);


module.exports = router;
