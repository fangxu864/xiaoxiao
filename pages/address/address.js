var App = getApp();
var Common = require("../../util/common.js");
var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.Toast, {

    _isEdit: false,
    _eidtId: "",
    _isSetDefault: false,
    _defalutVal: false,


    data: {
        address: "",
        user_name: "",
        mobile: "",
        code: "",
        id: "",
        isDefault: 0,

        showBottomPopup: false,
        addrArr: [],

    },

    onLoad() {
        this.getAddrData();
    },

    toggleBottomPopup() {
        this.setData({
            showBottomPopup: !this.data.showBottomPopup
        });
    },


    addressBlur: function (e) {
        this.setData({
            address: e.detail.value
        })
    },

    mobileBlur: function (e) {
        this.setData({
            mobile: e.detail.value
        })
    },

    nameBlur: function (e) {
        this.setData({
            user_name: e.detail.value
        })
    },

    codeBlur: function (e) {
        this.setData({
            code: e.detail.value
        })
    },

    setDefault(e) {
        var _this = this;
        var curIndex = e.currentTarget.dataset.index;
        var curData = this.data.addrArr[curIndex];
        this._isEdit = true;
        this._eidtId = curData.id;
        this._isSetDefault = true;

        if (curData.is_default == 1) {
            this._defalutVal = 0;
        } else {
            this._defalutVal = 1;
        }

        this.setData({
            address: curData.address,
            user_name: curData.name,
            mobile: curData.mobile,
            code: curData.code,
            id: curData.id,
            isDefault: curData.is_default
        })
        this.saveAddr();
    },

    /**
     * 编辑地址
     * 
     */
    editAddr(e) {

        var _this = this;
        var curIndex = e.currentTarget.dataset.index;
        var curData = this.data.addrArr[curIndex];
        this._isEdit = true;
        this._eidtId = curData.id;

        this.setData({
            address: curData.address,
            user_name: curData.name,
            mobile: curData.mobile,
            code: curData.code,
            id: curData.id,
            isDefault: curData.is_default
        })
        this.toggleBottomPopup();
    },

    addArr() {

        this._isEdit = false;
        this.setData({
            address: "",
            user_name: "",
            mobile: "",
            code: "",
            id: "",
            isDefault: 0
        })
        this.toggleBottomPopup();
      
    },

    //删除
    deleteAddr(e) {
        console.log(e.currentTarget.dataset.index);
        var _this = this;
        var curId = e.currentTarget.dataset.index;
        App.ajax({
            debug: false,
            url: "/Home/SmallApp/deleteAddress",
            data: {
                id: curId
            },
            header: {},
            method: "POST",
            dataType: "json",
            loading: function () {
                wx.showLoading({
                    title: "删除中.."
                })
            },
            success: function (res) {
                if (res.code == 200) {

                    console.log("sss");

                    for (var i = 0; i < _this.data.addrArr.length; i++) {
                        console.log(_this.data.addrArr[i]);
                        if (_this.data.addrArr[i]["id"] == curId) {
                            _this.data.addrArr.splice(i, 1);
                            break;
                        }
                    }
                    _this.setData({
                        addrArr: _this.data.addrArr
                    })

                } else {
                    Common.alert(res.msg || "删除失败，请重试");
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
                        addrArr: res.data
                    })
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
     * 保存地址
     * 
     */
    saveAddr() {
        var _this = this;
        var params = {};

        
        //如果是编辑
        if (this._isEdit) {
            params["id"] = this._eidtId;
        }

        //第一个添加的设为默认
        if (this.data.addrArr.length == 0) {
            params["isDefault"] = 1;
        } else {
            params["isDefault"] = 0;
        }

        //如果是设为默认
        if (this._isEdit) {
            params["isDefault"] = this._defalutVal;
        }

        //校验姓名
        if (this.data.user_name == "") {
            console.log(4545)
            this.showZanToast("请填写收货人姓名", 1500);
            return false;
        } else {
            params["user_name"] = this.data.user_name;
        }

        //校验手机
        if (!/\d{11}/.test(this.data.mobile)) {
            this.showZanToast("手机号格式错误", 1500);
            return false;
        } else {
            params["mobile"] = this.data.mobile;
        }

        //校验地址
        if (this.data.address == "") {
            this.showZanToast("请填写收货地址", 1500);
            return false;
        } else {
            params["address"] = this.data.address;
        }

        //校验邮编
        if (!/^\d{6}$/.test(this.data.code)) {
            this.showZanToast("邮政编码格式错误", 1500);
            return false;
        } else {
            params["code"] = this.data.code;
        }

        App.ajax({
            debug: false,
            url: "/Home/SmallApp/setAddress",
            data: params,
            header: {},
            method: "POST",
            dataType: "json",
            loading: function () {
                wx.showLoading({
                    title: "保存中.."
                })
            },
            success: function (res) {
                if (res.code == 200) {
                    // Common.alert("保存成功");
                    _this.getAddrData();
                    _this.setData({
                        showBottomPopup: false
                    })
                } else {
                    Common.alert(res.msg || "保存失败");
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