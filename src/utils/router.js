// 引入 Vue Router 和其他依赖
import { createRouter, createWebHistory } from 'vue-router';
// 页面注册
import Home from '../pages/homeDu.vue'
import About from '../pages/aboutDu.vue'
import technology from '../pages/tecDu.vue'
import pyhcials from '../pages/pyhDu.vue'
import community from '../pages/commuDu.vue'
import chatMaker from '../pages/chatDu.vue'
import read from '../pages/readerDu.vue'
import writer from '../pages/writeDu.vue'
import chatReader from '../pages/chatReaderDu.vue'


// 创建 Vue Router 实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
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
    }  ]
});
/*
// 定义全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查是否记住登录状态
  const rememberedLogin = localStorage.getItem('rememberedLogin');
  const userInfoFromStorage = localStorage.getItem('userInfo');
  
  if (rememberedLogin === 'true' && userInfoFromStorage) {
    const userInfo = JSON.parse(userInfoFromStorage);
    // 更新用户信息
    updateUserInfo(userInfo);
  } else {
    // 清除用户信息
    clearUserInfo();
  }
  
  // 继续导航
  next();
});

// 更新用户信息
const updateUserInfo = (userInfo) => {
  // 更新 Vue 应用的状态
  // 注意：这里需要在 Vue 实例中定义一个 ref 或 reactive 来保存用户信息，并在此处进行更新
  // 例如：
  // const userInfo = reactive({
  //   username: '',
  //   account: '',
  //   likes: 0,
  //   comments: 0,
  //   level: 1,
  //   id: 0
  // });
  // Object.assign(userInfo, userInfo);
};

// 清除用户信息
const clearUserInfo = () => {
  // 清除 Vue 应用的状态
  // 例如：
  // userInfo.username = '';
  // userInfo.account = '';
  // userInfo.likes = 0;
  // userInfo.comments = 0;
  // userInfo.level = 0;
  // userInfo.id = 0;
};

*/

export default router;
