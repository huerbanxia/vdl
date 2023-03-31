# vdl

一个视频下载器

## TODO

-   [x] ~~设置窗口圆角 效果不好已放弃~~
-   [x] 添加标题栏并设置可拖动
-   [x] 添加响应式样式
-   [x] 添加路由
-   [x] 左侧添加菜单栏
-   [x] 最大化按钮失效
-   [x] 路由样式设置
-   [x] 主要内容区域样式设置
-   [x] 安装配置pinia
-   [x] 存储全局应用宽高
-   [x] 在组件中使用全局宽高更新布局
-   [x] 重设窗口大小功能
-   [x] 窗口监听函数防抖动 https://www.lodashjs.com/docs/lodash.debounce
-   [x] 解析视频站链接
-   [x] 下载源视频
-   [x] 下载进度条动态更新
-   [ ] 应用关闭后未完全退出
-   [ ] 表格数据加载loading
-   [ ] 下载进度条loading
-   [ ] 下载策略 同时下载多个
-   [ ] 抽取环境变量
-   [ ] 设置信息持久化

## 推荐的 IDE 设置

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 项目结构

```text
.
├──src
│  ├──main				# 主进程代码
│  │  ├──index.ts
│  │  └──...
│  ├──preload			# 预加载脚本
│  │  ├──index.ts
│  │  └──...
│  └──renderer			# 渲染器基于 Vue开发
│     ├──src   			
│     ├──index.html
│     └──...
├──electron.vite.config.ts # vite 相关配置
├──package.json			# 依赖配置 主进程相关的放在dependencies 渲染进程相关放在devDependencies
├──electron-builder.yml	# builder 构建配置
└──...
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



