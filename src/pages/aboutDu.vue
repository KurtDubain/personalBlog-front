<!-- 个人简介页面 -->
<template>
  <div class="common-layout">
      <el-container>
        <el-aside width="20%">
        </el-aside>
        <el-main>
          <mainDu style="display:flex;flex-direction: column;align-items: center;">
            <div class="common-layout">
              <el-container>
                <el-header>雪碧的小屋</el-header>
                <el-main >这里是一些介绍的内容</el-main>
              </el-container>
            </div>
          
          </mainDu>
        </el-main>
        <el-aside width="20%">
  
        </el-aside>
      </el-container>
    </div>
</template>

<script>
import mainDu from '../components/mainDu.vue'
export default {
  name:'aboutDu',
  components:{
    mainDu
  }
}
</script>

<style>

.el-main{
    padding-top:0px ;
  }
</style>