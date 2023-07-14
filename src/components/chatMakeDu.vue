<template>
    <el-dialog v-model="dialogVisible" title="发表留言">
      <el-form :model="form" :ref="commentForm" label-position="top">
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" rows="4" placeholder="请输入留言内容"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            action="http://localhost:3000/comments/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button  size="small" type="primary">点击上传图片</el-button>
            <div class="upload-help">支持上传图片文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
import { ElMessage } from 'element-plus';
  
  export default {
    name: 'CommentFormDialog',
    props: {
      userid: {
        type: String,
        required: true
      }
    },
    setup() {
      const dialogVisible = ref(false);
      const form = ref({
        content: '',
        image: null
      });
      const commentForm = ref(null)
  
      const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          ElMessage.error('只能上传图片文件');
        }
        return isImage;
      };
  
      const handleUploadSuccess = (response) => {
        form.value.image = response.data.imageUrl;
      };
  
      const submitForm = async () => {
        const valid = await commentForm.value.validate();
        if (valid) {
          try {
            const formData = {
              content: form.value.content,
              image: form.value.image
            };
            const res = await axios.post('http://localhost:3000/comments/form', formData);
            console.log('表单数据成功提交', res.data);
            dialogVisible.value = false; // 提交成功后关闭弹窗
          } catch (err) {
            console.error('表单数据提交失败', err);
            ElMessage.error('留言发表失败');
          }
        } else {
          ElMessage.error('请正确填写表单内容');
        }
      };
  
      return {
        dialogVisible,
        form,
        beforeUpload,
        handleUploadSuccess,
        submitForm,
        commentForm
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
  </style>
  