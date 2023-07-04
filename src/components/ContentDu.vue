<template>
    <div class="article-content" >
      <h1>{{ article.title }}</h1>
      <div class="markdown-content" v-html="parsedContent"></div>
      <div class="metadata">
        <span class="date">{{ article.date }}</span>
        <span class="views">{{ article.views }}</span>
        <span class="likes">{{ article.likes }}</span>
        <span class="comments">{{ article.commentsNum }}</span>
      </div>
      
    </div>
  </template>
  
  <script>
  import {marked} from 'marked';
  import {computed} from 'vue'
  
  export default {
    name: 'ContentDu',
    props: {
      article: {
        type: Object,
        required: true
      }
    },
    setup(props) {

    // console.log('哈哈',props.article)
    const parsedContent = computed(() =>{

      if (props.article && props.article.content) {
        return marked(props.article.content);
      }
      return '';

    })


    // watch(
    // () => props.article,(newArticle) => {
    //   if (newArticle && newArticle.content && newArticle.title && newArticle.date && newArticle.views && newArticle.likes && newArticle.commentsNum) {
    //       const {
    //         title,
    //         date,
    //         views,
    //         likes,
    //         commentsNum,
    //         content
    //       } = newArticle;

    //       Object.assign(SingleArticle, {
    //         title,
    //         date,
    //         views,
    //         likes,
    //         commentsNum,
    //         content
    //       });
    //     }

    // },
    
    // { immediate: true });

  // // 使用 toRefs 将 SingleArticle 转换为响应式引用对象
  // const { ...refSingleArticle } = toRefs(SingleArticle);



        return {
            
            parsedContent
        };
  }
  };
  </script>
  
  <style scoped>

.article-content {
  margin: 20px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.metadata {
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
}

.markdown-content {
  line-height: 1.6;
  font-size: 16px;
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

  