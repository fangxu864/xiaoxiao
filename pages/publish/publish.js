var App = getApp();
var Common = require("../../util/common.js");
var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.Toast, {

  data: {
    num: "", //数量 
    name: "", //下单人姓名
    address: "", //收货地址
    mobile: "", //手机号
    describe: "" //商品描述
  },

  onShow: function () {

  },

  numBlur: function (e) {
    this.setData({
      num: e.detail.value
    })
  },

  addressBlur: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  nameBlur: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  mobileBlur: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  describeBlur: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },

  submitOrder: function () {
    console.log(12121)
    var _this = this;
    var params = {};

    //校验下单描述
    if (this.data.describe == "") {
      console.log(1212121212)
      this.showZanToast("买什么不能为空", 1500);
      return false;
    } else {
      params["describe"] = this.data.describe;
    }

    //校验姓名
    if (this.data.name == "") {
      this.showZanToast("姓名不能为空", 1500);
      return false;
    } else {
      params["name"] = this.data.name;
    }

    //校验数量
    if (this.data.num == "") {
      this.showZanToast("数量不能为空", 1500);
      return false;
    } else {
      params["num"] = this.data.num;
    }

    //校验手机
    if (!/\d{11}/.test(this.data.mobile)) {
      this.showZanToast("手机号格式错误", 1500);
      return false;
    } else {
      params["mobile"] = this.data.mobile;
    }

    //校验地址
    if (this.data.address == "") {
      this.showZanToast("地址不能为空", 1500);
      return false;
    } else {
      params["address"] = this.data.address;
    }

    App.ajax({
      debug: false,
      url: "/Home/Order/submit",
      data: params,
      header: {},
      method: "POST",
      dataType: "json",
      loading: function () {
        console.log("调用loading...")
        wx.showLoading({
          title: "订单提交中.."
        })

      },
      success: function (res) {
        if (res.code == 200) {
          
          Common.alert("下单成功,稍后我们会联系您");
          this.setData({
            num: "", //数量 
            name: "", //下单人姓名
            address: "", //收货地址
            mobile: "", //手机号
            describe: "" //商品描述
          })

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

  }



}));