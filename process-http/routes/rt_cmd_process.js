'use strict';

const express = require('express');
const CmdProcHandle = require('../controller/cmds/ctl_cmd_process.js');



const router = express.Router();


console.log("enter route of cmds");



//查看升级过程状态
router.all('/exec/shell', CmdProcHandle.exec_shell_cmd);

//执行远程ssh命令
router.all('/exec/remote/ssh', CmdProcHandle.exec_remote_ssh);

//执行远程重启命令
router.all('/exec/remote/reboot', CmdProcHandle.exec_remote_reboot);


//执行远程set命令
router.all('/exec/remote/set', CmdProcHandle.record_operate_log, CmdProcHandle.exec_remote_set);

module.exports = router;