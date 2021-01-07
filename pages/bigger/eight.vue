<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/triage_eight.png" ></image>
		<view class="type">
			<view class="type-text">检查室</view>
			<view class="type-text">当前检查</view>
			<view class="type-text">候诊</view>
			<view class="type-text">过号</view>
		</view>
		<view class="info">
			<view class="info-patient" v-for="(item,index) in data" :key="index">
				<view class="room">
					<view>{{item.room}}</view>
				</view>
				<view class="number room">
					<view v-if="item.seeingNumber">
						<text class="pr-15">{{item.seeingNumber}}号</text>
						<text class="pl-15">{{item.seeingName}}</text>
					</view>
				</view>
				<view class="room">
					<view v-if="item.waitingNumber">
						<text class="pr-15">{{item.waitingNumber}}号</text>
						<text class="pl-15">{{item.waitingName}}</text>
					</view>
				</view>
				<view class="room">
					<view class="uni-notice">
						<uni-notice-bar scrollable="true" single="true" :text="item.pastName" color="#000"></uni-notice-bar>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<uni-notice-bar scrollable="true" single="true" :text="tips"></uni-notice-bar>
		</view>
		<popupSet ref="popupSet" @confirm="confirm" @close="close" backgroundColor="transparent" :showwText="true" :dataInit="dataPopup" color="#fff" :showPlaySound="true" :showIType="true" ></popupSet>
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
					// {
					// 	room:'检查室203',
					// 	number:'GX124',
					// 	department:'数字胃肠镜',
					// 	seeingName:'吴先杰',
					// 	seeingNumber:'3211',
					// 	waitingName:'吴先杰',
					// 	waitingNumber:'321',
					// 	pastName:'我先杰',
					// },
				
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
				text:'',
				voicePlayNumber:0,
				voicePlayTiems:0,
				tips:'',
			}
		},
		onLoad() {
			let dataInit = uni.getStorageSync('dataInit')||{};
			this.iType = dataInit.iType || '';
			this.playSound = dataInit.playSound || false;
			this.text = dataInit.text || '';
			if(this.iType){
				this.init();
				this.dataPopup.iType = this.iType;
				this.dataPopup.playSound = this.playSound;
				this.dataPopup.text = this.text;
			}
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
				if(this.iType){
					this.init();
				}
			},
			//确定设置
			confirm(res) {
				this.iType = res.iType;
				this.text = res.text;
				this.playSound = res.playSound;
				this.popupShow = false;
				this.init();
			},
			// 初始化数据
			init(){
				if(this.popupShow){
					return false;
				}
				// 测试使用
				// let datas = { CompleteList:[{"queueNo": "CT1518843",},{"queueNo": "CT1518843",},{"queueNo": "CT1518843",}],scrolling:'友情提示：请在自助机刷卡取排队号，取号1后在大厅等候广播呼叫，过号请与窗口联系！',"queueDtoList":[
				// 	{
				// 	"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT843","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",
				// 	"waitList":[{"queueNo": "CT843","name": "黎洋等",}],
				// 	"completeList":[{"queueNo": "CT1518843",},{"queueNo": "CT1518843",}]
				// 	},
				// 	{
				// 	"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT843","name": "黎洋2","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",
				// 	"waitList":[{"queueNo": "CT843","name": "黎洋等",}],
				// 	"completeList":[{"queueNo": "CT1518843",},{"queueNo": "CT1518843",}]
				// 	},
				// 	{
				// 	"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT843","name": "黎洋2","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",
				// 	"waitList":[{"queueNo": "CT843","name": "黎洋等",}],
				// 	"completeList":[{"queueNo": "CT1518843",},{"queueNo": "CT1518843",}]
				// 	},
				// 	]}
					
				
				this.$request({
					url: 'Queue/GetQueueAndCompleteList',
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
							if(datas.queueDtoList.length>5){
								datas.queueDtoList = datas.queueDtoList.slice(0,5);
							}
							this.tips = datas.scrolling;
							let dataMaps = [];
							let voiceDataInit = [];
							datas.queueDtoList.forEach((data,index) =>{
								let seeingName =data.name?this.$util.hideName(data.name):'';
								let waiting = [];
								let waitingName = '';
								if(data.waitList.length>0){
									waiting = data.waitList[0];
									waitingName =waiting.name?this.$util.hideName(waiting.name):'';
								}
								let calledNumbera = data.completeList.map(item => {
									return item.queueNo;
								})
								let dataMap = {
									room:data.queueName,
									seeingNumber:data.queueNo,
									seeingName:seeingName,
									department:data.examClass,
									pastName:calledNumbera.join(),
									waitingName:waitingName,
									waitingNumber:waiting.queueNo,
								}
								dataMaps = dataMaps.concat(dataMap);
								if(seeingName && this.playSound){
									let number = this.$util.chineseNumeral(dataMap.seeingNumber+'');
									let speakText = `请,${number}号,${data.name}到,${dataMap.room}就诊`;
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
									}, 6000);
								}
							}else{
								setTimeout(() => {
									this.init();
								}, 6000);
							}
						}catch(e){
							console.error(e);
							setTimeout(() => {
								this.init();
							}, 6000);
						}
					},
					fail: err => {
						setTimeout(() => {
							this.init();
						}, 6000);
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
				if(this.voiceData.length>1){
					this.onDone(this.voiceData[1]);
				}else{
					this.voiceData = [];
					setTimeout(() => {
						this.init()
					}, 5000);
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
					if(this.voicePlayNumber>=2){
						this.voiceData.shift();
						this.voicePlayNumber = 0;
					}
					if(this.voiceData.length>0){
						this.voiceQueue()
					}else{
						setTimeout(() => {
							this.init()
						}, 5000);
					}
				}, date);
				
			},
		}
	}
</script>

<style>
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
	padding-left: 10px;
	padding-right: 10px;
	height: 762px;
}
.footer{
	color: #FFFFFF;
    font-size: 44px;
    height: 78px;
    line-height: 78px;
    padding: 0 10px;
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
	width: 477px;
}
.number view{
	color: rgb(113,17,18) !important;
}
.content {
	position: relative;
	height: 100%;
	width: 1920px;
}
.type{
	font-size: 70px;
	display: flex;
	padding-top: 116px;
	font-weight: bold;
	height: 122px;
	line-height: 122px;
    padding-left: 10px;
	padding-right: 10px;
}
.type-text{
	width: 471px;
	text-align: center;
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
	justify-content: center;
	align-items: center;
	height: 95px;
	text-align: center;
}
.info-patient view {
	 font-size: 58px;
	font-weight: bold;
	color: #000;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

</style>
