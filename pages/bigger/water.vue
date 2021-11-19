<template>
	<view class="content" @longpress="open" @click="open">
		<image class="bg" src="../../static/water.png"></image>
		<view class="type ">{{text}}</view>
		<view class="info">
			<view class="info-patient" >
				<view class="room" ><view style="color: rgb(113,17,18);">当前呼叫</view></view>
				<view class="msg"><view style="color: rgb(113,17,18);">消息</view></view>
			</view>
			<view class="info-patient data" v-for="(item, index) in data" :key="index">
				<view class="room"><view>{{item.queueNo +'  '+ item.patientName}}</view></view>
				<view class="msg"><view>{{item.msg}}</view></view>
			</view>
		</view>
		<!-- <view class="footer"><uni-notice-bar scrollable="true" single="true" :text="tips" :fontSize="noticeFontSize" :height="noticeFontSize"></uni-notice-bar></view> -->
		<popupSet
			ref="popupSet"
			@confirm="confirm"
			@close="close"
			backgroundColor="transparent"
			:dataInit="dataPopup"
			color="#fff"
		></popupSet>
	</view>
</template>

<script>
import popupSet from '../../components/popup-set/popup-set.vue';
import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue';
export default {
	components: { popupSet, uniNoticeBar },
	data() {
		return {
			title: '超声科',
			data: [
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
			calledNumbera: '',
			iType: '',
			popupShow: false,
			seqNumber: '',
			voiceData: [],
			testNubmer: 0,
			voiceDataInit: [],
			dataPopup: {
				title: '',
				iType: '',
				screenNumber: '',
				playSound: false,
				text: ''
			},
			text: '',
			voicePlayNumber: 0,
			voicePlayTiems: 3,
			tips: '',
			interval: 10000,
			noticeFontSize: ''
		};
	},
	onLoad() {
		this.interval = this.$util.getRequestInterval();
		let dataInit = uni.getStorageSync('dataInit') || {};
		this.init();
	},
	methods: {
		// 打开设置
		open() {
			this.$refs.popupSet.open();
			this.popupShow = true;
		},
		// 关闭设置
		close() {
			this.popupShow = false;
			if (this.iType) {
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
		init() {
			if (this.popupShow) {
				return false;
			}
			// 测试使用
		// 	let datas = {
		// 		reload: 'false',
		// 		data: [
		// 			{
		// 				queueId: '66',
		// 				examClass: 'CT',
		// 				queueName: 'CT2',
		// 				queueTime: '2021-07-19 14:32:00',
		// 				queueNo: '1A03',
		// 				examNo: '0000000003',
		// 				patientName: '张三3',
		// 				queueStatus: '0',
		// 				deferFlag: '1',
		// 				msg: '喝水'
		// 			},
		// 			{
		// 				queueId: '65',
		// 				examClass: 'CT',
		// 				queueName: 'CT1',
		// 				queueTime: '2021-07-19 14:31:00',
		// 				queueNo: '1A02',
		// 				examNo: '0000000002',
		// 				patientName: '张三2',
		// 				queueStatus: '0',
		// 				deferFlag: '1',
		// 				msg: '喝水'
		// 			},
		// 			{
		// 				queueId: '64',
		// 				examClass: 'CT',
		// 				queueName: 'CT1',
		// 				queueTime: '2021-07-19 14:30:00',
		// 				queueNo: '1A01',
		// 				examNo: '0000000001',
		// 				patientName: '张三1',
		// 				queueStatus: '0',
		// 				deferFlag: '1',
		// 				msg: '喝水'
		// 			}
		// 		],
		// 		serverTime: '2021-07-19 11:57:26',
		// 		queueTitle: '服务器'
		// 	};
		// this.data = datas.data;
		// this.text = datas.queueTitle;
			this.$request({
				url: 'Queue/injectionRoomMessage',
				method: 'POST',
				success: datas => {
					try {
						if (datas.reload == 'true' || datas.reload == true) {
							this.$tui.webView.postMessage({
								data: {
									reload: datas.reload
								}
							});
							return;
						}
						this.data = datas.data;
						this.text = datas.queueTitle;
						setTimeout(() => {
							this.init();
						}, this.interval);
						
					} catch (e) {
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
			});
		},
		// 语音队列
		voiceQueue() {
			let text = this.voiceData[0];
			this.$tui.webView.postMessage({
				data: {
					text: text
				}
			});
			console.log(text);
			if (this.voiceData.length > 1) {
				this.onDone(this.voiceData[1]);
			} else {
				this.onDone(this.voiceData[0]);
			}
		},
		// 播放完执行
		onDone(data) {
			let date = 4300;
			if (data.length > 12) {
				date = date + (data.length - 12) * 300;
			}
			setTimeout(() => {
				this.voicePlayNumber++;
				if (this.voicePlayNumber >= this.voicePlayTiems) {
					this.voiceData.shift();
					this.voicePlayNumber = 0;
				}
				if (this.voiceData.length > 0) {
					this.voiceQueue();
				} else {
					this.init();
				}
			}, date);
		}
	}
};
</script>

<style lang="scss">
@import './index.scss';

@media screen and (min-width: 900px) and (max-width: 1300px) {
	.content {
		.info-patient {
			height: 63px;
		}
	}
}
.pr-15 {
	padding-right: 15px;
}
.pl-15 {
	padding-left: 15px;
}
page {
	height: 100%;
}
.uni-form-item.uni-form-btn {
	padding: 0;
}
.info {
	padding-left: 10px;
	padding-right: 10px;
	height: 762px;
}
.footer {
	color: #ffffff;
	font-size: 44px;
	height: 78px;
	line-height: 78px;
	padding: 0 10px;
}
.chooseBtn {
	font-size: 30px;
	width: 438px;
}
.header {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 118px;
}
.room {
	width: 600px;
}
.number view {
	color: rgb(113, 17, 18) !important;
}
.content {
	position: relative;
	height: 100%;
	width: 1920px;
}
.type {
	font-size: 70px;
	padding-top: 116px;
	font-weight: bold;
	height: 122px;
	line-height: 122px;
	padding-left: 10px;
	padding-right: 10px;
	text-align: center;
}
.type-text {
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
.header-title {
	color: rgb(253, 250, 7);
	font-size: 63px;
	font-weight: 800;
	letter-spacing: 12px;
}
.header-time view {
	font-size: 35px;
	color: #000;
	letter-spacing: 5px;
}

.info-patient {
	display: flex;
	align-items: center;
	height: 115px;
	text-align: center;
}
.info-patient.data{
	height: 324px;
}
.info-patient view {
	font-size: 58px;
	font-weight: bold;
	color: #000;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.msg {
	width: 1412px;
}

</style>
