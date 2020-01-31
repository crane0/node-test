const net = require('net')

const socket = new net.Socket({})

socket.connect({
  host: '127.0.0.1',
  port: 4000
})

const lessonids = [
  "136797",
  "136798",
  "136799",
  "136800",
  "136801",
  "136803",
  "136804",
  "136806",
  "136807",
  "136808",
  "136809",
  "141994",
  "143517",
  "143557",
  "143564",
  "143644",
  "146470",
  "146569",
  "146582"
]

// 监听接收的服务端数据
socket.on('data', buffer => {
  // 全：取出对应的 buffer
  const seqBuffer = buffer.slice(0, 2)
  const titleBuffer = buffer.slice(2)
  console.log(seqBuffer.readInt16BE(), titleBuffer.toString())

  // 接收到数据之后，按照半双工通信的逻辑，马上开始下一次请求
  id = Math.floor(Math.random() * lessonids.length)
  socket.write(encode(id))
})

let seq = 0
function encode(index) {
  // 全：扩大长度，并在前两位写入，lessonid 就要从 2 位置写入
  let buffer = Buffer.alloc(6)
  buffer.writeInt16BE(seq)
  // 在第 2 位写，是因为 seq 占了两位。
  buffer.writeInt32BE(lessonids[index], 2)

  console.log(seq, lessonids[index])
  seq++

  return buffer
}

// 往服务器传数据，server 设置为不同的时间间隔返回，就可以模拟出服务端数据未返回时，又再次请求。
setInterval(() => {
  let id = Math.floor(Math.random() * lessonids.length)
  socket.write(encode(id))
}, 50);
