'use strict';


const admin_router = require('./admin.js');
const script_router = require('./script.js');
const rom_router = require('./rom.js');
const pkg_router = require('./pkg.js');
const manage_router = require('./manage.js');
const task_router = require('./task.js');
const device_router = require('./device.js');
const devtype_router = require('./devtype.js');
const stats_router = require('./stats.js');



 function https_web_router(app) {
     //渠道相关
     app.use('/admin', admin_router);
     
     //脚本相关
     app.use('/script', script_router);

     //固件相关
     app.use('/rom', rom_router);

     //插件相关
     app.use('/pkg', pkg_router);

     //管理功能
     app.use('/manage', manage_router);

     //任务功能
     app.use('/task', task_router);

     //设备管理功能
     app.use('/device', device_router);

     //设备型号管理功能
     app.use('/devtype', devtype_router);

     //数据统计功能
     app.use('/stats', stats_router);
}


//导出模块
module.exports = https_web_router;
