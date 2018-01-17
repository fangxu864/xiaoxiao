/**
 * @author [fangxu]
 * @email [864109504@qq.com]
 * @create date 2017-08-22 02:07:07
 * @modify date 2017-08-22 02:07:07
 * @desc [description]
*/
var Common = require("../../util/common.js");
var app = getApp();



/**
 * 店铺列表页
 */
Page({

    isUseCache: true,

    data: {
        shopListShow: "block",
        locationText: "当前定位地址",
        shopListArr: [],
        //是否显示状态提示框
        pageStatusShow: "none",
        pageStatusText: "页面状态文本",

        historyShoplist: [
            // {
            //     img:"http://images.12301.cc/shops/123624/14609470368965.jpg",
            //     name:"慢慢的二级店铺",
            //     scenCode:"wxApp#Bp3odO"
            // }
        ]
    },

    onLoad: function () {
    },

    /**
     * 下拉刷新更新经纬度
     */
    onPullDownRefresh: function () {
        var _this = this;
        this.refreshLocation();
    },

    onShow: function () {
        // var _this = this;
        // //如果不存在经纬度
        // if (!app.globalData.curLatitude || !app.globalData.curLongitude) {
        //     this.refreshLocation();
        // } else {
        //     // this.getShopListData(app.globalData.curLongitude, app.globalData.curLatitude);
        // }

    },

    /**
     * 刷新位置
     */
    refreshLocation: function () {
        var _this = this;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                //缓存经纬度
                _this.setData({
                    locationText: "当前定位地址"
                });
                app.globalData.curLatitude = res.latitude;
                app.globalData.curLongitude = res.longitude;
                // _this.getShopListData(res.longitude, res.latitude);
            },
            fail: function () {
                _this.setData({
                    locationText: "定位失败，请手动选择"
                });
            },
            complete: function () {
                wx.stopPullDownRefresh();
            }
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
                app.globalData.curLatitude = res.latitude;
                app.globalData.curLongitude = res.longitude;

                _this.setData({
                    locationText: Common.ellipsis(res.name || res.address, 15)
                });
                // _this.getShopListData(res.longitude, res.latitude);
            },
            fail: function (e) {

                //如果用户拒绝了授权地理位置 'chooseLocation:fail auth deny'
                if (/deny/g.test(e.errMsg)) {

                }

            }
        })
    },


    onInfoListTap: function () {
        wx.navigateTo({
            url: '../detail/detail'
        })
    }

});