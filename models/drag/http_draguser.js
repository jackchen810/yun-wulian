'use strict';

const mongoose = require('mongoose');
// var ObjectId = mongoose.Schema.Types.ObjectId;

const darguserData = new mongoose.Schema({

    account_id: String,   //AccountTable用户表id
    user_account:  {type:String, required: true},   //创建者

    project_showname:  {type:String, required: true},   //用户名
    user_password: {type:String, required: true}, 
    
    user_prov: String, // 省
    user_city: String,  // 市
    user_address: String,   // 用户详细地址  

    user_phone: Number,   //手机号码
    user_region:String, //用户公司名
  

    update_time: String,  //创建时间
    sort_time:Number, //排序时间戳，

    is_logic:{type:Boolean, default:true}, //是否显示  
    user_status:{type:Boolean, default:true} // 是否冻结

});

const darguser = mongoose.model('darguser', darguserData);
module.exports = darguser;