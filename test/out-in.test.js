const test = require('tape')
const {spawn} = require('child_process')
const {Writable} = require('stream')
const {outIn} = require('../')

test('outIn throws if given less than 2 processes', t => {
  t.plan(1)
  const a = spawn('echo')
  try {
    outIn([a])
    t.fail('did not throw')
  } catch (err) {
    t.pass('threw err: ' + err)
  }
  a.kill()
})

test('outIn pipes a to b', t => {
  t.plan(1)
  const a = spawn('echo', ['hey'])
  const b = spawn('head')
  b.stdout.on('data', data => {
    a.kill()
    b.kill()
    t.equal(String(data), 'hey\n')
  })
  outIn([a, b])
})

test('outIn returns last process', t => {
  t.plan(1)
  const a = spawn('echo', ['hey'])
  const b = spawn('head')
  const ws = Writable()
  ws._write = (chunk, enc, next) => {
    a.kill()
    b.kill()
    ws.end()
    t.equal(String(chunk), 'hey\n')
  }
  outIn([a, b]).stdout.pipe(ws)
})
