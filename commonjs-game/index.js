const gameFun = require('./lib')

let count = 0
process.stdin.on('data', e => {
  const playerAction = e.toString().trim()
  const ret = gameFun(playerAction)
  if (ret === -1) {
    count++
  }

  if (count === 3) {
    console.log('电脑说，我输了')
    process.exit()
  }
})