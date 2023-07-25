<!-- 文章内容组件 -->
<template>
  <div class="article-content">
    <h1>{{ article.title }}</h1>
    
    <!-- 解析的内容 -->
    <div class="markdown-content" v-html="parsedContent"></div>

    <div class="metadata">
      <!-- 文章直接可用的数据 -->
      <span class="date">{{ article.date }}</span>
      <span class="views">{{ article.views }}</span>
      <span class="comments">{{ article.commentsNum }}</span>
      
    </div>
        <slot></slot>
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
      }
      return '';
    });

    return {
      parsedContent
    };
  }
};
</script>

<style scoped>
.article-content {
  margin: 20px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

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
}

.markdown-content {
  line-height: 1.6;
  font-size: 16px;
  color: #555;
}

.metadata span {
  margin-right: 10px;
}

.date::before {
  content: "日期：";
}

.views::before {
  content: "阅读量：";
}

.likes::before {
  content: "点赞数：";
}

.comments::before {
  content: "评论数：";
}
</style>
