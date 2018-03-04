const {
  Tab,
  extend
} = require('../../dist/index');

var App = getApp();
var Common = require("../../util/common.js");
var Zan = require('../../dist/index.js');

Page(extend({}, Tab, Zan.Toast, Zan.NoticeBar, Zan.Stepper, {

  pageSize: 5,

  data: {
    tab: {
      list: [{
        id: '1',
        title: '生鲜类'
      }, {
        id: '2',
        title: '加工食品类'
      }, {
        id: '3',
        title: '鱼干类'
      }],
      selectedId: '1',
      scroll: true,
      height: 45
    },

    list1: {
      data: [],
      status: 1,
      page: 1
    },
    list2: {
      data: [],
      status: 1,
      page: 1
    },
    list3: {
      data: [],
      status: 1,
      page: 1
    },

    statusText: {
      1: "上滑动加载更多..",
      2: "没有更多了..",
    },

    showBottomPopup: false,
    movable: {
      text: ''
    },

    showPopup: false,
    popupText: "fasdfasdf",

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

  handleZanStepperChange(e) {
    var componentId = e.componentId;
    var stepper = e.stepper;

    this.curItemData.num = stepper;
    this.setData({
      [`${componentId}.stepper`]: stepper
    });
  },


  onLoad: function () {
    console.log(1212);
    this.getData(1)
    this.getNotice();
  },

  onShow() {
    // 滚动通告栏需要initScroll
    // this.initZanNoticeBarScroll('movable');
    var _this = this;

    // _this.setData({
    //   "movable.text": "3月2日，网上出现一则消息称，马云至黑龙江哈尔滨尚志市参加亚布力中国企业家论坛，正赶上黑龙江省突遇暴雪天气，执勤民警引导车辆，马云向执勤民警致谢并与民警合影留念，并配有一张马云与执勤民警的合影。合影中，马云面带微笑，双手交叉放在身前，两位执勤民警站在其两边。"
    // })
    // setTimeout(function () {
    //   _this.initZanNoticeBarScroll('movable');
    // }, 200)

   



  },

  refreshPage() {
    wx.reLaunch({
      url: '/pages/product/product'
    })
  },


  /**
   * 切换显示下单数量popup
   */
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
    this.curItemData.num = 1;
    this.setData({
      'buyNumStepper.stepper': 1
    })
  },

  //当前下单参数
  curItemData: {
    name: "",
    id: "",
    num: "",
    price: "",
    images: "",
    uid: ""
  },

  //加入清单
  addList(e) {
    var dataSet = e.currentTarget.dataset;
    this.curItemData.name = dataSet.name;
    this.curItemData.id = dataSet.id;
    // this.curItemData.num = dataSet.num;
    this.curItemData.price = dataSet.price;
    this.curItemData.images = dataSet.images;
    this.curItemData.uid = dataSet.uid;
    this.curItemData.pricetype = dataSet.pricetype;
    this.setData({
      curProData: {
        name: dataSet.name, //产品名称
        images: dataSet.images, //图片
        price: dataSet.price, //价格
        pricetype: dataSet.pricetype //价格单位
      }
    })
    this.toggleBottomPopup();

  },

  //确认加入清单
  sureAddList() {
    var buyNum = this.curItemData.num;

    console.log(buyNum)

    if (!buyNum || Number(buyNum) <= 0) {
      this.showZanToast("请填写正确的购买的数量", 1500);
      return false;
    }
    console.log(this.curItemData)
    let result = App.shoppingCart.add(this.curItemData);
    if (result) {
      this.showZanToast("添加成功,可去下单页下单", 1500);
    } else {
      this.showZanToast("增加清单失败", 1500);
    }
    this.toggleBottomPopup();
  },

  //预览图片
  previewImg(e) {
    var urls = [e.currentTarget.dataset.src];
    wx.previewImage({
      urls: urls // 需要预览的图片http链接列表
    })
  },

  getData(tabId) {
    var curList = "list" + tabId;
    console.log(curList);
    var _this = this;
    App.ajax({
      debug: false,
      url: "/Home/Product/getProduct",
      data: {
        pageSize: _this.pageSize,
        page: _this.data[curList].page,
        type: tabId
      },
      header: {},
      method: "post",
      dataType: "json",
      loading: function () {
        console.log("调用loading...")
        wx.showLoading({
          title: "获取信息中.."
        })

      },
      success: function (res) {

        if (res.code == 200) {
          _this.setData({
            [`${curList}.data`]: _this.data[curList].data.concat(res.data.list),
          });

          _this.setData({
            [`${curList}.page`]: Number(_this.data[curList].page) + 1,
          });
          if (res.data.cnt < _this.pageSize || res.data.list.length == 0) {
            _this.setData({
              [`${curList}.status`]: 2
            });
          } else {
            _this.setData({
              [`${curList}.status`]: 1
            });
          }
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

  /**
   * 获取公告信息
   */
  getNotice() {
    var _this = this;
    App.ajax({
      debug: false,
      url: "/Home/SmallApp/getNotice",
      data: {},
      header: {},
      method: "post",
      dataType: "json",
      loading: function () {
        // console.log("调用loading...")
        // wx.showLoading({
        //   title: ".."
        // })
      },
      success: function (res) {
        var noticeText = res.data;
        if (res.code == 200) {
          _this.setData({
            "movable.text": noticeText
          })
          setTimeout(function () {
            _this.initZanNoticeBarScroll('movable');
          }, 300)
        } else {
          // Common.alert(res.msg);
        }
      },
      fail: function (err) {
        // Common.alert(JSON.stringify(err))
      },
      complete: function (res) {
        // console.log(res);
        // wx.hideLoading()
      }
    });
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });

    var curList = "list" + selectedId;
    if (this.data[curList].data.length == 0) {
      this.getData(selectedId);
    }


  },


  onScrollBottom(e) {
    console.log(e)
    console.log("11212");
    this.getData(this.data.tab.selectedId);

  },

  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },

  /**
   * 查看公告
   */
  viewNotice() {
    var _this = this;
    this.setData({
      popupText: _this.data.movable.text
    });
    this.togglePopup();
  },

  /**
   * 查看描述
   */
  showDesc: function (e) {
    var _this = this;
    var text = e.currentTarget.dataset.desc;
    this.setData({
      popupText: text
    });
    this.togglePopup();
  }
}));