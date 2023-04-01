import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
// elementPlus 按需加载插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

// externalizeDepsPlugin 自动将 main、preload 中的依赖外部化
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
    // build: {
    //   rollupOptions: {
    //     input: {
    //       // 单独配置文件
    //       index: resolve(__dirname, 'src/main/index.js')
    //     }
    //   }
    // }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          // 主进程预加载脚本
          index: resolve(__dirname, 'src/preload/index.js'),
          // 解析下载预加载脚本
          loadurl: resolve(__dirname, 'src/preload/loadurl.js')
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      ElementPlus()
    ]
  }
})
