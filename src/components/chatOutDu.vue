<template>
  <div class="midForm">
    <!-- 未登录表单样式 -->
    <div v-if="!isLog">
      <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="top">
        <el-form-item label="你的昵称" class="little_text">
          <el-input v-model="formInline.username" placeholder="不能修改(除非联系博主)" clearable />
        </el-form-item>
        <el-form-item label="联系方式" class="little_text">
          <el-input v-model="formInline.account" placeholder="邮箱(唯一凭证)" clearable />
          <el-switch
            v-model="remBtn"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="记住状态"
            inactive-text="忘掉状态"
          />
        </el-form-item>

        <el-form-item class="button_row">
          <el-button type="primary" @click="onSubmit" :disabled="isFormInvalid">登陆</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    </div>
    <!-- 登录之后的表单样式 -->
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
          <br><br>
          <el-form-item class="button_row">
            <el-button type="primary" @click="submitChat">留个言</el-button>
            <chatMakeDu v-if="chatFormVisible" :chatFormVisible="chatFormVisible" @closeForm="closeChatForm" :userInfo="userInfo"></chatMakeDu>
          </el-form-item>
        </el-card>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import { reactive, computed,ref,watch } from 'vue'
  import axios from 'axios'
//   import EventBus from '../utils/eventBus'
  import { ElMessage,ElMessageBox } from 'element-plus'
  import chatMakeDu from './chatMakeDu.vue'
  import DOMPurify from 'dompurify'


  export default {
    name: 'chatOutDu',
    components:{
        chatMakeDu
    },
    props: {
      chatsId: {
        type: String,
        required: true
      }
    },
    setup() {
      // 判断是否记住登陆状态
      const remBtn = ref(true)
      // 判断是否已经登陆
      const isLog = ref(false)
      // 判断发表留言的表单是否可见
      const chatFormVisible = ref(false)
      // 定义表单内容
      const formInline = reactive({
        username: '',
        account: '',
      })
      // 定义用户信息
      const userInfo = reactive({
        username:'',
        account:'',
        likes:0,
        comments:0,
        level:1,
        id :0
      })
      // 利用正则表达式判断表单是否为空且是否为正确邮箱格式
      const isFormInvalid = computed(() => {
        const username = formInline.username.trim()
        const account = formInline.account.trim()
        
        if (username === '' || !isValidUsername(username)) {
          return true;
        }
        if (account === '' || !isValidAccount(account)) {
          return true;
        } 

        return false
      })
      // 用于检验表单内容是否合规
      function isValidUsername(username) {
        const cleanUsername = DOMPurify.sanitize(username);
        return cleanUsername === username;
      }

      function isValidAccount(email) {
        const cleanEmail = DOMPurify.sanitize(email);
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(cleanEmail);
      }

      // 表单提交功能
      const onSubmit = async () => {
        try {
          const formData = {
            username: formInline.username,
            account: formInline.account
          }
          // 将表单内数据由axios发送提交，并由后端补充id、日期等信息
          const res = await axios.post('http://localhost:3000/users/FromChatLogin', formData)
          console.log('表单数据成功提交', res.data)
          
          // 获取用户信息
          const resUser = await axios.get(`http://localhost:3000/users/FromComments/${formInline.username}`)
          const user = resUser.data[0];
            userInfo.id = user.id
            userInfo.username = user.username;
            userInfo.account = user.account;
            userInfo.likes = user.like_count;
            userInfo.comments = user.comment_count;
            userInfo.level = user.level;
            userInfo.created_at = user.created_at

            // 根据是否记住登陆状态，来使用不同方式存储用户信息
          if(remBtn.value){
            isLog.value = true            
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            localStorage.setItem('rememberedLogin','true')
          }else{
            isLog.value = true
            sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
            localStorage.setItem('rememberedLogin','false')

          }
        } catch (err) {
          console.error('表单数据提交失败', err)
          ElMessage.error('您的账户或昵称输入有误')
        }
      }
      // 展示个人信息卡片
      const showUserInfoCard = () => {
        ElMessageBox.alert(`用户id:${userInfo.id}\n用户名: ${userInfo.username}\n账号: ${userInfo.account}\n被喜欢数:${userInfo.likes}\n回复数:${userInfo.comments}`, '个人信息', {
          confirmButtonText: '确定'
        })
      }
  
      // 退出登录
      const logout = () => {
        // 清空用户信息
        userInfo.username = ''
        userInfo.account = ''
        userInfo.likes = 0
        userInfo.comments =0
        userInfo.level = 0
        userInfo.id =0
        // 切换回未登录状态
        isLog.value = false
      }
  
      //确保用户在登录状态下保持登录状态
      const checkRememberedLogin = () => {
        // 检查是否记住登录状态
        // 根据登陆状态来判断用什么方式读取数据
        const rememberedLogin = localStorage.getItem('rememberedLogin')
        const storedUserInfo = rememberedLogin === 'true'?localStorage.getItem('userInfo'):sessionStorage.getItem('userInfo')

        if (storedUserInfo) {
          isLog.value = true
          // 获取用户信息
          userInfo.id = JSON.parse(storedUserInfo).id
          userInfo.username = JSON.parse(storedUserInfo).username
          userInfo.account = JSON.parse(storedUserInfo).account
          userInfo.comments = JSON.parse(storedUserInfo).comments
          userInfo.likes = JSON.parse(storedUserInfo).likes
          userInfo.level = JSON.parse(storedUserInfo).level
          
        }
        
      }
  
      // 监听登录状态的变化
      watch(isLog, (newValue) => {
        if (newValue) {
          // 登录状态，保存用户信息和登录状态
          const storedUserInfo = JSON.stringify({ 
            username: userInfo.username,
            account: userInfo.account,
            likes:userInfo.likes,
            comments:userInfo.comments,
            level:userInfo.level,
            id:userInfo.id
          })
          // 通过判断不同的登录状态来用不同方式获取数据
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
  
      // 初始化检查是否记住登录状态
      checkRememberedLogin()
      
      // 显示留言表单
      const submitChat = async () => {
        try {
          chatFormVisible.value = true
          
        } catch (err) {
          console.error('表单数据提交失败', err)
        }
      }
      // 关闭留言表单
      const closeChatForm = ()=>{
        chatFormVisible.value = false
      }
  
      return {
        onSubmit,
        formInline,
        isFormInvalid,
        remBtn,
        isLog,
        userInfo,
        showUserInfoCard,
        logout,
        submitChat,
        chatFormVisible,
        closeChatForm,
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
  