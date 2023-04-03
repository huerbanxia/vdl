import { parentPort } from 'worker_threads'
import fs from 'fs'
import http from './http'
import _ from 'lodash'
import { resolve } from 'path'
import globalConfig from './config'

parentPort.on('message', (task) => {
  let data = task.data
  let filepath = globalConfig.config.savePath ?? __dirname
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath)
  }
  if (data.list?.length !== 0) {
    let video = _.find(data.list, { type: 'Source' })
    if (!video) {
      video = _.find(data.list, { type: '540' })
      if (!video) {
        video = _.find(data.list, { type: '360' })
        if (!video) {
          video = data.list[0]
        }
      }
    }
    http
      .get(video.downloadUrl, {
        responseType: 'stream',
        onDownloadProgress: (progressEvent) => {
          let process = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          // 将下载进度返回给回调函数
          let result = {
            status: true,
            process
          }
          parentPort.postMessage(result)
        }
      })
      .then((res) => {
        const filename =
          data.author + ' - ' + data.title + ' [' + video.type + '] [' + data.id + '].mp4'
        const mypath = resolve(filepath, filename)
        const writer = fs.createWriteStream(mypath)
        res.data.pipe(writer)
      })
      .catch((e) => {
        let result = {
          status: false,
          process
        }
        parentPort.postMessage(result)
        console.log(e)
      })
  } else {
    console.error('未获取到下载数据')
    // 向前端发送消息 获取下载进度失败
    let result = {
      status: false,
      process
    }
    parentPort.postMessage(result)
  }
})
