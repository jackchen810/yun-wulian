'use strict';

const DB = require('../../models/models.js');
const dtime = require('time-formater');
const logger = require('../../logs/logs.js');
const schedule = require('node-schedule');
const iconv = require("iconv-lite");

class StatsUpdateHandle {
    constructor() {
        //logger.info('init StatsUpdateHandle');
        //this.test();
        //this.upload_invoice_info();
        this.provs = [
            {label:"北京市",value:"北京"},
            {label:"天津市",value:"天津"},
            {label:"河北省",value:"河北"},
            {label:"山西省",value:"山西"},
            {label:"内蒙古",value:"内蒙古"},
            {label:"辽宁省",value:"辽宁"},
            {label:"吉林省",value:"吉林"},
            {label:"黑龙江省",value:"黑龙江"},
            {label:"上海市",value:"上海"},
            {label:"江苏省",value:"江苏"},
            {label:"浙江省",value:"浙江"},
            {label:"安徽省",value:"安徽"},
            {label:"福建省",value:"福建"},
            {label:"江西省",value:"江西"},
            {label:"山东省",value:"山东"},
            {label:"河南省",value:"河南"},
            {label:"湖北省",value:"湖北"},
            {label:"湖南省",value:"湖南"},
            {label:"广东省",value:"广东"},
            {label:"广西",value:"广西"},
            {label:"海南省",value:"海南"},
            {label:"重庆市",value:"重庆"},
            {label:"四川省",value:"四川"},
            {label:"贵州省",value:"贵州"},
            {label:"云南省",value:"云南"},
            {label:"西藏",value:"西藏"},
            {label:"陕西省",value:"陕西"},
            {label:"甘肃省",value:"甘肃"},
            {label:"青海省",value:"青海"},
            {label:"宁夏",value:"宁夏"},
            {label:"新疆",value:"新疆"},
            {label:"台湾省",value:"台湾"},
            {label:"香港",value:"香港"},
            {label:"澳门",value:"澳门"}];

        this.upload = this.upload.bind(this);
        //this.isChinese = this.isChinese.bind(this);
        this.upload_invoice_info = this.upload_invoice_info.bind(this);

    }


    async upload(req, res, next) {

        logger.info('stats upload');
        //logger.info(req.body);

        //获取表单数据，josn
        var route_mac = req.body['route_mac'];
        var stats = req.body['stats'];
        var location = stats['location'];
        var invoice_count = stats['invoice_count'];
        var printer_info = stats['printer_info'];
        var box51_status = stats['box51_status'];
        var printer_status = stats['printer_status'];


        //参数有效性检查
        if (!location || !invoice_count) {
            res.send({ret_code: 1002, ret_msg: 'FAILED', extra: '用户输入参数无效'});
            logger.info('para invalid');
            return;
        }

        logger.info('location:', location);
        logger.info('route_mac:', route_mac);
        logger.info('invoice_count:', invoice_count);
        logger.info('printer_info:', printer_info);
        logger.info('box51_status:', box51_status);
        logger.info('printer_status:', printer_status);

        //日期, 1个月后文档删除，任务记录删除
        var del_time = new Date();
        del_time.setMonth(del_time.getMonth() + 3);
        var mytime = new Date();
        var doc_at_day = dtime(mytime).format('YYYY-MM-DD');
        var doc_at_hour = dtime(mytime).format('YYYY-MM-DD HH');

        //获取表单数据，josn
        try {
            var user_name = '';
            var dev_type = '';
            var wherestr = {'mac': route_mac};
            ///分解location
            var address  =  location.split('\'');
            //var city  =  address[3].split(' ');

            var myprovs = '';
            for(var i = 0; i< this.provs.length; i++){
                //logger.info('address:', address[3]);
                //logger.info('label:', this.provs[i].label);
                if (address[3].indexOf(this.provs[i].label) >= 0){
                    myprovs = this.provs[i].value;
                    break;
                }
            }

            var updatestr = {
                'location': myprovs,
                'inet_ip': address[1],
                'box51_status': box51_status,
                'printer_status': printer_status
            };
            var device = await DB.DeviceTable.findOneAndUpdate(wherestr, updatestr).exec();
            if (device != null) {
                user_name = device['user_name'];
                dev_type = device['dev_type'];
                //logger.info('user_name:', user_name);
            }

            //写入数据库
            var docObj = {
                "route_mac": route_mac,
                "user_name": user_name,
                "dev_type": dev_type,

                "invoice_count": invoice_count,
                "printer_info": printer_info,

                'doc_create_at': doc_at_hour,
                'doc_del_at': dtime(del_time).format('YYYY-MM-DD'),
            };
            ///记录小时线统计数据， 底层路由器上报后会清数据
            var wherestr = {"route_mac": route_mac, "doc_create_at": doc_at_hour};
            var queryDay = await DB.InvoiceHourTable.findOne(wherestr).exec();
            if (queryDay == null){
                docObj.doc_create_at = doc_at_hour;
                await DB.InvoiceHourTable.create(docObj);
            }
            else{
                var total = Number(invoice_count) + Number(queryDay['invoice_count']);
                var updatestr = {"invoice_count": total};
                await DB.InvoiceHourTable.findByIdAndUpdate(queryDay['_id'], updatestr);
            }


            ///记录日线统计数据
            var wherestr = {"route_mac": route_mac, "doc_create_at": doc_at_day};
            var queryDay = await DB.InvoiceDayTable.findOne(wherestr).exec();
            if (queryDay == null){
                docObj.doc_create_at = doc_at_day;
                await DB.InvoiceDayTable.create(docObj);
            }
            else{
                var total = Number(invoice_count) + Number(queryDay['invoice_count']);
                var updatestr = {"invoice_count": total};
                await DB.InvoiceDayTable.findByIdAndUpdate(queryDay['_id'], updatestr);
            }

            res.send({ret_code: 0, ret_msg: 'SUCCESS', extra: ''})
        } catch (err) {
            logger.info('获取数据失败', err);
            res.send({ret_code: 1004, ret_msg: 'FAILED', extra: err});
        }

        logger.info('stats upload end');
    }

