let build = require('core-js-builder')
let fs = require('fs')

build({
      modules: [
        'es6.string.includes',
        'es6.string.starts-with',
        'es6.string.ends-with',
        'es6.array.iterator',
        'es7.array.includes',
        'es6.array.find',
        'es6.object.assign',
        'es6.promise',
        'es6.set'
      ],                             // 需要的模块列表 
      library:true,                // 不注入全局变量
      umd: true                     // 支持模块方式引入ES6
}).then((code) => {
  // 打出来的代码写入一个文件
  fs.writeFileSync( __dirname + '/es6.polyfill.js', code, { encoding: 'utf8' })
})
