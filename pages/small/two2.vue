/**
 * 超声科 口腔 放射科  CT  MR检查室二级分诊
 */
<template>
	<view class="content"  @longpress="open" @click="open">
		<image class="bg" src="../../static/triage_small_second.png" ></image>
		<view class="title">
			<view class="title-dep">{{title}}</view>
			<view class="title-room">{{iType}}</view>
		</view>
		<view class="info">
			<view class="info-patient">
				<view class="data">
					<view v-if="data.seeingNumber">
						<text class="pr-15">{{data.seeingNumber}}号</text>
						<text class="pl-15">{{data.seeingName}}</text>
					</view>
				</view>
			</view>
			<view class="info-patient pt-15">
				<view class="room" >
					<view v-for="(item,index) in data.wating" :key="index">
						<view v-if="item.number">
							<text class="pr-15">{{item.number}}号</text>
							<text class="pl-15">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<uni-notice-bar scrollable="true" single="true" text="温馨提示：请保持安静，有序就诊！" fontSize="30px" height="30px"></uni-notice-bar>
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
				text:'',
				dataPage:[],
				pageNewNumber:1,
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
				let datas = [{
					room:'检查室203',
					number:'GX124',
					department:'数字胃肠镜',
					seeingName:'吴先姐',
					seeingNumber:'3211',
					wating:[
						{name:'陈琳',number:'3412'},
						{name:'陈琳',number:'3412'},
					],
				},{
					room:'检查室203',
					number:'G1224',
					department:'数字胃肠镜',
					seeingName:'吴先接',
					seeingNumber:'3211',
					wating:[
						{name:'陈琳',number:'3412'},
						{name:'陈琳',number:'3412'},
					],
				},
				{
					room:'检查室203',
					number:'G1224',
					department:'数字胃肠镜',
					seeingName:'吴先3',
					seeingNumber:'3211',
					wating:[
						{name:'陈琳',number:'3412'},
						{name:'陈琳',number:'3412'},
					],
				}]
				datas[0].seeingNumber = this.testNubmer++;
				let dataMaps = [];
				let voiceDataInit = [];
				datas.forEach((data,index) =>{
					let waitingName =data.waitingName?this.$util.hideName(data.waitingName):'';
					let seeingName =data.seeingName?this.$util.hideName(data.seeingName):'';
					let dataMap = {
						room:data.room,
						number:data.number,
						department:data.department,
						seeingName:seeingName,
						seeingNumber:data.seeingNumber,
						wating:[
							{name:'陈琳',number:'3412'},
							{name:'陈琳',number:'3412'},
						],
						doctor:data.doctor
					}
					dataMaps = dataMaps.concat(dataMap);
				})
				this.dataPage = dataMaps;
				this.data = dataMaps[0];
				console.log(this.data );
				this.page();
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
	font-size: 64px;
	color: #fff;

	text-overflow: ellipsis;
}

</style>
