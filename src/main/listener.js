import { ipcMain, BrowserWindow, session } from 'electron'
import { join, resolve } from 'path'
import http from './utils/http'
import fs from 'fs'
import _ from 'lodash'
// import createWorker from './utils/worker?nodeWorker'

export default function registerListtener(win) {
  const wc = win.webContents // eslint-disable-line no-unused-vars

  ipcMain.handle('on-set-win-size', (width, height) => {
    if (width && height) {
      console.log()
    } else {
      console.log('重设窗口大小')
      win.resetWindowToDefault()
    }
  })

  ipcMain.handle('on-login', () => {
    const win = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        // 不构建窗口只在内存中进行操作
        session: session.fromPartition('persist:session-iwara') //共享session
      }
    })
    win.webContents.session.setProxy({
      mode: 'fixed_servers',
      proxyRules: 'http://127.0.0.1:1081'
    })
    win.loadURL('https://www.iwara.tv/login')
  })

  ipcMain.handle('on-get-video-page-list', async () => {
    // 获取 token 接口 https://api.iwara.tv/user/token
    // let res = await http.get('https://api.iwara.tv/videos?sort=date&rating=all')
    //
    let res = await http.get('https://api.iwara.tv/videos?page=0&limit=24&subscribed=true')
    // 进行预览图的下载 并将完成后的路径返回

    // createWorker({ workerData: '1111' })
    //   .on('message', (message) => {
    //     console.log(`Message from worker: ${message}`)
    //   })
    //   .postMessage('123')
    // for (let item of res.results) {
    // }

    return res
  })

  ipcMain.handle('on-download-video', (e, data) => {
    data.forEach((item) => {
      // https://www.iwara.tv/video/jUYUofGNEFJTgr/darling-dance-or-ninomae-inanis-pov
      let url = 'https://www.iwara.tv/video/' + item.id + '/' + item.slug
      const win = new BrowserWindow({
        width: 100,
        height: 100,
        show: false,
        webPreferences: {
          preload: join(__dirname, '../preload/loadurl.js'),
          // 不构建窗口只在内存中进行操作
          offscreen: true,
          session: session.fromPartition('persist:session-iwara') //共享session
        }
      })
      win.webContents.openDevTools()

      win.webContents.session.setProxy({
        mode: 'fixed_servers',
        proxyRules: 'http://127.0.0.1:1081'
      })

      win.webContents.on('did-finish-load', () => {
        // page-videoList__item
        setTimeout(() => {
          win.webContents.send('on-did-finish-load', item.id)
        }, 4000)
      })

      win.loadURL(url)

      // 当前页面加载完成
      // http.get('https://api.iwara.tv/video/' + item.id).then((res) => {
      //   console.log(res.fileUrl)
      //   let downloadUrl =
      //     'https://momo.iwara.tv/download?filename=' +
      //     item.fileId +
      //     '_Source.mp4&path=' +
      //     item.createdAt
      //   let temp =
      //     '&' +
      //     res.fileUrl.split('?')[1] +
      //     '&download=Iwara - ' +
      //     item.title +
      //     ' [' +
      //     item.id +
      //     '] [Source].mp4'
      //   console.log(downloadUrl + encodeURI(temp))
      // })
    })
  })

  ipcMain.on('on-return-info-list', (e, data) => {
    let filepath = 'D:\\Download'
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath)
    }
    if (data.list?.length !== 0) {
      let video = _.find(data.list, { type: 'Source' })
      http
        .get(video.downloadUrl, {
          responseType: 'stream',
          onDownloadProgress: (progressEvent) => {
            let process = Math.round((progressEvent.loaded / progressEvent.total) * 100)
            wc.send('update-process', { id: data.id, process: process })
          }
        })
        .then((res) => {
          const mypath = resolve(filepath, '1.mp4')
          const writer = fs.createWriteStream(mypath)
          res.data.pipe(writer)
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      console.error('未获取到下载数据')
    }
  })

  // 加载url
  // ipcMain.handle('on-load-url', (e, url) => {
  //   console.log(url)
  //   const win = new BrowserWindow({
  //     width: 1920,
  //     height: 1080,
  //     // show: false,
  //     webPreferences: {
  //       preload: join(__dirname, '../preload/loadurl.js')
  //       // 不构建窗口只在内存中进行操作
  //       // offscreen: true
  //     }
  //   })
  //   win.webContents.openDevTools()

  //   win.webContents.session.setProxy({
  //     mode: 'fixed_servers',
  //     proxyRules: 'http://127.0.0.1:1081'
  //   })
  //   win.loadURL(url)

  //   // 当前页面加载完成
  //   win.webContents.on('did-finish-load', () => {
  //     // page-videoList__item
  //     win.webContents.send('on-did-finish-load')
  //   })
  // })
}
