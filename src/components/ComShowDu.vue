<!-- 文章评论发表表单的组件 -->
<template>
  <div class="midForm">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="top">
      <el-form-item label="你的昵称" class="little_text" >
        <el-input v-model="formInline.name" placeholder="昵称" clearable />
      </el-form-item>
      <el-form-item label="联系方式" class="little_text">
        <el-input v-model="formInline.contact" placeholder="邮箱、微信都可" clearable />
      </el-form-item>
      <el-form-item class="big_text">
        <el-input v-model="formInline.content" type="textarea" placeholder="想说点什么呢" clearable />
      </el-form-item>
      <el-form-item class="button_row">
        <el-button type="primary" @click="onSubmit" :disabled="isFormInvalid">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import axios from 'axios'
import EventBus from '../utils/eventBus'

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
    const formInline = reactive({
      name: '',
      contact: '',
      content: ''
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
        formInline.content = ''
        formInline.name = ''
        formInline.contact = ''
        // 使用总线，实现发送一个表单，重新刷新评论表单列表，展示最新数据
        EventBus.emit('NeedRefresh')
      } catch (err) {
        console.error('表单数据提交失败', err)
      }
    }

    return {
      onSubmit,
      formInline,
      isFormInvalid
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
