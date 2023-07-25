<template>
  <div class="list-container">
    <el-timeline>
      <!-- 同样是利用键值对逐一显示 -->
      <el-timeline-item v-for="comment in Object.values(comments)" :key="comment.id" center :timestamp="comment.created_Date" placement="top">
        <el-card class="comment-card">
          <div class="header-chat">
            <h2 class="comment-name">{{ comment.name }}</h2>
            <!-- 将 likesDu 组件放入 el-card 组件中 -->
            <likesDu :itemId="comment.id" :itemType="'comment'"></likesDu>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import likesDu from './likesDu.vue';
export default {
  name: "ComListDu",
  props: {
    comments: {
      type: Array,
      default: () => [],
      require:true
    }
  },
  components:{
    likesDu
  }
};
</script>

<style scoped>
.list-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  width: 80%;
  padding-top: 5%;
}

.comment-card {
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 15px;
}

.header-chat {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.comment-name {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
}

.comment-contact {
  font-size: 14px;
  color: #999;
}

.comment-content {
  font-size: 16px;
  line-height: 1.6;
  margin-top: 10px;
}
</style>
