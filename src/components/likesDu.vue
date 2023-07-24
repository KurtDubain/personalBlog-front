<template>
    <button class="like-btn" @click="toggleLike" type="button"> 
      <span v-if="liked">
        <div class="like-pos">
            <el-icon>  <Star color="rgb(255, 132, 0)" /></el-icon>
        </div>
        
        <!-- <el-icon><Star /></el-icon> -->
        <!-- 取消点赞 -->
      </span>
      <span v-else>
        <div class="like-pos">
            <el-icon><StarFilled color="rgb(255, 132, 0)" /></el-icon>
        </div>
                <!-- <el-icon> <Star color="red"/></el-icon> -->
        <!-- 点赞 -->
      </span>
      <span class="like-count">{{ likeCount }}</span>
    </button>
  </template>
  
  
  <script>
  import { StarFilled } from '@element-plus/icons-vue';

  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    name: "likesDu",
    props: {
        itemId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        itemType: {
            type: String,
            required: true,
            validator: (value) => ["article", "comment", "chat", "chatcomment"].includes(value),
        },
    },
    setup(props) {
        const liked = ref(false);
        const likeCount = ref(0);
        onMounted(async () => {
            await fetchLikeInfo();
        });
        const fetchLikeInfo = async () => {
            try {
                // 根据 itemType 和 itemId 发送请求，获取点赞信息
                const response = await axios.get(`http://localhost:3000/likes/${props.itemType}/${props.itemId}/${props.userId}/getlikes`);
                liked.value = response.data.liked;
                likeCount.value = response.data.likeCount;
            }
            catch (error) {
                console.error("获取点赞信息失败", error);
            }
        };
        const toggleLike = async () => {
            try {
                if (liked.value) {
                    // 根据 itemType 和 itemId 发送请求，切换点赞状态
                    await axios.post(`http://localhost:3000/likes/${props.itemType}/liked`, {
                        itemId: props.itemId,
                        userId: props.userId,
                    });
                }
                else {
                    await axios.post(`http://localhost:3000/likes/${props.itemType}/disliked`, {
                        itemId: props.itemId,
                        userId: props.userId,
                    });
                }
                // 根据 itemType 和 itemId 发送请求，切换点赞状态
                // 更新点赞信息
                await fetchLikeInfo();
            }
            catch (error) {
                console.error("点赞操作失败", error);
            }
        };
        return {
            liked,
            likeCount,
            toggleLike,
        };
    },
    components: { StarFilled }
};
  </script>
  
  <style scoped>
  /* 自定义按钮样式 */
  .like-btn {
    background-color: transparent;
    border: none;
    color: rgb(255, 132, 0);
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    
  }
  
  .like-pos{
    position: relative;
    top: auto;
  }
  .like-btn span {
    margin-left: 4px;
  }
  
  .like-btn i {
    
    font-size: 25px;
    transition: color 0.3s;
  }
  
  /* 点赞数量样式 */
  .like-count {
    margin-left: 8px;
    font-size: 14px;
    color: #333;
  }
  </style>
  