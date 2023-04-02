import { AsyncResource } from 'async_hooks'
import { EventEmitter } from 'events'
import { resolve } from 'path'
import createWorker from './task_processor?nodeWorker'

const kTaskInfo = Symbol('kTaskInfo')
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent')

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo')
    this.callback = callback
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result)
    this.emitDestroy() // `TaskInfo`s are used only once.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super()
    this.numThreads = numThreads
    this.workers = []
    this.freeWorkers = []
    this.tasks = []

    for (let i = 0; i < numThreads; i++) this.addNewWorker()

    // 每当发出 kWorkerFreedEvent 时，调度队列中待处理的下一个任务（如果有）。
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift()
        this.runTask(task, callback)
      }
    })
  }

  addNewWorker() {
    const worker = new createWorker(resolve(__dirname, 'task_processor.js'))
    worker.on('message', (result) => {
      // 获取到信息后调用回返回信息
      worker[kTaskInfo].callback(null, result)
      // 如果成功：调用传递给`runTask`的回调，删除与Worker关联的`TaskInfo`，并再次将其标记为空闲。
      if (result.process === 100) {
        if (worker[kTaskInfo]) {
          // 此处判断下载完成且worker[kTaskInfo]存在才进行下面的操作
          worker[kTaskInfo].done(null, result)
          worker[kTaskInfo] = null
        }
        this.freeWorkers.push(worker)
        this.emit(kWorkerFreedEvent)
      }
    })
    worker.on('error', (err) => {
      // 如果发生未捕获的异常：调用传递给 `runTask` 并出现错误的回调。
      if (worker[kTaskInfo]) worker[kTaskInfo].done(err, null)
      else this.emit('error', err)
      // 从列表中删除 Worker 并启动一个新的 Worker 来替换当前的 Worker。
      this.workers.splice(this.workers.indexOf(worker), 1)
      this.addNewWorker()
    })
    this.workers.push(worker)
    this.freeWorkers.push(worker)
    this.emit(kWorkerFreedEvent)
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // 没有空闲线程，等待工作线程空闲。
      this.tasks.push({ task, callback })
      return
    }

    const worker = this.freeWorkers.pop()
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback)
    worker.postMessage(task)
  }

  close() {
    for (const worker of this.workers) worker.terminate()
  }
}

export default WorkerPool
