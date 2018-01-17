const core = require('./es6.polyfill.js')

console.info(core)


function noneMethod (obj, method, isStatic = true) {
  if (isStatic) {
    return !obj[method]
  } else {
    return !obj.prototype[method]
  }
}


['Array', 'Object', 'String'].forEach((item) => {
  let obj = core[item]
  let virtual = obj.virtual || {}


  for (let i in obj) {
    if (i === 'virtual') continue

    if (virtual.hasOwnProperty(i)) {
      switch (item) {
        case 'Array':
          if (noneMethod(Array, i, false)) {
            Array.prototype[i] = ['keys', 'values', 'entries'].indexOf(i) === -1 ? virtual[i] : obj[i]
          }
          break
        case 'String':
          if (noneMethod(String, i, false)) {
            String.prototype[i] = virtual[i]
          }
          break
      }
    } else {
     switch (item) {
        case 'Array':
          if (noneMethod(Array, i)) {
            Array[i] = obj[i]
          }
          break
        case 'Object':
          if (noneMethod(Object, i)) {
            Object[i] = obj[i]
          }
          break
      }
    }
  }
})


module.exports = core