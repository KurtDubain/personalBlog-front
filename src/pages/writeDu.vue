<template>
  <div class="markdown-editor">
    <div class="editor">
      <textarea v-model="MDFile.content" @input="handleInput" placeholder="在此处输入Markdown文本"></textarea>
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
    <button @click="upMarkDown">上传文章</button>
  </div>
</template>

<script>
import { reactive, computed, ref } from 'vue';
import { marked } from 'marked';

export default {
  name: 'MarkdownEditor',
  setup() {
    let MDFile = reactive({
      content: '',
      name: '',
      imageName: '',
      imageFile:null
    });

    const uploadStatus = ref(null);

    // 实时解析Markdown文本并生成HTML
    const parsedMarkdown = computed(() => {
      return marked(MDFile.content);
    });

    // 处理输入事件，更新解析后的Markdown内容
    const handleInput = () => {
      // 在这里可以添加其他处理逻辑，如果需要
    };

    // 上传图片
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        MDFile.imageFile = file;
      }
    };

    const uploadImg = async() => {
      if (MDFile.imageFile && MDFile.imageName) {
        // 模拟上传图片逻辑
        // 这里可以替换成实际的图片上传逻辑，例如使用axios等发送POST请求将MDFile.imageFile上传到服务器
        console.log(MDFile)
        
      } else {
        uploadStatus.value = null;
        console.log('请选择图片并输入照片名称');
      }
    };

    // 上传Markdown文件
    const upMarkDown = () => {
      if (MDFile.name && MDFile.content) {
        // 模拟上传Markdown文件逻辑
        // 这里可以替换成实际的Markdown文件上传逻辑，例如使用axios等发送POST请求将MDFile.content上传到服务器
        console.log('上传Markdown文件', MDFile.name, '内容', MDFile.content);
      } else {
        console.log('请输入文件序号和Markdown内容');
      }
    };

    return {
      parsedMarkdown,
      handleInput,
      MDFile,
      uploadStatus,
      handleImageUpload,
      uploadImg,
      upMarkDown,
    };
  },
};
</script>

<style>
.markdown-editor {
  display: flex;
}

.editor,
.preview {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 300px;
  overflow: auto;
}

.editor {
  margin-right: 10px;
}

.editor textarea {
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

.preview {
  background-color: #f9f9f9;
  font-size: 16px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

/* 添加一些Markdown渲染后的样式 */
.preview h1,
.preview h2,
.preview h3 {
  margin: 16px 0;
  font-weight: bold;
}

.preview p {
  margin: 8px 0;
}

.preview ul,
.preview ol {
  margin: 8px 0;
  padding-left: 20px;
}

.preview li {
  margin: 5px 0;
}

.preview a {
  color: #007bff;
}

.preview blockquote {
  border-left: 3px solid #ccc;
  padding-left: 10px;
  margin: 8px 0;
}

.preview pre {
  background-color: #f1f1f1;
  padding: 5px;
  border-radius: 5px;
  overflow: auto;
}

.preview code {
  font-family: Consolas, monospace;
  background-color: #f1f1f1;
  padding: 2px 5px;
  border-radius: 3px;
}

.upload-section {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.image-upload input[type="text"] {
  margin-left: 10px;
}

.upload-result {
  margin-left: 10px;
}

.upload-result p {
  margin: 5px 0;
  color: green;
}

.upload-result p:last-child {
  color: red;
}
</style>
