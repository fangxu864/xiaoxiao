var Common = {
	appId: "wx5605b231e666f425",
	REQUEST_HOST: "https://api.12301dev.com/index.php",
	SESSION_STORAGE_KEY: "pft-session-storage",
	SESSION_STORAGE_EXPIRE_KEY: "pft-session-storage-expire", //session过期时长的key
	SESSION_STORAGE_AT_TIME: "pft-session-storage-attime",
	SERVER_ERROR_TEXT: "服务器未成功处理请求",

	/**
	 * 获取今天
	 * @returns {string}
	 */
	getToday: function () {
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		if (m < 10) m = "0" + m;
		if (d < 10) d = "0" + d;
		return y + "-" + m + "-" + d;
	},


	/**
	 * 显示错误信息
	 * 
	 * @param {any} errMsg 
	 */
	alert: function (errMsg) {
		wx.showModal({
			title: "提示",
			content: errMsg,
			showCancel: false
		})
	},

	/**
	 * 获取明天
	 * 
	 */
	getTomorrow: function () {
		var date = new Date();
		date.setDate(date.getDate() + 1);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		if (m < 10) m = "0" + m;
		if (d < 10) d = "0" + d;
		return y + "-" + m + "-" + d;
	},


	MinueToDayTime: function (daytime) {
		var day = daytime / (24 * 60);
		var day_init = String(day).split(".")[0] * 1;
		var hour = (day - day_init) * 24;
		var hour_init = String(hour).split(".")[0] * 1;
		var mine = (hour - hour_init) * 60;
		var mine_init = Math.ceil(mine);
		var day_text = day_init == 0 ? "" : (day_init + "天");
		var hour_text = (day_init == 0 && hour_init == 0) ? "" : (hour_init + "小时");
		var mine_text = mine_init != 0 ? (mine_init + "分钟") : "";
		return day_text + hour_text + mine_text;
	},

	/**
	 * 验证身份证
	 * @param code
	 * @returns {boolean}
	 */
	validateIDCard: function (code) {
		var city = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏 ",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外 "
		};
		var tip = "";
		var pass = true;

		if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
			tip = "身份证号格式错误";
			pass = false;
		} else if (!city[code.substr(0, 2)]) {
			tip = "地址编码错误";
			pass = false;
		} else {
			//18位身份证需要验证最后一位校验位
			if (code.length == 18) {
				code = code.split('');
				//∑(ai×Wi)(mod 11)
				//加权因子
				var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				//校验位
				var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
				var sum = 0;
				var ai = 0;
				var wi = 0;
				for (var i = 0; i < 17; i++) {
					ai = code[i];
					wi = factor[i];
					sum += ai * wi;
				}
				var last = parity[sum % 11];
				if (parity[sum % 11] != code[17]) {
					tip = "校验位错误";
					pass = false;
				}
			}
		}
		return pass;
	},

	/**
	 * 字符串省略
	 * @param string 字符串
	 * @param length 长度
	 */
	ellipsis: function (string, length) {
		var str = string || "";
		if (str.length > length) {
			var reg = new RegExp('.{0,' + length + '}');
			str = str.match(reg)[0] + '...';
		}
		return str;
	},

	/**
	 * 判断真假
	 */
	judgeTrue: function (param) {
		var type = Object.prototype.toString.call(param);
		switch (type) {
			case '[object Array]':
				return param.length === 0 ? !1 : !0;
				break;
			case '[object Object]':
				var t;
				for (t in param)
					return !0;
				return !1;
				break;
			case '[object String]':
				return param === '' ? !1 : !0;
				break;
			case '[object Number]':
				return param === 0 ? !1 : !0;
				break;
			case '[object Boolean]':
				return param === false ? !1 : !0;
				break;
			case '[object Null]':
				return !1;
				break;
			case '[object Undefined]':
				return !1;
				break;
			default:
				return type;
		}
	},

	/**
	 * 对象序列化url查询参数
	 * @param obj
	 * @returns {string}
	 */
	urlStringify: function (obj) {
		let arr = [];
		for (let key in obj) {
			arr.push(key + '=' + obj[key]);
		}
		return arr.join("&");
	}
};


module.exports = Common;