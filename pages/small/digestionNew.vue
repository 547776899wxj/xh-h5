/**
 * 消化内镜
 */
<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/digestion_small.png" ></image>
		<view class="title">
			<view class="title-room">{{this.iType}}</view>
		</view>
		<view class="doctor">
			<view class="doctor-img">
				<image class="doctor-image" :src="data.doctor.img" mode=""></image>
			</view>
			<view class="doctor-info">
				<view class="doctor-name">{{data.doctor.name}}</view>
				<view class="doctor-title">{{data.doctor.title}}</view>
			</view>
		</view>
		<view class="info">
			<view class="info-patient">
				<view class="data">
					<view v-if="data.seeingName">
						<text class="pr-15">{{data.seeingNumber}}号</text>
						<text class="pl-15">{{data.seeingName}}</text>
					</view>
				</view>
			</view>
			<view class="info-patient pt-15">
				<view class="room" >
					<view v-for="(item,index) in data.wating" :key="index">
						<view>
							<text class="pr-15"  v-if="item.number">{{item.number}}号</text>
							<text class="pl-15">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<uni-notice-bar scrollable="true" single="true" :text="tips" fontSize="30px" height="30px"></uni-notice-bar>
		</view>
		<popupSet ref="popupSet" @confirm="confirm" @close="close" :showwText="true" :dataInit="dataPopup" :showIType="true"></popupSet>
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
					room:'',
					number:'',
					department:'',
					seeingName:'',
					seeingNumber:'',
					wating:[
						
					],
					doctor:{
						img:'',
						name:'',
						title:'',
					},
				},
				calledNumbera:'',
				iType:'',
				popupShow:false,
				seqNumber:'',
				voiceData:[],
				testNubmer:1,
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
				dataPage:[],
				pageNewNumber:1,
				text:'',
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
			// 翻页
			page(){
				if(this.dataPage.length>this.pageNewNumber){
					setTimeout(() => {
						this.data = this.dataPage.slice(this.pageNewNumber,++this.pageNewNumber)[0];
						this.page();
					}, 5000);
				}
				else{
					setTimeout(() => {
						this.pageNewNumber = 1;
						this.init();
					}, 5000);
				}
			},
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
				// let datas = { "Doctor": {"doctorId": "","doctorName": "陈丰霖","doctorTitle": "主任医师","doctorPictureURL": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601028493073&di=2a989fb8f8da415157d9f21115711f39&imgtype=0&src=http%3A%2F%2Ft9.baidu.com%2Fit%2Fu%3D583874135%2C70653437%26fm%3D79%26app%3D86%26f%3DJPEG%3Fw%3D3607%26h%3D2408","doctorEquipmentId": ""},CompleteList:[{"queueNo": "CT1518843",},{"queueNo": "CT1518843",},{"queueNo": "CT1518843",}],scrolling:'友情提示：请在自助机刷卡取排队号，取号1后在大厅等候广播呼叫，过号请与窗口联系！',"queueDtoList":[
				// 	{
				// 	"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "CT843","name": "黎洋麟","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",
				// 	"waitList":[{"queueNo": "CT843","name": "黎洋等",}]
				// 	},
				// 	]}
				this.$request({
					url: 'Queue/GetSmallQueue',
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
									wating:wating.slice(0,3),
									doctor:{
										img:datas.Doctor.doctorPictureURL,
										title:datas.Doctor.doctorTitle,
										name:datas.Doctor.doctorName,
									},
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
			padding-top: 240px;
			height: 410px;
		}
		.title-room{
			font-size: 125px;
		}
		.doctor{
			height: 500px;
		}
		.doctor-img{
		    width: 219px;
		    height: 311px;
		    margin-left: 50px;
		}
		.doctor-image{
			width: 219px;
			height: 311px;
			background-size: 219px 311px;
		}
		.doctor-name{
		    font-size: 130px;
		}
		.doctor-title{
		    font-size: 90px;
		}
		.info-patient{
			height: 313px;
			padding-left: 315px;
			view{
				font-size: 80px;
			}
		}
		.footer{
			padding-top: 35px;
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
    padding-top: 168px;
    height: 290px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.title-dep{
	font-size: 105px;
	text-shadow: 5px 5px 1px #333;
}
.title-room{
	text-shadow: 5px 5px 1px #333;
	font-size: 100px;
}
.uni-form-item.uni-form-btn{
	padding: 0;
}
.doctor{
	display: flex;
	align-items: center;
	height: 356px;
	padding-left: 18px;
}
.doctor-img{
	width: 167px;
	height: 220px;
	margin-left: 25px;
	margin-right: 25px;
	background-color: #FFFFFF;
}
.doctor-name{
	font-size: 90px;
}
.doctor-title{
	font-size: 60px;
}
.doctor-info{
	width: 732px;
	text-align: center;
	color: #fff;
}
.doctor-image{
	width: 167px;
	height: 220px;
	background-image: url(../../static/user.png) ;
	background-size: 167px 220px;
}
.info{
	padding-left: 10px;
	padding-right: 10px;
}
.footer{
	color: #FFFFFF;
    font-size: 30px;
    padding-top: 17px;
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
	justify-content: center;
	align-items: center;
	height: 220px;
	text-align: center;
	padding-bottom: 20px;
	padding-left: 217px;
	padding-top: 0;
}
.info-patient:first-child{
	padding-top: 30px;
	padding-bottom: 0px;
}
.info-patient view {
	font-size: 61px;
	color: #fff;

	text-overflow: ellipsis;
}

</style>
