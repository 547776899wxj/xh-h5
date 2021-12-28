<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/ultrNew.png" ></image>
		<view class="title">{{title}}</view>
		<view class="info">
			<view>
				<view class="info-patient">
					<view class="number">检查室</view>
					<view class="number">正在检查</view>
					<view class="number">已过号</view>
				</view>
				<view class="info-patient" v-for="(item,index) in data.slice(0,8)" :key="index">
					<view class="number">{{item.room}}</view>
					<view class="number " :class="{seeing:item.seeingLength>9}">{{item.number}}{{item.seeingName}}</view>
					<view class="number">
						<uni-notice-bar scrollable="true" single="true" color='#000' :text="item.calledNumbera" :fontSize="noticeFontSize" :speed='30'></uni-notice-bar>
					</view>
				</view>
			</view>
			<view>
				<view class="info-patient">
					<view class="number">检查室</view>
					<view class="number">正在检查</view>
					<view class="number">已过号</view>
				</view>
				<view class="info-patient" v-for="(item,index) in data.slice(8,17)" :key="index">
					<view class="number">{{item.room}}</view>
					<view class="number " :class="{seeing:item.seeingLength>9}">{{item.number}}{{item.seeingName}}</view>
					<view class="number">
						<uni-notice-bar scrollable="true" single="true" color='#000' :text="item.calledNumbera" :fontSize="noticeFontSize" :speed='30'></uni-notice-bar>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<uni-notice-bar scrollable="true" single="true" :text="tips" :fontSize="noticeFontSize" :height="noticeFontSize"></uni-notice-bar>
		</view>
		<popupSet ref="popupSet" @confirm="confirm" @close="close" :showTitle="true" :showwText="true" :dataInit="dataPopup"  :showPlaySound="true" :showIType="true" ></popupSet>
	</view>
</template>

<script>
	import popupSet from '../../components/popup-set/popup-set.vue';
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	export default {
		components: { popupSet ,uniNoticeBar},
		data() {
			return {
				title:'超声科',
				data:[
				],
				calledNumbera:'',
				iType:'',
				popupShow:false,
				seqNumber:'',  
				voiceData:[],
				testNubmer:0,
				voiceDataInit:[],
				dataPopup:{
					title:'',
					iType:'',
					screenNumber:'',
					playSound:false,
					text:'',
				},
				voicePlayNumber:0,
				voicePlayTiems:3,
				text:'',
				tips:'',
				reload:false,
				interval:10000,
				noticeFontSize:''
			}
		},
		onLoad() {
			this.interval = this.$util.getRequestInterval();
			let dataInit = uni.getStorageSync('dataInit')||{};
			this.iType = dataInit.iType || '';
			this.playSound = dataInit.playSound || false;
			this.text = dataInit.text || '';
			this.title = dataInit.title || '';
			this.init();
			if(this.iType){
				this.dataPopup.iType = this.iType;
				this.dataPopup.playSound = this.playSound ;
				this.dataPopup.text = this.text;
				this.dataPopup.title = this.title;
			}
			uni.getSystemInfo({
			    success: (res) =>{
					if(res.windowWidth < 1600 ){
						this.noticeFontSize = '30px'
					}else{
						this.noticeFontSize = '44px'
					}
			    }
			});
		},
		methods: {
			// 打开设置
			open(){
				this.$refs.popupSet.open();
				this.popupShow = true;
			},
			// 关闭设置
			close(){
				this.popupShow = false;
				this.init();
			},
			//确定设置
			confirm(res) {
				this.iType = res.iType;
				this.playSound = res.playSound;
				this.text = res.text;
				this.popupShow = false;
				this.title = res.title;
				this.init();
			},
			// 初始化数据
			init(){
				if(this.popupShow){
					return false;
				}
				// 测试使用
				// let datas = { CompleteList:[{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",},{"queueNo": "CT151",}],scrolling:'友情提示：请在自助机刷卡取排队号，取号1后在大厅等候广播呼叫，过号请与窗口联系！',"queueDtoList":[{
				// 	"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT151","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",
				// 	},
				// 	{"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT151","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",},
				// 	{"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT151","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",},
				// 	{"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT151","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",},
				// 	{"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT151","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",},
				// 	{"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT151","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",},
				// 	{"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT151","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",},
					
				// 	]}
				
				this.$request({
					url: 'Queue/getQueue/Us/Big',
					data:{
						examClass: this.iType,
						queueName: this.text,
						apmFlag: '',
					},
					method: 'POST',
					success: datas => {
						try{
							if(datas.reload=='true' || datas.reload==true){
								this.$tui.webView.postMessage({
									data: {
										reload:datas.reload
									}
								})
								return;
							}
						
							this.tips = datas.scrolling;
							let dataMaps = [];
							let voiceDataInit = [];
							datas.queueDtoList.forEach((data,index) =>{
								// if(!data.queueNo && this.data[index]){
								// 	data.queueNo = this.data[index].number;
								// 	data.patientName = this.data[index].seeingName;
								// }
								let seeingName =data.patientName?this.$util.hideName(data.patientName):'';
								let calledNumbera = [];
								if(Array.isArray(data.passList)){
									calledNumbera = data.passList.map(item => {
										return item.queueNo;
									})
								}
								let dataMap = {
									room:data.queueName,
									number:data.queueNo  || '',
									seeingName:seeingName,
									calledNumbera: calledNumbera.join(),
									seeingLength:(data.queueNo+'').length + seeingName.length
								}
								dataMaps = dataMaps.concat(dataMap);
								if(seeingName && this.playSound){
									let number = this.$util.chineseNumeral(dataMap.seeingNumber+'');
									number = number?number+'号':'';
									let speakText = `请,${number}${data.patientName}到,${dataMap.room}就诊`;
									if(this.data.length==0){
										this.voiceData.push(speakText);
										this.voiceDataInit.push(speakText);
									}else{
										voiceDataInit = voiceDataInit.concat(speakText);
									}
								}
							})
							this.data = dataMaps;
							if(this.playSound){
								if(voiceDataInit.length>0){
									this.voiceData = this.$util.findDifferentElements(voiceDataInit,this.voiceDataInit);
									this.voiceDataInit = voiceDataInit;
								}
								if(this.voiceData.length>0){
									this.voiceQueue();	
								}else{
									setTimeout(() => {
										this.init()
									}, this.interval);
								}
							}else{
								setTimeout(() => {
									this.init();
								}, this.interval);
							}
						}
						catch(err){
							setTimeout(() => {
								this.init();
							}, this.interval);
							console.error(err);
						}
					},
					fail: err => {
						setTimeout(() => {
							this.init();
						}, this.interval);
					}
				})
				
			},
			// 语音队列
			voiceQueue(){
				let text = this.voiceData[0] ; 
				this.$tui.webView.postMessage({
					data: {
						text:text
					}
				})
				console.log(text);
				if(this.voiceData.length>1){
					this.onDone(this.voiceData[1]);
				}else{
					this.onDone(this.voiceData[0]);
				}
			},
			// 播放完执行
			onDone(data){
				let date = 4300;
				if(data.length>12){
					date = date + ((data.length - 12)*300 ) 
				}
				setTimeout(() => {
					this.voicePlayNumber++;
					if(this.voicePlayNumber>=this.voicePlayTiems){
						this.voiceData.shift();
						this.voicePlayNumber = 0;
					}
					if(this.voiceData.length>0){
						this.voiceQueue()
					}else{
						this.init()
					}
				}, date);
				
			},
		}
	}
