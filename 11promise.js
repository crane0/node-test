const promise = new Promise(function (resolve, reject) {
  setTimeout(() => {
    reject(2)
  }, 500)
}).then(res => {
  console.log(res)
}).catch(res => {
  console.log(res, 'catch')
})

console.log(promise)
setTimeout(() => {
  console.log(promise)
}, 800)