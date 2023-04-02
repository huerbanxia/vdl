import { ipcMain, BrowserWindow, session } from 'electron'
import { join } from 'path'
import http from './utils/http'
import WorkerPool from './utils/worker_pool'
import globalConfig from './utils/config'

const poolSize = globalConfig.config.maxTaskNum ? globalConfig.config.maxTaskNum : 1
const pool = new WorkerPool(poolSize)

// 主进程监听器统一注册
export default function registerListtener(win) {
  const wc = win.webContents

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
        width: 1280,
        height: 720,
        show: false,
        webPreferences: {
          preload: join(__dirname, '../preload/loadurl.js'),
          // 不构建窗口只在内存中进行操作
          offscreen: true,
          session: session.fromPartition('persist:session-iwara') //共享session
        }
      })

      // win.webContents.openDevTools()

      // 判断是否需要代理
      if (globalConfig.config.proxy) {
        let proxy = globalConfig.config.proxy
        let proxyUrl = proxy.protocol + '://' + proxy.host + ':' + proxy.port
        win.webContents.session.setProxy({
          mode: 'fixed_servers',
          proxyRules: proxyUrl
        })
      }
      /**
       * 等待页面基本元素加载完成后
       * 延时等待所有元素加载完成后再进行下载链接的读取
       * 否则读取不到数据
       * 这个可能是i站为放爬取设置了固定的延时
       */
      win.webContents.on('did-finish-load', () => {
        setTimeout(() => {
          win.webContents.send('on-did-finish-load', item)
          // 延时一秒关闭窗口
          setTimeout(() => {
            win.close()
          }, 1000)
        }, 6000)
      })

      win.loadURL(url)

      // 手动拼接下载链接 暂时未成功
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

  // event.sender.send 返回的消息必须用 on 监听
  ipcMain.on('on-return-info-list', (e, data) => {
    e.sender.send('show-msg', 'success', '下载信息解析成功 开始下载')
    console.log('接收到下载信息 开始下载', data.list.length)
    pool.runTask({ data }, (err, result) => {
      let res = {
        id: data.id,
        process: result.process,
        status: result.status
      }
      if (result.status) {
        wc.send('update-process', res)
      } else {
        wc.send('update-process', res)
        e.sender.send('show-msg', 'error', '下载失败')
      }
    })
  })

  ipcMain.handle('on-test-pool', (e, data) => {
    console.log(data)
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
