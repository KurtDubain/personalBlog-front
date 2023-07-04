<template>
  <div>
    <div class="pre_btn"  v-if="articleId !=='1'">
        <router-link title="顺序按发布日期排序" :to="`/reader/${parseInt(articleId) -1 }`">
         <p>
           上一篇文章: 
        </p>
        <p>
            {{ ctrltitle.Tpre }}
        </p>
        
        <!-- <el-button type="primary" plain>Primary</el-button> -->
        </router-link>
    </div>
    <div class="next_btn" v-if="articleId !==lastId">
        <router-link title="顺序按发布日期排序" :to="`/reader/${parseInt(articleId) +1 }`">
        下一篇文章: {{ ctrltitle.Tnext }}
        </router-link>
    </div>
  </div>
</template>

<script>
// import { inject } from 'vue'
// import {watchEffect,ref,onMounted} from 'vue'
// import EventBus from '../utils/eventBus'
// import { ref } from 'vue'

export default {
    name:'crtlBtnDu',
    props:{
        articleId:{
            type:String,
            required:true
        },
        ctrltitle:{
            type:Object,
            required:true
        },
        lastId:{
            type:String,
            required:true
        }
        
        
    },
    setup(){
        // let filterArray = ref([])
        // onMounted(() => {
        //     EventBus.on('filterArray', (value) => {
        //         filterArray.value = value;
        //         console.log(filterArray.value);
        //         getPreviousArticle();
        //         getNextArticle();
        //     });
        // });
    //     const getPreviousArticle = () => {
    //         const currentIndex = filterArray.value.findIndex(
    //             article => article.id === props.articleId
    //         );

    //         if (currentIndex > 0) {
    //             const prevArticle = filterArray.value[currentIndex - 1];
    //             return {
    //             id: prevArticle.id,
    //             title: prevArticle.title
    //             };
    //         } else {
    //             // 如果当前文章是第一篇文章，则返回空对象或其他合适的值
    //             return {};
    //         }
    //     };

    //     const getNextArticle = () => {
    //         const currentIndex = filterArray.value.findIndex(
    //             article => article.id === props.articleId
    //         );

    //         if (currentIndex < filterArray.value.length - 1) {
    //             const nextArticle = filterArray.value[currentIndex + 1];
    //             return {
    //             id: nextArticle.id,
    //             title: nextArticle.title
    //             };
    //         } else {
    //             // 如果当前文章是最后一篇文章，则返回空对象或其他合适的值
    //             return {};
    //         }
    //     };
    //     watchEffect(() => {
    //   // 当 filterArray 发生变化时执行操作
    //         getPreviousArticle()
    //         getNextArticle()
    //         console.log(filterArray.value[1])
    //         console.log(getNextArticle().title)
    //     })
        // onUnmounted(() => {
        //     EventBus.off('filterArray');
        // });
        return{
        }
    }
}
</script>

<style>

</style>