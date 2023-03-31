import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// console.log(electronAPI)

// Custom APIs for renderer
const api = {
  // 设置窗口大小
  setWinSize(width, height) {
    ipcRenderer.invoke('on-set-win-size', width, height)
  },
  async getVideoPageList() {
    let res = ipcRenderer.invoke('on-get-video-page-list', {})
    return res
  },
  loadUrl(url) {
    ipcRenderer.invoke('on-load-url', url)
  },
  downloadVideo(data) {
    ipcRenderer.invoke('on-download-video', data)
  },
  updateProcess(callback) {
    ipcRenderer.on('update-process', callback)
  },
  login() {
    ipcRenderer.invoke('on-login')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
