webpackJsonp([14],{528:function(e,t,a){a(909);var o=a(203)(a(911),a(912),"data-v-09c831c8",null);e.exports=o.exports},909:function(e,t,a){var o=a(910);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);a(205)("f578f9cc",o,!0)},910:function(e,t,a){t=e.exports=a(204)(!1),t.push([e.i,".handle-box[data-v-09c831c8]{margin-bottom:20px}.handle-select[data-v-09c831c8]{width:120px}.handle-input[data-v-09c831c8]{width:300px;display:inline-block}.rad-group[data-v-09c831c8]{margin-bottom:20px}.btn1[data-v-09c831c8]{margin-bottom:5px;margin-top:5px;margin-left:0}.diainp[data-v-09c831c8]{width:217px}.diainp2[data-v-09c831c8]{width:400px}",""])},911:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={data:function(){return{isShow:"1"!=localStorage.getItem("userMsg"),cur_page:1,dialogFormVisible:!1,form:{dev_name:"",dev_vendor:"",chip_type:"",chip_vendor:"jdwx-default",comment:""},rules:{dev_name:[{required:!0,message:"请输入设备型号",trigger:"blur"},{validator:this.validateSpace,trigger:"blur"}],dev_vendor:[{required:!0,message:"请输入设备厂商",trigger:"blur"},{validator:this.validateSpace,trigger:"blur"}],chip_type:[{required:!0,message:"请输入芯片类型",trigger:"blur"},{validator:this.validateSpace,trigger:"blur"}]},listData:[],formLabelWidth:"120px",loading:!1,pageTotal:0,currentPage:1}},created:function(){this.getData({})},methods:{getData:function(e){var t=this;t.loading=!0,t.$axios.post("/api/devtype/list",e).then(function(a){t.loading=!1,"1001"==a.data.ret_code&&(t.$message({message:a.data.extra,type:"warning"}),setTimeout(function(){t.$router.replace("login")},2e3)),0==a.data.ret_code&&("{}"==JSON.stringify(e)?(t.pageTotal=a.data.extra.length,t.listData=a.data.extra.slice(0,10)):t.listData=a.data.extra)})},saveAdd:function(e){var t=this;t.$refs[e].validate(function(e){if(!e)return!1;console.log("验证成功");var a={dev_name:t.form.dev_name,dev_vendor:t.form.dev_vendor,chip_type:t.form.chip_type,chip_vendor:t.form.chip_vendor,comment:t.form.comment};t.loading=!0,t.$axios.post("/api/devtype/add",a).then(function(e){t.loading=!1,"1001"==e.data.ret_code&&(t.$message({message:e.data.extra,type:"warning"}),setTimeout(function(){t.$router.replace("login")},2e3)),0==e.data.ret_code&&(t.$message({message:"添加成功",type:"success"}),t.getData({}),t.form.dev_name="",t.form.dev_vendor="",t.form.chip_type="",t.form.chip_vendor="",t.form.comment="",t.dialogFormVisible=!1)},function(e){t.loading=!1,t.$message.error("添加失败"),console.log(e)})})},delDev:function(e){var t=this,a={_id:e};t.loading=!0,t.$axios.post("/api/devtype/del",a).then(function(e){t.loading=!1,"1001"==e.data.ret_code&&(t.$message({message:e.data.extra,type:"warning"}),setTimeout(function(){t.$router.replace("login")},2e3)),0==e.data.ret_code?(t.$message({message:"删除成功",type:"success"}),t.getData()):t.$message.error(e.data.extra)},function(e){t.loading=!1,t.$message.error("删除失败"),console.log(e)})},handleCurrentChange:function(e){this.currentPage=e,this.getData({page_size:10,current_page:this.currentPage})},validateSpace:function(e,t,a){t.indexOf(" ")>=0?a(new Error("输入有空格")):a()}}}},912:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"table"},[e.isShow?a("div",{staticClass:"handle-box"},[a("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary",icon:"plus"},on:{click:function(t){e.dialogFormVisible=!0}}},[e._v("添加型号")])],1):e._e(),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:e.listData,border:""}},[a("el-table-column",{attrs:{prop:"create_date",label:"添加时间",width:"170"}}),e._v(" "),a("el-table-column",{attrs:{prop:"dev_name",label:"设备型号",width:"150"}}),e._v(" "),a("el-table-column",{attrs:{prop:"dev_vendor",label:"设备厂商",width:"130"}}),e._v(" "),a("el-table-column",{attrs:{prop:"chip_type",label:"芯片型号",width:"170"}}),e._v(" "),a("el-table-column",{attrs:{prop:"comment",label:"更新说明"}}),e._v(" "),e.isShow?a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{staticClass:"btn1",attrs:{size:"small",type:"danger"},on:{click:function(a){e.delDev(t.row._id)}}},[e._v("删除")])]}}])}):e._e()],1),e._v(" "),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{"current-page":e.currentPage,layout:"prev, pager, next",total:e.pageTotal},on:{"current-change":e.handleCurrentChange}})],1),e._v(" "),a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"digcont",attrs:{title:"添加型号",visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules}},[a("el-form-item",{attrs:{label:"设备型号",prop:"dev_name","label-width":e.formLabelWidth}},[a("el-input",{staticClass:"diainp",attrs:{"auto-complete":"off"},model:{value:e.form.dev_name,callback:function(t){e.$set(e.form,"dev_name",t)},expression:"form.dev_name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"设备厂商",prop:"dev_vendor","label-width":e.formLabelWidth}},[a("el-input",{staticClass:"diainp",attrs:{"auto-complete":"off"},model:{value:e.form.dev_vendor,callback:function(t){e.$set(e.form,"dev_vendor",t)},expression:"form.dev_vendor"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"芯片类型",prop:"chip_type","label-width":e.formLabelWidth}},[a("el-input",{staticClass:"diainp",attrs:{"auto-complete":"off"},model:{value:e.form.chip_type,callback:function(t){e.$set(e.form,"chip_type",t)},expression:"form.chip_type"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"备注",prop:"comment","label-width":e.formLabelWidth}},[a("el-input",{staticClass:"diainp",attrs:{"auto-complete":"off"},model:{value:e.form.comment,callback:function(t){e.$set(e.form,"comment",t)},expression:"form.comment"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.saveAdd("form")}}},[e._v("添 加")])],1)],1)],1)},staticRenderFns:[]}}});