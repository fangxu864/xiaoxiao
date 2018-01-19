var App = getApp();
var uploadFile = require("../../util/uploadFile/index.js");
var Common = require("../../util/common.js");

const wxPromise = require('../../util/es6/wxPromise.js');
const Promise = require('../../util/es6/index.js').Promise;

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.Toast, {

  bizData: {
    content: "",
    mobile: "",
    address: "",
    tagName: "",
    latitude: "",
    longitude: ""
  },

  data: {
    files: [],
    showDialog: false,
    address: "请选择地址",
    tagName: "请选择标签",
    tagList: ["服务名片", "闲置二手", "全职兼职", "买房租房", "宠物信息", "其它类别"],
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },

  onShow: function () {

  },

  // 编辑用户信息  
  // key=登录返回的key
  // user_name=用户姓名
  // nick_name=用户昵称
  // mobile=用户手机号
  // id_card=用户身份证
  // address=用户地址
  // 技术部-蓝罗程 22:53:40
  // 姓名 手机号 地址 必填，其他的可为空


  wxLogin: function () {

    App.ajax({
      debug: false,
      url: "/Home/SmallApp/editorUserInfo",
      data: {
        user_name: "666",
        mobile: "15659329936",
        address: "212121254854"
      },
      header: {},
      method: "POST",
      dataType: "json",
      loading: function () {
        console.log("调用loading...")
        wx.showLoading({
          title: "努力加载中.."
        })

      },
      success: function (res) {
        console.log("---success----", res);
      },
      fail: function (err) {
        Common.alert(JSON.stringify(err))
      },
      complete: function (res) {
        console.log(res);
        wx.hideLoading()
      }
      
    });

  }

}));