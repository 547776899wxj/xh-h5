<!-- 超声科一行 -->
<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/ultrasonic_one.png" ></image>
		<view class="title">{{queueTitle}}</view>
		<view class="data">
			<view class="left">
				<view class="data-title seeing-title">
					正在呼叫
				</view>
				<view class="data-title">
					等待叫号
				</view>
				<view class="data-title">
					已过号码
				</view>
			</view>
			<view class="right">
				<view class="data-title seeing-title">
					<text>请</text>
					<text class="highlight">
						<text>{{data.seeing.number}}</text>
						<text class="pl-15">{{data.seeing.name}}</text> 
					</text>
					<text>到</text>
					<text class="highlight">{{data.seeing.queueName}}</text>
					<text>检查</text>
				</view>
				<view class="data-title" style="font-size: 40px;">
					<text>{{data.watingOne}}</text>
				</view>
				<view class="data-title" style="display: flex; align-items: center;height: 133px;">
					<uni-notice-bar scrollable="true" single="true" :text="passText " color='#000' fontSize="40px" :speed="25"></uni-notice-bar>
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
				data:{
					seeing:{}
				},
				calledNumbera:'',
				iType:'',
				queueTitle: '',
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
				noticeFontSize:'30px',
				passText:'',
				roomName:'',
				broadcast:[],
			}
		},
		onLoad() {
			this.interval = this.$util.getRequestInterval();
			let dataInit = uni.getStorageSync('dataInit')||{};
			this.iType = dataInit.iType || '';
			this.playSound = dataInit.playSound || false;
			this.text = dataInit.text || '';
			this.title = dataInit.title || '';
			if(this.iType){
				this.dataPopup.iType = this.iType;
				this.dataPopup.playSound = this.playSound ;
				this.dataPopup.text = this.text;
				this.dataPopup.title = this.title;
				this.init();
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
				// let datas = {
				// 	scrolling:`1：请在自助机刷卡取号`,
				// 	"data":{
				// 		"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT843","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",
				// 		"waitingListOne":[{"queueNo": 'C001',"name": "黎洋等",},{"queueNo": "","name": "黎洋等",},{"queueNo": 'C001',"name": "黎洋等",},{"queueNo": "","name": "黎洋等",},{"queueNo": "","name": "黎洋等",},{"queueNo": "","name": "黎洋等",},{"queueNo": "","name": "黎洋等",} ],
				// 		"callingList":[{"queueNo": 'C0011',"name": "黎洋1","queueName":'诊室1'}],
				// 		"passList":[{"queueNo": 'C0011',"name": "黎洋1",}],
				// 	},
				// 	broadcast:[{"queueNo": 'C0011',"name": "黎洋1","queueName":'诊室1','rePlay':true}]
				// 	}
				
				this.$request({
					url: 'Queue/GetQueueForUS',
					method: 'POST',
					success: datas => {
						try{
							if (datas.reload == 'true' || datas.reload == true) {
								this.$tui.webView.postMessage({
									data: {
										reload: datas.reload
									}
								});
								return;
							}
							this.tips = datas.scrolling;
							this.queueTitle = datas.queueTitle;
							let dataMaps = [];
							this.roomName = datas.roomName;
							let data = datas.data.callingList;
							let seeingName = data.name ? this.$util.hideName(data.name) : '';
							let watingOne = datas.data.waitingListOne.map(item => {
								return item.queueNo + (item.name ? this.$util.hideName(item.name) : '');
							}).join('，');
							let seeing = datas.data.callingList.map(item => {
								return {
									name: item.name ? this.$util.hideName(item.name) : '',
									number: item.queueNo || '',
									nameNoHide: item.name,
									queueName: item.queueName
								};
							});
							let dataMap = {
								watingOne: watingOne,
								seeing: seeing.length > 0 ? seeing[0] : {}
							};
							this.broadcast = datas.broadcast.map(item => {
								return {
									name: item.name ? this.$util.hideName(item.name) : '',
									number: item.queueNo || '',
									nameNoHide: item.name,
									queueName: item.queueName,
									rePlay: item.rePlay
								};
							});
							dataMaps = dataMaps.concat(dataMap);
							this.data = dataMaps[0];
							let passText = datas.data.passList.map(item => {
								return item.queueNo + (item.name ? this.$util.hideName(item.name) : '');
							});
							this.passText = passText.join('，');
							if (this.playSound) {
								let voiceDataInit = [];
								this.broadcast.forEach(item => {
									if (item.name) {
										let number = this.$util.chineseNumeral(item.number + '');
										number = number ? number + '号' : '';
										let speakText = `请,${number}${item.nameNoHide}到,${item.queueName}就诊`;
										if (this.data.length == 0) {
											this.voiceData.push(speakText);
											this.voiceDataInit.push(speakText);
											return
										} else {
											voiceDataInit = voiceDataInit.concat(speakText);
										}
										//重呼
										if(item.rePlay){
											this.voiceData.push(speakText);
										}
									}
								});
								if (voiceDataInit.length > 0) {
									let voiceData = this.$util.findDifferentElements(voiceDataInit, this.voiceDataInit);
									let rePlayData = [];
									if(this.voiceData.length>0){
										rePlayData = this.$util.findDifferentElements(this.voiceData,voiceData);
									}
									this.voiceData = rePlayData.concat(voiceData);
									this.voiceDataInit = voiceDataInit;
								}
								if (this.voiceData.length > 0) {
									this.voiceQueue();
								} else {
									setTimeout(() => {
										this.init();
									}, this.interval);
								}
							} else {
								setTimeout(() => {
									this.init();
								}, this.interval);
							}
						}
						catch(err){
							console.log(err);
							setTimeout(() => {
								this.init();
							}, this.interval);
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
				console.log(text);
				this.$tui.webView.postMessage({
					data: {
						text:text
					}
				})
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
.data{
	padding: 0 10px;
	font-size: 46px;
	display: flex;
	.data-title{
		line-height: 133px;
		height: 133px;
		overflow: hidden;
		&.seeing-title{
			height: 244px;
			line-height: 244px;
		}
	}
	.left{
		width: 253px;
		text-align: center;
	}
	.right{
		box-sizing: border-box;
		padding: 0 53px;
		width: 1000px;
		overflow: hidden;
		.highlight{
			padding: 0 53px;
			color: #711112;
			box-sizing: border-box;
			width: 320px;
		}
	}
}
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

.footer{
	color: #FFFFFF;
    font-size: 29px;
    height: 52px;
    line-height: 52px;
    padding: 5px 10px;
	overflow: hidden;
}

.header{
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 78px;
}
.room{
	width: 214px;
}

.content {
	position: relative;
	height: 100%;
}

.bg {
	position: absolute;
	height: 720px;
	width: 1280px;
	z-index: -1;
}


.title{
	font-weight: bold;
    padding-top: 76px;
    font-size: 53px;
    text-align: center;
    height: 80px;
    line-height: 80px;
}
.tip{
	color: rgb(113,17,18);
	font-size: 33px;
	font-weight: bold;
	height: 74px;
	line-height: 74px;
	padding-left: 36px;
}

</style>
