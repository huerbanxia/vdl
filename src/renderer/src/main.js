import { createApp } from 'vue'
import App from './App.vue'

// 它是css样式初始化的插件 避免手动写 margin:0 padding:0 抹平各浏览器的差异
import 'normalize.css'

createApp(App).mount('#app')
