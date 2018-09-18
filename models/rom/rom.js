'use strict';

const mongoose = require('mongoose');

const romSchema = new mongoose.Schema({
    file_name: String,    //文件名
    rom_version:{ type: String, default: null },  //rom 版本号
    dev_type: { type: String, default: null },   //设备类型
    ver_type: { type: String, default: null },   //版本类型
    md5_value: { type: String, default: null },  //md5串码
    comment: { type: String, default: null },   //备注说明
    rom_status: { type: String, default: 'revoke' }, //normal:rom上架,revoke:pkg 下架
    create_date: String,
    sort_time:Number, //排序时间戳， string无法排序
    //create_date: { type: Date, default: Date.now },

});




/**
 * 分页查询
 * find（）   查询商品，
 * limit(),   限制显示文档个数
 * skip();    跳过文档个数，
 * sort(),    这个是排序规则
 * @param {Object} romDocObj - task object
 * @returns {MqttClient} this - for chaining
 * @api public
 *
 * @example getByPager(uuid, mac, topic, newJsonMsg);
 */
romSchema.statics.findByPage = function (condition, page_size, current_page, sort){
    return new Promise(async (resolve, reject) => {

        //console.log("romDocObj:", romDocObj);
        var skipnum = (current_page - 1) * page_size;   //跳过数

        try{
            await this.find(condition).skip(skipnum).limit(page_size).sort(sort).exec(function (err, res) {
                if (err) {
                    //console.log("Error:" + err);
                    resolve(err);
                }
                else{
                    //console.log("query:" + res);
                    resolve(res);
                }
            });
            //console.log('task status 111');
            //resolve('done');
        }catch(err){
            reject({name: 'ERROR_DATA', message: '查找数据失败'});
            console.error(err);
        }
    })
}




const RomTable = mongoose.model('RomTable', romSchema);
module.exports = RomTable;