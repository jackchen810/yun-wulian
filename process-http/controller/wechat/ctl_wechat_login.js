'use strict';
const DB = require( "../../../models/models.js");
const logger = require( '../../../logs/logs.js');
//const request = require('request');
const https =require('https');

class WechatLoginHandle {
    constructor(){
        //logger.info('init 111');

    }

    async jscode2session(req, res, next) {
        console.log('wechat jscode2session');
        //console.log(req.body);
        console.log(req.session);

        //获取表单数据，josn
        let js_code = req.body['js_code'];
        let nick_name = req.body['nick_name'];

        logger.info('js_code:', js_code);
        logger.info('nick_name:', nick_name);

        let options={
            hostname:'api.weixin.qq.com',
            port:443,
            path:'/sns/jscode2session?appid=wxfb43bce3f582507f&secret=32de6baffb1f13fffe46921f59eaa7a4&js_code='+js_code+'&grant_type=authorization_code',
            method:'GET'
        };
        //你的后台服务(/wx/onlogin)接着需要使用这个传递过来的登录凭证，去调用微信接口换取openid和session_key，接口地址格式如下所示：
        //https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code

        //console.log("options:", options);
        let httpres = https.get(options, function (response){
            let jsonstr ='';
            response.on('data',function(data){
                jsonstr+=data;
            });
            response.on('end',function(){
                console.info('jsonstr', jsonstr);
                res.send({ret_code: 0, ret_msg: '成功', extra:JSON.parse(jsonstr)});
            });
        });

        httpres.on('error', (e) => {
            console.error(`微信服务器验证错误: ${e.message}`);
            res.send({ret_code: -1, ret_msg: '微信服务器验证出错', extra:e.message});
        });

        //res.send({ret_code: 0, ret_msg: '成功', extra:''});
        console.log('wechat jscode2session end');
    }


    async user2session(req, res, next) {
        console.log('user2session ');
        //console.log(req.body);

        console.log('user2session end');
    }
}


module.exports = new WechatLoginHandle();

