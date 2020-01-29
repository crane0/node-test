const http = require('http')
const fs = require('fs')
const url = require('url')
const queryString = require('querystring')
const game = require('./14.2game')

// 玩家赢 3 次以后，电脑说，再也不和你玩了
let playerWonCount = 0

// 玩家连续出 3 次相同的操作，电脑说，你作弊
let playerLastAction = ''
let sameCount = 0

http
  .createServer(function (request, response) {
    const parsedUrl = url.parse(request.url)

    if (parsedUrl.pathname === '/favicon.ico') {
      response.writeHead(200)
      response.end()
      return
    }

    if (parsedUrl.pathname === '/game') {
      const query = queryString.parse(parsedUrl.query)
      const playerAction = query.action
      const gameResult = game(playerAction)

      if (playerWonCount >= 3 || sameCount === 9) {
        response.writeHead(500)
        response.end('再也不和你玩了')
        return
      }

      if (playerLastAction === playerAction) {
        sameCount++
      } else {
        sameCount = 0
      }

      playerLastAction = playerAction

      if (sameCount >= 2) {
        response.writeHead(400)
        response.end('你作弊')
        sameCount = 9
        return
      }

      response.writeHead(200)
      if (gameResult === 0) {
        response.end('平局')
      } else if (gameResult === 1) {
        response.end('你赢了')
        playerWonCount++
      } else {
        response.end('你输了')
      }
    }

    if (parsedUrl.pathname === '/') {
      // 返回指定文件
      fs.createReadStream(__dirname + '/14.1index.html')
        .pipe(response)
    }
  })
  .listen(3000)