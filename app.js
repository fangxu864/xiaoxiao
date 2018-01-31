var Cache = require("./cache.js");

App({

  appId: "",
  REQUEST_HOST: "https://blog.quanmingpian.com",
  SESSION_STORAGE_KEY: "xxs-session-storage",
  SERVER_ERROR_TEXT: "服务器未成功处理请求",
  cache: Cache,

  curProductName: "",
  curProductPid: "",

  onLaunch() {
    Date.prototype.format = function (format) {
      var args = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
      };
      if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var i in args) {
        var n = args[i];
        if (new RegExp("(" + i + ")").test(format))
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
      }
      return format;
    };
  },

  /**
   * 提示错误信息
   * 
   */
  alert: function (msg) {
    if (!msg) return false;
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })

  },

  /**
   * 登录微信，用code换取sessionKey
   * 
   * @param {any} callback 登录后的回调
   */
  login: function (callback) {
    console.log("走了一次登录");
    var _this = this;
    var callback = callback || new Function();
    wx.login({
      success: function (res) {

        if (res.code) {
          wx.showLoading({
            title: "登录中.."
          })
          //发起网络请求
          wx.request({
            url: _this.REQUEST_HOST + '/Home/SmallApp/login',
            method: "POST",
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res);
              if (res.statusCode == 200 && res.data.code == 200) {
                console.log("sessionKey返回：", res.data.data.sessionKey);
                //设置sessionKey
                wx.setStorageSync(_this.SESSION_STORAGE_KEY, res.data.data.sessionKey);
                console.log("localStorage成功设置sessionKey");
                //调用回调
                callback();
              }
            },
            fail: function () {
              _this.alert("微信登录向xxs服务器发送请求失败");
            },
            complete: function () {
              wx.hideLoading()
            }
          })
        } else {
          _this.alert('微信登录wx.login有获取到用户的code');
        }
      },
      fail: function () {
        _this.alert("微信登录wx.login调用失败");
      }
    })
  },


  /**
   * 统一封装的ajax
   * 每次请求都会验证登录与否
   * 
   * @param {any} opt 
   */
  ajax: function (opt) {

    var _this = this;

    //-----参数处理开始-----//

    //默认参数
    var defaults = {
      debug: false,
      url: "",
      data: {},
      header: {},
      method: "POST",
      dataType: "json",
      loading: function () {},
      success: function () {},
      fail: function (err) {
        wx.showModal({
          title: "提示",
          content: JSON.stringify(err),
          showCancel: false
        })
      },
      complete: function () {}
    };

    //混合默认参数和新参数
    var newOpt = {};
    for (var i in defaults) {
      if (typeof opt[i] == "undefined") {
        newOpt[i] = defaults[i];
      } else {
        newOpt[i] = opt[i];
      }
    }

    //给url加上host
    var url = newOpt.url;
    if (!url) return new Error("没有url");
    newOpt["url"] = _this.REQUEST_HOST + newOpt["url"];

    //success中间件
    var _success = newOpt.success;
    newOpt["success"] = function (res) {
      var _res = res.data;
      var statusCode = res.statusCode;
      if (statusCode == 200) {
        //205代表用户没登录，在redis里取不到sessionKey对应的信息
        if (_res.code == 205) {
          reLogin();
        } else {
          _success(_res);
        }
      } else {
        wx.showModal({
          title: "提示",
          content: _this.SERVER_ERROR_TEXT + "，statusCode:" + statusCode,
          showCancel: false
        });
      }
    };

    //-----参数处理结束-----//

    //开发debug
    if (newOpt.debug) {
      newOpt.loading();
      return setTimeout(function () {
        newOpt.complete();
        newOpt.success();
      }, 2000)
    };

    //登录校验
    var sessionKey = wx.getStorageSync(_this.SESSION_STORAGE_KEY);
    if (!sessionKey) {
      reLogin();
    } else {
      wx.checkSession({
        success: function () {
          //session 未过期，并且在本生命周期一直有效
          let sessionKey = wx.getStorageSync(_this.SESSION_STORAGE_KEY);
          newOpt["header"]["session-key"] = sessionKey;
          newOpt.loading();
          wx.request(newOpt);
        },
        fail: function () {
          //登录态过期
          reLogin();
        }
      })
    }

    //走登录的流程
    function reLogin() {
      _this.login(function () {
        let sessionKey = wx.getStorageSync(_this.SESSION_STORAGE_KEY);
        newOpt["header"]["session-key"] = sessionKey;
        //此处的定时是为了de腾讯的bug,不然loading不显示
        setTimeout(function () {
          newOpt.loading();
          wx.request(newOpt);
        }, 20)
      })

    }

  }

});