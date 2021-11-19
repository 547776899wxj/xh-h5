/**
 * 消化内镜 e耳喉鼻
 */
<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/nosethroatOld.png" ></image>
		<view class="title">
			<view class="title-room">{{title}}</view>
		</view>
		<view class="info">
			<view class="info-patient wait">
				<view class="info-title wait-title">
					当前检查
				</view>
				<view class="room ">
					<view v-for="(item,index) in data.seeing" :key="index" class="room-list" style="color:rgb(113,17,18);">
						<view>
							<text class="pl-15">{{item.number}}</text>
							<text class="pl-15">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="info-patient pt-15 wait">
				<view class="wait-title">
					等待检查
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
				// let datas = {"scrolling": "欢迎光临","reload": "false","serverTime": "2021-05-25 02:53:47","Doctor": {"doctorId": "1","doctorName": "张三","doctorTitle": null,"doctorPictureURL": "asdsadsad","doctorEquipmentId": "29"},"queueDtoList": {"callingList": [{"examClass": "鼻咽喉镜","examSubClass": null,"examGroup": null,"queueName": "电子鼻咽喉镜","queueApm": null,"patLocalId": null,"queueNo": "1A01","patientSource": null,"reqDept": null,"performDept": null,"name": "蜘蛛侠","age": null,"sex": null,"deferFlag": null,"callCount": null,"callTime": null,"scheduleTime": "2021-05-25 09:54:48","waitStatus": "2"},{"examClass": "鼻咽喉镜","examSubClass": null,"examGroup": null,"queueName": "电子鼻咽喉镜","queueApm": null,"patLocalId": null,"queueNo": "1A02","patientSource": null,"reqDept": null,"performDept": null,"name": "赵四","age": null,"sex": null,"deferFlag": null,"callCount": null,"callTime": null,"scheduleTime": "2021-05-25 09:54:49","waitStatus": "2"},{"examClass": "鼻咽喉镜","examSubClass": null,"examGroup": null,"queueName": "电子鼻咽喉镜","queueApm": null,"patLocalId": null,"queueNo": "1A03","patientSource": null,"reqDept": null,"performDept": null,"name": "王富贵","age": null,"sex": null,"deferFlag": null,"callCount": null,"callTime": null,"scheduleTime": "2021-05-25 09:54:50","waitStatus": "2"},{"examClass": "鼻咽喉镜","examSubClass": null,"examGroup": null,"queueName": "电子鼻咽喉镜","queueApm": null,"patLocalId": null,"queueNo": "1A04","patientSource": null,"reqDept": null,"performDept": null,"name": "孙笑川","age": null,"sex": null,"deferFlag": null,"callCount": null,"callTime": null,"scheduleTime": "2021-05-25 09:54:51","waitStatus": "2"}],"waitingList": [{"examClass": "鼻咽喉镜","examSubClass": null,"examGroup": null,"queueName": "电子鼻咽喉镜","queueApm": null,"patLocalId": null,"queueNo": "1B01","patientSource": null,"reqDept": null,"performDept": null,"name": "赵5啊","age": null,"sex": null,"deferFlag": null,"callCount": null,"callTime": null,"scheduleTime": "2021-05-25 09:54:52","waitStatus": "0"},{"examClass": "鼻咽喉镜","examSubClass": null,"examGroup": null,"queueName": "电子鼻咽喉镜","queueApm": null,"patLocalId": null,"queueNo": "1B02","patientSource": null,"reqDept": null,"performDept": null,"name": "赵6请求","age": null,"sex": null,"deferFlag": null,"callCount": null,"callTime": null,"scheduleTime": "2021-05-25 09:54:53","waitStatus": "0"},{"examClass": "鼻咽喉镜","examSubClass": null,"examGroup": null,"queueName": "电子鼻咽喉镜","queueApm": null,"patLocalId": null,"queueNo": "1B03","patientSource": null,"reqDept": null,"performDept": null,"name": "赵7方法","age": null,"sex": null,"deferFlag": null,"callCount": null,"callTime": null,"scheduleTime": "2021-05-25 09:54:54","waitStatus": "0"},{"examClass": "鼻咽喉镜","examSubClass": null,"examGroup": null,"queueName": "电子鼻咽喉镜","queueApm": null,"patLocalId": null,"queueNo": "1B04","patientSource": null,"reqDept": null,"performDept": null,"name": "赵8搜索","age": null,"sex": null,"deferFlag": null,"callCount": null,"callTime": null,"scheduleTime": "2021-05-25 09:54:55","waitStatus": "0"},{"examClass": "鼻咽喉镜","examSubClass": null,"examGroup": null,"queueName": "电子鼻咽喉镜","queueApm": null,"patLocalId": null,"queueNo": "1B05","patientSource": null,"reqDept": null,"performDept": null,"name": "赵9回合","age": null,"sex": null,"deferFlag": null,"callCount": null,"callTime": null,"scheduleTime": "2021-05-25 09:54:56","waitStatus": "0"},{"examClass": "鼻咽喉镜","examSubClass": null,"examGroup": null,"queueName": "电子鼻咽喉镜","queueApm": null,"patLocalId": null,"queueNo": "1C01","patientSource": null,"reqDept": null,"performDept": null,"name": "赵10","age": null,"sex": null,"deferFlag": null,"callCount": null,"callTime": null,"scheduleTime": "2021-05-25 09:54:57","waitStatus": "0"}]}}
				
				this.$request({
					url: 'Queue/GetQueueForOralCavity',
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
				height: 550px;
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
			}
			.data{
				.room-list{
					width: 734px;
					font-size: 100px;
				}
			}
		}
		.footer{
			height: 304px;
			.footer-title{
				width: 55px;
				font-size: 57px;
				padding: 0 53px;
			}
			.footer-text{
				font-size: 51px;
				width: 846px;
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
	padding: 5px 19px;
	height: 211px;
}
.footer-title{
	 width: 50px;
	 font-size: 40px;
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
	width: 600px;
	line-height: 1.3;
	color: rgb(113,17,18);
	font-size: 35px;
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
	height: 386px;
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
