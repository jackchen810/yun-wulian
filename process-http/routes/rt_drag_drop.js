'use strict';

const express = require('express');
const CtldragManage = require('../controller/drag/ctl_drag.js');
const router = express.Router();

console.log("enter route of project");


// router.all('/list',  CtlProjectManage.project_list);
// // router.all('/address/list',  CtlProjectManage.projectaddress_list);
// router.all('/page/list',  CtlProjectManage.project_page_list);
// router.all('/array',  CtlProjectManage.project_array);
router.all('/add',  CtldragManage.drag_add);
router.all('/list',  CtldragManage.drag_list);
router.all('/typeList',  CtldragManage.drag_typelist);
router.all('/listid',  CtldragManage.drag_idlist);
router.all('/del',  CtldragManage.drag_del);
router.all('/imgadd',  CtldragManage.project_imgadd);
router.all('/change',  CtldragManage.project_content_change);
router.all('/userlist',  CtldragManage.drag_userlist);
router.all('/useradd',  CtldragManage.drag_adduser);
router.all('/userlogin',  CtldragManage.drag_userlogin);

// router.all('/addupimg',  CtldragManage.project_imgadd);
// router.all('/del',  CtlProjectManage.project_del);
// router.all('/status/update',  CtlProjectManage.project_status_update);


module.exports = router;