    isHasChinese(str){
        if (escape(str).indexOf("%u") !=-1){
            return true;
        }else{
            return false;
        }
    }


    async upload_invoice_info(req, res, next) {

        logger.info('stats stk');
        //logger.info(req.body);

        //获取表单数据，josn
        var route_mac = req.body['route_mac'];
        var info = req.body['info'];

        //日期,
        var mytime = new Date();
        //var linestr = new Array();
        //var newline = new Array();

        logger.info('info length', info.length);
        for (var i = 0; i< info.length; i++) {
            var linestr = new Array();
            var newline = new Array();

            var timestamp = info[i]['timestamp'];
            var content = info[i]['content'];

            var invoicetime = new Date(parseInt(timestamp) * 1000);
            //var mystr = new Buffer(content, 'base64').toString();
            var mybuf = new Buffer(content, 'base64');
            var mygbstr = iconv.decode(mybuf, 'gb2312');

            logger.info('route_mac', route_mac);
            logger.info('timestamp', timestamp);
            //logger.info('timestamp', dtime(invoicetime).format('YYYY-MM-DD HH:MM:SS'));
            //logger.info('content', content);
            //logger.info('data', data);
            linestr = mygbstr.split('\n');
            logger.info('line length', linestr.length);

            for (var ll = 0; ll< linestr.length; ll++) {
                newline[ll] = linestr[ll].trim().split(/\s+/g);

                //logger.info('line', ll,  ll, dd);
                if (ll == 8) {   //第8行
                    //保留最后两个数据
                    //logger.info('line 8---', newline[ll].length);
                    var resv = newline[ll].length -4;
                    for (var t = 0; t < newline[ll].length && t < resv ; t++) {
                        newline[ll].shift();
                    }

                    var pp = newline[ll][0].lastIndexOf('\x1b'+'2');  // ESC 2  指令开始
                    newline[ll][0]= newline[ll][0].slice(pp + 2);       //
                    //logger.info('line 8---', pp,  n, t, newline[ll].length);
                }
                else if (ll == 2 || ll == 5) {
                    //保留最后两个数据
                    var resv = newline[ll].length -2;
                    for (var t = 0; t < newline[ll].length && t < resv ; t++) {
                        newline[ll].shift();
                    }
                }
                else if (ll == 9) {
                    //logger.info('line 9---', newline[ll]);
                    var pp = newline[ll][0].lastIndexOf('\x1b'+'J');  // ESC J  指令开始
                    newline[ll][0]= newline[ll][0].slice(pp + 3);
                }
                else{
                    //保留最后1个数据
                    var resv = newline[ll].length -1;
                    for (var t = 0; t < newline[ll].length && t < resv ; t++) {
                        newline[ll].shift();
                    }
                }

                //var ff = this.isHasChinese(newline[ll]);
                //logger.info('line ddd', ll, ff, newline[ll]);
                //logger.info('no', i, 'line', ll, 'str:', newline[ll]);
            }

            if (newline.length < 13 || newline.length > 18){
                continue;
            }

            //写入数据库
            var docObj = {
                "route_mac": route_mac,
                "invoice_timestamp": timestamp,
                "invoice_date_time": dtime(invoicetime).format('YYYY-MM-DD HH:mm:ss'),

                "invoice_code" : newline[0][0],   //发票代码
                "invoice_no": newline[1][0],   //发票编号


                "printer_code": newline[2][0],    //机打号码
                "machine_id": newline[2][1],    //机器编码
                "seller_name": newline[3][0],   //销售方名称

                "buyer_taxpayer_id": newline[4][0],   //    纳税人识别号
                "invoice_date": newline[5][0],   //开票日期
                "buyer_payee": newline[5][1],   //收款人
                "buyer_unit": newline[6][0],   //收款单位， 购买方名称

                "item_taxpayer_id": newline[7][0],   //    客户纳税人识别号
                "service_item": newline[8][0],   //项目
                "unit_price": newline[8][1],   //单价
                "unit_quantity": newline[8][2],   //数量
                "amount": newline[8][3],   //金额

                "total_amount": newline[10][0],   //合计金额
                "total_amount_big": newline[11][0],   //合计金额大写


                "check_code": newline[12][0],   //校验码
                "code_field": "",   //二维码区

                'doc_create_at': dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
                'doc_del_at': "",
            };


            //记录发票信息
            logger.info('query InvoiceContentTable:', route_mac, timestamp);
            var wherestr = {'route_mac': route_mac, "invoice_timestamp": timestamp};
            var query = await DB.InvoiceContentTable.findOne(wherestr).exec();
            if (query == null){
                //logger.info('query is null-----', docObj['invoice_timestamp']);
                DB.InvoiceContentTable.create(docObj);
            }
        }


        logger.info('stats stk end');
    }


