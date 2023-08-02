<!-- 科技分类的页面组件 -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧 el-aside -->
      <el-aside class="left-aside" width="20%" v-show="showLeftAside"></el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;align-items: center;">
          <articleDu :articles="filteredArticlesByTag"></articleDu>
        </mainDu>
      </el-main>
      <!-- 右侧 el-aside -->
      <el-aside class="right-aside" width="20%" v-show="showRightAside"></el-aside>
    </el-container>
  </div>
</template>

<script>
import mainDu from '@/components/mainDu.vue'
import articleDu from '@/components/articleDu.vue';
import {computed,onMounted} from 'vue'
import {useStore} from 'vuex'
export default {
    name:"pyhDu",
    components:{
        mainDu,
        articleDu
    },
    setup(){
      const store = useStore()
      onMounted(async()=>{
          try{
            // 获取所有文章信息
            await store.dispatch('articles/loadArticles')

          }
          catch(error){
            console.error('未能获取到文章内容');

          }
        })
        // 使用计算属性，过滤出标签中含有“技术”的文章
        const filteredArticlesByTag = computed(() => store.getters['articles/filteredArticlesByTag']('技术'));

      // 响应式设计相关
      const showLeftAside = computed(() => {
      // 当屏幕宽度小于等于 768px 时，隐藏左侧 el-aside
        return window.innerWidth > 768;
      });

      const showRightAside = computed(() => {
      // 当屏幕宽度小于等于 768px 时，隐藏右侧 el-aside
        return window.innerWidth > 768;
      });

    // 监听窗口大小变化，实时更新显示/隐藏状态
      window.addEventListener('resize', () => {
        showLeftAside.value = window.innerWidth > 768;
        showRightAside.value = window.innerWidth > 768;
      });
      return {
        filteredArticlesByTag,
        
        showLeftAside,
        showRightAside
      }
    }
}
</script>

<style scoped>
.el-main{
  padding-top:0px ;
}
.el-aside {
  transition: all 0.3s;
}

@media (max-width: 768px) {
  /* 当屏幕宽度小于等于 768px 时，隐藏 el-aside */
  .el-aside {
    display: none;
  }
}
</style>