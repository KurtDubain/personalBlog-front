<!-- 文章栏组件 -->
<template>
  <div class="article-container">
    <!-- <el-timeline> -->
      <!-- 根据articles的类型，需要使用键值对来实现逐一显示 -->
        <el-item v-for="article in Object.keys(articles)" :key="articles[article].id"
        center :timestamp="articles[article].date" placement="top" size="large" @click="goToArticle(articles[article].id)">
        <router-link :to="`/reader/${articles[article].id}`" class="article-link">
          <el-card class="article-card">
            <span>
              <h2 class="article-title">{{ articles[article].title }}</h2>
              <h4 style="font-weight:lighter ">{{ articles[article].date }}</h4>

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
// import {useStore} from 'vuex'
// import {computed} from 'vue'

export default {
  name: 'articleDu',
  props: {
    articles: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    console.log(props.articles);
    const router = useRouter();
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

    return {
      goToArticle,
      
    };
  }
}
</script>

  <style scoped>

  .article-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-basis: 0;
    width: 80%;
    padding-top: 5%;
  }
  
  .article-card {
    margin: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    padding: 15px;
    cursor: pointer;
    transition: box-shadow 0.3s ease;
  }
  
  .article-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .article-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .article-tags {
    margin-top: 10px;
  }
  
  .article-tag {
    display: inline-block;
    font-size: 14px;
    padding: 5px 10px;
    margin-right: 5px;
  }
  
  .article-link {
    text-decoration: none;
  }
  </style>
  