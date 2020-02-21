const cluster = require('cluster')
// 可以获取当前计算机有几个核
const os = require('os')

if (cluster.isMaster) {
  // 因为本来就有一些 CPU 用于处理事件循环中任务而存在的，如果将这些 CPU 占满了，反而会让这些事件得不到处理。
  // 而且每次 fork 进程，都是将 node.js 复制了一遍，内存空间也都复制了一遍，会造成成倍的内存消耗，
  // 所以，没有必要 fork 出这么多子进程。 一般 i < os.cpus().length/2 或更少。
  // 这里 i < 1 为了更好的做压测。
  for (let i = 0; i < 1; i++) {
    const worker = cluster.fork()
    let missedPing = 0
    let interval = setInterval(() => {
      console.log('ping')
      // 主进程每隔 1s 向启动后的子进程发送 'ping'，计算+1，
      worker.send('ping')
      missedPing++

      if (missedPing >= 3) {
        clearInterval(interval)
        process.kill(worker.process.pid)
      }
    }, 1000);

    // 并且，主进程监听子进程发送的消息，如果收到 'pong'，计数-1，
    worker.on('message', (msg) => {
      if (msg == 'pong') {
        console.log('pong')
        missedPing--
      }
    })
  }

  // 监听子进程的退出，重新 fork 一个新的子进程。
  cluster.on('exit', () => {
    // 如果子进程的错误时不停发生的，就会导致这里一直在创建新的进程，就会消耗大量的 CPU，
    // 所以，有个延迟会稍微好一点。
    setTimeout(() => {
      cluster.fork()
    }, 5000)
  })
} else {
  require('./app')

  // 子进程监听主进程发送的消息，如果收到了 'ping'，就向主进程发送 'pong'，
  process.on('message', (str) => {
    if (str == 'ping') {
      process.send('pong')
    }
  })

  // 监听无法自动捕捉到的错误，手动处理后退出。
  process.on('uncaughtException', (err) => {
    console.error(err)
    process.exit(1)
  })

  // 内存泄漏监控，会导致在老生代内存区产生大量的遍历时间，导致服务器越来越慢
  // 所以，可以监控进程的内存使用情况
  setInterval(() => {
    console.log(process.memoryUsage().rss)
    if (process.memoryUsage().rss > 734003200) {
      console.log('oom')
      process.exit(1)
    }
  }, 5000);
}