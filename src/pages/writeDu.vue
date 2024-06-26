<!-- 用于博主实现文章发表的页面组件 -->
<template>
  <div class="articleMake">
    <div class="markdown-editor">
      <div class="editor">
        <textarea v-model="MDFile.content" @input="handleInputWithDebounce" placeholder="在此处输入Markdown文本"></textarea>
      </div>
      <div class="preview" v-html="parsedMarkdown"></div>
    </div>
    <div class="upload-section">
      <div class="image-upload">
        <input type="file" accept="image/*" @change="handleImageUpload" ref="imageInput">
        <input v-model="MDFile.imageName" type="text" placeholder="输入照片名称">
        <button @click="uploadImg">上传图片</button>
      </div>
      <div class="upload-result" v-if="uploadStatus !== null">
        <p v-if="uploadStatus === 'success'">上传成功</p>
        <p v-else-if="uploadStatus === 'fail'">上传失败</p>
      </div>
    </div>
    <div class="upload-section">
      <input v-model="MDFile.name" type="text" placeholder="输入文件序号">
      <input v-model="MDFile.title" type="text" placeholder="输入标题">

    </div>
    <!-- 标签选择 -->
    <div class="tags">
      <label>
        <input type="checkbox" v-model="MDFile.tags.tags" value="生活"> 生活
      </label>
      <label>
        <input type="checkbox" v-model="MDFile.tags.tags" value="技术"> 技术
      </label>
      <label>
        <input type="checkbox" v-model="MDFile.tags.tags" value="体育"> 体育
      </label>
    </div>


    <button @click="upMarkDown">上传文章</button>
  </div>
  <div class="announceMake">
    <h2>发布公告</h2>
    <div class="announce-content">
      <textarea v-model="announce.content" placeholder="在此处输入公告内容"></textarea>
      <br>
      <input v-model="announce.author" type="text" placeholder="输入作者名称">
    </div>
    <div class="announce-upload">
      <button @click="upAnnounce">发布公告</button>
    </div>
  </div>
</template>

<script>
import { reactive, computed, ref } from 'vue';
import { marked } from 'marked';
import { ElMessage } from 'element-plus'
import axios from 'axios';
import Compressor from 'compressorjs'

// import { el } from 'element-plus/es/locale';

export default {
  name: 'MarkdownEditor',
  setup() {
    // 定义文章的全部信息，包含图片和文件信息
    let MDFile = reactive({
      content: '',
      name: '',
      imageName: '',
      imageFile: null,
      tags: { tags: [] },
      title: ''
    });
    let announce = reactive({
      content: '',
      author: ''
    })

    const uploadStatus = ref(null);

    // 实时解析Markdown文本并生成HTML
    const parsedMarkdown = computed(() => {
      return marked(MDFile.content);
    });



    // 处理输入事件，更新解析后的Markdown内容
    const handleInput = () => {
      // 在这里可以添加其他处理逻辑，如果需要
    };
    // 调用compressorjs中的方法，创建实例压缩文件
    const compressorImage = (file) => {
      return new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.6,
          success(result) {
            resolve(result)
          },
          error(error) {
            console.log('压缩异常', error)
            reject(error)
          }
        })
      })
    }

    // 上传图片
    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (file) {
        // 先进行压缩处理进行文件添加
        const compressedFile = await compressorImage(file)
        MDFile.imageFile = compressedFile;
      }
    };
    // 以二进制的形式上传图片
    const uploadImg = async () => {
      if (MDFile.imageFile && MDFile.imageName) {
        const formData = new FormData()
        formData.append('image', MDFile.imageFile, MDFile.imageName)
        try {
          const res = await axios.post('https://www.dyp02.vip:443/backend/write/imgUpload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          if (res.status === 200) {
            uploadStatus.value = 'success'
            ElMessage.success(`${MDFile.imageName} 图片上传成功`)
          } else {
            uploadStatus.value = 'fail'
            ElMessage.error('图片上传失败')
          }

        } catch (error) {
          console.error(error);
          uploadStatus.value = 'fail'
          ElMessage.error('图片上传失败')

        }

      } else {
        uploadStatus.value = null;
        ElMessage('请选择图片并输入照片名称');
      }
    };

    // 上传Markdown文件
    // 以Formdata格式上传
    const upMarkDown = async () => {
      if (MDFile.name && MDFile.content && MDFile.tags.tags.length > 0) {
        const formData = new FormData()
        formData.append('name', MDFile.name)
        formData.append('content', MDFile.content)
        formData.append('tags', JSON.stringify(MDFile.tags))
        formData.append('title', MDFile.title)
        try {
          const res = await axios.post('https://www.dyp02.vip:443/backend/write/ContentUpload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          if (res.status === 200) {
            ElMessage.success(`${MDFile.title} 文件上传成功`)
          } else {
            ElMessage.error('文件上传失败')

          }
        } catch (error) {
          console.error(error);
          ElMessage.error('文件上传失败')

        }
      } else {
        ElMessage.error('请不要置空')

      }
    };

    const upAnnounce = async () => {
      if (announce.content && announce.author) {
        try {
          const res = await axios.post('https://www.dyp02.vip:443/backend/announce/PostAnnounceForm', announce)
          if (res.status === 200) {
            ElMessage.success(`公告发表成功`)
            announce.content = ''
            announce.author = ''
          }
        } catch (error) {
          console.log(error);
          ElMessage.error('公告发布失败')
        }
      } else {
        ElMessage.error('请不要置空')
      }
    }
    // 防抖，避免文本输入请求时多次请求
    function debounce(callback, delay) {
      let timeoutId;
      return function () {
        const context = this
        const args = arguments
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          callback.apply(context, args)
        }, delay)
      }
    }
    // 防抖处理input事件
    const debounceHandleInput = debounce(handleInput, 2000)
    const handleInputWithDebounce = () => {
      debounceHandleInput();
    };

    return {
      parsedMarkdown,
      handleInput,
      MDFile,
      uploadStatus,
      handleImageUpload,
      uploadImg,
      upMarkDown,
      handleInputWithDebounce,
      announce,
      upAnnounce
    };
  },
};
</script>

