(async function () {
  try {
    await interview(1)
    await interview(2)
    await interview(3)
    try {
      await Promise.all([
        // catch 中什么都没有执行，则返回值还是 resolved 状态。
        family('father').catch(() => {}),
        family('mother'),
        family('wife'),
      ])
    } catch (e) {
      e.round = 'family'
      throw e
    }
    console.log('smile')
  } catch (error) {
    return console.log('cry at ' + error.round)
  }
})()


// interview(1)
//   .then(() => {
//     return interview(2)
//   })
//   .then(() => {
//     return interview(3)
//   })
//   .then(() => {
//     console.log('smile')
//   })
//   .catch((error) => {
//     console.log('cry at ' + error.round)
//   })

 
/**
 * 进行第 round 轮面试
 */
function interview(round) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        const error = new Error('failed')
        error.round = round
        reject(error)
      } else {
        resolve('success')
      }
    })
  })
}

/**
 * 询问家人意见，是否接受 offer
 */
function family(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        const error = new Error('disagree')
        error.name = name
        reject(error)
      } else {
        resolve('agree')
      }
    }, Math.random() * 400)
  })
}