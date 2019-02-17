'use strict';

const mongoose = require('mongoose');
const config = require('config-lite');
mongoose.connect(config.url, {useMongoClient:true});
mongoose.Promise = global.Promise;

//获取connection实例
const db = mongoose.connection;

db.once('open' ,() => {
	console.log('连接数据库成功, pid =', process.pid);
});

db.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close', function() {
    console.log('数据库断开，重新连接数据库');
    mongoose.connect(config.url, {server:{auto_reconnect:true}});
});

module.exports = db;

/*
class DatabaseHandle {
    constructor(dbname) {
        this.init = this.init.bind(this);
        this.createConnection = this.createConnection.bind(this);

        this.connection = null;
        //this.init(dbname);


        console.log("db create connection");
        //this.createConnection("iotks2020");
    }

    async init(dbname) {
        this.connection = await this.createConnection(dbname);
    }

    // 监听器 #1 ,  每分钟更新1次
    // devunit_name
    async createConnection (dbname) {
        //获取connection实例
        //const db = mongoose.connection;
        var url = "mongodb://localhost:27017/" + dbname;
        //var db = mongoose.createConnection(url);
        var db = mongoose.createConnection('localhost', dbname, 27017, {server:{auto_reconnect:true}});
        //var db = mongoose.createConnection(url, {useMongoClient:true});
        //console.log('createConnection, db =', db);

        db.once('open' ,() => {
            console.log('连接数据库成功, pid =', process.pid);
        });

        db.on('error', function(error) {
            console.error('Error in MongoDb connection: ' + error);
            mongoose.disconnect();
        });

        db.on('close', function() {
            console.log('数据库断开，重新连接数据库');
            mongoose.createConnection('localhost', dbname, 27017, {server:{auto_reconnect:true}});
        });

        return db;
    }


    async destoryConnection () {
        mongoose.disconnect();
    }

}
*/