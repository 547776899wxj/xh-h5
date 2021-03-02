/**
 * 消化内镜
 */
<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/noseThroat_small_one.png" ></image>
		<view class="title">
			<view class="title-room">{{title}}</view>
		</view>
		<view class="info">
			<view class="info-patient">
				<view class="info-title">
					当前检查
				</view>
				<view class="room data">
					<view v-if="data.seeingNumber">
						<text class="pr-15">{{data.seeingNumber}}号</text>
						<text class="pl-15">{{data.seeingName}}</text>
					</view>
				</view>
			</view>
			<view class="info-patient pt-15 wait">
				<view class="wait-title">
					等候检查
				</view>
				<view class="room" >
					<view v-for="(item,index) in data.wating" :key="index" class="room-list" :class="index%2==0?'room-list-left':'room-list-right'">
						<view >
							<text class="" v-if="item.number">{{item.number}}号</text>
							<text class="pl-15">{{item.name}}</text>
							<text>，</text>
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
				<text>
					{{tips}}
				</text>
			</view>
		</view>
		<popupSet ref="popupSet" @confirm="confirm" @close="close" :showTitle="true" :dataInit="dataPopup" :showwText="true" :showIType="true" ></popupSet>
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
				// let datas = { CompleteList:[{"queueNo": "CT1518843",},{"queueNo": "CT1518843",},{"queueNo": "CT1518843",}],scrolling:'友情提示：请在自助机刷卡取排队号，取号1后在大厅等候广播呼叫，过号请与窗口联系！',"queueDtoList":[
				// 	{
				// 	"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT843","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",
				// 	"waitList":[{"queueNo": null,"name": "黎洋等",},{"queueNo": "","name": "黎洋等",},]
				// 	},
				// 	]}
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
							setTimeout(() => {
								this.init();
							}, this.interval);
							let dataMaps = [];
							let voiceDataInit = [];
							datas.queueDtoList.forEach((data,index) =>{
								let seeingName = data.name?this.$util.hideName(data.name):'';
								let wating = data.waitList.map(item => {
									return {
										name: item.name?this.$util.hideName(item.name):'',
										number:item.queueNo
									}
								})
								let dataMap = {
									room:data.queueName,
									seeingNumber:data.queueNo,
									seeingName:seeingName,
									wating:wating.slice(0,10),
								}
								dataMaps = dataMaps.concat(dataMap);
							})
							this.dataPage =  dataMaps;
							this.data = dataMaps[0];
						}
						catch(err){
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
@media screen and (min-width: 900px) and (max-width: 1100px) {
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
			height: 325px;
			.info-title{
				font-size: 106px;
				width: 310px;
			}
			.room.data{
				font-size: 90px;
			}
			&.wait{
				height: 780px;
				.room{
					font-size: 59px;
					padding: 64px 0;
				}
			}
			.wait-title{
				font-size: 106px;
			}
		}
		.footer{
			height: 295px;
			.footer-title{
				width: 55px;
				font-size: 55px;
				padding: 0 53px;
			}
			.footer-text{
				font-size: 53px;
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
	padding: 5px 20px;
	height: 208px;
}
.footer-title{
	 width: 44px;
	 font-size: 41px;
	 padding: 0 32px;
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
	font-size: 33px;
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
	height: 227px;
	text-align: center;
	padding-bottom: 20px;
	padding-top: 0;
}
.info-patient .info-title{
	color: rgb(113,17,18);
	font-size: 73px;
	width: 298px;
}
.info-patient:first-child{
	padding-top: 10px;
	padding-bottom: 0px;
}
.info-patient .room {
	font-size: 80px;
	color: #000;
	width: 861px;
	text-overflow: ellipsis;
	padding-right: 13px;
}
.info-patient.wait .room{
	font-size: 39px;
	font-weight: bold;
	display: flex;
	padding: 25px 0;
	flex-wrap: wrap;
}
.info-patient.wait .room .room-list{
	padding: 26px 0px;
	width: 33.33%;
	text-align: left;
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
	font-size: 60px;
	width: 736px;
}
.info-patient.wait{
	height: 550px;
	align-items: flex-start;
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