<style scoped lang="scss">
$primary-color: #007bff;
$secondary-color: #ccc;

.articleMake {
  .markdown-editor {
    display: flex;

    .editor,
    .preview {
      flex: 1;
      padding: 10px;
      border: 1px solid $secondary-color;
      border-radius: 5px;
      height: 600px;
      overflow: auto;
    }

    .editor {
      margin-right: 10px;

      textarea {
        width: 100%;
        height: 100%;
        resize: none;
        border: none;
        outline: none;
        font-size: 16px;
        font-family: Arial, sans-serif;
        line-height: 1.5;
        padding: 5px;
      }
    }

    .preview {
      background-color: #f9f9f9;
      font-size: 16px;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }

    h1,
    h2,
    h3 {
      margin: 16px 0;
      font-weight: bold;
    }

    p {
      margin: 8px 0;
    }

    ul,
    ol {
      margin: 8px 0;
      padding-left: 20px;
    }

    li {
      margin: 5px 0;
    }

    a {
      color: $primary-color;
    }

    blockquote {
      border-left: 3px solid $secondary-color;
      padding-left: 10px;
      margin: 8px 0;
    }

    pre {
      background-color: #f1f1f1;
      padding: 5px;
      border-radius: 5px;
      overflow: auto;
    }

    code {
      font-family: Consolas, monospace;
      background-color: #f1f1f1;
      padding: 2px 5px;
      border-radius: 3px;
    }
  }

  .upload-section {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .image-upload {
      input[type="text"] {
        margin-left: 10px;
      }
    }

    .upload-result {
      margin-left: 10px;

      p {
        margin: 5px 0;

        &:last-child {
          color: red;
        }
      }
    }
  }
}

.announceMake {
  h2 {
    font-size: 24px;
    font-weight: bold;
  }

  .announce-content {
    textarea {
      width: 100%;
      height: 100px;
      resize: none;
      border: 1px solid $secondary-color;
      border-radius: 5px;
      padding: 10px;
      font-size: 16px;
      font-family: Arial, sans-serif;
      margin: 10px 0;
    }

    input[type="text"] {
      width: 100%;
      border: 1px solid $secondary-color;
      border-radius: 5px;
      padding: 5px;
      font-size: 16px;
      font-family: Arial, sans-serif;
      margin: 10px 0;
    }
  }

  .announce-upload {
    button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: $primary-color;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
</style>