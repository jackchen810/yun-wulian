'use strict';

const mongoose = require('mongoose');

const invoiceContentSchema = new mongoose.Schema({
    route_mac: String,    //路由mac
    invoice_timestamp: String,   //开票时间
    invoice_date_time: String,   //开票时间

    invoice_code: String,   //发票代码
    invoice_no: String,   //发票编号


    printer_code:String,    //机打号码
    machine_id:String,    //机器编码
    seller_name: String,   //销售方名称

    buyer_taxpayer_id: String,   //    纳税人识别号
    invoice_date: String,   //开票日期
    buyer_payee: String,   //收款人
    buyer_unit: String,   //收款单位， 购买方名称

    item_taxpayer_id: String,   //    客户纳税人识别号
    service_item: String,   //项目
    unit_price: String,   //单价
    unit_quantity: String,   //数量
    amount: String,   //金额

    total_amount: String,   //合计金额
    total_amount_big: String,   //合计金额大写

    check_code: String,   //校验码
    code_field: String,   //二维码区


    doc_create_at: {type: String, default: null},
    doc_del_at:{type: String, default: null},   //记录删除日期，使用mongodb的TTl机制, 这个日期到达后会删除文档记录
});


//根据超时时间计算超时日期，使用TTL机制
//invoiceInfoSchema.index({doc_del_at: 1}, { expireAfterSeconds:0 } );


const invoiceContentTable = mongoose.model('invoiceContentTable', invoiceContentSchema);
module.exports = invoiceContentTable;