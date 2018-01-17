
var fileHost="https://xxs-quanminpian.oss-cn-hangzhou.aliyuncs.com"
var config = {
  //aliyun OSS config
  uploadImageUrl: `${fileHost}`, //默认存在根目录，可根据需求改
  AccessKeySecret: '0GmFVeoMHkfTul0O6cr49RnwHD5Zdu',
  OSSAccessKeyId: 'LTAI5peLb0c1idFb',
  timeout: 87600 //这个是上传文件时Policy的失效时间
};
module.exports = config



// uploadImage(
//     {
//       filePath: filePath,
//       dir: "images/",
//       success: function (res) {
//         console.log("上传成功")
//       },
//       fail: function (res) {
//         console.log("上传失败")
//         console.log(res)
//       }
//     })
    