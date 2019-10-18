'use strict';
const logger = require( '../logs/logs.js');
logger.info('[http] create http process..., pid =', process.pid);


require('../mongodb/db.js');
const config = require('config-lite');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const web_router = require('./routes/http_route_entry');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const fs = require("fs");
const mqttClient = require('../mqttclient/mqttclient.js');
const mqtt_router = require('./routes/mqtt_route_entry.js');

//注册mqtt分发
mqtt_router(mqttClient);


//图片存放位置， 不存在则创建
fs.exists(config.download_dir, function(exists) {
    console.log(exists ? "文件下载目录存在" : "文件下载目录不存在", config.download_dir);
    if (!exists) fs.mkdirSync(config.download_dir);
});

fs.exists(config.firmware_dir, function(exists) {
    console.log(exists ? "固件目录存在" : "固件目录不存在", config.firmware_dir);
    if (!exists) fs.mkdirSync(config.firmware_dir);
});



const app = express();

app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  	res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    //res.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
	res.header("X-Powered-By", '3.2.1');
	if (req.method == 'OPTIONS') {
	  	res.send(200);
	} else {
		console.log('[http] method:', req.method, req.path);
		///** 尼玛，打开下面开关后，文件上传不好使
		/*   //不能开
        req.on('data', function (data) {
            console.log('entry, url:', req.hostname + req.path, ';body data', data.toString());
        });
        */
	    next();
	}
});


// 2. 使用中间件解析body
// body-parser 能处理 text/plain, application/json和application/x-www-form-urlencoded的数据，解析完放到req.body里。
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());





// 3. session连接数据库
const MongoStore = connectMongo(session);
app.use(session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie,
    store: new MongoStore({
        url: config.url
    })
}));

// use this middleware to reset cookie expiration time
// when user hit page every time
app.use(function(req, res, next){
    req.session._garbage = Date();
    req.session.touch();
    //console.log('-----session-----:', req.session);
    next();
});




// 4. 注册路由分发
web_router(app);



// 5. 托管静态文件
if ( process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'development') {
//通过 Express 内置的 express.static 可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
    app.use(express.static('./public'));
    console.log('express static dir: public');
}



// 6. 监听端口
app.listen(config.backend_port);
console.log('[http] Http listening at ' + config.backend_port);




process.on('unhandledRejection', (reason, p) => {
    logger.info("[http] Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    logger.error("[http] uncaughtException：", err);
});