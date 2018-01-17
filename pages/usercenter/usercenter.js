var uploadFile = require("../../util/uploadFile/index.js");

Page({

    authSet: function () {
        console.log(1212);
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
        wx.getUserInfo({
            success: function (res) {
                console.log(res);
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                var gender = userInfo.gender //性别 0：未知、1：男、2：女
                var province = userInfo.province
                var city = userInfo.city
                var country = userInfo.country
            }
        })
    },

    uploadImg: function () {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;

                console.log(res);

                uploadFile({
                    filePath: tempFilePaths[0],
                    dir: "images/",
                    success: function (res) {
                        console.log("上传成功")
                    },
                    fail: function (res) {
                        console.log("上传失败")
                        console.log(res)
                    }
                })
            }
        })
    }

    // userClearStorage: function () {
    //     console.log(1212)
    //     wx.clearStorage();
    // }
})