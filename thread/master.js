const cp = require('child_process')

// 路径是子进程的入口文件，相当于在 node.js 中又跑了一个 node.js 
const child_process = cp.fork(__dirname + '/child.js')

child_process.send('向子进程发送消息')

// 接收子进程的消息
child_process.on('message', (str) => {
  console.log(str)
})