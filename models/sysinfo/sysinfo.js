'use strict';

const mongoose = require('mongoose');
//import cityData from '../../InitData/cities'
var ObjectId = mongoose.Schema.Types.ObjectId;

const sysinfoSchema = new mongoose.Schema({
    date: String,
    item: String,
    id: String,
    //mac: { type:String, unique: true },
    mac:String,
    hostname: String,
    boardname: String,
    boardtype: String,
    fwversion: String,
    rsyslogversion: String,
    "mqtt-clientversion": String,
    luciversion: String,
    mode: String,
    ssid: String,
    encryption:String,
    key: String,
    channel_2_4: String,
    channel_5: String,
    rsyslogserverIP: String,
    mosquittoserverIP: String,
    channel_path: String,
    apps: mongoose.Schema.Types.Mixed
});





const SysinfoTable = mongoose.model('SysinfoTable', sysinfoSchema);
module.exports = SysinfoTable;