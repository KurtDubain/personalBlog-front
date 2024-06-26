<!-- 留言发表表单，包含文字发表和图片上传 -->
<template>
  <el-dialog v-model="dialogVisible" title="发表留言" :close-on-click-modal="false" :lock-scroll="false">
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
        <el-upload class="upload-demo" :action="upLoadUrl" :show-file-list="false" :on-change="fileChange"
          :before-upload="beforeUpload">

          <el-button size="small" type="primary">点击上传</el-button>
          <div class="upload-help">(支持上传图片或视频)</div>
        </el-upload>
      </el-form-item>
      <div v-show="showDownLoad(currentDownLoad)">
        <el-progress :percentage="currentDownLoad" />
      </div>
      <div v-if="form.uploadUrl">
        <img v-if="isImage(form.uploadUrl)" :src="form.uploadUrl" alt="已上传图片" style="max-width:200px;max-height:200px">
        <video v-else :src="form.uploadUrl" controls style="max-width:200px;max-height:200px" preload="none"></video>
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
import { throttle } from 'lodash'
import axios from 'axios';
// import spark from 'spark-md5';
import sparkMD5 from 'spark-md5';
import Compressor from 'compressorjs'

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
    // 定义一个块的大小
    const chunkSize = 2 * 1024 * 1024
    // 定义当前块、总的块数、上传到的序号
    let currentChunk = 0
    let totalChunks = 0
    let uploadChunks = 0
    // 处理当前上传的情况（百分比）
    let currentDownLoad = ref(0)
    // 处理当前上传进度
    let showDownLoad = (currentDownLoad) => {
      if (currentDownLoad === 0 || currentDownLoad === 100) {
        console.log('cuocuo')
        return false
      }
      console.log('the value is', currentDownLoad)
      return true
    }
    // 表单的数据
    const form = ref({
      content: '',
      uploadUrl: null,
      fileType: '',
      filename: ``,
      fileExtension: ''
    });
    const commentForm = ref({});
    // 判断表单是否为空，且是否含有恶意脚本
    const isFormInvalid = computed(() => {
      const content = form.value.content.trim()
      if (content === '' || !isValidContent(content)) {
        return true
      }
      return false
    })
    // 用于检验表单是否存在危险脚本
    function isValidContent(content) {
      const cleanContent = DOMPurify.sanitize(content)
      return cleanContent === content
    }

    // 判断是否上传图片，以及限制上传图片的数量
    const beforeUpload = (file) => {
      if (form.value.uploadUrl) {
        ElMessage.error('最多只能上传一张图片')
        return false
      }
      // console.log(file.type)
      // 判断文件类型
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

      return true;
    };
    // 调用compressorjs库，创建实例来进行文件压缩
    const compressorImage = (file) => {
      return new Promise((resolve, reject) => {
        const isImage = file.type.startsWith('image/');
        // 对于image格式的文件进行压缩，其余不处理
        if (isImage) {
          new Compressor(file, {
            quality: 0.6,
            success(result) {
              resolve(result);
            },
            error(error) {
              console.log('压缩出错', error);
              reject(error);
            }
          });
        } else {
          // 如果不是图片类型，直接返回原文件
          resolve(file);
        }
      });
    };
    // 当文件上传处有了文件进行处理
    const fileChange = async (file) => {
      // 重置分片相关变量
      currentChunk = 0;

      uploadChunks = 0;

      // 对文件进行压缩处理
      const compressedFile = await compressorImage(file.raw);
      // 计算压缩后文件的 MD5 值
      const compressedMD5 = await calculateMD5(compressedFile);
      form.value.filename = compressedMD5

      // 分块计算块的数量
      totalChunks = Math.ceil(compressedFile.size / chunkSize);

      // 开始分片上传
      uploadChunk(compressedFile, currentChunk);
    };

    // 计算文件MD5的函数
    const calculateMD5 = (file, index) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const blob = index !== undefined ? file.slice(index * chunkSize, (index + 1) * chunkSize) : file;

        reader.onload = () => {
          const spark = new sparkMD5.ArrayBuffer();
          spark.append(reader.result);
          const md5 = spark.end();
          resolve(md5);
        };
        reader.onerror = (error) => reject(error);
        if (index !== undefined) {
          reader.readAsArrayBuffer(blob);
        } else {
          reader.readAsArrayBuffer(file);
        }
      });
    };
    // 上传分片操作
    const uploadChunk = async (file, index) => {
      // 分块
      const start = index * chunkSize;
      const end = Math.min((index + 1) * chunkSize, file.size);

      const blob = file.slice(start, end);
      // 设计表单数据
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('index', index);
      formData.append('totalChunks', totalChunks);
      formData.append('filename', form.value.filename)
      formData.append('fileExtension', form.value.fileExtension)
      formData.append('fileType', form.value.fileType)

      // 计算当前分片的 MD5 值
      const chunkMD5 = await calculateMD5(file, index);
      formData.append('fileMD5', chunkMD5);

      // 更新进度条
      currentDownLoad.value = Math.floor(100 * ((index + 1) / totalChunks))

      try {
        if (index === 0) {
          const res = await axios.post('https://www.dyp02.vip:443/backend/chats/uploadChunk', formData)
          // 判断是否需要断点续传
          if (res.data.needUpload) {
            uploadChunks = res.data.uploadedChunks
            currentChunk = uploadChunks
            console.log('触发了断点续传')
          } else if (res.data.message === '成功实现秒传') {
            form.value.uploadUrl = res.data.url
            return
          }
        } else {
          const res = await axios.post('https://www.dyp02.vip:443/backend/chats/uploadChunk', formData)
          if (res.data.isOk) {
            form.value.uploadUrl = res.data.url
          }
        }
        currentChunk++
        // 持续处理分块数据，直到全部上传完毕为止
        if (currentChunk < totalChunks) {
          uploadChunk(file, currentChunk)
        } else {
          console.log(`当前文件全部上传成功!`)
        }

      } catch (error) {
        console.error('Error uploading chunk:', error);
      }
    };




    // // 当成功处理数据的时候，获取返回的图片URL，用于显示
    // const handleUploadSuccess = (response) => {
    //   form.value.uploadUrl = response.imageUrl;
    //   // console.log(form.value.image)
    // };


    // 判断是否是图片数据类型
    const isImage = (url) => {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const extension = url.split('.').pop().toLowerCase();
      return imageExtensions.includes(extension);
    };
    // 判断是否是视频数据类型
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
            username: props.userInfo.username,
            account: props.userInfo.account,
            uid: props.userInfo.id,

          };
          // 处理表单的提交
          await axios.post('https://www.dyp02.vip:443/backend/chats/formUpload', formData);
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
      fileChange,
      currentDownLoad,
      showDownLoad
    };
  }
};
</script>

<style lang="scss">
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

.el-dialog {
  --el-dialog-width: 60%;
}

// 媒体查询处理不同设备的表单大小
@media (max-width:768px) {
  .el-dialog {
    --el-dialog-width: 90%;
  }
}
</style>
