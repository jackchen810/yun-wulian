'use strict';


const gateway_router = require("./rt_gateway_ide4g.js");
const admin_router = require('./rt_acount.js');
const prj_manage_router = require('./rt_project_manage.js');
const dev_manage_router = require('./rt_device_manage.js');
const dev_module_router = require('./rt_device_module.js');
const wechat_router = require('./rt_wechat.js');


 function http_web_router(app) {

     //用户登录相关
     app.use('/api/admin', admin_router);

     //stats
     app.use('/api/gateway', gateway_router);

     //project
     app.use('/api/project/manage', prj_manage_router);

     //device
     app.use('/api/device/manage', dev_manage_router);

     //module
     app.use('/api/module', dev_module_router);

     //wechat
     app.use('/api/wechat', wechat_router);

     // Welcome test
     app.get('/test', function(req, res) {
         res.status(200).send('Welcome, this is test!');
     });
}


//导出模块
module.exports = http_web_router;