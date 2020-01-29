module.exports = function (playerAction) {
  var random = Math.random() * 3
  var computerAction = ''

  if (random < 1) {
    computerAction = 'rock'
  } else if (random > 2) {
    computerAction = 'scissor'
  } else {
    computerAction = 'paper'
  }

  if (playerAction === computerAction) {
    console.log('平局')
    return 0
  } else if (
    (computerAction === 'rock' && playerAction === 'paper') ||
    (computerAction === 'scissor' && playerAction === 'rock') ||
    (computerAction === 'paper' && playerAction === 'scissor')
  ) {
    console.log('computerAction:' + computerAction)
    console.log('你赢了')
    return -1
  } else {
    console.log('computerAction:' + computerAction)
    console.log('你输了')
    return 1
  }
}