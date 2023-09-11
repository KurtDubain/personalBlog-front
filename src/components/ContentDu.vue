d<!-- 文章内容组件 -->
<template>
  <div class="article-content">
    <h1>{{ article.title }}</h1>
    
    <!-- 解析的内容 -->
    <div class="markdown-content" v-html="parsedContent"></div>
    
    <div class="metadata">

      <span class="date">{{ article.date }}</span>
      <br><br>
      <span class="views">
      <el-icon><View /></el-icon>
      {{ article.views }}</span>
      <span class="comments">      
        <el-icon><ChatDotSquare /></el-icon>
        {{ article.commentsNum }}
        
      </span>
      <span class="like-button">
          <slot></slot>
        </span>

    </div>
        
  </div>
</template>

<script>
import { marked } from 'marked';
import { computed } from 'vue';

export default {
  name: 'ContentDu',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // 解析文章md格式的文件
    const parsedContent = computed(() => {
      // 判断是否存在，没有该语句会出现无法刷新内容的情况
      if (props.article && props.article.content) {
        return marked(props.article.content);
      }else{
        return '';
      }
    });



    return {
      parsedContent
    };
  }
};
</script>

<style lang="scss" scoped>
.article-content {
  margin: 20px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-width: 100%;
  
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }
  
  .metadata {
    font-size: 14px;
    color: #888;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    
    span {
      margin-right: 10px;
    }
    
    .date, .views, .comments {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: large;
    }
  }
  
  .markdown-content {
    line-height: 1.6;
    font-size: 16px;
    color: #555;
    max-width: 100%; /* 设置最大宽度为100%，防止内容过宽 */
    overflow-wrap: break-word; /* 当内容过长时，自动换行 */
    /* overflow-x: hidden; */
  }
  
  pre {
    overflow-x: auto; /* 设置水平方向的滑动条 */
    background-color: #9d3737; /* 设置代码块背景色 */
    padding: 10px; /* 设置代码块内边距 */
    
    code {
      font-size: 16px;
      background-color: #e36363;
      padding: 8px;
      border-radius: 4px;
    }
  }
}
</style>
