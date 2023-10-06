<!-- 留言发表表单，包含文字发表和图片上传 -->
<template>
  <el-dialog v-model="dialogVisible" title="发表留言" :close-on-click-modal="false">
    <el-form :model="form" ref="commentForm" label-position="top">
      <el-form-item label="内容">
        <el-input v-model="form.content" type="textarea" rows="4" placeholder="请输入留言内容"></el-input>
      </el-form-item>
      <el-form-item label="图片或视频">
        <!-- <el-upload
          class="upload-demo"
          :action="upLoadUrl"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        > -->
        <el-upload
          class="upload-demo"
          :action="upLoadUrl"
          :show-file-list="false"
          :on-change="fileChange"
          :before-upload="beforeUpload"
        >
          
          <el-button size="small" type="primary">点击上传</el-button>
          <div class="upload-help">(支持上传图片或视频)</div>
        </el-upload>
      </el-form-item>
      <div v-if="form.uploadUrl">
        <img v-if="isImage(form.uploadUrl)" :src="form.uploadUrl" alt="已上传图片" style="max-width:200px;max-height:200px">
        <video v-else :src="form.uploadUrl" controls style="max-width:200px;max-height:200px"></video>
        (最多上传一张照片或一个视频)
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
import { throttle} from 'lodash'
import axios from 'axios';
// import spark from 'spark-md5';
import sparkMD5 from 'spark-md5';

export default {
  name: 'CommentFormDialog',
  props: {
    userInfo: {
      type: Object,
      required: true
    },
  },
  // 添加了一个子传父的组件，用于控制表单的显示与关闭
  emits: ['closeForm'],
  setup(props, { emit }) {
    // 定义表单是否显示
    const dialogVisible = ref(true);
    const chunkSize = 2*1024*1024
    const chunks = ref([])
    let totalChunks = 0
    // let fileMD5 = ref('')
    const form = ref({
      content: '',
      uploadUrl: null,
      fileType:'',
      filename:``,
      fileExtension:''
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
      if(form.value.uploadUrl){
        ElMessage.error('最多只能上传一张图片')
        return false
      }
      // console.log(file.type)
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/')
      form.value.fileType = isImage ? 'image' : 'video';
      if (isImage) {
        form.value.fileType = 'image';
        form.value.fileExtension = file.type.split('/')[1]; // 获取具体的扩展名
      } else if (isVideo) {
        form.value.fileType = 'video';
        form.value.fileExtension = file.type.split('/')[1]; // 获取具体的扩展名
      }


      if (!isImage && !isVideo) {
        ElMessage.error('只能上传图片或视频文件');
        return false
      }
      if(isImage||isVideo){
        totalChunks = Math.ceil(file.size / chunkSize);
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min((i + 1) * chunkSize, file.size);
          const chunk = file.slice(start, end);
          chunks.value.push(chunk);
        } 
        
      }
      
      return true;
    };
    
    const fileChange = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const sparkFile = new sparkMD5.ArrayBuffer();
        sparkFile.append(e.target.result);
        const md5 = sparkFile.end(); // 获取文件的 MD5 值
        form.value.filename = md5; // 将文件名设置为 MD5 值

        if (chunks.value.length > 0) {
          uploadChunks();
        }
      };

      reader.readAsArrayBuffer(file.raw);
    };
    const uploadChunks = async () => {
      try {
        for (let i = 0; i < chunks.value.length; i++) {
          const chunk = chunks.value[i];
          const formData = new FormData();
          const spark = new sparkMD5.ArrayBuffer();
          spark.append(chunk);
          formData.append('file', chunk);
          formData.append('totalChunks', totalChunks);
          formData.append('chunkIndex', i + 1);
          formData.append('fileMD5', spark.end());
          formData.append('fileType', form.value.fileType);
          formData.append('filename', form.value.filename);
          formData.append('fileExtension', form.value.fileExtension);
          
          try {
            
            const res = await axios.post('http://localhost:3000/chats/uploadChunk', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            if (!res.data.success) {
              console.error('分片上传失败', res.data.message);
              return; // 上传失败，结束上传流程
            }
          } catch (error) {
            console.error('分片上传异常', error);
            return; // 上传异常，结束上传流程
          }
        }

        // 所有分片上传完成
        chunks.value = [];
      } catch (error) {
        console.error('分片上传异常', error);
      }
    };

    // const MAX_CONCURRENT_UPLOADS = 3; // 最大并发上传数量
    // let concurrentUploads = 0; // 当前并发上传数量

    // const uploadChunks = async () => {
    //   try {
    //     const uploadPromises = chunks.value.map(async (chunk, i) => {
    //       if (concurrentUploads >= MAX_CONCURRENT_UPLOADS) {
    //         // 达到最大并发上传数量，等待一段时间再继续上传
    //         await new Promise(resolve => setTimeout(resolve, 100));
    //       }

    //       concurrentUploads++; // 增加并发上传数量

    //       try {
    //         const formData = new FormData();
    //         const spark = new sparkMD5.ArrayBuffer();
    //         spark.append(chunk);
    //         formData.append('file', chunk);
    //         formData.append('totalChunks', totalChunks);
    //         formData.append('chunkIndex', i + 1);
    //         formData.append('fileMD5', spark.end());
    //         formData.append('fileType', form.value.fileType);
    //         formData.append('filename', form.value.filename);
    //         formData.append('fileExtension', form.value.fileExtension);

    //         const res = await axios.post('http://localhost:3000/chats/uploadChunk', formData, {
    //           headers: {
    //             'Content-Type': 'multipart/form-data'
    //           }
    //         });

    //         if (!res.data.success) {
    //           console.error('分片上传失败', res.data.message);
    //         }
    //       } finally {
    //         concurrentUploads--; // 完成上传，减少并发上传数量
    //       }
    //     });

    //     await Promise.all(uploadPromises);
    //     chunks.value = [];
    //   } catch (error) {
    //     console.error('分片异常', error);
    //   }
    // };
    


    // // 当成功处理数据的时候，获取返回的图片URL，用于显示
    // const handleUploadSuccess = (response) => {
    //   form.value.uploadUrl = response.imageUrl;
    //   // console.log(form.value.image)
    // };
      
    

    const isImage = (url) => {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const extension = url.split('.').pop().toLowerCase();
      return imageExtensions.includes(extension);
    };

    const isVideo = (url) => {
      const videoExtensions = ['mp4'];
      const extension = url.split('.').pop().toLowerCase();
      return videoExtensions.includes(extension);
    };

    // 提交表单，包含用户信息、评论内容以及图片信息
    const submitForm = async () => {
      const valid = await commentForm.value?.validate();
      if (valid) {
        try {
          const formData = {
            content: form.value.content,
            image: form.value.uploadUrl,
            username:props.userInfo.username,
            account:props.userInfo.account,
            uid:props.userInfo.id,

          };
          // 处理表单的提交
          await axios.post('http://localhost:3000/chats/formUpload', formData);
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
    const throttledSubmitForm = throttle(submitForm, 15, { leading: true, trailing: false });


    // 关闭表单，触发父组件事件
    const ChatFormClose = () => {
      emit('closeForm');
    };

    return {
      ChatFormClose,
      form,
      beforeUpload,
      // handleUploadSuccess,
      submitForm,
      commentForm,
      dialogVisible,
      isFormInvalid,
      throttledSubmitForm,
      isVideo,
      isImage,
      uploadChunks,
      fileChange
    };
  }
};
</script>

<style lang="scss" scoped>
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
