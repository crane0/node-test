const glob = require('glob')

let result
// 同步
// console.time('glob')
// result = glob.sync(__dirname + '**/*')
// console.timeEnd('glob')
// console.log(result)

// 异步
console.time('glob')
glob(__dirname + '**/*', function(err, res){
  result = res
  console.log('异步')
})
console.timeEnd('glob')
console.log(1 + 1)