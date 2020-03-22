'use strict';


const http_router = require('../../process-http/routes/http_route_entry.js');
const gateway_router = require("../../process-http/routes/rt_gateway_ide4g.js");
const admin_router = require('../../process-http/routes/rt_acount.js');
const project_router = require('../../process-http/routes/rt_project_manage.js');
const device_router = require('../../process-http/routes/rt_devunit_manage.js');


 function https_web_router(app) {

     //用户登录相关
     app.use('/api/admin', admin_router);

     //stats
     app.use('/api/gateway', gateway_router);

     //manage
     app.use('/api/manage', project_router);

     //device
     app.use('/api/device', device_router);

     //wechat 登录相关
     app.use('/api/wechat', wechat_router);


     // Welcome
     app.get('/test', function(req, res) {
         res.status(200).send('Welcome Https, this is test!');
     });
}


//导出模块
//module.exports = https_web_router;
//http 中的所有接口提供https
module.exports = http_router;
