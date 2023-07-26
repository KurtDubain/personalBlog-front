<template>
  <div class="midForm">
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
      // 定义表单内容
      const remBtn = ref(true)
      const isLog = ref(false)
      const chatFormVisible = ref(false)
      const formInline = reactive({
        username: '',
        account: '',
      })
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
        return (
          !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(formInline.account)
        )
      })
      
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
          
          // 表单内容清空
          if(remBtn.value){
            isLog.value = true
            const resUser = await axios.get(`http://localhost:3000/users/FromComments/${formInline.username}`)
            console.log('记住用户数据成功处理',resUser.data)
            const user = resUser.data[0];
            userInfo.id = user.id
            userInfo.username = user.username;
            userInfo.account = user.account;
            userInfo.likes = user.like_count;
            userInfo.comments = user.comment_count;
            userInfo.level = user.level;
            userInfo.created_at = user.created_at
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
  
          }else{
            isLog.value = true
            const resUser = await axios.get(`http://localhost:3000/users/FromComments/${formInline.username}`)
            console.log('不记住用户数据成功处理',resUser.data)
            const user = resUser.data[0];
            userInfo.id = user.id
            userInfo.username = user.username;
            userInfo.account = user.account;
            userInfo.likes = user.like_count;
            userInfo.comments = user.comment_count;
            userInfo.level = user.level;
            userInfo.created_at = user.created_at
          }
        //   EventBus.emit('NeedRefresh')
        //   ElMessage.success('评论发表成功')
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
        const rememberedLogin = localStorage.getItem('rememberedLogin')
        if (rememberedLogin === 'true') {
          isLog.value = true
          // 获取用户信息
          const storedUserInfo = localStorage.getItem('userInfo')
          if (storedUserInfo) {
            userInfo.id = JSON.parse(storedUserInfo).id
            userInfo.username = JSON.parse(storedUserInfo).username
            userInfo.account = JSON.parse(storedUserInfo).account
            userInfo.comments = JSON.parse(storedUserInfo).comments
            userInfo.likes = JSON.parse(storedUserInfo).likes
            userInfo.level = JSON.parse(storedUserInfo).level
          }
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
          localStorage.setItem('userInfo', storedUserInfo)
          localStorage.setItem('rememberedLogin', remBtn.value.toString())
        } else {
          // 未登录状态，清除保存的用户信息和登录状态
          localStorage.removeItem('userInfo')
          localStorage.removeItem('rememberedLogin')
        }
      })
  
      // 初始化检查是否记住登录状态
      checkRememberedLogin()
  
      const submitChat = async () => {
        try {
          chatFormVisible.value = true
          
        } catch (err) {
          console.error('表单数据提交失败', err)
        }
      }
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
  
  <style scoped>.midForm {
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
  
  .el-button {
    border: none;
    cursor: pointer;
    color: #fff;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 5px;
    transition: 0.2s;
    background-color: #409eff;
  }
  
  .el-button:hover {
    background-color: #66b1ff;
  }
  
  .el-button:active {
    background-color: #3a8ee6;
  }
  
  .el-button[disabled] {
    background-color: #dcdfe6;
    cursor: not-allowed;
  }
  
  </style>
  