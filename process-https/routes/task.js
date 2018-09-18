'use strict';

import express from 'express'
import TaskHandle from '../../controller-https/task/task.js'
import RomHandle from '../../controller-https/rom/rom.js'
import RomUpgradeHnd from '../../controller-https/rom/rom_upgrade.js'


const router = express.Router();


console.log("enter route of task");



//获取任务列表
router.all('/list', TaskHandle.list);

//新建任务（固件升级，插件升级，脚本执行）
//router.all('/add', TaskHandle.add);

//查看升级过程状态
router.all('/status', TaskHandle.status);

//恢复冻结任务
router.all('/restore', TaskHandle.restore);

//冻结该任务
router.all('/revoke', TaskHandle.revoke);

//固件升级该任务
router.all('/add/sysupgrade', RomUpgradeHnd.add_sysupgrade_check, RomUpgradeHnd.add_sysupgrade);

//获取固件升级任务列表
router.all('/list/sysupgrade', RomUpgradeHnd.sysupgrade_update_status, RomUpgradeHnd.list_sysupgrade);

//获取固件升级任务列表
router.all('/list/detail', RomUpgradeHnd.list_detail);


module.exports = router;