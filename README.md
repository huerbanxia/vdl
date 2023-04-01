# vdl

![](https://img.shields.io/badge/electron-22.3.2-blue)

一个视频下载器

## TODO

- [x] ~~设置窗口圆角 效果不好已放弃~~
- [x] 添加标题栏并设置可拖动
- [x] 添加响应式样式
- [x] 添加路由
- [x] 左侧添加菜单栏
- [x] 最大化按钮失效
- [x] 路由样式设置
- [x] 主要内容区域样式设置
- [x] 安装配置 pinia
- [x] 存储全局应用宽高
- [x] 在组件中使用全局宽高更新布局
- [x] 重设窗口大小功能
- [x] 窗口监听函数防抖动 https://www.lodashjs.com/docs/lodash.debounce
- [x] 解析视频站链接
- [x] 下载源视频
- [x] 下载进度条动态更新
- [x] 全局消息提示函数
- [ ] 加入动画
- [x] 应用关闭后未完全退出（可能是获取下载链接打开的窗口没有关闭导致主进程无法自动关闭）
- [x] 表格数据加载 loading
- [ ] 下载进度条 loading
- [ ] 下载策略 同时下载多个
- [ ] 抽取环境变量
- [ ] 设置信息持久化
- [ ] 预览图展示
- [ ] 搜索功能
- [ ] 自动从浏览器缓存中读取 Token

## 推荐的 IDE 设置

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 项目结构

```text
vdl
├── LICENSE
├── README-zh.md
├── README.md
├── build
│   ├── entitlements.mac.plist
│   ├── icon.icns
│   ├── icon.ico
│   ├── icon.png
│   └── notarize.js
├── dev-app-update.yml					# 更新配置文件
├── electron-builder.yml				# 构建配置文件
├── electron.vite.config.js				# vite及electron相关配置
├── package-lock.json					# 依赖版本控制文件
├── package.json						# 项目信息及依赖信息
├── resources							# 打包资源文件夹
│   └── icon.png
└── src									# 源代码目录
    ├── main							# 主进程
    │   ├── index.js					# 主进程脚本
    │   ├── listener.js					# 主进程ipc相关
    │   └── utils						# 工具包
    │       ├── http.js
    │       ├── task_processor.js
    │       └── worker_pool.js
    ├── preload							# 预加载
    │   ├── index.js					# 主窗口预加载脚本
    │   └── loadurl.js					# 子进程预加载脚本
    └── renderer						# 渲染进程 Vue实现
        ├── index.html
        └── src
            ├── App.vue
            ├── assets
            ├── components
            ├── main.js					# 渲染进程入口
            └── store
```

## 项目安装

`尽量使用npm命令 ，使用pnpm在打包时会出现找不到依赖的问题`

### 安装

```bash
$ npm install
# 使用 pnpm
$ pnpm install
```

### 启动

```bash
$ npm run dev
# 使用 pnpm
$ pnpm run dev
```

### 构建可分发程序

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

获取当前目录树

```shell
# 全局安装 tree-node-cli
npm i tree-node-cli -g
# 在项目目录执行 -L 最大文件层级 -I 忽略的文件
treee -L 4 -I "node_modules|out|dist|.vscode|.git" > ../tree.md
# 查看帮助
treee --help
```
