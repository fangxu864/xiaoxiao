const {
  Tab,
  extend
} = require('../../dist/index');

var App = getApp();
var Common = require("../../util/common.js");
var Zan = require('../../dist/index.js');

Page(extend({}, Tab, {

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
    }

  },

  onLoad: function () {
    this.getData(1)

  },

  getData(tabId) {
    var curList = "list" + tabId;
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