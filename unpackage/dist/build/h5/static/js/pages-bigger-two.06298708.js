(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-bigger-two"],{"0cc4":function(t,e,i){"use strict";var a=i("4ea4");i("99af"),i("4160"),i("a15b"),i("d81d"),i("fb6a"),i("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=a(i("0b44")),o=a(i("ce1b")),s={components:{popupSet:n.default,uniNoticeBar:o.default},data:function(){return{title:"超声科",data:[],calledNumbera:"",iType:"",popupShow:!1,seqNumber:"",voiceData:[],testNubmer:1,voiceDataInit:[],dataPopup:{title:"",iType:"",screenNumber:"",playSound:!1,text:""},voicePlayNumber:0,voicePlayTiems:0,text:"",tips:"",reload:""}},onLoad:function(){var t=uni.getStorageSync("dataInit")||{};this.iType=t.iType||"",this.playSound=t.playSound||!1,this.text=t.text||"",this.iType&&(this.init(),this.dataPopup.iType=this.iType,this.dataPopup.playSound=this.playSound,this.dataPopup.text=this.text)},methods:{open:function(){this.$refs.popupSet.open(),this.popupShow=!0},close:function(){this.popupShow=!1,this.iType&&this.init()},confirm:function(t){this.iType=t.iType,this.playSound=t.playSound,this.text=t.text,this.popupShow=!1,this.init()},init:function(){var t=this;if(this.popupShow)return!1;this.$request({url:"Queue/GetQueueAndCompleteList",data:{examClass:this.iType,queueName:this.text,apmFlag:""},method:"POST",success:function(e){try{if("true"==e.reload||1==e.reload)return void t.$tui.webView.postMessage({data:{reload:e.reload}});e.queueDtoList.length>2&&(e.queueDtoList=e.queueDtoList.slice(0,2)),t.tips=e.scrolling;var i=[],a=[];e.queueDtoList.forEach((function(e,n){var o=e.name?t.$util.hideName(e.name):"",s=[],c="";e.waitList.length>0&&(s=e.waitList[0],c=s.name?t.$util.hideName(s.name):"");var u=e.completeList.map((function(t){return t.queueNo})),p={room:e.queueName,seeingNumber:e.queueNo,seeingName:o,department:e.examClass,pastName:u.join(),waitingName:c,waitingNumber:s.queueNo};if(i=i.concat(p),o&&t.playSound){var r=t.$util.chineseNumeral(p.seeingNumber+""),l="请,".concat(r,"号,").concat(e.name,"到,").concat(p.room,"就诊");0==t.data.length?(t.voiceData.push(l),t.voiceDataInit.push(l)):a=a.concat(l)}})),t.data=i,t.playSound?(a.length>0&&(t.voiceData=t.$util.findDifferentElements(a,t.voiceDataInit),t.voiceDataInit=a),t.voiceData.length>0?t.voiceQueue():setTimeout((function(){t.init()}),6e3)):setTimeout((function(){t.init()}),6e3)}catch(n){console.error(n),setTimeout((function(){t.init()}),6e3)}},fail:function(e){setTimeout((function(){t.init()}),6e3)}})},voiceQueue:function(){var t=this,e=this.voiceData[0];this.$tui.webView.postMessage({data:{text:e}}),console.log(e),this.voiceData.length>1?this.onDone(this.voiceData[1]):(this.voiceData=[],setTimeout((function(){t.init()}),5e3))},onDone:function(t){var e=this,i=4300;t.length>12&&(i+=300*(t.length-12)),setTimeout((function(){e.voicePlayNumber++,e.voicePlayNumber>=e.voicePlayTiems&&(e.voiceData.shift(),e.voicePlayNumber=0),e.voiceData.length>0?e.voiceQueue():setTimeout((function(){e.init()}),5e3)}),i)}}};e.default=s},"29b5":function(t,e,i){"use strict";i.r(e);var a=i("0cc4"),n=i.n(a);for(var o in a)"default"!==o&&function(t){i.d(e,t,(function(){return a[t]}))}(o);e["default"]=n.a},"3c98":function(t,e,i){var a=i("cb69");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("1b8e55b2",a,!0,{sourceMap:!1,shadowMode:!1})},"646d":function(t,e,i){"use strict";i.r(e);var a=i("fabe"),n=i("29b5");for(var o in n)"default"!==o&&function(t){i.d(e,t,(function(){return n[t]}))}(o);i("9117");var s,c=i("f0c5"),u=Object(c["a"])(n["default"],a["b"],a["c"],!1,null,"e4baf25c",null,!1,a["a"],s);e["default"]=u.exports},9117:function(t,e,i){"use strict";var a=i("3c98"),n=i.n(a);n.a},"986d":function(t,e,i){t.exports=i.p+"static/img/triage_two.e9bec6c6.png"},cb69:function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,".footer[data-v-e4baf25c]{color:#fff;font-size:44px;height:78px;line-height:78px;padding:0 10px}.pr-15[data-v-e4baf25c]{padding-right:15px}.pl-15[data-v-e4baf25c]{padding-left:15px}uni-page-body[data-v-e4baf25c]{height:100%}.uni-form-item.uni-form-btn[data-v-e4baf25c]{padding:0}.info[data-v-e4baf25c]{padding-left:10px;padding-right:10px;height:762px}.chooseBtn[data-v-e4baf25c]{font-size:30px;width:438px}.header[data-v-e4baf25c]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;position:relative;height:118px}.room[data-v-e4baf25c]{width:477px}.number uni-view[data-v-e4baf25c]{color:#711112!important}.content[data-v-e4baf25c]{position:relative;height:100%;width:1920px}.type[data-v-e4baf25c]{font-size:70px;display:-webkit-box;display:-webkit-flex;display:flex;padding-top:116px;font-weight:700;height:122px;line-height:122px;padding-left:10px;padding-right:10px}.type-text[data-v-e4baf25c]{width:471px;text-align:center}.bg[data-v-e4baf25c]{position:absolute;height:1080px;width:1920px;z-index:-1}.header-time[data-v-e4baf25c]{display:-webkit-box;display:-webkit-flex;display:flex;position:absolute;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;right:45px;padding-top:15px;top:0}.header-title[data-v-e4baf25c]{color:#fdfa07;font-size:63px;font-weight:800;letter-spacing:12px}.header-time uni-view[data-v-e4baf25c]{font-size:35px;color:#000;letter-spacing:5px}.info-patient[data-v-e4baf25c]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;height:380px;text-align:center}.info-patient uni-view[data-v-e4baf25c]{font-size:58px;font-weight:700;color:#000;overflow:hidden}",""]),t.exports=e},fabe:function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return o})),i.d(e,"a",(function(){return a}));var a={uniNoticeBar:i("ce1b").default},n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"content",on:{longpress:function(e){arguments[0]=e=t.$handleEvent(e),t.open.apply(void 0,arguments)},click:function(e){arguments[0]=e=t.$handleEvent(e),t.open.apply(void 0,arguments)}}},[a("v-uni-image",{staticClass:"bg",attrs:{src:i("986d").replace(/^\./,"")}}),a("v-uni-view",{staticClass:"type"},[a("v-uni-view",{staticClass:"type-text"},[t._v("检查室")]),a("v-uni-view",{staticClass:"type-text"},[t._v("当前检查")]),a("v-uni-view",{staticClass:"type-text"},[t._v("候诊")]),a("v-uni-view",{staticClass:"type-text"},[t._v("过号")])],1),a("v-uni-view",{staticClass:"info"},t._l(t.data,(function(e,i){return a("v-uni-view",{key:i,staticClass:"info-patient"},[a("v-uni-view",{staticClass:"room"},[a("v-uni-view",[t._v(t._s(e.department))]),a("v-uni-view",[t._v(t._s(e.room))])],1),a("v-uni-view",{staticClass:"number room"},[e.seeingNumber?a("v-uni-view",[a("v-uni-text",{staticClass:"pr-15"},[t._v(t._s(e.seeingNumber)+"号")]),a("v-uni-text",{staticClass:"pl-15"},[t._v(t._s(e.seeingName))])],1):t._e()],1),a("v-uni-view",{staticClass:"room"},[e.waitingNumber?a("v-uni-view",[a("v-uni-text",{staticClass:"pr-15"},[t._v(t._s(e.waitingNumber)+"号")]),a("v-uni-text",{staticClass:"pl-15"},[t._v(t._s(e.waitingName))])],1):t._e()],1),a("v-uni-view",{staticClass:"room"},[a("v-uni-view",{staticClass:"uni-notice"},[a("uni-notice-bar",{attrs:{scrollable:"true",single:"true",text:e.pastName,color:"#000"}})],1)],1)],1)})),1),a("v-uni-view",{staticClass:"footer"},[a("uni-notice-bar",{attrs:{scrollable:"true",single:"true",text:t.tips}})],1),a("popupSet",{ref:"popupSet",attrs:{backgroundColor:"transparent",showwText:!0,dataInit:t.dataPopup,color:"#fff",showPlaySound:!0,showIType:!0},on:{confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.confirm.apply(void 0,arguments)},close:function(e){arguments[0]=e=t.$handleEvent(e),t.close.apply(void 0,arguments)}}})],1)},o=[]}}]);