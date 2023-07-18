<!-- md编辑页面 -->
<template>
  <div class="editor-container">
    <div class="toolbar">
      <button @click="formatText('bold')" :class="{ active: isFormatActive('bold') }">
        <i class="fas fa-bold"></i>
      </button>
      <button @click="formatText('italic')" :class="{ active: isFormatActive('italic') }">
        <i class="fas fa-italic"></i>
      </button>
      <button @click="formatText('underline')" :class="{ active: isFormatActive('underline') }">
        <i class="fas fa-underline"></i>
      </button>
    </div>
    <div class="content">
      <textarea v-model="content" class="editor"></textarea>
      <img v-if="imageUrl" :src="imageUrl" alt="Pasted Image" />
    </div>
    <div class="button-container">
      <button @click="clearContent">Clear</button>
      <button @click="saveContent">Save</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'TextEditor',
  setup() {
    const content = ref('');
    const imageUrl = ref('');

    const clearContent = () => {
      content.value = '';
    };

    const saveContent = () => {
      console.log('保存内容:', content.value);
    };

    const formatText = (format) => {
      document.execCommand(format, false, null);
    };

    const isFormatActive = (format) => {
      return document.queryCommandState(format);
    };

    const handlePaste = (event) => {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (e) => {
            imageUrl.value = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    };

    return {
      content,
      imageUrl,
      clearContent,
      saveContent,
      formatText,
      isFormatActive,
      handlePaste,
    };
  },
};
</script>

<style scoped>
.editor-container {
  width: 600px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.toolbar button {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  padding: 5px;
}

.toolbar button i {
  font-size: 16px;
}

.toolbar button.active {
  background-color: #e6e6e6;
  border-radius: 4px;
}

.content {
  border: 1px solid #ccc;
  padding: 10px;
}

.editor {
  width: 100%;
  height: 200px;
  resize: none;
  border: none;
  outline: none;
}

.button-container {
  margin-top: 10px;
  text-align: center;
}

.button-container button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #007bff;
  border: none;
  color: #fff;
  cursor: pointer;
}

.button-container button + button {
  margin-left: 10px;
}
</style>
