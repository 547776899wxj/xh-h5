/**
 * 消化内镜 e耳喉鼻
 */
<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/noseThroat_small.png" ></image>
		<view class="title">
			<view class="title-room">{{title}}</view>
		</view>
		<view class="info">
			<view class="info-patient ">
				<view class="info-title">
					当前检查
				</view>
				<view class="room data">
					<view v-for="(item,index) in data.seeing" :key="index" class="room-list" >
						<view>
							<text class="pl-15">{{item.number}}</text>
							<text class="pl-15">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="info-patient pt-15 wait">
				<view class="wait-title">
					已叫号码
				</view>
				<view class="room" >
					<view v-for="(item,index) in data.wating" :key="index" class="room-list" >
						<view>
							<text class="pl-15">{{item.number}}</text>
							<text class="pl-15">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-title">
				温馨提示
			</view>
			<view class="footer-text">
				<!-- <text>
					{{tips}}
				</text> -->
				<rich-text :nodes="tips"></rich-text>
				<!-- <uni-notice-bar scrollable="true" single="true" :text="tips" fontSize="70px" scrollableHeight="75px" height="75px" color="#711112"></uni-notice-bar> -->
			</view>
		</view>
		<popupSet ref="popupSet" @confirm="confirm" @close="close" :showTitle="true" :dataInit="dataPopup" :showwText="true" :showIType="true" :showPlaySound="true"></popupSet>
	</view>
</template>

