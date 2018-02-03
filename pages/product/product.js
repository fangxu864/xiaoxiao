const {
  Tab,
  extend
} = require('../../dist/index');

var App = getApp();
var Common = require("../../util/common.js");
var Zan = require('../../dist/index.js');

Page(extend({}, Tab, Zan.Toast, {

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
    buyNum: ""

  },



  onLoad: function () {
    console.log(1212);
    this.getData(1)
  },

  refreshPage() {
    wx.reLaunch({
      url: '/pages/product/product'
    })
  },

  /**
   * 打开数量弹框
   * 
   */
  openNumPupop() {
    this.setData({
      showBottomPopup: true
    })
  },

  closeNumPupop() {
    this.setData({
      showBottomPopup: false
    })
  },


  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },

  curItemData: {
    name: "",
    id: "",
    num: "",
    price: "",
    images: ""
  },

  //加入清单
  addList(e) {
    var dataSet = e.currentTarget.dataset;
    this.curItemData.name = dataSet.name;
    this.curItemData.id = dataSet.id;
    this.curItemData.num = dataSet.num;
    this.curItemData.price = dataSet.price;
    this.curItemData.images = dataSet.images;
    this.openNumPupop();
  },

  //确认加入清单
  sureAddList() {
    if (!this.curItemData.num || Number(this.curItemData.num) <= 0) {
      this.showZanToast("请填写正确的购买的数量", 1500);
      return false;
    }
    let result = App.shoppingCart.add(this.curItemData);
    if (result) {
      this.showZanToast("添加成功,可去下单页下单", 1500);
    } else {
      this.showZanToast("增加清单失败", 1500);
    }
    this.setData({
      buyNum: ""
    })
    this.closeNumPupop();
  },

  //数量
  numBlur: function (e) {
    this.curItemData.num = e.detail.value;
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

  }
}));