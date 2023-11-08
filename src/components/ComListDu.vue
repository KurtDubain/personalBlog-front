<!-- 文章评论展示小组件 -->
<template>
  <div :class="['list-container',themeClass]">
    <el-item v-for="comment in Object.values(comments)" :key="comment.id" center :timestamp="comment.created_Date" placement="top">
      <div class="comment-card">
        <div class="header-chat">
          <el-icon><User size="large"/></el-icon>
          <div class="comment-info">
            <h2 class="comment-name">{{ comment.name }}</h2>
            <span class="comment-contact">{{ comment.email }}</span>
          </div>
          <!-- 将 likesDu 组件放入 el-card 组件中 -->
          <likesDu :itemId="comment.id" :itemType="'comment'"></likesDu>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
        <h4 class="created-date">{{ comment.created_Date }}</h4>
      </div>
    </el-item>
  </div>
</template>

<script>
import likesDu from './likesDu.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
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
  },
  setup(){
    const store = useStore()
    // 主题处理
    const themeClass = computed(()=>{
      return store.state.theme.isLight?'light-theme':'dark-theme'
    })
    return{
      themeClass
    }
  }
};
</script>

<style lang="scss" scoped>
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
  background-color: #f5f5f5;
  padding: 10px;
}

.header-chat {
  display: flex;
  align-items: center;
}

.el-icon {
  font-size: 24px;
  color: #333;
  margin-right: 10px;
}

.comment-info {
  flex-grow: 1;
}

.comment-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.comment-contact {
  font-size: 14px;
  color: #888;
  margin: 0;
}

.comment-content {
  font-size: 16px;
  line-height: 1.6;
  margin-top: 10px;
  color: #333;
}

.created-date {
  font-size: 14px;
  color: #999;
  margin-top: 10px;
}

.likes-count {
  margin-left: 5px;
}
// 夜间模式处理
.dark-theme {
  .list-container {
    color: #fff; /* 夜间模式下的文字颜色 */
  }

  .comment-card {
    background-color: #1f2937; /* 夜间模式下的评论卡片背景色 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .el-icon {
    color: #fff; /* 夜间模式下的图标颜色 */
  }

  .comment-name {
    color: #fff; /* 夜间模式下的评论者名称颜色 */
  }

  .comment-contact {
    color: #999; /* 夜间模式下的评论者联系方式颜色 */
  }

  .comment-content {
    color: #ccc; /* 夜间模式下的评论内容颜色 */
  }

  .created-date {
    color: #999; /* 夜间模式下的评论日期颜色 */
  }
}
</style>
