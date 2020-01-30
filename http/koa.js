const fs = require('fs')
const game = require('./game')
const koa = require('koa')
const mount = require('koa-mount')

// 玩家赢的次数 > 3，则后续发送到该服务器的请求，都返回 500
let playerWonCount = 0
// 玩家上一次动作
let playerLastAction = ''
// 玩家连续同一个动作的次数
let sameCount = 0

const app = new koa()

app.use(
  mount('/favicon.ico', function(ctx) {
    /* 
      koa 比 express 做了更极致的 response 处理函数，
      koa 使用异步函数作为中间件的实现方式，
      所以，koa 可以在等待所有的中间件执行完毕后，在统一处理返回值，所以可以使用赋值运算符。
    */
    ctx.status = 200
  })
)

// koa 可以接受 koa 实例，实现多个中间件
const gameKoa = new koa()
app.use(
  mount('/game', gameKoa)
)

gameKoa.use(
  async function(ctx, next) {
    if (playerWonCount >= 3) {
      ctx.status = 500
      ctx.body = '再也不和你玩了'
      return
    }

    // 等待后续的中间件执行完成
    await next()

    // 当后续中间件执行完之后，会执行到这个位置
    if (ctx.playerWon) {
      playerWonCount++
    }
  }
)

gameKoa.use(
  async function (ctx, next) {
    const query = ctx.query
    const playerAction = query.action

    if (!playerAction) {
      ctx.status = 400
      return
    }

    // 这个也进行拆分，功能之间不影响
    if (sameCount === 9) {
      ctx.status = 500
      ctx.body = '再也不和你玩了'
    }

    if (playerLastAction === playerAction) {
      sameCount++
      if (sameCount >= 2) {
        ctx.status = 400
        ctx.body = '你作弊'
        sameCount = 9
        return
      }
    } else {
      sameCount = 0
    }

    playerLastAction = playerAction
    // 挂在 ctx 上，更符合语义
    ctx.playerAction = playerAction
    await next()
  }
)

gameKoa.use(
  async function (ctx) {
    const playerAction = ctx.playerAction
    const gameResult = game(playerAction)

    await new Promise((resolve) => {
      setTimeout(() => {
        ctx.status = 200
        if (gameResult === 0) {
          ctx.body = '平局'
        } else if (gameResult === 1) {
          ctx.body = '你赢了'
          // playerWonCount++ 的操作，放在其他中间件中。
          ctx.playerWon = true
        } else {
          ctx.body = '你输了'
        }
        resolve()
      }, 500)
    })
    
  }
)

app.use(
  mount('/', function (ctx) {
    ctx.body = fs.readFileSync(__dirname + '/index.html', 'utf-8')
  })
)

app.listen(3000)