const test = require('tape')
const {spawn} = require('child_process')
const {Writable} = require('stream')
const {err: pipeErr} = require('../')

test('cpPipe.err throws if given no processes', t => {
  t.plan(2)
  const a = spawn('echo')
  try {
    pipeErr()
    t.fail('did not throw')
  } catch (err) {
    t.pass('threw err: ' + err)
  }
  try {
    pipeErr([])
    t.fail('did not throw')
  } catch (err) {
    t.pass('threw err: ' + err)
  }
  a.kill()
})

test('cpPipe.err pipes processes stderr to destProcess stderr', t => {
  t.plan(1)
  const a = spawn('yes')
  const b = spawn('sleep')
  const ws = Writable()
  ws._write = (chunk, enc, next) => {
    a.kill()
    b.kill()
    ws.end()
    t.pass(String(chunk))
  }
  const dest = {stdout: Writable(), stderr: ws}
  pipeErr([a, b], dest)
})
