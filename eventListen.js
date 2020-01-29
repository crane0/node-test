const EventEmitter = require('events').EventEmitter

class MyListen extends EventEmitter {
  constructor() {
    super()
    setInterval(() => {
      // 触发事件
      this.emit('newListen', { price: Math.random() * 100 })
    }, 1000)
  }
}

const myListen = new MyListen()

myListen.addListener('newListen', (res) => {
  console.log('监听到了', res)
})