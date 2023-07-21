import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 页面注册
import Home from './pages/homeDu.vue'
import About from './pages/aboutDu.vue'
import technology from './pages/tecDu.vue'
import pyhcials from './pages/pyhDu.vue'
import community from './pages/commuDu.vue'
import chatMaker from './pages/chatDu.vue'
import read from './pages/readerDu.vue'
import writer from './pages/writeDu.vue'
import chatReader from './pages/chatReaderDu.vue'

import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes =[
    {
        path:'/',
        name:'home',
        component: Home
    },
    {
        path:'/about',
        name:'about',
        component: About
    },
    {
        path:'/technology',
        name:'technology',
        component: technology
    },
    {
        path:'/pyhcials',
        name:'pyhcials',
        component: pyhcials,
        
    },
    {
        path:'/community',
        name:'community',
        component: community,
        
    },
    {
        path:'/chatMaker',
        name:'chatMaker',
        component: chatMaker
    },
    {
        path:'/reader/:articleId',
        name:'read',
        component:read,
        props:true,
        
    },
    {
        // 添加了前置路由守卫，来防止非博主用户使用文章发表功能
        path:'/write',
        name:'write',
        component:writer,
        beforeEnter: (to, from, next) => {
            const Login = localStorage.getItem('rememberedLogin')
            const storedUserInfo = localStorage.getItem('userInfo')
            let username
          if (storedUserInfo) {
            // userInfo.id = JSON.parse(storedUserInfo).id
            username = JSON.parse(storedUserInfo).username
            // userInfo.account = JSON.parse(storedUserInfo).account
            // userInfo.comments = JSON.parse(storedUserInfo).comments
            // userInfo.likes = JSON.parse(storedUserInfo).likes
            // userInfo.level = JSON.parse(storedUserInfo).level
          }
          if(Login&&username==='哈哈'){
            next()
          }else{
            next('/')
          }
        }
    },
    {
        path:'/chatComment/:chatId',
        name:'chatComment',
        component:chatReader,
        props:true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    }

]

const router = createRouter({
    history:createWebHistory(),
    routes
})

const app = createApp(App)

app.use(router)
// app.use(ElementPlus, { size: 'small' });

for(const[key,component] of Object.entries(ElementPlusIconsVue)){
    app.component(key,component)
}
app.use(ElementPlus)
app.mount('#app')
