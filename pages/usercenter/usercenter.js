var App = getApp();
var Common = require("../../util/common.js");
var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.Toast, {

    data: {
        nick_name: "",
        avatar_url: ""
    },


    onShow: function () {
        this.updateUserInfo();
        // this.getUserInfo();
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

    authSet: function () {
        wx.openSetting({
            success: (res) => {
                /*
                 * res.authSetting = {
                 *   "scope.userInfo": true,
                 *   "scope.userLocation": true
                 * }
                 */
            }
        })
    },

    updateUserInfo: function () {
        var _this = this;
        wx.getUserInfo({
            success: function (res) {
                _this.setData({
                    nick_name: res.userInfo.nickName,
                    avatar_url: res.userInfo.avatarUrl
                });
            }
        })
    },
}))