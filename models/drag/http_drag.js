'use strict';

const mongoose = require('mongoose');
// var ObjectId = mongoose.Schema.Types.ObjectId;

const dargSTablev = new mongoose.Schema({
    projectname: String,   //项目名
    user_account: String,   //用户名
    project_showname: String,   //展示用户名
    user_password:String, //展示用户名密码
    project_image: {type: String, default: ''},    //项目图片
    dargjsondata: String,   //json 数据
    comment:String,//
    update_time: String,  //创建时间
    sort_time:Number, //排序时间戳，
    is_logic:{type:Boolean, default:true}, //是否显示  
    is_release:{type:Boolean, default:true} // 是否发布

});

const dargSTable = mongoose.model('dargjson', dargSTablev);
module.exports = dargSTable;