'use strict';

const mongoose = require('mongoose');
//import cityData from '../../InitData/cities'
var ObjectId = mongoose.Schema.Types.ObjectId;

const invoiceHourSchema = new mongoose.Schema({
    route_mac:String,
    user_name: {type: String, default: null},    //用户就是渠道，一个mac唯一归属于一个用户
    dev_type: String,   //设备型号

    //location: String,
    //online_count: String,
    invoice_count: Number,
    printer_info: String,

    doc_create_at: {type: String, default: null},
    doc_del_at:{type: String, default: null},   //记录删除日期，使用mongodb的TTl机制, 这个日期到达后会删除文档记录
});


//根据超时时间计算超时日期，使用TTL机制
invoiceHourSchema.index({doc_del_at: 1}, { expireAfterSeconds:0 } );


const InvoiceHourTable = mongoose.model('InvoiceHourTable', invoiceHourSchema);
module.exports = InvoiceHourTable;