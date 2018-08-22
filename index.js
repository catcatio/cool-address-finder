const target = process.argv.length > 2 ? process.argv[process.argv.length - 1] : 'CAT'
console.log(target)

const fs = require('fs')
const { Keypair } = require('stellar-sdk')
const prettyHrTime = require('pretty-hrtime')

const startTime = process.hrtime()
const logRate = (count) => console.log(`${count} keys/sec`)
const logKey = (key) => console.log(key.secret(), key.publicKey())
const logTime = (startTime) => console.log(prettyHrTime(process.hrtime(startTime)))
const save = (key) => fs.writeFileSync(`${key.publicKey()}`, key.secret())

let count = 0
let interval = setInterval(() => {
  logRate(count) || (count = 0)
}, 1000)

const find = (coolName) => {
  count++
  let key = Keypair.random()
  let pk = key.publicKey()
  if (pk.endsWith(coolName)) {
    logKey(key)
    save(key)
    logTime(startTime)
    clearInterval(interval)
    return key
  }

  setImmediate(() => { find(coolName) })
  return null
}

setImmediate(() => {
  find(target)
})
