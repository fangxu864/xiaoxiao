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


  /**
   * 要发布的内容框失去焦点
   * 
   * @param {any} e 
   */
  contentBlur: function (e) {
    this.bizData.content = e.detail.value;
  },

  /**
   * 手机输入框失去焦点
   * 
   * @param {any} e 
   */
  mobileBlur: function (e) {
    this.bizData.mobile = e.detail.value;
  },

  /**
   * 切换弹框显示
   * 
   */
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },


  /**
   * 用户进行手动选择定位
   * @param e
   */
  tapChooseLocation: function (e) {
    var _this = this;
    wx.chooseLocation({
      cancel: function () {

      },
      success: function (res) {
        _this.bizData.address = Common.ellipsis(res.name || res.address, 15);
        _this.bizData.latitude = res.latitude;
        _this.bizData.longitude = res.longitude;

        _this.setData({
          // address: Common.ellipsis(res.name || res.address, 15)
          address: res.name || res.address
        });
      },
      fail: function (e) {

        //如果用户拒绝了授权地理位置 'chooseLocation:fail auth deny'
        if (/deny/g.test(e.errMsg)) {

        }

      }
    })
  },


  publish: function () {
    var _this = this;

    console.log(this.bizData)

    var content = this.bizData.content;
    if (content == "") {
      console.log(11212);
      console.log(this.showZanToast)
      this.showZanToast('发布内容不能为空',1500);
      // Common.alert("发布内容不能为空");
      return false;
    }

    var address = this.bizData.address;
    if (address == "") {
      this.showZanToast("请选择地址");
      return false;
    }
    var locationArr = [];
    locationArr.push(this.bizData.longitude);
    locationArr.push(this.bizData.latitude);
    var location = locationArr;

    var mobile = this.bizData.mobile;
    if (!/\d{11}/.test(mobile)) {
      this.showZanToast("手机号填写有误");
      return false;
    }

    var tagName = this.bizData.tagName;
    if (tagName == "") {
      this.showZanToast("请选择标签");
      return false;
    }

    var subData = {
      content: content,
      address: address,
      location: location,
      mobile: mobile,
      tagName: tagName,
      imgUrls: []
    }



    this.uploadImages().then(function (res) {

      if (res) {
        subData.imgUrls = res;
      }


      App.ajax({
        debug: false,
        url: "/xxs/publish",
        data: subData,
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
          if (res.code == 200) {
            Common.alert("发布成功");
          } else {
            Common.alert(res.msg || "发布失败，请重试");
          }
        },
        fail: function (err) {
          Common.alert(JSON.stringify(err));
        },
        complete: function (res) {
          console.log(res);
          wx.hideLoading()
        }
      });


      console.log(res);
    }).catch(function (err) {
      console.log(err);
    });


  },


  wxLogin: function () {

    App.ajax({
      debug: false,
      url: "/xxs/publish",
      data: {
        username: "1212212"
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