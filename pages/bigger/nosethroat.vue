/**
 * 消化内镜
 */
<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/nosethroat_bigger.png" ></image>
		<view class="info">
			<view class="info-left">
				<view class="info-title">当前检查</view>
				<view class="room current" >
					<view v-if="data.seeingNumber">
						<text class="pr-15">{{data.seeingNumber}}号</text>
						<text class="pl-15">{{data.seeingName}}</text>
					</view>
				</view>
			</view>
			<view class="info-right">
				<view class="info-title">等候检查</view>
				<view class="wait">
					<view v-for="(item,index) in data.wating" :key="index">
						<text v-if="item.number">{{item.number}}号</text>
						<text>{{item.name}}</text>
						<text v-if="(index+1)%3!=0">，</text>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="tips">
			<view class="tips-title">
				温馨提示
			</view>
			<view class="tips-content">
				<text>
					1、检查前请至诊室4喷麻药
					2、检查后1小时内禁食禁饮
					3、20分钟后至候诊厅自助打印报告
				</text>
			</view>
		</view> -->
		<view class="footer">
			<uni-notice-bar scrollable="true" single="true" :text="tips" fontSize="47px"></uni-notice-bar>
		</view>
		<popupSet ref="popupSet" @confirm="confirm" @close="close"  :dataInit="dataPopup" :showwText="true" :showIType="true" ></popupSet>
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
				data:{
					wating:[
					],
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
				this.init();
				this.dataPopup.iType = this.iType;
				this.dataPopup.title = this.title;
				this.dataPopup.playSound = this.playSound;
				this.dataPopup.text = this.text||'';
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
					
				this.$request({
					url: 'Queue/GetQueue',
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
								let seeingName =data.name?this.$util.hideName(data.name):'';
								let wating = data.waitList.map(item => {
									return {
										name: item.name?this.$util.hideName(item.name):'',
										number:item.queueNo || '',
									}
								})
								let dataMap = {
									room:data.queueName,
									seeingNumber:data.queueNo,
									seeingName:seeingName,
									department:data.examClass,
									wating:wating.slice(0,12)
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
							this.data = dataMaps[0];
							console.log(this.data);
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
.content {
	position: relative;
	height: 100%;
	width: 1920px;
	.info{
		display: flex;
		font-size: 80px;
		padding-top: 115px;
		.info-title{
			line-height: 120px;
		}
		.info-left{
			width: 642px;
			text-align: center;
		}
		.info-right{
			width: 1278px;
			text-align: center;
		}
		.room{
			height: 762px;
			&.current{
				display: flex;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;
				color: rgb(113,17,18);
				font-size: 83px;
			}
		}
		.wait{
			font-size: 55px;
			padding: 40px;
			display: flex;
			flex-wrap: wrap;
			view{
				height: 100px;
			}
		}
	}
	.tips{
		display: flex;
		height: 250px;
		.tips-title{
			color: rgb(113,17,18);
			font-size: 51px;
			font-weight: bold;
			width: 100px;
			padding-left: 10px;
			line-height: 55px;
			text-align: center;
			display: flex;
			align-items: center;
		}
		.tips-content{
			font-size: 47px;
		    padding: 40px;
		}
	}
	.footer{
		padding-top: 3px;
	}
}
.bg {
	position: absolute;
	height: 1080px;
	width: 1920px;
	z-index: -1;
}
</style>
