<!-- 点赞组件 -->
<template>
    <button class="like-btn" @click="throttledToggleLike" type="button">
        <span v-if="liked">
            <div class="like-pos">
                <el-icon>
                    <StarFilled color="rgb(255, 132, 0)" />
                </el-icon>
            </div>

            <!-- <el-icon><Star /></el-icon> -->
            <!-- 取消点赞 -->
        </span>
        <span v-else>
            <div class="like-pos">
                <el-icon>
                    <Star color="rgb(255, 132, 0)" />
                </el-icon>
            </div>
            <!-- <el-icon> <Star color="red"/></el-icon> -->
            <!-- 点赞 -->
        </span>
        <span :class="['like-count', themeClass]">{{ likeCount }}</span>
    </button>
</template>


<script>
import { StarFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref, onMounted, watch, computed } from 'vue';
import { throttle } from 'lodash'
import { useStore } from 'vuex';

import axios from 'axios';


export default {
    name: "likesDu",
    props: {
        itemId: {
            type: String,
            required: true,
        },
        // 定义四种类型，分别对应数据库的四个类型
        itemType: {
            type: String,
            required: true,
            validator: (value) => ["article", "comment", "chat", "chatcomment"].includes(value),
        },
    },
    components: {
        StarFilled
    },

    setup(props) {
        // console.log(props)
        // 判断是否喜欢
        const liked = ref(false);
        // 判断喜欢的数量
        const likeCount = ref(0);
        // 定义用户id
        const userId = ref(null)
        const store = useStore()
        // 切换主题
        const themeClass = computed(() => {
            return store.state.theme.isLight ? 'light-theme' : 'dark-theme'
        })
        // const 
        // 初始化点赞情况
        onMounted(async () => {
            checkLoginStatus()
            await fetchLikeInfo(props.itemType, props.itemId, userId);
        });
        // 获取指定项目的点赞情况
        const fetchLikeInfo = async (type, itemId, userId) => {
            try {
                // console.log(userId.value);
                // 根据 itemType 和 itemId 发送请求，获取点赞信息
                const response = await axios.get(`https://www.dyp02.vip:443/backend/likes/${type}/${itemId}/${userId.value}/getlikes`);
                likeCount.value = response.data.likeCount
                liked.value = response.data.userLiked
            }
            catch (error) {
                console.error("获取点赞信息失败", error);
            }
        };
        // 点赞或者取消点赞的请求的发送
        const toggleLike = async () => {
            try {
                if (!userId.value) {
                    ElMessage('请先登录')
                    return
                } else {
                    // 切换点赞状态
                    if (!liked.value) {
                        // 根据 itemType 和 itemId 发送请求，切换点赞状态
                        await axios.post(`https://www.dyp02.vip:443/backend/likes/${props.itemType}/liked`, {
                            itemId: props.itemId,
                            userId: userId.value,
                        });
                    }
                    else {
                        await axios.post(`https://www.dyp02.vip:443/backend/likes/${props.itemType}/disliked`, {
                            itemId: props.itemId,
                            userId: userId.value,
                        });
                    }
                    // 根据 itemType 和 itemId 发送请求，切换点赞状态
                    // 更新点赞信息
                    await fetchLikeInfo(props.itemType, props.itemId, userId);
                }

            }
            catch (error) {
                console.error("点赞操作失败", error);
            }
        };
        // 获取用户登陆情况，如果未登录，则禁止点赞
        const checkLoginStatus = () => {
            // const userInfo = computed(() => store.getters['users/getUserAllInfo'])
            // 如果用户登陆，则获取用户id信息
            if (localStorage.getItem('userID') !== null) {
                userId.value = localStorage.getItem('userID')

                // console.log(JSON.parse(userInfo))
            } else {
                console.error('未登录');
            }
        }

        // 节流处理点赞操作
        const throttledToggleLike = throttle(toggleLike, 5000, { leading: true, trailing: false });

        // 当点赞情况发生变化的时候，更新信息
        watch(() => props.itemId,
            async (newItemId) => {
                await fetchLikeInfo(props.itemType, newItemId, userId)

            })
        return {
            liked,
            likeCount,
            toggleLike,
            throttledToggleLike,
            themeClass
        };
    },
};
</script>

<style lang="scss" scoped>
/* 自定义按钮样式 */
.like-btn {
    background-color: transparent;
    border: none;
    color: rgb(255, 132, 0);
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;

    span {
        margin-left: 4px;
    }

    i {
        font-size: 25px;
        transition: color 0.3s;
    }
}

/* 点赞数量样式 */
.like-count {
    margin-left: 8px;
    font-size: 14px;
    color: rgb(85, 85, 85);
}

.dark-theme {
    .like-count {
        color: aliceblue;
    }
}
</style>
