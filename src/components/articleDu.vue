<!-- 文章栏组件 -->
<template>
  <div :class="['article-container',themeClass]">
    <!-- <el-timeline> -->
      <!-- 根据articles的类型，需要使用键值对来实现逐一显示 -->
        <el-item v-for="article in Object.keys(articles)" :key="articles[article].id"
        center :timestamp="articles[article].date" placement="top" size="large" @click="goToArticle(articles[article].id)">
        <router-link :to="`/reader/${articles[article].id}`" class="article-link">
          <el-card class="article-card">
            <span>
              <h2 class="article-title">{{ articles[article].title }}</h2>
              <h4 class="article-date" style="font-weight:lighter ">{{ articles[article].date }}</h4>

            </span>
            <div class="article-tags">
              <el-tag v-for="tag in articles[article].tags.tags" :key="tag" class="article-tag" type="info">
                {{ tag }}
              </el-tag>
            </div>
          </el-card>
        </router-link>
      </el-item>

    <!-- </el-timeline> -->
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import {useStore} from 'vuex'
import {computed} from 'vue'

export default {
  name: 'articleDu',
  props: {
    articles: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const router = useRouter();
    const store = useStore()
    // 传递路由参数

    // console.log(articles)
    const goToArticle = (articleId) => {
      router.push({
        name: 'read',
        params: {
          articleId: articleId
        }
      });
    };
    // 根据夜间模式处理样式
    const themeClass = computed(()=>{
      return store.state.theme.isLight?'light-theme':'dark-theme'
    })

    return {
      goToArticle,
      themeClass
    };
  }
}
</script>

  <style lang="scss" scoped>
.article-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  width: 80%;
  padding-top: 5%;
  // background-color: none;

  .article-card {
    margin: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    padding: 15px;
    cursor: pointer;
    transition: box-shadow 0.3s ease;
    border: 2px solid #ccc; /* 添加边框样式 */
    position: relative;
    overflow: hidden;

    &::before{
      content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // border: 4px groove rgba(153, 156, 121, 0.575); /* 添加装饰性的边框 */
        border: 4px groove rgba(255, 255, 255, 0.575);
        box-sizing: border-box;
        pointer-events: none;
    }

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .article-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .article-date{
      font-weight: lighter;
    } 

    .article-tags {
      margin-top: 10px;

      .article-tag {
        display: inline-block;
        font-size: 14px;
        padding: 5px 10px;
        margin-right: 5px;
      }
    }

    // .article-link {
    //   text-decoration: none;
    // }
  }
} 
  
.dark-theme {
  .article-container {
    // background-color: #1f2937; /* 夜间模式下的背景颜色 */
  }

  .article-card {
    background-color: rgba(0, 0, 0, 0.575); /* 夜间模式下的卡片底色 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    .article-title {
      color: #fff; /* 文章标题颜色 */
    }
    .article-date{
      color:#fff
    }

    .article-tags {
      .article-tag {
        color: rgb(37, 36, 36); /* 标签文字颜色 */
      }
    }
  }
}
  .article-link {
    text-decoration: none;
  }
  </style>
  