'use strict';


const gateway_router = require("./rt_gateway_ide4g.js");
const admin_router = require('./rt_acount.js');
const prj_manage_router = require('./rt_project_manage.js');
const dev_manage_router = require('./rt_device_manage.js');
const dev_module_router = require('./rt_device_module.js');
const devtype_router = require('./rt_device_type.js');
const trigger_router = require('./rt_trigger_manage.js');
const rom_pkg_router = require('./rt_rom_package.js');
const rom_task_router = require('./rt_rom_task.js');
const script_router = require('./rt_script_manage.js');
const apps_pkg_router = require('./rt_apps_package.js');
const apps_task_router = require('./rt_apps_task.js');
const wechat_router = require('./rt_wechat.js');
const cmd_proc_router = require('./rt_cmd_process.js');
const logs_alarm_router = require('./rt_logs_alarm.js');
const config = require( "config-lite");
const fs = require("fs");
const path = require('path');

 function http_web_router(app) {

      //用户登录相关
     app.use('/api/admin', admin_router);

     //wechat 登录相关
     app.use('/api/wechat', wechat_router);

     // right check, 所有都要检查, router按挂接顺序依次匹配
     app.use('/api', function(req, res, next) {
         if (!req.hasOwnProperty("session")){
             console.log('right check fail', req.cookies);
             res.send({ret_code: 2001, ret_msg: '用户无权限，会话不存在', extra: req});
             return;
         }
         if (! req.session.hasOwnProperty("user_type")){
             console.log('right check fail', req.cookies);
             res.send({ret_code: 2001, ret_msg: '用户无权限，用户类型无法识别', extra: req.session});
             return;
         }
         //console.log('right check ok ');
         next()
     });

     //stats
     app.use('/api/gateway', gateway_router);

     //project
     app.use('/api/project/manage', prj_manage_router);

     //device
     app.use('/api/device/manage', dev_manage_router);

     //module
     app.use('/api/module', dev_module_router);

     //设备类型相关
     app.use('/api/devtype', devtype_router);


     //设备触发器相关
     app.use('/api/trigger', trigger_router);


     app.use('/api/alarm/logs', logs_alarm_router);


     //固件相关
     app.use('/api/rom', rom_pkg_router);

     //脚本相关
     app.use('/api/script', script_router);

     //插件功能
     app.use('/api/apps', apps_pkg_router);


     //固件升级任务相关
     app.use('/api/rom/task', rom_task_router);

     //插件级任务相关
     app.use('/api/apps/task', apps_task_router);





     //插件级任务相关
     app.use('/api/cmd', cmd_proc_router);




     // Welcome download
     app.use('/download', function(req, res) {
         //console.log('req.baseUrl', req.baseUrl);
         //console.log('req.path', req.path);
         //console.log('config.download_dir', config.download_dir);

         var file_name = req.path.slice(1);
         //console.log('file_name', file_name);

         // 实现文件下载
         var filePath = path.join(config.download_dir,  req.path);
         res.download(filePath, file_name, function(err){
             if(err){
                 //处理错误，可能只有部分内容被传输，所以检查一下res.headerSent
                 res.send({ret_code: -1, ret_msg: 'FAILED', extra:err});
             }else{
                 //减少下载的积分值之类的。
                 //res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: 'download ok'});
                 res.status(200);
             }
         });

     });


     // Welcome test
     app.get('/test', function(req, res) {
         res.status(200).send('Welcome, this is test!');
     });
}


//导出模块
module.exports = http_web_router;