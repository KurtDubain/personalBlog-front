<!-- 文章评论发表表单的组件 -->
<template>
  <div class="midForm">
    <div v-if="!isLog">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="top">
        <el-form-item label="你的昵称" class="little_text" >
          <el-input v-model="formInline.name" placeholder="不能修改(除非联系博主)" clearable />
        </el-form-item>
        <el-form-item label="联系方式" class="little_text">
          
          <el-input v-model="formInline.contact" placeholder="邮箱(唯一凭证)" clearable />
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
          
          <el-button type="primary" @click="onSubmit" :disabled="isFormInvalid">发布</el-button>
          
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <div class="user-info">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>你好 {{ userInfo.username }}</span>
              <el-button class="button" text @click="logout">退出登陆</el-button>
            </div>
          </template>

            <div class="text item">等级：{{ userInfo.level }}</div>
            <el-form-item class="big_text">
              <el-input v-model="formInlineWithLogin.content" type="textarea" placeholder="想说点什么呢" clearable />
            </el-form-item>
            <el-form-item class="button_row">         
              <el-button type="primary" @click="submitWithLogin" :disabled="isFormInvalid">发布</el-button>
            </el-form-item>
            <el-button @click="showUserInfoCard">查看个人信息</el-button>
        </el-card>
      </div>
    </div>
    
  </div>
</template>

<script>
import { reactive, computed,ref,watch } from 'vue'
import axios from 'axios'
import EventBus from '../utils/eventBus'
import { ElMessage,ElMessageBox } from 'element-plus'

export default {
  name: 'ComShowDu',
  props: {
    articleId: {
      type: String,
      required: true
    },
    loadComment: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    // 定义表单内容
    const remBtn = ref(true)
    const isLog = ref(false)
    const formInline = reactive({
      name: '',
      contact: '',
      content: ''
    })
    const formInlineWithLogin = reactive({
      content:'',
    })
    const userInfo = reactive({
      username:'',
      account:''
    })
    // 利用正则表达式判断表单是否为空且是否为正确邮箱格式
    const isFormInvalid = computed(() => {
      return (
        formInline.content.trim() === '' ||
        !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(formInline.contact)
      )
    })
    // 表单提交功能
    const onSubmit = async () => {
      try {
        const formData = {
          articleId: props.articleId,
          content: formInline.content,
          name: formInline.name,
          contact: formInline.contact
        }
        // 将表单内数据由axios发送提交，并由后端补充id、日期等信息
        const res = await axios.post('http://localhost:3000/comments/form', formData)
        console.log('表单数据成功提交', res.data)
        
        // 表单内容清空
        if(remBtn.value){
          isLog.value = true
          const resUser = await axios.get(`http://localhost:3000/users/${formInline.name}`)
          console.log('用户数据成功处理',resUser.data)
          const userInfo = resUser.data
          localStorage.setItem('userInfo',JSON.stringify({
            username:userInfo.username,
            account:userInfo.account,
            comments:userInfo.comments,
            likes:userInfo.likes,
            level:userInfo.level
          }))
          EventBus.emit('NeedRefresh')
          ElMessage.success('评论发表成功')
        }else{
          formInline.content = ''
          formInline.name = ''
          formInline.contact = ''
          // 使用总线，实现发送一个表单，重新刷新评论表单列表，展示最新数据
          EventBus.emit('NeedRefresh')
          ElMessage.success('评论发表成功')
        }
        
      } catch (err) {
        console.error('表单数据提交失败', err)
      }
    }
    // 展示个人信息卡片
    const showUserInfoCard = () => {
      ElMessageBox.alert(`用户名: ${userInfo.username}\n账号: ${userInfo.account}\n被喜欢数:${userInfo.likes}\n回复数:${userInfo.comments}`, '个人信息', {
        confirmButtonText: '确定'
      })
    }

    // 退出登录
    const logout = () => {
      // 清空用户信息
      userInfo.username = ''
      userInfo.account = ''
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
          level:userInfo.level
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

    const submitWithLogin = async () => {
      try {
        // if (!isLog.value) {
        //   // 未登录状态，进行登录操作
        //   const loginData = {
        //     name: formInline.name,
        //     contact: formInline.contact
        //   }
        //   const res = await axios.post('http://localhost:3000/login', loginData)
        //   if (res.data.success) {
        //     // 登录成功，更新用户信息和登录状态
        //     userInfo.username = res.data.username
        //     userInfo.account = res.data.account
        //     isLog.value = true
        //   } else {
        //     // 登录失败，提示错误信息
        //     ElMessage.error(res.data.message)
        //     return
        //   }
        // }

        // 登录状态下提交评论
        const formData = {
          articleId: props.articleId,
          content: formInlineWithLogin.content,
          name: userInfo.username,
          contact: userInfo.account
        }
        const res = await axios.post('http://localhost:3000/comments/form', formData)
        console.log('表单数据成功提交', res.data)
        formInlineWithLogin.contact = ''
        EventBus.emit('NeedRefresh')
        ElMessage.success('评论发表成功')
      } catch (err) {
        console.error('表单数据提交失败', err)
      }
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
      submitWithLogin
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
