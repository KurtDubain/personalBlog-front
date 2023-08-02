<!-- 指定留言下的评论卡片组件 -->
<template>
  <div class="comment-list">
    <div v-for="comment in chatCommentInfo" :key="comment.id" class="comment-item">
      <div class="comment-info">
        <span class="comment-username"><el-icon><User /></el-icon>&nbsp;{{ comment.username }}</span>
        <span class="comment-date">{{ comment.date }}</span>
        <likesDu :itemId="comment.id" :itemType="'chatcomment'"></likesDu>

      </div>
      <div class="comment-content">{{ comment.content }}</div>
      

    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import likesDu from './likesDu.vue';
import {useStore} from 'vuex'

export default {
  name: 'ChatCommentDu',
  props: {
    chatId: {
      type: String,
      required: true,
    },
  },
  components:{
    likesDu
  },
  setup() {
    // 集中管理获取指定留言下的评论信息
    const store = useStore()
    const chatCommentInfo = computed(()=> store.state.chats.chatCommentInfo )
    

    return {
      chatCommentInfo
    };
  },
};
</script>

<style scoped>
.comment-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comment-item {
  width: 80%;
  /* max-width: 500px; */
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comment-content {
  font-size: 16px;
  margin-bottom: 10px;
}

.comment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #999;
}

.comment-username {
  font-weight: bold;
  color: #007bff;
  margin-right: 10px;
}

.comment-date {
  color: #999;
}

.comment-actions {
  display: flex;
  align-items: center;
}

.like-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.comment-likes {
  font-size: 14px;
  color: #007bff;
}
</style>
