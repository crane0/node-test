const fs = require('fs')
const game = require('./game')
const express = require('express')

// 玩家赢的次数 > 3，则后续发送到该服务器的请求，都返回 500
let playerWonCount = 0
// 玩家上一次动作
let playerLastAction = ''
// 玩家连续同一个动作的次数
let sameCount = 0

const app = express()

app.get('/favicon.ico', function(request, response) {
  // 代替 writeHead(200); end()
  response.status(200)
})

/** 
* 中间件模型，是一个洋葱模型，也是一个完整的事件循环。
* 顶层的中间件，就像洋葱的外皮，逻辑经过洋葱外皮，深入内核，又从另外一边穿出来，返回洋葱的外皮。
* 所以，在执行第一个中间件函数，并调用 next() 后，就会直接跳到下一个中间件函数，
* 直到后续的中间件函数都执行完，就会返回到第一个中间件函数 next() 后面的代码并执行。
*/

app.get('/game', 
  function (request, response, next) {
    if (playerWonCount >= 3 || sameCount === 9) {
      response.status(500)
      response.send('再也不和你玩了')
      return
    }

    // 通过 next 执行后续的中间件
    next()

    // 当后续中间件执行完之后，会执行到这个位置
    if (response.playerWon) {
      playerWonCount++
    }
  },

  function (request, response, next) {
    // express 会自动将 query 处理好挂在 request 上
    const query = request.query
    const playerAction = query.action

    if (!playerAction) {
      response.status(400)
      response.send()
      return
    }

    if (playerLastAction === playerAction) {
      sameCount++
      if (sameCount >= 2) {
        response.status(400)
        response.send('你作弊')
        sameCount = 9 
        return
      }
    } else {
      sameCount = 0
    }

    playerLastAction = playerAction

    // 把玩家操作挂在 response 上传递给下一个中间件
    response.playerAction = playerAction
    next()
  },

  function (request, response) {
    const playerAction = response.playerAction
    const gameResult = game(playerAction)

    /* 
      这里执行 setTimeout，会导致前面的洋葱模型失败。（这也是 express 的缺点之一，对异步的支持不太好）
      因为 setTimeout 是一个新的事件循环，所以在第一个中间件函数中进行判断时，
      拿不到下面赋的值，永远都无法执行 playerWonCount++ 的操作。
    */
    // setTimeout(() => {
      response.status(200)
      if (gameResult === 0) {
        response.send('平局')
      } else if (gameResult === 1) {
        response.send('你赢了')
        // playerWonCount++ 的操作，放在其他中间件中。
        response.playerWon = true
      } else {
        response.send('你输了')
      }
    // }, 500)
  }
)

app.get('/', function (request, response) {
  // express 的 send 接口会判断传入值的类型，文本会处理成 text/html 直接在页面上显示。buffer 会处理为下载。
  // readFileSync要传第二个参数 utf-8，返回的才是字符串。
  response.send(fs.readFileSync(__dirname + '/index.html', 'utf-8'))
})

app.listen(3000)