<script>
	import popupSet from '../../components/popup-set/popup-set.vue';
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	export default {
		components: { popupSet ,uniNoticeBar},
		data() {
			return {
				title:'电子鼻咽喉镜室',
				// data:{
				// 	room:'检查室203',
				// 	number:'GX124',
				// 	department:'数字胃肠镜',
				// 	seeingName:'吴先杰',
				// 	seeingNumber:'3211',
				// 	wating:[
				// 		{name:'陈琳',number:'3412'},
				// 		{name:'陈琳',number:'3412'},{name:'陈琳',number:'3412'},
				// 		{name:'陈琳',number:'3412'},{name:'陈琳',number:'3412'},
				// 		{name:'陈琳',number:'3412'},{name:'陈琳',number:'3412'},
				// 		{name:'陈琳',number:'3412'},{name:'陈琳',number:'3412'},
				// 		{name:'陈琳',number:'3412'},
				// 	],
				// 	pastName:'我先杰',
				// },
				data:{
					wating:[],
				},
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
				voicePlayTiems:3,
				tips:'',
				reload:false,
				interval:10000,

			}
		},
		onLoad() {
			this.interval = this.$util.getRequestInterval();
			let dataInit = uni.getStorageSync('dataInit')||{};
			this.iType = dataInit.iType||'';
			this.title = dataInit.title||'';
			this.text = dataInit.text||'';
			this.playSound = dataInit.playSound || false;
			if(this.iType){
				this.dataPopup.iType = this.iType;
				this.dataPopup.title = this.title;
				this.dataPopup.playSound = this.playSound;
				this.dataPopup.text = this.text||'';
			}
			this.init();
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
				this.title = res.title;
				this.playSound = res.playSound;
				this.text = res.text;
				this.popupShow = false;
				this.init();
			},
			// 初始化数据
			init(){
				if(this.popupShow){
					return false;
				}
				// let datas = { CompleteList:[{"queueNo": "CT1518843",},{"queueNo": "CT1518843",},{"queueNo": "CT1518843",}],
				// 	scrolling:`1：请在自助机刷卡取号
				// 	2:取号1后在大厅等候广播呼叫
				// 	3:过号请与窗口联系！`,
				// 	"queueDtoList":{
				// 		"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT843","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",
				// 		"waitingList":[{"queueNo": 'C001',"name": "黎洋等",},{"queueNo": "","name": "黎洋等",},{"queueNo": 'C001',"name": "黎洋等",},{"queueNo": "","name": "黎洋等",},{"queueNo": "","name": "黎洋等",},{"queueNo": "","name": "黎洋等",},{"queueNo": "","name": "黎洋等",} ],
				// 		"callingList":[{"queueNo": 'C0011',"name": "黎洋1",}],
				// 	},}
				
				this.$request({
					url: 'Queue/GetQueueForENT',
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
							
							let data = datas.queueDtoList;
							let seeingName = data.name?this.$util.hideName(data.name):'';
							let wating = data.waitingList.map(item => {
								return {
									name: item.name?this.$util.hideName(item.name):'',
									number:item.queueNo || '',
									
								}
							})		
							let seeing = data.callingList.map(item => {
								return {
									name: item.name?this.$util.hideName(item.name):'',
									number:item.queueNo || '',
									nameNoHide:item.name,
								}
							})	
							let dataMap = {
								room:data.queueName,
								seeingNumber:data.queueNo,
								seeingName:seeingName,
								wating:wating,
								seeing:seeing,
							}
							dataMaps = dataMaps.concat(dataMap);
							this.data = dataMaps[0];
							if(this.playSound){
								let voiceDataInit = [];
								seeing.forEach((item) => {
									if(item.name){
										let number = this.$util.chineseNumeral(item.number+'');
										number = number?number+'号':'';
										let speakText = `请,${number}${item.nameNoHide}到,${this.title}就诊`;
										if(this.data.length==0){
											this.voiceData.push(speakText);
											this.voiceDataInit.push(speakText);
										}else{
											voiceDataInit = voiceDataInit.concat(speakText);
										}
									}
								})
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
@media screen and (min-width: 900px) and (max-width: 1200px) {
	.content{
		width: 1080px !important;
		.bg{
			height: 1920px;
			width: 1080px;
		}
		.title{
			padding-top: 164px;
			height: 258px;
		}
		.title-room{
			font-size: 104px;
		}
		.info-patient{
			height: 327px;
			&.wait{
				height: 610px;
				.room{
					font-size: 66px;
					// padding: 50px 0 50px 20px;
					.room-list{
						padding: 50px 0px;
					}
				}
			}
			.wait-title{
				font-size: 106px;
			}
			.info-title{
				font-size: 106px;
				width: 329px;
			}
			.data{
				.room-list{
					width: 734px;
					font-size: 100px;
				}
			}
		}
		.footer{
			height: 458px;
			.footer-title{
				width: 55px;
				font-size: 70px;
				padding: 0 53px;
			}
			.footer-text{
				font-size: 76px;
				
			}
		}
	}
	
}
.pr-15{
	padding-right: 15px;
}
.pl-15{
	padding-left: 15px;
}
.pt-15{
	padding-top: 15px;
}
page {
	height: 100%;
}
.title{
	color: #fff;
    padding-top: 120px;
    height: 180px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.title-room{
	font-size: 74px;
	color: #000000;
}
.uni-form-item.uni-form-btn{
	padding: 0;
}

.doctor-name{
	font-size: 130px;
}
.doctor-title{
	font-size: 90px;
}
.doctor-info{
	width: 732px;
	text-align: center;
	color: #fff;
}
.doctor-image{
	width: 240px;
	height: 313px;
	background-image: url(../../static/user.png) ;
	background-size: 240px 313px;
}
.info{
	padding-left: 10px;
	padding-right: 10px;
}
.footer{
	color: #000;
    font-size: 41px;
	display: flex;
	padding: 5px 15px;
	height: 322px;
}
.footer-title{
	 width: 44px;
	 font-size: 53px;
	 padding: 0 29px;
	line-height: 1.1;
	height: 100%;
	display: flex;
	color: rgb(113,17,18);
	align-items: center;
}
.footer-text{
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 30px;
	overflow: hidden;
	width: 840px;
	line-height: 1.3;
	color: rgb(113,17,18);
	font-size: 57px;
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

.number view{
	color: rgb(113,17,18) !important;
}
.content {
	position: relative;
	height: 100%;
	width: 768px;
}


.bg {
	position: absolute;
	height: 1366px;
	width: 768px;
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
	align-items: center;
	height: 230px;
	text-align: center;
	padding-bottom: 20px;
	padding-top: 0;
}
.info-patient .info-title{
	color: rgb(113,17,18);
	font-size: 80px;
	padding: 0 12px 10px 12px;
	width: 320px;
}
.info-patient:first-child{
	padding-top: 10px;
	padding-bottom: 0px;
}
.info-patient .room {
	font-size: 46px;
	font-weight: bold;
	color: #000;
	width: 861px;
	text-overflow: ellipsis;
	display: flex;
	flex-wrap: wrap;
	padding-right: 13px;
	padding-top: 15px;
}

.wait .room .room-list{
	padding: 35px 0px;
	width: 50%;
	overflow: hidden;
}
// .room-list-left{
// 	width: 31%;
// 	text-align: end;
// }
// .room-list-right{
// 	width: 30%;
// 	text-align: start;
// }
.info-patient .room.data{
	color: rgb(113,17,18);
	font-size: 73px;
	
}
.data .room-list{
	width: 520px;
}
.info-patient.wait{
	align-items: flex-start;
	height: 435px;
}
.wait-title{
	height: 100%;
	width: 167px;
	font-size: 80px;
	line-height: 1.1;
	display: flex;
    align-items: center;
}
</style>
