'use strict';

import express from 'express'
import ManageHandle from '../../controller-https/manage/manage.js'

const router = express.Router();


console.log("enter route of manage");


router.all('/sysinfo', ManageHandle.sysinfo);
router.all('/sysync', ManageHandle.sysync);
router.all('/networkinfo', ManageHandle.networkinfo);
router.all('/wireless', ManageHandle.wireless);
router.all('/TX_power', ManageHandle.TX_power);
router.all('/rsyslogserverIP', ManageHandle.rsyslogserverIP);
router.all('/wifidog', ManageHandle.wifidog);
router.all('/wifidog_check', ManageHandle.wifidog_check);
router.all('/WD_wired_pass', ManageHandle.WD_wired_pass);
router.all('/WD_roam_switch', ManageHandle.WD_roam_switch);
router.all('/WD_NOAUTH', ManageHandle.WD_NOAUTH);
router.all('/mosquittoserverIP', ManageHandle.mosquittoserverIP);
router.all('/shell', ManageHandle.shell);
router.all('/shell64', ManageHandle.shell64);
router.all('/script', ManageHandle.script);
router.all('/script_result', ManageHandle.script_result);
router.all('/script_detail', ManageHandle.script_detail);
router.all('/script_detail_detail', ManageHandle.script_detail_detail);
router.all('/script_query', ManageHandle.script_query);
router.all('/apps', ManageHandle.apps);
router.all('/apps_result', ManageHandle.apps_result);
router.all('/apps_detail', ManageHandle.apps_detail);
router.all('/apps_detail_detail', ManageHandle.apps_detail_detail);
router.all('/apps_query', ManageHandle.apps_query);
router.all('/firmware', ManageHandle.firmware);
router.all('/reboot', ManageHandle.reboot);
router.all('/network', ManageHandle.network);
router.all('/passwd', ManageHandle.passwd);
router.all('/superpasswd', ManageHandle.superpasswd);
router.all('/domainlist_set', ManageHandle.domainlist_set);
router.all('/domainlist_del', ManageHandle.domainlist_del);
router.all('/domainlist_clear', ManageHandle.domainlist_clear);
router.all('/pandomain_add', ManageHandle.pandomain_add);
router.all('/pandomain_del', ManageHandle.pandomain_del);
router.all('/pandomain_clear', ManageHandle.pandomain_clear);
router.all('/iplist_set', ManageHandle.iplist_set);
router.all('/iplist_clear', ManageHandle.iplist_clear);
router.all('/maclist_w_set', ManageHandle.maclist_w_set);
router.all('/maclist_w_del', ManageHandle.maclist_w_del);
router.all('/maclist_w_clear', ManageHandle.maclist_w_clear);
router.all('/maclist_b_set', ManageHandle.maclist_b_set);
router.all('/maclist_b_del', ManageHandle.maclist_b_del);
router.all('/maclist_b_clear', ManageHandle.maclist_b_clear);
router.all('/maclist_b_reset', ManageHandle.maclist_b_reset);
router.all('/channelpath_set', ManageHandle.channelpath_set);
router.all('/channelpath_clear', ManageHandle.channelpath_clear);
router.all('/blist_mac_get', ManageHandle.blist_mac_get);
router.all('/blist_mac_set', ManageHandle.blist_mac_set);
router.all('/blist_mac_del', ManageHandle.blist_mac_del);
router.all('/blist_mac_clear_all', ManageHandle.blist_mac_clear_all);
router.all('/blist_domain_get', ManageHandle.blist_domain_get);
router.all('/blist_domain_set', ManageHandle.blist_domain_set);
router.all('/blist_domain_clear_all', ManageHandle.blist_domain_clear_all);
router.all('/qos_show', ManageHandle.qos_show);
router.all('/qos_setting', ManageHandle.qos_setting);

module.exports = router;
