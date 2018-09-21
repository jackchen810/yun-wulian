'use strict';
const logger = require( '../logs/logs.js');
logger.info('[http] create http process..., pid =', process.pid);

require('../mongodb/db.js');
const express = require('express');
const config = require('config-lite');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const web_router = require('./routes/entry_index');
const session = require('express-session');
const connectMongo = require('connect-mongo');



const app = express();

app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  	res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    //res.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
	res.header("X-Powered-By", '3.2.1')
	if (req.method == 'OPTIONS') {
	  	res.send(200);
	} else {
		console.log('method:', req.method, req.path);
		///*
        req.on('data', function (data) {
            console.log('entry, url:', req.hostname + req.path, ';body data', data.toString());
        });
        //*/
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
    next();
});




// 4. 注册路由分发
web_router(app);


app.listen(config.vue_service_port);
console.log('[http] Http listening at ' + config.vue_service_port);




process.on('unhandledRejection', (reason, p) => {
    logger.info("Unhandled Rejection:", p);
    // application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    logger.error("[http] uncaughtException：", err);
});