<!-- 指定留言下的评论展示组件 -->
<template>
  <div class="comment-list">
    <div v-for="comment in chatCommentInfo" :key="comment.id" class="comment-item">
      <div class="comment-content">{{ comment.content }}</div>
      <div class="comment-info">
        <span class="comment-username">{{ comment.username }}</span>
        <span class="comment-date">{{ comment.date }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatCommentDu',
  props: {
    chatCommentInfo: {
      type: Array,
      required: true
    },
    chatId: {
      type: String,
      required: true
    }
  },
  setup(props){
    console.log(props.chatCommentInfo)
  }
};
</script>

<style scoped>
.comment-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comment-item {
  width: 80%;
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
  font-size: 12px;
  color: #999;
}

.comment-username {
  font-weight: bold;
  color: #007bff;
}

.comment-date {
  color: #999;
}
</style>
