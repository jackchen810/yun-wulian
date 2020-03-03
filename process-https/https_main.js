'use strict';
const logger = require( '../logs/logs.js');
logger.info('[https] create https process..., arg2:'+ process.argv[2], ',pid =', process.pid, process.env.LOG);

require('../mongodb/db.js');
const express = require('express');
const config = require('config-lite');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const web_router = require('./routes/https_route_entry');
const session = require('express-session');
const connectMongo = require('connect-mongo');

const path = require('path');
const https = require('https');
const fs = require("fs");


//图片存放位置， 不存在则创建
fs.exists(config.image_dir, function(exists) {
    console.log(exists ? "图片目录存在" : "图片目录不存在", config.image_dir);
    if (!exists) fs.mkdirSync(config.image_dir);
});


const app = express();

app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, XX-Device-Type, XX-Token");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  	res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    //res.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
	res.header("X-Powered-By", '3.2.1')
	if (req.method == 'OPTIONS') {
        //logger.info('[HTTPS] method:', req.method, req.path);
        res.end('welcome to options');
	  	//res.send(200);
	} else {
        logger.info('[HTTPS] method:', req.method, req.path);
        ///** 尼玛，打开下面开关后，文件上传不好使
        /*   //不能开
        req.on('data', function (data) {
            console.log('entry, url:', req.hostname + req.path, ';body data', data.toString().substr(0, 60));
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


//app.listen(config.backend_port);

var options = {
	key:fs.readFileSync(path.join(__dirname,config.ssl.key),'utf8'),
	cert:fs.readFileSync(path.join(__dirname,config.ssl.cert),'utf8')
};
https.createServer(options,app).listen(config.ssl.port)

console.log('Https listening at ' + config.ssl.port);




process.on('unhandledRejection', (reason, p) => {
    logger.info("[https] Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    logger.error("[https] uncaughtException：", err);
});