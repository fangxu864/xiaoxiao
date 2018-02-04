var App = getApp();
var Common = require("../../util/common.js");
var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.Toast, {

    data: {
        orderList: [],
    },

    onLoad() {
        this.getData()
    },


    getData() {
        var _this = this;
        App.ajax({
            debug: false,
            url: "/Home/Order/myOrders",
            data: {
                page : 1,
                pageSize: 100,
                bime : "2018-01-01",
                etime : "2020-01-01"
            },
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
                    // Common.alert("保存成功");
                    res.data.list.forEach(item => {
                        console.log(item.time)
                        item.time = new Date(Number(item.time + "000")).format("yyyy-MM-dd hh:mm:ss");
                    });
                    _this.setData({
                        orderList: res.data.list
                    })
                } else {
                    Common.alert(res.msg || "获取失败");
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

}))