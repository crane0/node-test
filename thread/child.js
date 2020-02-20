// 接收父进程的消息
process.on('message', (str) => {
  console.log(str)

  // 向父进程发送的消息
  process.send('向父进程发送的消息')
})