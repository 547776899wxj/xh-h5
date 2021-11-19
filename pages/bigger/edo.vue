<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/edo.png" ></image>
		<view class="type">
			<view class="title">{{title}}</view>
		</view>
		<view class="info">
			<view class="info-patient" >
				<view class="type-text">检查室</view>
				<view class="type-text">当前检查</view>
				<view style="flex: 1;text-align: center;">等待检查</view>
			</view>
			<view class="info-patient" v-for="(item,index) in data" :key="index">
				<view class="room">
					<view>{{item.room}}</view>
				</view>
				<view class="number room">
					<view>
						<text class="pr-15"  v-if="item.seeingNumber">{{item.seeingNumber}}号</text>
						<text class="pl-15">{{item.seeingName}}</text>
					</view>
				</view>
				<view class="room" v-for="(item,index) in item.waitingList" :key="index">
					<view >
						<text class="pr-15" v-if="item.queueNo">{{item.queueNo}}号</text>
						<text class="pl-15">{{item.hideName}}</text>
					</view>
				</view>
				<!-- <view class="room">
					<view >
						<text class="pr-15" v-if="item.waitingNumber">{{item.waitingNumber}}号</text>
						<text class="pl-15">{{item.waitingName}}</text>
					</view>
				</view> -->
			</view>
		</view>
		<view class="footer">
			<uni-notice-bar scrollable="true" single="true" :text="tips" :fontSize="noticeFontSize" :height="noticeFontSize"></uni-notice-bar>
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
				title:'',
				data:[
					// {
					// 	room:'检查室203',
					// 	number:'GX124',
					// 	department:'数字胃肠镜',
					// 	seeingName:'吴先1杰吴',
					// 	seeingNumber:'3211',
					// 	waitingName:'吴先杰',
					// 	waitingNumber:'321',
					// 	pastName:'我先杰',
					// },
					// {
					// 	room:'摄片室—205',
					// 	number:'GX124',
					// 	department:'反射科',
					// 	seeingName:'吴先杰',
					// 	seeingNumber:'321',
					// 	waitingName:'吴先杰',
					// 	waitingNumber:'321',
					// 	pastName:'我先杰',
					// },{
					// 	room:'摄片室—205',
					// 	number:'GX124',
					// 	department:'反射科',
					// 	seeingName:'吴先杰',
					// 	seeingNumber:'321',
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
				voicePlayTiems:3,
				tips:'',
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
			this.init();
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
				let datas = {"scrolling": "欢迎光临","reload": "false","data": [{"queueName": "内镜检查室1","examNo": "1","queueNo": "E001","patientName": "张三1","rePlay": false,"waitingList": [{"queueName": "内镜检查室1","examNo": "1","queueNo": "E002","patientName": "张三2","rePlay": false},{"queueName": "内镜检查室1","examNo": "1","queueNo": "E003","patientName": "张三3","rePlay": false}]},{"queueName": "内镜检查室2","examNo": null,"queueNo": null,"patientName": null,"rePlay": null,"waitingList": [{"queueName": "内镜检查室2","examNo": "1","queueNo": "E004","patientName": "张三4","rePlay": false},{"queueName": "内镜检查室2","examNo": "1","queueNo": "E005","patientName": "张三5","rePlay": false}]},{"queueName": "内镜检查室3","examNo": null,"queueNo": null,"patientName": null,"rePlay": null,"waitingList": [{"queueName": "内镜检查室3","examNo": "1","queueNo": "E007","patientName": "张三7","rePlay": false}]},{"queueName": "内镜检查室4","examNo": null,"queueNo": null,"patientName": null,"rePlay": null,"waitingList": [{"queueName": "内镜检查室4","examNo": "1","queueNo": "E008","patientName": "张三8","rePlay": false},{"queueName": "内镜检查室4","examNo": "1","queueNo": "E009","patientName": "张三9","rePlay": false}]},{"queueName": "内镜检查室5","examNo": null,"queueNo": null,"patientName": null,"rePlay": null,"waitingList": [{"queueName": "内镜检查室5","examNo": "1","queueNo": "E010","patientName": "张三10","rePlay": false}]}],"serverTime": "2021-09-13 02:24:45","queueTitle": "服务器1111"}
				
				this.$request({
					url: 'Queue/getQueueForBiggerEdo',
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
							if(datas.data.length>7){
								datas.data = datas.data.slice(0,7);
							}
							this.title =  datas.queueTitle;
							this.tips = datas.scrolling;
							let dataMaps = [];
							let voiceDataInit = [];
							datas.data.forEach((data,index) =>{
								let seeingName =data.patientName?this.$util.hideName(data.patientName):'';
								// let waiting = [];
								// let waitingName = '';
								// if(data.waitingList.length>0){
								// 	waiting = data.waitingList[0];
								// 	waitingName =waiting.patientName?this.$util.hideName(waiting.patientName):'';
								// }
								data.waitingList.forEach(item =>{
									item.hideName = item.patientName?this.$util.hideName(item.patientName):'';
								})
								let dataMap = {
									room:data.queueName,
									seeingNumber:data.queueNo,
									seeingName:seeingName,
									department:data.examClass,
									// waitingName:waitingName,
									// waitingNumber:waiting.queueNo,
									waitingList: data.waitingList
								}
								dataMaps = dataMaps.concat(dataMap);
								if(seeingName && this.playSound){
									let number = this.$util.chineseNumeral(dataMap.seeingNumber+'');
									number = number?number+'号':'';
									let speakText = `请,${number},${data.patientName}到,${dataMap.room}就诊`;
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
						}catch(e){
							console.error(e);
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
@import './index.scss';
@media screen and (min-width: 900px) and (max-width: 1300px) {
	.content{
		.info-patient {
			height: 85px;
			
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
	margin-top: 5px;
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
	padding-top: 116px;
	font-weight: bold;
	height: 122px;
	line-height: 122px;
    padding-left: 10px;
	padding-right: 10px;
	.title{
		text-align: center;
	}
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
	align-items: center;
	height: 129px;
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
