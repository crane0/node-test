module.exports = function(playerAction) {
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
    return 0
  } else if (
    (computerAction === 'rock' && playerAction === 'paper') ||
    (computerAction === 'scissor' && playerAction === 'rock') ||
    (computerAction === 'paper' && playerAction === 'scissor')
  ) {
    return 1
  } else {
    return -1
  }
}