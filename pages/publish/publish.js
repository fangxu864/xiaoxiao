var App = getApp();
var uploadFile = require("../../util/uploadFile/index.js");
var Common = require("../../util/common.js");

const wxPromise = require('../../util/es6/wxPromise.js');
const Promise = require('../../util/es6/index.js').Promise;

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.Toast, {

  bizData: {
    content: "",
    mobile: "",
    address: "",
    tagName: "",
    latitude: "",
    longitude: ""
  },

  data: {
    files: [],
    showDialog: false,
    address: "请选择地址",
    tagName: "请选择标签",
    tagList: ["服务名片", "闲置二手", "全职兼职", "买房租房", "宠物信息", "其它类别"]
  },

  onShow: function () {

  },


  /**
   * 要发布的内容框失去焦点
   * 
   * @param {any} e 
   */
  contentBlur: function (e) {
    this.bizData.content = e.detail.value;
  },

  /**
   * 手机输入框失去焦点
   * 
   * @param {any} e 
   */
  mobileBlur: function (e) {
    this.bizData.mobile = e.detail.value;
  },

  /**
   * 切换弹框显示
   * 
   */
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  /**
   * 选择图片
   * 
   * @param {any} e 
   */
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 9 - this.data.files.length,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },


  /**
   * 图片预览
   * 
   * @param {any} e 
   */
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
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
        _this.bizData.address = Common.ellipsis(res.name || res.address, 15);
        _this.bizData.latitude = res.latitude;
        _this.bizData.longitude = res.longitude;

        _this.setData({
          // address: Common.ellipsis(res.name || res.address, 15)
          address: res.name || res.address
        });
      },
      fail: function (e) {

        //如果用户拒绝了授权地理位置 'chooseLocation:fail auth deny'
        if (/deny/g.test(e.errMsg)) {

        }

      }
    })
  },

  onTagListTap: function (e) {

    var curTagName = e.target.dataset.tagname;
    this.bizData.tagName = curTagName;
    this.setData({
      tagName: curTagName
    })
    this.toggleDialog()
  },

  /**
   * 长按删除图片
   * 
   * @param {any} e 
   */
  imgOnLongTap: function (e) {

    var _this = this;

    var Files = [].concat(this.data.files);

    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        if (res.tapIndex == 0) {
          Files.remove(e.currentTarget.id);
          _this.setData({
            files: Files
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },

  /**
   * 上传图片
   * 
   */
  uploadImages: function () {
    var _this = this;

    return new Promise(function (resolve, reject) {


      var imgArrLen = _this.data.files.length;

      //如果用户没选图片，结束
      if (imgArrLen == 0) {
        return resolve(false);
      }


      var uploadFilePromised = wxPromise(uploadFile);
      var successIndexArr = []


      var queueIndex = 0;

      var successImgArr = [];

      console.log(_this.data.files[0]);

      function upImg(url) {
        return uploadFilePromised({
          filePath: url,
          dir: "images/"
        }).then(function (res) {
          successImgArr.push(res);
          successIndexArr.push(queueIndex);
          //进度显示
          wx.showLoading({
            title: (queueIndex + 1) + "/" + imgArrLen
          })
          queueIndex++;
          if (queueIndex < imgArrLen) {
            upImg(_this.data.files[queueIndex]);
          } else {
            wx.hideLoading();
            resolve(successImgArr);
          }

        }).catch(function (err) {
          console.log("上传失败", queueIndex, res);

          Common.alert("图片上传失败，请重试！")
          wx.hideLoading();
          reject("上传失败");
        });
      }

      wx.showLoading({
        title: "0/" + imgArrLen
      })

      upImg(_this.data.files[queueIndex]);

    })


  },


  publish: function () {
    var _this = this;

    console.log(this.bizData)

    var content = this.bizData.content;
    if (content == "") {
      console.log(11212);
      console.log(this.showZanToast)
      this.showZanToast('发布内容不能为空',1500);
      // Common.alert("发布内容不能为空");
      return false;
    }

    var address = this.bizData.address;
    if (address == "") {
      this.showZanToast("请选择地址");
      return false;
    }
    var locationArr = [];
    locationArr.push(this.bizData.longitude);
    locationArr.push(this.bizData.latitude);
    var location = locationArr;

    var mobile = this.bizData.mobile;
    if (!/\d{11}/.test(mobile)) {
      this.showZanToast("手机号填写有误");
      return false;
    }

    var tagName = this.bizData.tagName;
    if (tagName == "") {
      this.showZanToast("请选择标签");
      return false;
    }

    var subData = {
      content: content,
      address: address,
      location: location,
      mobile: mobile,
      tagName: tagName,
      imgUrls: []
    }



    this.uploadImages().then(function (res) {

      if (res) {
        subData.imgUrls = res;
      }


      App.ajax({
        debug: false,
        url: "/xxs/publish",
        data: subData,
        header: {},
        method: "POST",
        dataType: "json",
        loading: function () {
          console.log("调用loading...")
          wx.showLoading({
            title: "努力加载中.."
          })

        },
        success: function (res) {
          if (res.code == 200) {
            Common.alert("发布成功");
          } else {
            Common.alert(res.msg || "发布失败，请重试");
          }
        },
        fail: function (err) {
          Common.alert(JSON.stringify(err));
        },
        complete: function (res) {
          console.log(res);
          wx.hideLoading()
        }
      });


      console.log(res);
    }).catch(function (err) {
      console.log(err);
    });


  },


  wxLogin: function () {

    App.ajax({
      debug: false,
      url: "/xxs/publish",
      data: {
        username: "1212212"
      },
      header: {},
      method: "POST",
      dataType: "json",
      loading: function () {
        console.log("调用loading...")
        wx.showLoading({
          title: "努力加载中.."
        })

      },
      success: function (res) {
        console.log("---success----", res);
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