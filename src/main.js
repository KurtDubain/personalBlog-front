import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import Home from './pages/homeDu.vue'
import About from './pages/aboutDu.vue'
import technology from './pages/tecDu.vue'
import pyhcials from './pages/pyhDu.vue'
import community from './pages/commuDu.vue'
import chatMaker from './pages/chatDu.vue'
import read from './pages/readerDu.vue'


import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
        
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

const app = createApp(App)

app.use(router)
app.use(ElementPlus, { size: 'small' });

for(const[key,component] of Object.entries(ElementPlusIconsVue)){
    app.component(key,component)
}
app.use(ElementPlus)
app.mount('#app')
