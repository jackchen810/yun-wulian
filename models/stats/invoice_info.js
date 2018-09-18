'use strict';

const mongoose = require('mongoose');

const invoiceInfoSchema = new mongoose.Schema({
    route_mac: String,    //路由mac
    invoice_timestamp: String,   //开票时间
    invoice_date_time: String,   //开票时间

    invoice_type: String,   //发票代码
    invoice_info: String,   //发票信息


    doc_create_at: {type: String, default: null},
    doc_del_at:{type: String, default: null},   //记录删除日期，使用mongodb的TTl机制, 这个日期到达后会删除文档记录
});


//根据超时时间计算超时日期，使用TTL机制
//invoiceInfoSchema.index({doc_del_at: 1}, { expireAfterSeconds:0 } );


const invoiceInfoTable = mongoose.model('invoiceInfoTable', invoiceInfoSchema);
module.exports = invoiceInfoTable;