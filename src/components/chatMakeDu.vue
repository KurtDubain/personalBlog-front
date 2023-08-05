<!-- 留言发表表单，包含文字发表和图片上传 -->
<template>
  <el-dialog v-model="dialogVisible" title="发表留言" :close-on-click-modal="false">
    <el-form :model="form" ref="commentForm" label-position="top">
      <el-form-item label="内容">
        <el-input v-model="form.content" type="textarea" rows="4" placeholder="请输入留言内容"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          class="upload-demo"
          action="http://www.dyp02.vip:3000/chats/imageUpload"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          
          <el-button size="small" type="primary">点击上传图片</el-button>
          <div class="upload-help">(支持上传图片文件)</div>
        </el-upload>
      </el-form-item>
      <div v-if="form.image">
        <img :src="form.image" alt="已上传图片" style="max-width:200px;max-height:200px">
        (最多上传一张照片)
      </div>

    </el-form>
    <template #footer>
      <el-button @click="ChatFormClose">取消</el-button>
      <el-button type="primary" @click="throttledSubmitForm" :disabled="isFormInvalid">提交</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import EventBus from '@/utils/eventBus';
import DOMPurify from 'dompurify'
import {throttle} from 'lodash'
import axios from 'axios';

export default {
  name: 'CommentFormDialog',
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    // chatFormVisible:{
    //   type:Boolean,
    //   required:true
    // }
  },
  // 添加了一个子传父的组件，用于控制表单的显示与关闭
  emits: ['closeForm'],
  setup(props, { emit }) {
    // 定义表单是否显示
    const dialogVisible = ref(true);
    const form = ref({
      content: '',
      image: null,
    });
    const commentForm = ref({});
    // 判断表单是否为空，且是否含有恶意脚本
    const isFormInvalid = computed(()=>{
      const content = form.value.content.trim()
      if(content === ''|| !isValidContent(content)){
        return true
      }
      return false
    })
    // 用于检验表单是否存在危险脚本
    function isValidContent(content){
      const cleanContent = DOMPurify.sanitize(content)
      return cleanContent === content
    }

    // 判断是否上传图片，以及限制上传图片的数量
    const beforeUpload = (file) => {
      if(form.value.image){
        ElMessage.error('最多只能上传一张图片')
        return false
      }

      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        ElMessage.error('只能上传图片文件');
      }
      return isImage;
    };
    // 当成功处理数据的时候，获取返回的图片URL，用于显示
    const handleUploadSuccess = (response) => {
      form.value.image = response.imageUrl;
      // console.log(form.value.image)
    };
    // 提交表单，包含用户信息、评论内容以及图片信息
    const submitForm = async () => {
      const valid = await commentForm.value?.validate();
      if (valid) {
        try {
          const formData = {
            content: form.value.content,
            image: form.value.image,
            username:props.userInfo.username,
            account:props.userInfo.account,
            uid:props.userInfo.id,

          };
          // 处理表单的提交
          await axios.post('http://www.dyp02.vip:3000/chats/formUpload', formData);
          // props.chatFormVisible.value=false
          // 刷新评论区
          EventBus.emit('NeedRefreshChats')
          // 触发父事件，关闭当前表单栏
          emit('closeForm');
          // dialogVisible.value = false; // 提交成功后关闭弹窗
        } catch (err) {
          console.error('表单数据提交失败', err);
          ElMessage.error('留言发表失败');
        }
      } else {
        ElMessage.error('请正确填写表单内容');
      }
    };
    // 节流控制发表频率
    const throttledSubmitForm = throttle(submitForm, 15000, { leading: true, trailing: false });


    // 关闭表单，触发父组件事件
    const ChatFormClose = () => {
      emit('closeForm');
    };

    return {
      ChatFormClose,
      form,
      beforeUpload,
      handleUploadSuccess,
      submitForm,
      commentForm,
      dialogVisible,
      isFormInvalid,
      throttledSubmitForm
    };
  }
};
</script>

<style scoped>
.upload-demo {
  margin-top: 10px;
}

.upload-help {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}

/* 样式调整部分 */
.el-dialog__body {
  padding: 20px;
}

.el-dialog__footer {
  padding: 10px 20px;
  text-align: right;
}

.el-button {
  margin-right: 10px;
}
</style>
