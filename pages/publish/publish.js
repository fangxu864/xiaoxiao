var App = getApp();
var Common = require("../../util/common.js");
var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.Toast, {

  data: {
    remark: "", //备注

    prolist: [],
    totalMoney: 0,

    showNumPopup: false,
    buyNum: 0,

    curAddr: {},
    addrList: [],
    showAddrPopup: false
  },

  onShow: function () {
    this.setData({
      describe: App.curProductName
    })


    this.renderList();
    this.getAddrData();
  },

  //渲染列表
  renderList() {
    var cartData = App.shoppingCart.getData();

    var totalMoney = 0;

    cartData.forEach(item => {
      item["total"] = (Number(item.price) * Number(item.num)).toFixed(2);
      totalMoney += Number(item["total"]);
    });
    this.setData({
      prolist: cartData,
      totalMoney: Number(totalMoney).toFixed(2)
    })
  },

  getAddrData() {

    var _this = this;

    App.ajax({
      debug: false,
      url: "/Home/SmallApp/getAddress",
      data: {},
      header: {},
      method: "POST",
      dataType: "json",
      loading: function () {
        wx.showLoading({
          title: "加载中.."
        })
      },
      success: function (res) {
        if (res.code == 200) {
          _this.setData({
            addrList: res.data
          });
          if (res.data[0]) {
            _this.setData({
              curAddr: res.data[0]
            });
          }
        } else {
          // Common.alert(res.msg || "提交订单失败，请重试");
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

  /**
   * 打开数量弹框
   * 
   */
  openNumPupop() {
    this.setData({
      showNumPopup: true
    })
  },

  closeNumPupop() {
    this.setData({
      showNumPopup: false
    })
  },


  toggleNumPopup() {
    this.setData({
      showNumPopup: !this.data.showNumPopup
    });
  },

  openAddrPupop() {
    this.setData({
      showAddrPopup: true
    })
  },

  closeAddrPupop() {
    this.setData({
      showAddrPopup: false
    })
  },


  toggleAddrPopup() {
    this.setData({
      showAddrPopup: !this.data.showAddrPopup
    });
  },

  //地址切换
  onAddrPick() {
    this.openAddrPupop();
  },

  //点击地址列表
  onAddrListTap(e) {
    var _this = this;
    var curId = e.currentTarget.dataset.id;
    this.data.addrList.forEach(item => {
      if (item.id == curId) {
        _this.setData({
          curAddr: item
        })
      }
    })
    this.closeAddrPupop()
  },

  //数量
  numBlur: function (e) {
    this.curItemData.num = e.detail.value;
  },
  //数量
  remarkBlur: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  curItemData: {
    id: "",
    num: ""
  },

  //改数量
  changeNum(e) {
    var dataSet = e.currentTarget.dataset;
    this.curItemData.id = dataSet.id;
    this.curItemData.num = dataSet.num;
    this.setData({
      buyNum: dataSet.num
    })
    this.openNumPupop();
  },

  //确认更改数量
  sureAddList() {
    if (!this.curItemData.num || Number(this.curItemData.num) <= 0) {
      this.showZanToast("请填写正确的购买的数量", 1500);
      return false;
    }
    let result = App.shoppingCart.alter(this.curItemData.id, this.curItemData.num);
    if (result) {
      this.showZanToast("更改成功", 1500);
      this.renderList();
    } else {
      this.showZanToast("更改失败", 1500);
    }
    this.closeNumPupop();
  },

  //删除产品
  delPro(e) {
    var _this = this;
    var dataSet = e.currentTarget.dataset;
    var id = dataSet.id;

    wx.showModal({
      title: '提示',
      content: '确定删除该商品？',
      success: function (res) {
        if (res.confirm) {
          var result = App.shoppingCart.remove(id);
          if (result) { //删除成功
            _this.renderList();
            _this.showZanToast("删除成功", 1500);
          }
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })

  },

  submitOrder: function () {
    console.log(12121)
    var _this = this;
    var params = {};

    //校验下单描述
    // if (this.data.describe == "") {
    //   this.showZanToast("请填写您要购买的物品", 1500);
    //   return false;
    // } else {
    //   params["describe"] = this.data.describe;
    // }

    params["remark"] = this.data.remark;
    params["addr"] = this.data.curAddr;
    params["paroducts"] = this.data.prolist

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

          // Common.alert("下单成功,稍后我们会联系您");
          // _this.setData({
          //   num: "", //数量 
          //   name: "", //下单人姓名
          //   address: "", //收货地址
          //   mobile: "", //手机号
          //   describe: "" //商品描述
          // })
          // App.curProductName = "";
          // App.curProductPid = "";

        } else {
          Common.alert(res.msg || "提交订单失败，请重试");
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