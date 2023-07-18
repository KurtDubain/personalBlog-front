<!-- 指定留言下的留言头部展示 -->
<template>
    <div class="selected-comment">
      <h2 class="comment-username">{{ chatInfo.username }}</h2>
      <p class="comment-content">{{ chatInfo.content }}</p>
      <img v-if="chatInfo.imgUrl" :src="chatInfo.imgUrl" alt="留言图片" class="comment-image" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'ChatHeadDu',
    props: {
      chatInfo: {
        type: Object,
        default: () => ({}),
      },
    //   chatId: {
    //     type: String,
    //     required: true
    //   }
    },
  };
  </script>
  
  <style scoped>
  .selected-comment {
    width: 80%;
    margin: 20px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .comment-username {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  
  .comment-content {
    font-size: 18px;
    line-height: 1.8;
    text-align: left;
    color: #555;
  }
  
  .comment-image {
    max-width: 100%;
    margin-top: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  