    async upload_invoice_stk(req, res, next) {

        logger.info('stats info stk');
        //logger.info(req.body);

        //获取表单数据，josn
        var route_mac = req.body['route_mac'];
        var info = req.body['info'];

        //日期,
        var mytime = new Date();
        //var linestr = new Array();
        //var newline = new Array();

        logger.info('info length', info.length);
        for (var i = 0; i< info.length; i++) {

            var timestamp = info[i]['timestamp'];
            var content = info[i]['content'];
            var type = info[i]['type'];

            var invoicetime = new Date(parseInt(timestamp) * 1000);
            //var mystr = new Buffer(content, 'base64').toString();
            var mybuf = new Buffer(content, 'base64');
            var mygbstr = iconv.decode(mybuf, 'gb2312');

            logger.info('route_mac', route_mac);
            logger.info('timestamp', timestamp);
            logger.info('mygbstr', mygbstr);


            //写入数据库
            var docObj = {
                "route_mac": route_mac,
                "invoice_timestamp": timestamp,
                "invoice_date_time": dtime(invoicetime).format('YYYY-MM-DD HH:mm:ss'),

                "invoice_type" : type,   //发票代码
                "invoice_info": mygbstr,   //发票编号

                'doc_create_at': dtime(mytime).format('YYYY-MM-DD HH:mm:ss'),
                'doc_del_at': "",
            };


            //记录发票信息
            logger.info('query InvoiceInfoTable:', route_mac, timestamp);
            var wherestr = {'route_mac': route_mac, "invoice_timestamp": timestamp};
            var query = await DB.InvoiceInfoTable.findOne(wherestr).exec();
            if (query == null){
                //logger.info('query is null-----', docObj['invoice_timestamp']);
                DB.InvoiceInfoTable.create(docObj);
            }
        }


        logger.info('stats info stk end');
    }


    async print_info(content) {
        //var mystr = new Buffer(content, 'base64').toString();
        var mybuf = new Buffer(content, 'base64');
        var mygbstr = iconv.decode(mybuf, 'gb2312');
        logger.info('parse info', mygbstr);
    }

}


//导出模块
module.exports = new StatsUpdateHandle();

