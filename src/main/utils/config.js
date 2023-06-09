// 配置文件操作
import fs from 'fs'
import { resolve } from 'path'
import yaml from 'js-yaml'

class GlobalConfig {
  constructor() {
    this.configPath = null
    // 根据运行环境选择不同的配置文件路径
    if (import.meta.env.DEV) {
      this.configPath = resolve(__dirname, '../../' + import.meta.env.MAIN_VITE_CONFIG_NAME)
    } else {
      this.configPath = resolve(process.cwd(), import.meta.env.MAIN_VITE_CONFIG_NAME)
    }

    // this.configPath = 'D:/' + import.meta.env.MAIN_VITE_CONFIG_NAME
    this.config = {}
  }

  init() {
    try {
      let file = fs.readFileSync(this.configPath, 'utf8')
      this.config = yaml.load(file)
    } catch (e) {
      // 配置文件不存在
    }
  }

  save(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig
    }
    let yamlStr = yaml.dump(this.config, { sortKeys: true })
    fs.writeFileSync(this.configPath, yamlStr, 'utf8')
  }
}
const globalConfig = new GlobalConfig()
globalConfig.init()

export default globalConfig
