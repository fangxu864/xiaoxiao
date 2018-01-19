var App = getApp();
var Common = require("../../util/common.js");
var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.Toast, {

  data: {
    name: "", //用户姓名
    nick_name: "", //用户昵称
    mobile: "", //用户手机号
    id_card: "", //用户身份证
    addr: "" //用户地址
  },

  onShow: function () {
    this.getUserInfo();
  },

  nameBlur: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  nickNameBlur: function (e) {
    this.setData({
      nick_name: e.detail.value
    })
  },

  mobileBlur: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  idCardBlur: function (e) {
    this.setData({
      id_card: e.detail.value
    })
  },

  addrBlur: function (e) {
    this.setData({
      addr: e.detail.value
    })
  },

  /**
   * 获取用户信息
   * 
   */
  getUserInfo: function () {
    var _this = this;
    App.ajax({
      debug: false,
      url: "/Home/SmallApp/getUserInfo",
      data: {},
      header: {},
      method: "get",
      dataType: "json",
      loading: function () {
        console.log("调用loading...")
        wx.showLoading({
          title: "获取信息中.."
        })

      },
      success: function (res) {
        if (res.code == 200) {
          _this.setData(res.data);
        } else {
          Common.alert(res.msg);
        }
      },
      fail: function (err) {
        Common.alert(JSON.stringify(err))
      },
      complete: function (res) {
        console.log(res);
        wx.hideLoading()
      }
    });

  },


  setUserInfo: function () {
    var _this = this;
    var params = {};
    //昵称
    params["nick_name"] = this.data.nick_name;

    //校验姓名
    if (this.data.name == "") {
      this.showZanToast("姓名不能为空", 1500);
      return false;
    } else {
      params["user_name"] = this.data.name;
    }

    //校验手机
    if (!/\d{11}/.test(this.data.mobile)) {
      this.showZanToast("手机号格式错误", 1500);
      return false;
    } else {
      params["mobile"] = this.data.mobile;
    }

    //校验身份证
    if (!Common.validateIDCard(this.data.id_card) && this.data.id_card != "") {
      this.showZanToast("身份证号格式错误", 1500);
      return false;
    } else {
      params["id_card"] = this.data.id_card;
    }

    //校验地址
    if (this.data.addr == "") {
      this.showZanToast("地址不能为空", 1500);
      return false;
    } else {
      params["address"] = this.data.addr;
    }

    App.ajax({
      debug: false,
      url: "/Home/SmallApp/editorUserInfo",
      data: params,
      header: {},
      method: "POST",
      dataType: "json",
      loading: function () {
        console.log("调用loading...")
        wx.showLoading({
          title: "保存中.."
        })

      },
      success: function (res) {
        if (res.code == 200) {
          _this.showZanToast("保存成功", 1500);
          setTimeout(function () {
            wx.switchTab({
              url: '../usercenter/usercenter'
            })
          },1500)
        } else {
          Common.alert(res.msg || "编辑失败");
        }
      },
      fail: function (err) {
        Common.alert(JSON.stringify(err))
      },
      complete: function (res) {
        console.log(res);
        wx.hideLoading()
      }

    });

  },




}));