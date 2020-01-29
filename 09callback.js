/*
因为是setTimeout 中，是全新的调用栈。
在异步任务中抛出的错误，是不会被外面的 trycatch 捕获到。
*/
try {
  interview(function() {
    console.log('smile')
  })
} catch (error) {
  console.log('cry', error)
}

function interview(callback) {
  setTimeout(() => {
    if (Math.random() < 0.1) {
      callback('success')
    } else {
      throw new Error('this is fail')
    }
  }, 500)
}
