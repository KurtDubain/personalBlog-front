// 导入createApp函数用于创建Vue应用实例
import { createApp } from 'vue'

// 导入element Plus样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入element Plus图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入根组件
import App from './App.vue'
// 导入路由实例
import router from './utils/router'

import store from './store'
// 创建Vue实例
const app = createApp(App)

app.use(router)
app.use(store)
// app.use(ElementPlus, { size: 'small' });
// 注册使用element Plus的icon
for(const[key,component] of Object.entries(ElementPlusIconsVue)){
    app.component(key,component)
}
app.use(ElementPlus)
app.mount('#app')