</script>

<style lang="scss">

.pr-15{
	padding-right: 15px;
}
.pl-15{
	padding-left: 15px;
}
page {
	height: 100%;
}
.uni-form-item.uni-form-btn{
	padding: 0;
}
.info{
	display: flex;
	height: 545px;
}
.footer{
	color: #FFFFFF;
    font-size: 44px;
    height: 78px;
    line-height: 78px;
    padding: 0 10px;
	overflow: hidden;
}
.chooseBtn{
	font-size: 30px;
	width: 438px;
}
.header{
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 118px;
}
.room{
	width: 321px;
}
.info-patient .number{
	width: 318px;
	font-size: 45px;
	text-align: center;
}
.info-patient .number.seeing{
	font-size: 24px !important;
}
.uni-notice{
	padding-left: 20px;
	width: calc(100% - 370px);
}
.content {
	position: relative;
	height: 100%;
}

.bg {
	position: absolute;
	height: 1080px;
	width: 1920px;
	z-index: -1;
}
.header-time {
	display: flex;
	position: absolute;
	justify-content: center;
	flex-direction: column;
	right: 45px;
	padding-top: 15px;
	top: 0px;
}
.header-title{
	color: rgb(253,250,7);
	font-size: 63px;
	font-weight: 800;
	letter-spacing: 12px;
}
.header-time view {
	font-size: 35px;
	color: #000;
	letter-spacing:5px;
}

.info-patient {
	display: flex;
	height: 109px;
}
.info-patient view {
	 font-size: 55px;
	font-weight: bold;
	color: #000;
	display: flex;
	align-items: center;
	justify-content: center;
}
.title{
	font-weight: bold;
    padding-top: 115px;
    font-size: 80px;
    text-align: center;
    height: 66px;
    line-height: 120px;
}
.tip{
	color: rgb(113,17,18);
	font-size: 50px;
	font-weight: bold;
	height: 112px;
	line-height: 112px;
	padding-left: 54px;
}
@media screen and (min-width: 900px) and (max-width: 1300px) {
	.content{
		.bg {
			height: 720px;
			width: 1280px;
		}
		.title{
			height: 66px;
			line-height: 66px;
			font-size: 54px;
			padding-top: 76.7px;
		}
		.tip{
			height: 74.6px;
			line-height: 74.6px;
			font-size: 34px;
			padding-left: 36px;
		}
		.info{
			height: 525.3px;
		}
		.uni-notice{
			padding-left: 13px;
			width: calc(100% - 246.8px);
		}
		.footer{
		    font-size: 34px;
		    height: 52px;
		    line-height: 52px;
		    padding: 0 10px;
		}
		.info-patient{
			height: 58.7px;
			view{
				font-size: 36.7px;
			}
			.room{
				width: 214px;
			}
			.number{
				width: 212.1px;
				font-size: 30px;
			}
		}
	}
}
</style>
