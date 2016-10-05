const assertValidArg = p => {
  if (!(p.stdout && p.stderr)) {
    throw new Error('Argument does not have stdout and stderr')
  }
}

const assertValidArgs = ps => {
  ps.forEach(p => assertValidArg(p))
}

const assertArgCount = (n, processes) => {
  if (!Array.isArray(processes)) {
    throw new Error('"processes" argument must be an array')
  }
  if (processes.length < n) {
    throw new Error(`At least ${n} process${n === 1 ? ' is' : 'es are'} required`)
  }
}

const outIn = (processes) => {
  return processes.reduce((prev, curr, idx) => {
    prev.stdout.pipe(curr.stdin)
    return curr
  })
}

const err = (processes, destProcess) => {
  processes.forEach(p => p.stderr.pipe(destProcess.stderr))
  return destProcess
}

const outInVerified = (processes) => {
  assertArgCount(2, processes)
  assertValidArgs(processes)
  return outIn(processes)
}

const errVerified = (processes, destProcess) => {
  assertArgCount(1, processes)
  if (!destProcess) {
    throw new Error(`"destProcess" argument is required`)
  }
  assertValidArgs([...processes, destProcess])
  return err(processes, destProcess)
}

const chainToProcess = (processes) => {
  assertArgCount(1, processes)
  assertValidArgs(processes)
  outIn(processes).stdout.pipe(process.stdout)
  err(processes, process)
}

module.exports = {
  outIn: outInVerified,
  err: errVerified,
  chainToProcess
}
