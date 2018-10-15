'use strict';


const gateway_router = require("../../process-http/routes/rt_gateway_ide4g.js");
const admin_router = require('../../process-http/routes/rt_acount.js');
const http_router = require('../../process-http/routes/entry_index.js');


 function https_web_router(app) {


     //stats
     app.use('/api/gateway', gateway_router);


     //用户登录相关
     app.use('/api/admin', admin_router);

     // Welcome
     app.get('/test', function(req, res) {
         res.status(200).send('Welcome Https, this is test!');
     });
}


//导出模块
//module.exports = https_web_router;
//http 中的所有接口提供https
module.exports = http_router;
