import { ipcMain } from 'electron'

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
}
