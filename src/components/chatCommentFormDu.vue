<!-- 指定留言下评论表单的组件 -->
<template>
    <div class="midForm">
      <div v-if="!isLog">
        <el-card>
        <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="top">
          <el-form-item label="你的昵称" class="little_text" >
            <el-input v-model="formInline.username" placeholder="不能修改(除非联系博主)" clearable />
          </el-form-item>
          <el-form-item label="联系方式" class="little_text">
            
            <el-input v-model="formInline.account" placeholder="邮箱(唯一凭证)" clearable />
          </el-form-item>
          <el-form-item class="big_text">
            <el-input v-model="formInline.content" type="textarea" placeholder="想说点什么呢" clearable />
            <el-switch
            v-model="remBtn"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="记住状态"
            inactive-text="忘掉状态"
          />
          </el-form-item>
          <!-- <el-radio :label="3" v-model="remBtn">Option A</el-radio> -->
          
          <el-form-item class="button_row">
            
            <el-button type="primary" @click="throttledOnSubmit" :disabled="isFormInvalid">发布</el-button>
            
          </el-form-item>
        </el-form>
      </el-card>
      </div>
      <div v-else>
        <div class="user-info">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span><el-icon><UserFilled /></el-icon>{{ userInfo.username }}</span>
                <el-button class="button" text @click="logout">退出登陆</el-button>
              </div>
            </template>
  
              <!-- <div class="text item">等级：{{ userInfo.level }}</div> -->
              <el-button @click="showUserInfoCard">查看个人信息</el-button>
              <el-form-item class="big_text">
                <el-input v-model="formInline.content" type="textarea" placeholder="想说点什么呢" clearable />
              </el-form-item>
              <el-form-item class="button_row">         
                <el-button type="primary" @click="throttledOnSubmitWithLogin" :disabled="isFormInvalidSecond">发布</el-button>
              </el-form-item>
              
          </el-card>
        </div>
      </div>
      
    </div>
  </template>
  
  <script>
  import { reactive, computed,ref,watch,onMounted } from 'vue'
  import EventBus from '../utils/eventBus'
  import { ElMessage,ElMessageBox } from 'element-plus'
  import DOMPurify from 'dompurify'
  import {throttle} from 'lodash'
  import { useStore } from 'vuex'

  
  export default {
    name: 'ComShowDu',
    props: {
      chatId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      // 定义按钮以及获取Vuex中的计算数据
      const remBtn = ref(true)
      const store = useStore()
      const userInfo = computed(() => store.getters['users/getUserInfo']);
      const isLog = computed(() => store.getters['users/isLoggedIn']);
      const formInline = reactive({
        username: '',
        account: '',
        content: ''
      })
      // 挂载执行检验用户登陆情况
      onMounted(()=>{
        store.dispatch('users/checkRememberedLogin')
      })
      
      // 判断表单内容是否合规
      const isFormInvalid = computed(() => {
        const username = formInline.username.trim()
        const account = formInline.account.trim()
        const content = formInline.content.trim()
        // 通过使用三个方法分别判断内容是否为空且是否包含恶意脚本，防止XSS注入
        if (username === '' || !isValidUsername(username)) {
          return true;
        }
        if (account === '' || !isValidAccount(account)) {
          return true;
        }
        if (content === '' || !isValidContent(content)) {
          return true;
        }

        return false

      })
      // 定义的三个方法，使用DOMPurify的sanitize方法消除恶意代码进行比较
      function isValidUsername(username) {
        const cleanUsername = DOMPurify.sanitize(username);
        return cleanUsername === username;
      }

      function isValidAccount(email) {
        const cleanEmail = DOMPurify.sanitize(email);
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(cleanEmail);
      }

      function isValidContent(content) {
        const cleanContent = DOMPurify.sanitize(content);
        return cleanContent === content;
      }

      // 对已登录的用户进行内容的检验
      const isFormInvalidSecond = computed(() => {
        const content = formInline.content.trim()
        if(content === '' || !isValidContent){
          return true
        }
        return false
      })
      // 表单提交功能
      const onSubmit = async () => {
        try {
          const formData = {
            chatId: props.chatId,
            content: formInline.content,
            username: formInline.username,
            account: formInline.account
          }
          // 执行表单发送以及用户登陆
          await store.dispatch('users/loginUserFromChats',{formData,remBtn:remBtn.value})

          formInline.content = ''

          
          // 事件总线，刷新评论
          EventBus.emit('NeedRefreshChatComment')
          ElMessage.success('评论发表成功')
        } catch (err) {
          console.error('表单数据提交失败', err)
          ElMessage.error('您的账户或昵称输入有误')
        }
      }
      // 展示个人信息卡片
      const showUserInfoCard = () => {
        ElMessageBox.alert(`用户名: ${userInfo.value.username}\n账号: ${userInfo.value.account}\n被喜欢数:${userInfo.value.likes}\n回复数:${userInfo.value.comments}`, '个人信息', {
          confirmButtonText: '确定'
        })
      }
  
      // 退出登录
      const logout = () => {
        // 清空用户信息
        store.dispatch('users/logoutUser')
      }
  
      
  
      // 监听登录状态的变化
      watch(isLog, (newValue) => {
        if (newValue) {
          // 登录状态，保存用户信息和登录状态
          const storedUserInfo = JSON.stringify({ 
            id:userInfo.value.id,
            username: userInfo.value.username,
            account: userInfo.value.account,
            likes:userInfo.value.likes,
            comments:userInfo.value.comments,
            level:userInfo.value.level
          })
          // 根据用户登陆情况判断以何种方式读取数据
          if(localStorage.getItem('rememberedLogin') === true){
            localStorage.setItem('userInfo', storedUserInfo)
          }else{
            sessionStorage.setItem('userInfo',storedUserInfo)
          }
        } else {
          // 未登录状态，清除保存的用户信息和登录状态
          localStorage.removeItem('userInfo')
          localStorage.removeItem('rememberedLogin')
          sessionStorage.removeItem('userInfo')

        }
      })
  
      
  
      const submitWithLogin = async () => {
        try {
          
          // 登录状态下提交评论
          const formData = {
            chatId: props.chatId,
            content: formInline.content,
            username: userInfo.value.username,
            account: userInfo.value.account
          }
          // 执行表单的发送
          await store.dispatch('users/loginedUserFromChats',{formData})

          formInline.content = ''
          EventBus.emit('NeedRefreshChatComment')
          ElMessage.success('评论发表成功')
        } catch (err) {
          console.error('表单数据提交失败', err)
        }
      }
      // 使用lodash库中的节流，防止多次提交评论表单
      const throttledOnSubmit = throttle(onSubmit, 15000, { leading: true, trailing: false });
      const throttledOnSubmitWithLogin = throttle(submitWithLogin, 15000, { leading: true, trailing: false });



      return {
        onSubmit,
        formInline,
        isFormInvalid,
        remBtn,
        isLog,
        userInfo,
        showUserInfoCard,
        logout,
        submitWithLogin,
        isFormInvalidSecond,
        throttledOnSubmit,
        throttledOnSubmitWithLogin
      }
    }
  }
  </script>
  
  <style scoped>
  .midForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    position: fixed;
  }
  
  .button_row {
    display: flex;
    justify-content: center;
  }
  
  .big_text {
    width: 80%;
  }
  
  .little_text {
    text-align: center;
    justify-content: center;
    width: 80%;
  }
  
  </style>
  