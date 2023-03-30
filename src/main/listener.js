import { ipcMain, BrowserWindow } from 'electron'
import { join } from 'path'
import http from './utils/http'
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

  ipcMain.handle('on-get-video-page-list', async () => {
    let res = await http.get('https://api.iwara.tv/videos?sort=date&rating=all')
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

  // 加载url
  ipcMain.handle('on-load-url', (e, url) => {
    console.log(url)
    const win = new BrowserWindow({
      width: 1920,
      height: 1080,
      // show: false,
      webPreferences: {
        preload: join(__dirname, '../preload/loadurl.js')
        // 不构建窗口只在内存中进行操作
        // offscreen: true
      }
    })
    win.webContents.openDevTools()

    win.webContents.session.setProxy({
      mode: 'fixed_servers',
      proxyRules: 'http://127.0.0.1:1081'
    })
    win.loadURL(url)

    // 当前页面加载完成
    win.webContents.on('did-finish-load', () => {
      // page-videoList__item
      win.webContents.send('on-did-finish-load')
    })
  })
}
