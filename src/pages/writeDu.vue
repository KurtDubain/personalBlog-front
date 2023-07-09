<!-- <template>
    <div>
      <h1>写博客</h1>
      <input v-model="title" placeholder="请输入标题" />
      <quill-editor v-model="content" :options="editorOptions"></quill-editor>
      <button @click="publishArticle">发布</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  
  export default {
    name: 'WriteArticle',
    setup() {
      const title = ref('');
      const content = ref('');
      const editorOptions = {
        placeholder: '请输入博客内容',
      };
  
      const publishArticle = () => {
        // 在这里可以将标题和内容提交到服务器
        console.log('发布文章', title.value, content.value);
      };
  
      // 在组件挂载后初始化Quill编辑器
      onMounted(() => {
        import('vue-quill-editor').then((module) => {
          const { quillEditor } = module.default;
          quillEditor.register();
        });
      });
  
      return {
        title,
        content,
        editorOptions,
        publishArticle,
      };
    },
  };
  </script>
  
  <style>
  /* 样式可以根据需要进行自定义 */
  </style>
   -->
   <template>
     <div></div>
   </template>
   
   <script>
   export default {
   
   }
   </script>
   
   <style>
   
   </style>