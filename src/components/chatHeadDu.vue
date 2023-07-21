<!-- 指定留言下的留言头部展示 -->
<template>
    <div class="selected-comment">
      <h2 class="comment-username">{{ chatInfo.username }}</h2>
      <p class="comment-content">{{ chatInfo.content }}</p>
      <img v-if="chatInfo.imgUrl" :src="chatInfo.imgUrl" alt="留言图片" class="comment-image" />
      <div class="comment-details">
        <span class="comment-date">发布日期：{{ chatInfo.date }}</span>
        <span class="comment-views">浏览量：{{ chatInfo.views }}</span>
        <span class="comment-reply">回复：{{ chatInfo.reply }}</span>
        <span class="comment-likes">点赞：{{ chatInfo.likes }}</span>
        <button @click="handleLike" class="like-button">{{ isLiked ? '取消点赞' : '点赞' }}</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
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
    setup(){
      // 控制是否Like
      const isLiked = ref(false)
      const handleLike = ()=>{
        isLiked.value = !isLiked.value
      }
      
      return{
        isLiked,
        handleLike
      }
    }
    
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

.comment-details {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
  color: #777;
}

.like-button {
  margin-left: auto;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>