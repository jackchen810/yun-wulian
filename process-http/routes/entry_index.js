'use strict';


const gateway_router = require("./rt_gateway_ide4g.js");
const admin_router = require('./rt_acount.js');
const project_router = require('./rt_project.js');
const device_router = require('./rt_device.js');


 function http_web_router(app) {

     //用户登录相关
     app.use('/api/admin', admin_router);

     //stats
     app.use('/api/gateway', gateway_router);

     //project
     app.use('/api/project', project_router);

     //device
     app.use('/api/device', device_router);



     // Welcome test
     app.get('/test', function(req, res) {
         res.status(200).send('Welcome, this is test!');
     });
}


//导出模块
module.exports = http_web_router;