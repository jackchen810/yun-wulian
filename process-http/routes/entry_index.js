'use strict';


const stats_router = require("./stats.js");



 function http_web_router(app) {


     //stats
     app.use('/stats', stats_router);
}


//导出模块
module.exports = http_web_router;