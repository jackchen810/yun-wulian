webpackJsonp([12],{529:function(t,a,e){e(913);var r=e(203)(e(915),e(916),null,null);t.exports=r.exports},913:function(t,a,e){var r=e(914);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);e(205)("29ece28c",r,!0)},914:function(t,a,e){a=t.exports=e(204)(!1),a.push([t.i,".rad-group{margin-bottom:20px}.handle-input{width:300px;display:inline-block}.handle-box2{display:inline-block;float:right}",""])},915:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0}),a.default={data:function(){return{curId:"",curRadio:"firmware",loading:!1,radio3:"ROM升级",appsData:[],firmwareData:[],scriptData:[],appsData1:[],firmwareData1:[],scriptData1:[],isShow:"apps",pageTotal:0,currentPage:1}},created:function(){this.getParams()},methods:{getParams:function(){var t=this;t.curId=t.$route.query.curid,t.curRadio=t.$route.query.curRadio,"apps"==t.curRadio&&(t.isShow="apps",t.getAppsDetailData({})),"firmware"==t.curRadio&&(t.isShow="firmware",t.getFirmwareData({})),"script"==t.curRadio&&(t.isShow="script",t.getScriptDetailData({}))},getFirmwareData:function(t){var a=this;t.uuid=a.curId,a.$axios.post("/api/rom/task/list/detail",t).then(function(e){a.loading=!1,"1001"==e.data.ret_code&&(a.$message({message:e.data.ret_msg,type:"warning"}),setTimeout(function(){a.$router.replace("login")},2e3)),0==e.data.ret_code?(a.firmwareData1=e.data.extra.resultList.slice(0,1),a.pageTotal=e.data.extra.count||a.pageTotal,t.hasOwnProperty("current_page"),a.firmwareData=e.data.extra.resultList):a.$message.error(e.data.ret_msg)},function(t){a.loading=!1,console.log(t)})},getAppsDetailData:function(t){var a=this;t.uuid=a.curId,a.$axios.post("/api/apps/apps_detail",t).then(function(t){a.loading=!1,"1001"==t.data.ret_code&&(a.$message({message:t.data.extra,type:"warning"}),setTimeout(function(){a.$router.replace("login")},2e3)),0==t.data.ret_code?(a.appsData1=t.data.extra.apps_task.slice(0,1),a.pageTotal=t.data.extra.count||a.pageTotal,a.appsData=t.data.extra.apps_task):a.$message.error(t.data.extra)},function(t){a.loading=!1,console.log(t)})},getScriptDetailData:function(t){var a=this;t.uuid=a.curId,a.$axios.post("/api/apps/script_detail",t).then(function(t){a.loading=!1,"1001"==t.data.ret_code&&(a.$message({message:t.data.extra,type:"warning"}),setTimeout(function(){a.$router.replace("login")},2e3)),0==t.data.ret_code?(a.scriptData1=t.data.extra.script_task.slice(0,1),a.pageTotal=t.data.extra.count||a.pageTotal,a.scriptData=t.data.extra.script_task):a.$message.error(t.data.extra)},function(t){a.loading=!1,console.log(t)})},handleCurrentChange:function(t){var a=this;a.currentPage=t;var e={page_size:10,current_page:this.currentPage};"apps"==a.curRadio&&(a.isShow="apps",a.getAppsDetailData(e)),"firmware"==a.curRadio&&(a.isShow="firmware",a.getFirmwareData(e)),"script"==a.curRadio&&(a.isShow="script",a.getScriptDetailData(e))},handleEdit:function(t){this.$router.push({path:"/updateromstatus",query:{curid:this.curId,curmac:t,curRadio:this.curRadio}})},changePage:function(t){this.information.pagination.per_page=t.perpage,this.information.data=this.information.data},onSearch:function(t){this.query=t}}}},916:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"table"},[e("div",{staticClass:"crumbs"},[e("el-breadcrumb",{attrs:{separator:"/"}},[e("el-breadcrumb-item",[e("i",{staticClass:"el-icon-upload"}),t._v("  版本升级")]),t._v(" "),e("el-breadcrumb-item",[t._v(t._s("firmware"==t.isShow?"ROM升级":"apps"==t.isShow?"插件升级":"脚本升级"))]),t._v(" "),e("el-breadcrumb-item",[t._v("执行结果")])],1)],1),t._v(" "),"firmware"==t.isShow?e("div",[e("h4",[t._v("基本信息")]),t._v(" "),e("el-table",{ref:"multipleTable",staticStyle:{width:"100%",margin:"20px 0 40px"},attrs:{data:t.firmwareData1,border:""}},[e("el-table-column",{attrs:{prop:"dest_version",label:"下发版本"}}),t._v(" "),e("el-table-column",{attrs:{prop:"dev_type",label:"设备型号"}}),t._v(" "),e("el-table-column",{attrs:{prop:"",label:"升级方式"},scopedSlots:t._u([{key:"default",fn:function(a){return[t._v(t._s("1"==a.row.upgrade_mode?"实时自动":"2"==a.row.upgrade_mode?"用户自动":"定时自动"))]}}])}),t._v(" "),e("el-table-column",{attrs:{prop:"",label:"配置更新"},scopedSlots:t._u([{key:"default",fn:function(a){return[t._v(t._s("0"==JSON.parse(a.row.request_msg).reflash?"保留用户配置":"更改用户配置"))]}}])}),t._v(" "),e("el-table-column",{attrs:{prop:"operator_name",label:"执行人"}})],1),t._v(" "),e("hr",{staticStyle:{"margin-bottom":"40px",height:"1px",border:"none","border-top":"1px solid #ddd"}}),t._v(" "),e("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.firmwareData,border:""}},[e("el-table-column",{attrs:{prop:"mac",label:"路由MAC",width:"180"}}),t._v(" "),e("el-table-column",{attrs:{prop:"old_version",label:"之前版本",width:"180"},scopedSlots:t._u([{key:"default",fn:function(a){return[t._v(t._s(a.row.old_version||"未知"))]}}])}),t._v(" "),e("el-table-column",{attrs:{prop:"dest_version",label:"更新后版本",width:"180"}}),t._v(" "),e("el-table-column",{attrs:{prop:"task_result",label:"升级状态",width:"100"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("el-tag",{attrs:{type:"success"==a.row.task_result?"success":"warning","close-transition":""}},[t._v(t._s("success"==a.row.task_result?"成功":"running"==a.row.task_result?"执行中":"失败"))])]}}])}),t._v(" "),e("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("el-button",{staticClass:"btn1",attrs:{type:"info",size:"small"},on:{click:function(e){t.handleEdit(a.row.mac)}}},[t._v("详情")])]}}])})],1)],1):t._e(),t._v(" "),"apps"==t.isShow?e("div",[e("h4",[t._v("基本信息")]),t._v(" "),e("el-table",{ref:"multipleTable",staticStyle:{width:"100%",margin:"20px 0 40px"},attrs:{data:t.appsData1,border:""}},[e("el-table-column",{attrs:{prop:"additions.apps_name",label:"插件名称"}}),t._v(" "),e("el-table-column",{attrs:{prop:"additions.apps_version",label:"插件版本"}}),t._v(" "),e("el-table-column",{attrs:{prop:"additions.operator",label:"执行人"}})],1),t._v(" "),e("hr",{staticStyle:{"margin-bottom":"40px",height:"1px",border:"none","border-top":"1px solid #ddd"}}),t._v(" "),e("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.appsData,border:""}},[e("el-table-column",{attrs:{prop:"request_timestamp",label:"下发时间"}}),t._v(" "),e("el-table-column",{attrs:{prop:"mac",label:"路由MAC"}}),t._v(" "),e("el-table-column",{attrs:{prop:"device_status",label:"设备状态"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("el-tag",{attrs:{type:"online"==a.row.device_status?"success":"warning","close-transition":""}},[t._v(t._s("online"==a.row.device_status?"在线":"offline"==a.row.device_status?"离线":"未知"))])]}}])}),t._v(" "),e("el-table-column",{attrs:{prop:"pubsub_status",label:"升级状态"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("el-tag",{attrs:{type:"response_ok"==a.row.pubsub_status?"success":"response_fail"==a.row.pubsub_status?"danger":"warning","close-transition":""}},[t._v(t._s("response_ok"==a.row.pubsub_status?"成功":"response_fail"==a.row.pubsub_status?"失败":"执行中"))])]}}])}),t._v(" "),e("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("el-button",{staticClass:"btn1",attrs:{type:"info",size:"small"},on:{click:function(e){t.handleEdit(a.row.mac)}}},[t._v("详情")])]}}])})],1)],1):t._e(),t._v(" "),"script"==t.isShow?e("div",[e("h4",[t._v("基本信息")]),t._v(" "),e("el-table",{ref:"multipleTable",staticStyle:{width:"100%",margin:"20px 0 40px"},attrs:{data:t.scriptData1,border:""}},[e("el-table-column",{attrs:{prop:"",label:"升级方式"},scopedSlots:t._u([{key:"default",fn:function(a){return[t._v(t._s("remote_cmd"==a.row.cmd_item?"脚本升级":"其他"))]}}])}),t._v(" "),e("el-table-column",{attrs:{prop:"operator_name",label:"执行人"}})],1),t._v(" "),e("hr",{staticStyle:{"margin-bottom":"40px",height:"1px",border:"none","border-top":"1px solid #ddd"}}),t._v(" "),e("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.scriptData,border:""}},[e("el-table-column",{attrs:{prop:"response_timestamp",label:"完成时间",width:"180"}}),t._v(" "),e("el-table-column",{attrs:{prop:"mac",label:"路由MAC",width:"180"}}),t._v(" "),e("el-table-column",{attrs:{prop:"pubsub_status",label:"升级状态",width:"100"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("el-tag",{attrs:{type:"response_ok"==a.row.pubsub_status?"success":"response_fail"==a.row.pubsub_status?"danger":"warning","close-transition":""}},[t._v(t._s("response_ok"==a.row.pubsub_status?"成功":"response_fail"==a.row.pubsub_status?"失败":"执行中"))])]}}])}),t._v(" "),e("el-table-column",{attrs:{label:"操作"},scopedSlots:t._u([{key:"default",fn:function(a){return[e("el-button",{staticClass:"btn1",attrs:{type:"info",size:"small"},on:{click:function(e){t.handleEdit(a.row.mac)}}},[t._v("详情")])]}}])})],1)],1):t._e(),t._v(" "),e("div",{staticClass:"pagination"},[e("el-pagination",{attrs:{"current-page":t.currentPage,layout:"prev, pager, next",total:t.pageTotal},on:{"current-change":t.handleCurrentChange}})],1)])},staticRenderFns:[]}}});