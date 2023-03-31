import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

// console.log(electronAPI)

// Custom APIs for renderer
const api = {
  // 设置窗口大小
  setWinSize(width, height) {
    ipcRenderer.invoke('on-set-win-size', width, height)
  },
  // 获取视频列表
  async getVideoPageList() {
    let res = ipcRenderer.invoke('on-get-video-page-list', {})
    return res
  },
  // 加载url
  loadUrl(url) {
    ipcRenderer.invoke('on-load-url', url)
  },
  // 下载视频
  downloadVideo(data) {
    ipcRenderer.invoke('on-download-video', data)
  },
  // 更新下载进度条
  updateProcess(callback) {
    ipcRenderer.on('update-process', callback)
  },
  // 手动登录
  login() {
    ipcRenderer.invoke('on-login')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // window.electron = electronAPI
  window.api = api
}
