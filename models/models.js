
'use strict';

const RomTable = require("../models/rom/rom.js");
const RomUpgradeTable= require("../models/rom/rom_upgrade.js");
const TaskTable= require("../models/task/task.js");
const SysinfoTable= require("../models/sysinfo/sysinfo.js");
const ProjectManageTable= require("../models/project/project.js");
const DeviceManageTable= require("../models/project/device.js");
const DevtypeManageTable= require("../models/devtype/devtype.js");
const ScriptManageTable= require("../models/script/script.js");
const AppsPkgManageTable= require("../models/apps/apps.js");
const Gateway_Real_Table= require("./device/gateway_ide4g_real.js");
const Gateway_Minute_Table= require("./device/gateway_ide4g_m1.js");
const Gateway_Hour_Table= require("./history_gateway/gateway_ide4g_hour1.js");
const Gateway_Day_Table= require("./history_gateway/gateway_ide4g_day1.js");
const InvoiceHourTable= require("./stats/invoice_stats_hour.js");
const InvoiceDayTable= require("../models/stats/invoice_stats_day.js");
const onlineDayTable= require("./stats/online_stats_day.js");
const AdminModel= require("../models/admin/admin.js");
const AccountTable = require('./admin/account.js');
const historySchema= require("./history_gateway/gateway_minute.js");


//mqtt 命令
function DB() {
    this.RomTable = RomTable;
    this.RomUpgradeTable = RomUpgradeTable;
    this.TaskTable = TaskTable;
    this.SysinfoTable = SysinfoTable;
    this.ProjectManageTable = ProjectManageTable;
    this.DeviceManageTable = DeviceManageTable;
    this.DevtypeTable = DevtypeManageTable;
    this.ScriptTable = ScriptManageTable;
    this.AppsPkgTable = AppsPkgManageTable;
    this.Gateway_Real_Table = Gateway_Real_Table;
    this.Gateway_Minute_Table = Gateway_Minute_Table;
    this.Gateway_Hour_Table = Gateway_Hour_Table;
    this.Gateway_Day_Table = Gateway_Day_Table;
    this.InvoiceHourTable = InvoiceHourTable;
    this.InvoiceDayTable = InvoiceDayTable;
    this.onlineDayTable = onlineDayTable;
    this.AdminModel = AdminModel;
    this.AccountTable = AccountTable;
    this.historySchema = historySchema;
    this.getNowFormatDate = getNowFormatDate;

}

function getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

//导出模块
module.exports = new DB();