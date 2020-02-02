const http = require('http')
const fs = require('fs')

http
  .createServer(function(request, response) {
    // 过滤掉
    if (request.url === '/favicon.ico') {
      response.writeHead(200)
      response.end()
      return
    }
    response.writeHead(200)
    // 会直接在页面中显示。
    // res.end('hello')

    // 返回指定文件
    fs.createReadStream(__dirname + '/index.html')
      .pipe(response)
  })
  .listen(3000)