(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-small-two"],{"05ed":function(t,e,i){"use strict";i.r(e);var a=i("f9d2"),n=i("2393");for(var o in n)"default"!==o&&function(t){i.d(e,t,(function(){return n[t]}))}(o);i("58b4");var s,p=i("f0c5"),u=Object(p["a"])(n["default"],a["b"],a["c"],!1,null,"4e805787",null,!1,a["a"],s);e["default"]=u.exports},2393:function(t,e,i){"use strict";i.r(e);var a=i("4415"),n=i.n(a);for(var o in a)"default"!==o&&function(t){i.d(e,t,(function(){return a[t]}))}(o);e["default"]=n.a},2416:function(t,e,i){t.exports=i.p+"static/img/triage_small_second.5476d23f.png"},4415:function(t,e,i){"use strict";var a=i("4ea4");i("99af"),i("4160"),i("fb6a"),i("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=a(i("0b44")),o=a(i("ce1b")),s={components:{popupSet:n.default,uniNoticeBar:o.default},data:function(){return{title:"超声科检查室",data:{},calledNumbera:"",iType:"",popupShow:!1,seqNumber:"",voiceData:[],testNubmer:0,voiceDataInit:[],dataPopup:{title:"",iType:"",screenNumber:"",playSound:!1,text:""},voicePlayNumber:0,text:"",dataPage:[],pageNewNumber:1,reload:!1,tips:""}},onLoad:function(){var t=uni.getStorageSync("dataInit")||{};this.iType=t.iType||"",this.title=t.title||"",this.text=t.text||"",this.playSound=t.playSound||!1,this.iType&&(this.init(),this.dataPopup.iType=this.iType,this.dataPopup.title=this.title,this.dataPopup.playSound=this.playSound,this.dataPopup.text=this.text||"")},methods:{page:function(){var t=this;this.dataPage.length>this.pageNewNumber?setTimeout((function(){t.data=t.dataPage.slice(t.pageNewNumber,++t.pageNewNumber)[0],t.page()}),5e3):setTimeout((function(){t.pageNewNumber=1,t.init()}),5e3)},open:function(){this.$refs.popupSet.open(),this.popupShow=!0},close:function(){this.popupShow=!1,this.iType&&this.init()},confirm:function(t){this.iType=t.iType,this.title=t.title,this.playSound=t.playSound,this.text=t.text,this.popupShow=!1,this.init()},init:function(){var t=this;if(this.popupShow)return!1;this.$request({url:"Queue/GetQueue",data:{examClass:this.iType,queueName:this.text,apmFlag:""},method:"POST",success:function(e){try{if("true"==e.reload||1==e.reload)return void t.$tui.webView.postMessage({data:{reload:e.reload}});t.tips=e.scrolling;var i=[];e.queueDtoList.forEach((function(e,a){!e.queueNo&&t.dataPage[a]&&(e.queueNo=t.dataPage[a].seeingNumber,e.name=t.dataPage[a].seeingName);var n=e.name?t.$util.hideName(e.name):"",o=[];e.waitList.forEach((function(e){e.queueNo&&o.push({name:e.name?t.$util.hideName(e.name):"",number:e.queueNo||""})}));var s={room:e.queueName,seeingNumber:e.queueNo||"",seeingName:n,wating:o.slice(0,2)};(o.length>0||s.seeingNumber)&&(i=i.concat(s))})),t.dataPage=i,t.data=i[0],t.page()}catch(a){console.error(a),setTimeout((function(){t.init()}),6e3)}},fail:function(e){setTimeout((function(){t.init()}),6e3)}})}}};e.default=s},"58b4":function(t,e,i){"use strict";var a=i("ea78"),n=i.n(a);n.a},"633d":function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,".pr-15[data-v-4e805787]{padding-right:15px}.pl-15[data-v-4e805787]{padding-left:15px}.pt-15[data-v-4e805787]{padding-top:15px}uni-page-body[data-v-4e805787]{height:100%}.title[data-v-4e805787]{color:#fff;padding-top:162px;height:424px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.title-dep[data-v-4e805787]{font-size:80px;text-shadow:5px 5px 1px #333}.title-room[data-v-4e805787]{text-shadow:5px 5px 1px #333;font-size:100px}.uni-form-item.uni-form-btn[data-v-4e805787]{padding:0}.info[data-v-4e805787]{padding-left:10px;padding-right:10px}.footer[data-v-4e805787]{color:#fff;font-size:30px;padding-top:7px}.chooseBtn[data-v-4e805787]{font-size:30px;width:438px}.header[data-v-4e805787]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;position:relative;height:118px}.number uni-view[data-v-4e805787]{color:#711112!important}.content[data-v-4e805787]{position:relative;height:100%;width:768px}.bg[data-v-4e805787]{position:absolute;height:1366px;width:768px;z-index:-1}.header-time[data-v-4e805787]{display:-webkit-box;display:-webkit-flex;display:flex;position:absolute;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;right:45px;padding-top:15px;top:0}.header-title[data-v-4e805787]{color:#fdfa07;font-size:63px;font-weight:800;letter-spacing:12px}.header-time uni-view[data-v-4e805787]{font-size:35px;color:#000;letter-spacing:5px}.info-patient[data-v-4e805787]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;height:357px;text-align:center;padding-left:219px}.info-patient uni-view[data-v-4e805787]{font-size:60px;color:#fff;text-overflow:ellipsis}",""]),t.exports=e},ea78:function(t,e,i){var a=i("633d");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("680cca40",a,!0,{sourceMap:!1,shadowMode:!1})},f9d2:function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return o})),i.d(e,"a",(function(){return a}));var a={uniNoticeBar:i("ce1b").default},n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"content",on:{longpress:function(e){arguments[0]=e=t.$handleEvent(e),t.open.apply(void 0,arguments)},click:function(e){arguments[0]=e=t.$handleEvent(e),t.open.apply(void 0,arguments)}}},[a("v-uni-image",{staticClass:"bg",attrs:{src:i("2416").replace(/^\./,"")}}),a("v-uni-view",{staticClass:"title"},[a("v-uni-view",{staticClass:"title-dep"},[t._v(t._s(t.title))]),a("v-uni-view",{staticClass:"title-room"},[t._v(t._s(t.text))])],1),a("v-uni-view",{staticClass:"info"},[a("v-uni-view",{staticClass:"info-patient"},[t.data.seeingNumber?a("v-uni-view",{staticClass:"data"},[a("v-uni-view",[a("v-uni-text",{staticClass:"pr-15"},[t._v(t._s(t.data.seeingNumber?t.data.seeingNumber+"号":""))]),a("v-uni-text",{staticClass:"pl-15"},[t._v(t._s(t.data.seeingName))])],1)],1):t._e()],1),a("v-uni-view",{staticClass:"info-patient pt-15"},[a("v-uni-view",{staticClass:"room"},t._l(t.data.wating,(function(e,i){return a("v-uni-view",{key:i},[e.number?a("v-uni-view",[a("v-uni-text",{staticClass:"pr-15"},[t._v(t._s(e.number?e.number+"号":""))]),a("v-uni-text",{staticClass:"pl-15"},[t._v(t._s(e.name))])],1):t._e()],1)})),1)],1)],1),a("v-uni-view",{staticClass:"footer"},[a("uni-notice-bar",{attrs:{scrollable:"true",single:"true",text:t.tips,fontSize:"30px",height:"30px"}})],1),a("popupSet",{ref:"popupSet",attrs:{dataInit:t.dataPopup,showTitle:!0,showwText:!0,showIType:!0},on:{confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.confirm.apply(void 0,arguments)},close:function(e){arguments[0]=e=t.$handleEvent(e),t.close.apply(void 0,arguments)}}})],1)},o=[]}}]);