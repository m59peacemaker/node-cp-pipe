const test = require('tape')
const {spawn} = require('child_process')
const {Writable} = require('stream')
const {chainToProcess} = require('../')

test('chainToProcess throws if given no processes', t => {
  t.plan(2)
  const a = spawn('echo')
  try {
    chainToProcess()
    t.fail('did not throw')
  } catch (err) {
    t.pass('threw err: ' + err)
  }
  try {
    chainToProcess([])
    t.fail('did not throw')
  } catch (err) {
    t.pass('threw err: ' + err)
  }
  a.kill()
})

test('chainToProcess chains stdouts to process.stdout', t => {
  t.plan(1)
  const a = spawn('echo', ['hey'])
  const b = spawn('head')
  const oldWrite = process.stdout.write
  process.stdout.write = (...args) => {
    process.stdout.write = oldWrite
    t.equal(String(args[0]), 'hey\n')
  }
  chainToProcess([a, b])
})

test('chainToProcess chains stdouts to process.stdout', t => {
  t.plan(1)
  const a = spawn('sleep')
  const b = spawn('head')
  const oldWrite = process.stdout.write
  process.stderr.write = (...args) => {
    process.stderr.write = oldWrite
    t.pass('wrote to process.stderr: ' + String(args[0]))
  }
  chainToProcess([a, b])
})
