import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import WinStateDefault from 'electron-win-state'

// 不知道为啥需要加个 default
const WinState = WinStateDefault.default

// 状态保存仓库
const winState = new WinState({
  defaultWidth: 1280,
  defaultHeight: 720,
  // 开发环境每次修改立刻存储，而不是在关闭窗口时保存
  dev: is.dev
  // other winState options, see below
})
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // 实际上就是解构出 { width: 1280, height: 720, x: 640, y: 345 }
    ...winState.winOptions,
    // 最小高宽设置
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    // 创建透明窗口、背景色透明、无边框 以便设置圆角效果
    // transparent: true,
    // backgroundColor: '#00000000',
    // frame: false,
    // 隐藏标题栏
    titleBarStyle: 'hidden',
    // 显示标题栏按钮 且支持通过jsApi在渲染进程中进行修改 详见以下链接
    // https://github.com/WICG/window-controls-overlay/blob/main/explainer.md#javascript-apis
    // https://github.com/WICG/window-controls-overlay/blob/main/explainer.md#css-environment-variables
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 39
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 状态管理绑定
  winState.manage(mainWindow)
  mainWindow.resetWindowToDefault()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
