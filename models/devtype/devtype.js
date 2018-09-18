'use strict';

const mongoose = require('mongoose');

const devtypeSchema = new mongoose.Schema({
    dev_name: String,   //设备型号
    dev_vendor: String,   //设备厂商
    chip_type: String,   //芯片类型
    chip_vendor: String,   //芯片厂商
    comment: String,   //备注说明
    create_date:String, //创建时间
    sort_time:Number, //排序时间戳， string无法排序
    // create_date: { type: Date, default: Date.now },

});




/**
 * 分页查询
 * find（）   查询商品，
 * limit(),   限制显示文档个数
 * skip();    跳过文档个数，
 * sort(),    这个是排序规则
 * @param {Object} devDocObj - task object
 * @returns {MqttClient} this - for chaining
 * @api public
 *
 * @example getByPager(uuid, mac, topic, newJsonMsg);
 */
devtypeSchema.statics.findByPage = function (condition, page_size, current_page, sort){
    return new Promise(async (resolve, reject) => {

        console.log("page_size:" + page_size);
        var skipnum = (current_page - 1) * page_size;   //跳过数

        try{
            await this.find(condition).skip(skipnum).limit(page_size).sort(sort).exec(function (err, res) {
                if (err) {
                    //console.log("Error:" + err);
                    resolve(err)
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



const DevtypeTable = mongoose.model('DevtypeTable', devtypeSchema);
module.exports = DevtypeTable;