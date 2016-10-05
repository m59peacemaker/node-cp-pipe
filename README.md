# cp-pipe

Pipe stdout and stderr from child processes without typing as much code.

## install

```sh
npm install cp-pipe
```

## example

Require the module and make some processes:

```js
const cpPipe = require('cp-pipe')

const a = spawnA()
const b = spawnB()
const c = spawnC()
```

```js
cpPipe.chainToProcess([a, b, c])

// vs

a.stdout.pipe(b.stdin)
b.stdout.pipe(c.stdin)
c.stdout.pipe(process.stdout)

a.stderr.pipe(process.stderr)
b.stderr.pipe(process.stderr)
c.stderr.pipe(process.stderr)
```

```js
cpPipe.outIn([a, b, c])

// vs

a.stdout.pipe(b.stdin)
b.stdout.pipe(c.stdin)
```

```js
cpPipe.err([a, b, c])

a.stderr.pipe(process.stderr)
b.stderr.pipe(process.stderr)
c.stderr.pipe(process.stderr)
```

## API

### cpPipe.chainToProcess(processes)

- `processes: []` Array of child processes

Pipes the stdout of a prior process from `processes` into the stdout of the next process, chaining the stdouts/stdins together, pipes the stdout of the last process to `process.stdout`, and pipes the stderrs of all `processes` to `process.stderr`.

### cpPipe.outIn(processes)

- `processes: []` Array of child processes

Pipes the stdout of a prior process from `processes` into the stdout of the next process, chaining the stdouts/stdins together.

### cpPipe.err(processes, destProcess)

Pipes the stderrs of all `processes` to `destProcess.stderr`.
