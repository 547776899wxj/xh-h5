/**
 * 超声科 口腔 放射科  CT  MR检查室二级分诊
 */
<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/triage_small_second.png" ></image>
		<view class="title">
			<view class="title-dep">{{title}}</view>
			<view class="title-room">{{text}}</view>
		</view>
		<view class="info">
			<view class="info-patient">
				<view class="data" v-if="data.seeingNumber">
					<view >
						<text class="pr-15">{{data.seeingNumber?data.seeingNumber+'号':''}}</text>
						<text class="pl-15">{{data.seeingName}}</text>
					</view>
				</view>
			</view>
			<view class="info-patient pt-15">
				<view class="room" >
					<view v-for="(item,index) in data.wating" :key="index">
						<view>
							<text class="pr-15">{{item.number?item.number+'号':''}}</text>
							<text class="pl-15">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<uni-notice-bar scrollable="true" single="true" :text="tips" fontSize="30px" height="30px"></uni-notice-bar>
		</view>
		<popupSet ref="popupSet" @confirm="confirm" @close="close" :dataInit="dataPopup" :showTitle="true" :showwText="true" :showIType="true" ></popupSet>
	</view>
</template>

<script>
	import popupSet from '../../components/popup-set/popup-set.vue';
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	export default {
		components: { popupSet ,uniNoticeBar},
		data() {
			return {
				title:'超声科检查室',
				data:{
					// room:'检查室203',
					// number:'GX124',
					// department:'数字胃肠镜',
					// seeingName:'吴先姐',
					// seeingNumber:'3211',
					// wating:[
					// 	{name:'陈琳',number:'3412'},
					// 	{name:'陈琳',number:'3412'},
					// ],
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
				voicePlayNumber:0,
				voicePlayTiems:3,
				text:'',
				dataPage:[],
				pageNewNumber:1,
				reload:false,
				tips:'',
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
				// 测试使用
				// let datas = { CompleteList:[{"queueNo": null,},{"queueNo": "CT1518843",},{"queueNo": "CT1518843",}],scrolling:'友情提示：请在自助机刷卡取排队号，取号1后在大厅等候广播呼叫，过号请与窗口联系！',"queueDtoList":[
				// 	{
				// 	"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": 123,"name": "黎洋等","reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",
				// 	"waitList":[{"queueNo": "","name": "黎洋等",},{"queueNo": "123","name": "2",},{"queueNo": "123","name": "3",}]
				// 	},
				// 	{
				// 	"waitStatus": "4","examClass": "CT","sex": "男","patientSource": "住院","queueNo": "12","name": 4123,"reqDept": "1243","scheduleTime": "2020-12-11 10:49:00","examGroup": "CT40","performDept": "1307","callCount": "1","callTime": "2020-12-11 10:33:21","queueApm": "全天","queueName": "CT2","age": "19岁","deferFlag": "0",
				// 	"waitList":[]
				// 	},
					
				// 	],reload:"false"}
					
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
								if(!data.queueNo && this.dataPage[index]){
									data.queueNo = this.dataPage[index].seeingNumber;
									data.name = this.dataPage[index].seeingName;
								}
								let seeingName =data.name?this.$util.hideName(data.name):'';
								let wating = [];
								data.waitList.forEach(item => {
									wating.push({
										name: item.name?this.$util.hideName(item.name):'',
										number:item.queueNo || ''
									})
								})
								let dataMap = {
									room:data.queueName,
									seeingNumber: data.queueNo || '',
									seeingName:seeingName,
									wating:wating.slice(0,2),
								}
								if(wating.length>0 || dataMap.seeingNumber){
									dataMaps = dataMaps.concat(dataMap);
								}
							})
							this.dataPage =  dataMaps;
							this.data = dataMaps[0];
							this.page();
						}
						catch(err){
							console.error(err)
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

<style>
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
    padding-top: 162px;
	height: 424px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.title-dep{
	font-size: 80px;
	text-shadow: 5px 5px 1px #333;
}
.title-room{
	text-shadow: 5px 5px 1px #333;
	font-size: 100px;
}
.uni-form-item.uni-form-btn{
	padding: 0;
}
.info{
	padding-left: 10px;
	padding-right: 10px;
}
.footer{
	color: #FFFFFF;
    font-size: 30px;
    padding-top: 7px;
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
	height: 357px;
	text-align: center;
	padding-left: 219px;
}
.info-patient view {
	font-size: 60px;
	color: #fff;

	text-overflow: ellipsis;
}

</style>
