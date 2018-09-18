'use strict';

const mongoose = require('mongoose');

const onlineDaySchema = new mongoose.Schema({
    user_name: String,
    online_count: Number,
    //invoice_count: Number,

    doc_create_at: {type: String, default: null},
    doc_del_at:{type: String, default: null},   //记录删除日期，使用mongodb的TTl机制, 这个日期到达后会删除文档记录
});


//根据超时时间计算超时日期，使用TTL机制
onlineDaySchema.index({doc_del_at: 1}, { expireAfterSeconds:0 } );


const onlineDayTable = mongoose.model('onlineDayTable', onlineDaySchema);
module.exports = onlineDayTable;