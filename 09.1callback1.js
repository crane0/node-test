// interview(function (res) {
//   if (res instanceof Error) {
//     return console.log('cry')
//   }
//   console.log('smile')
// })

/* 
如果每次都要判断参数是什么类型，会很麻烦，
所以，node 社区推出了一个规范：回调函数第一个参数是错误。
*/
interview(function (res) {
  if (res) {
    return console.log('cry')
  }
  console.log('smile')
})

function interview(callback) {
  setTimeout(() => {
    if (Math.random() < 0.5) {
      callback(null, 'success')
    } else {
      callback(new Error('this is fail'))
    }
  }, 500)
}
