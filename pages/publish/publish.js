var App = getApp();
var Common = require("../../util/common.js");
var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.Toast,Zan.Stepper, {

  data: {
    remark: "", //备注

    prolist: [],
    totalMoney: 0,

    showNumPopup: false,
    buyNum: 0,

    curAddr: {},
    addrList: [],
    showAddrPopup: false,

    buyNumStepper: {
      stepper: 1, //和购买数量对应
      min: 1,
      max: 99999
    },

    //用户当前点击的产品参数
    curProData: {
      name: "", //产品名称
      images: "", //图片
      price: "", //价格
      pricetype: "" //价格单位
    }
  },

  onShow: function () {
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


  toggleNumPopup() {
    this.setData({
      showNumPopup: !this.data.showNumPopup
    });
    // this.curItemData.num = 1;
    // this.setData({
    //   'buyNumStepper.stepper': 1
    // })
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

  handleZanStepperChange(e) {
    var componentId = e.componentId;
    var stepper = e.stepper;

    this.curItemData.num = stepper;
    this.setData({
      [`${componentId}.stepper`]: stepper
    });
  },

  //改数量
  changeNum(e) {
    var dataSet = e.currentTarget.dataset;
    this.curItemData.id = dataSet.id;
    this.curItemData.num = dataSet.num;
    this.curItemData.num =dataSet.num;
    this.setData({
      'buyNumStepper.stepper': dataSet.num
    })
    this.setData({
      curProData: {
        name: dataSet.name, //产品名称
        images: dataSet.images, //图片
        price: dataSet.price, //价格
        pricetype: dataSet.pricetype //价格单位
      }
    })
    this.toggleNumPopup();
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
    this.toggleNumPopup();
  },

  //预览图片
  previewImg(e) {
    var urls = [e.currentTarget.dataset.src];
    wx.previewImage({
      urls: urls // 需要预览的图片http链接列表
    })
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

  submitOrder: function (e) {
    var _this = this;
    var params = {};
    params["form_id"] = e.detail.formId;

    //校验收获地址
    if (!this.data.curAddr.address) {
      this.showZanToast("请正确填写收货地址", 1500);
      return false;
    } else {
      params["address"] = this.data.curAddr.address;
      params["name"] = this.data.curAddr.name;
    }

    //校验手机
    if (!/\d{11}/.test(this.data.curAddr.mobile)) {
      this.showZanToast("请正确填写收货手机号", 1500);
      return false;
    } else {
      params["mobile"] = this.data.curAddr.mobile;
    }
    params["describe"] = this.data.remark;

    var products = {};
    this.data.prolist.forEach(item => {
      if (!products[item.uid]) products[item.uid] = {};
      products[item.uid][item.id] = item.num;
    })
    params["products"] = products;

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
          //清空购物车
          App.shoppingCart.clear();
          _this.renderList();
          _this.setData({
            remark: ""
          })
          Common.alert("下单成功，稍后我们会联系您哦~");
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