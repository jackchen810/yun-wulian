(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-article-article"],{"77f2":function(t,e,i){e=t.exports=i("2350")(!1),e.push([t.i,".banner[data-v-d7bf2f20]{height:%?360?%;overflow:hidden;position:relative;background-color:#ccc}.banner-img[data-v-d7bf2f20]{width:100%;height:100%}.banner-title[data-v-d7bf2f20]{max-height:%?84?%;overflow:hidden;position:absolute;left:%?30?%;bottom:%?30?%;width:90%;font-size:%?32?%;font-weight:400;line-height:%?42?%;color:#fff;z-index:11}.article-meta[data-v-d7bf2f20]{padding:%?20?% %?30?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-pack:start;-webkit-justify-content:flex-start;justify-content:flex-start;color:grey}.article-excerpt[data-v-d7bf2f20]{padding:%?20?% %?0?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-pack:start;-webkit-justify-content:flex-start;justify-content:flex-start;color:grey}.article-text[data-v-d7bf2f20]{font-size:%?26?%;line-height:%?50?%;margin:0 %?20?%}.article-author[data-v-d7bf2f20],.article-see[data-v-d7bf2f20],.article-time[data-v-d7bf2f20]{margin-right:%?20?%;font-size:%?30?%}.article-content[data-v-d7bf2f20]{padding:0 %?30?%;overflow:hidden;font-size:%?30?%;padding-bottom:60px}.article-excerpt2[data-v-d7bf2f20]{padding-left:%?30?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-pack:start;-webkit-justify-content:flex-start;justify-content:flex-start;color:grey}.article-content2[data-v-d7bf2f20]{overflow:hidden;font-size:%?30?%;padding-bottom:60px;padding:%?20?%}.article-footer-action-bar[data-v-d7bf2f20]{position:fixed;bottom:0;height:48px;width:100%;background:#fff;line-height:48px;border-top:1px solid #eee}.action-bar-item-active[data-v-d7bf2f20]{background:#f9f9f9}.share-btn uni-button[data-v-d7bf2f20]{background:transparent}.share-btn uni-button[data-v-d7bf2f20]:after{border:none}.flex[data-v-d7bf2f20]{display:-webkit-box;display:-webkit-flex;display:flex}.flex__item[data-v-d7bf2f20]{-webkit-box-flex:1;-webkit-flex:1;flex:1}.text-center[data-v-d7bf2f20]{text-align:center}.text-text[data-v-d7bf2f20]{font-size:12px;display:inline-block;vertical-align:top}.uni-icon uni-icon-eye[data-v-d7bf2f20]{line-height:4!important}",""])},"7cf3":function(t,e,i){"use strict";var n,a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",[i("v-uni-view",{staticClass:"banner"},[i("v-uni-image",{staticClass:"banner-img",attrs:{src:t.banner.image_url}}),i("v-uni-view",{staticClass:"banner-title"},[t._v(t._s(t.banner.title))])],1),i("v-uni-view",{staticClass:"article-meta"},[t.banner.source?i("v-uni-text",{staticClass:"article-author"},[t._v(t._s(t.banner.source))]):t._e(),i("v-uni-text",{staticClass:"article-time"},[t._v(t._s(t.banner.datetime))]),i("v-uni-text",{staticClass:"article-see"},[t._v("浏览量:"+t._s(t.hits_count))])],1),t.ismark?t._e():i("v-uni-view",{staticClass:"article-content"},[i("v-uni-text",{staticClass:"article-excerpt"},[t._v(t._s(t.excerpt))]),i("v-uni-view",{domProps:{innerHTML:t._s(t.content)}})],1),t.ismark?i("v-uni-view",{staticClass:"article-content2"},[i("v-uni-text",{staticClass:"article-excerpt2"},[t._v(t._s(t.excerpt))]),t._l(t.content,function(e,n){return i("v-uni-view",{key:n,style:e.style},[i("p",{directives:[{name:"show",rawName:"v-show",value:"p"==e.tagType,expression:"item.tagType == 'p'"}]},[t._v(t._s(e.value))]),i("v-uni-image",{directives:[{name:"show",rawName:"v-show",value:"image"==e.tagType,expression:"item.tagType == 'image'"}],staticStyle:{width:"100%"},attrs:{src:e.value,mode:"widthFix"}})],1)})],2):t._e(),i("v-uni-view",{staticClass:"flex article-footer-action-bar share-btn"},[i("v-uni-view",{staticClass:"flex__item text-center",attrs:{"hover-class":"action-bar-item-active",bindtap:"onLikeTap"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.doFavorite.apply(void 0,arguments)}}},[i("v-uni-button",[i("uni-icon",{attrs:{type:"star",size:"28"}}),i("v-uni-view",{staticClass:"text-text"},[t._v(t._s(t.favorites_count))])],1)],1),i("v-uni-view",{staticClass:"flex__item text-center",attrs:{"hover-class":"action-bar-item-active"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.doLike.apply(void 0,arguments)}}},[i("v-uni-button",[i("uni-icon",{attrs:{type:"checkmarkempty",size:"38"}}),i("v-uni-view",{staticClass:"text-text"},[t._v(t._s(t.like_count))])],1)],1),i("v-uni-view",{staticClass:"flex__item text-center",attrs:{"hover-class":"action-bar-item-active"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.comment.apply(void 0,arguments)}}},[i("v-uni-button",[i("uni-icon",{attrs:{type:"chatbubble",size:"30"}}),i("v-uni-view",{staticClass:"text-text"},[t._v(t._s(t.comment_count))])],1)],1)],1)],1)},o=[];i.d(e,"b",function(){return a}),i.d(e,"c",function(){return o}),i.d(e,"a",function(){return n})},8720:function(t,e,i){"use strict";i.r(e);var n=i("7cf3"),a=i("df85");for(var o in a)"default"!==o&&function(t){i.d(e,t,function(){return a[t]})}(o);i("90fc");var s,r=i("f0c5"),c=Object(r["a"])(a["default"],n["b"],n["c"],!1,null,"d7bf2f20",null,!1,n["a"],s);e["default"]=c.exports},"90fc":function(t,e,i){"use strict";var n=i("b596"),a=i.n(n);a.a},ae7b:function(t,e,i){"use strict";var n=i("288e");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=n(i("f499")),o=n(i("365e")),s="<p>获取信息失败</p>",r=i("c78e"),c={data:function(){return{banner:{},content:"",excerpt:"",comment_count:0,like_count:0,favorites_count:0,hits_count:0,ismark:!1}},components:{uniIcon:o.default},onShareAppMessage:function(){return{title:this.banner.title,path:"/pages/article/article?query="+encodeURIComponent((0,a.default)(detail))}},onLoad:function(t){var e=this;if(t.id)r.get({url:"/portal/articles/"+t.id,success:function(t){if(1==t.code){var i=t.data;e.banner.id=i.id,e.banner.title=i.post_title,e.banner.datetime=i.published_time,e.banner.image_url=i.thumbnail,e.content=i.post_content,e.excerpt=i.post_excerpt,e.comment_count=i.comment_count,e.like_count=i.post_like,e.favorites_count=i.post_favorites,e.hits_count=i.post_hits}else e.content=s}});else{try{this.banner=JSON.parse(decodeURIComponent(t.query))}catch(i){this.banner=JSON.parse(t.query)}this.excerpt=this.banner.desc,this.getDetail(),uni.setNavigationBarTitle({title:this.banner.title})}},methods:{getDetail:function(){var t=this;r.get({url:"/portal/articles/"+this.banner.id,success:function(e){if(1==e.code){var i=e.data;2==i.post_format?(t.ismark=!0,t.content=JSON.parse(i.post_content)):t.content=i.post_content,t.excerpt=i.post_excerpt,t.comment_count=i.comment_count,t.like_count=i.post_like,t.favorites_count=i.post_favorites,t.hits_count=i.post_hits}else t.content=s}})},doFavorite:function(){var t=this;r.get({url:"user/favorites/hasFavorite",data:{object_id:t.banner.id,table_name:"portal_post"},success:function(e){1==e.code&&r.post({url:"portal/articles/cancelFavorite",data:{id:t.banner.id},success:function(e){1==e.code&&(t.favorites_count--,uni.showToast({title:e.msg,duration:1500,icon:"success"}))}}),0==e.code&&r.post({url:"portal/articles/doFavorite",data:{id:t.banner.id},success:function(e){1==e.code&&(t.favorites_count++,uni.showToast({title:e.msg,duration:1500,icon:"success"}))}})}})},doLike:function(){var t=this;r.post({url:"portal/articles/doLike",data:{id:t.banner.id},success:function(e){1==e.code&&(t.like_count++,uni.showToast({title:e.msg,duration:1500,icon:"success"})),0==e.code&&uni.showToast({title:e.msg,duration:1500,icon:"none"})}})},comment:function(){uni.navigateTo({url:"/pages/comment/comment?id="+this.banner.id})}}};e.default=c},b596:function(t,e,i){var n=i("77f2");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var a=i("4f06").default;a("46a9adf0",n,!0,{sourceMap:!1,shadowMode:!1})},df85:function(t,e,i){"use strict";i.r(e);var n=i("ae7b"),a=i.n(n);for(var o in n)"default"!==o&&function(t){i.d(e,t,function(){return n[t]})}(o);e["default"]=a.a}}]);