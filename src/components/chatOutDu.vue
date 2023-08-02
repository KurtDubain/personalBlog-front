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
  import { reactive, computed,ref,watch,onMounted } from 'vue'
//   import EventBus from '../utils/eventBus'
  import { ElMessage,ElMessageBox } from 'element-plus'
  import chatMakeDu from './chatMakeDu.vue'
  import DOMPurify from 'dompurify'
  import { useStore } from 'vuex'

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
      // 定义按钮以及其他计算属性
      const store = useStore()
      const remBtn = ref(true)
      const userInfo = computed(() => store.getters['users/getUserInfo']);
      const isLog = computed(() => store.getters['users/isLoggedIn']);
      
      // 判断发表留言的表单是否可见
      const chatFormVisible = ref(false)
      // 定义表单内容
      const formInline = reactive({
        username: '',
        account: '',
      })
      // 挂载检查用户登陆情况
      onMounted(()=>{
        store.dispatch('users/checkRememberedLogin')
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
          // 执行用户登陆操作
          await store.dispatch('users/loginUserWithoutForm',{formData,remBtn:remBtn.value})
        } catch (err) {
          console.error('表单数据提交失败', err)
          ElMessage.error('您的账户或昵称输入有误')
        }
      }
      // 展示个人信息卡片
      const showUserInfoCard = () => {
        ElMessageBox.alert(`用户id:${userInfo.value.id}\n用户名: ${userInfo.value.username}\n账号: ${userInfo.value.account}\n被喜欢数:${userInfo.value.likes}\n回复数:${userInfo.value.comments}`, '个人信息', {
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
            username: userInfo.value.username,
            account: userInfo.value.account,
            likes:userInfo.value.likes,
            comments:userInfo.value.comments,
            level:userInfo.value.level,
            id:userInfo.value.id
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
  