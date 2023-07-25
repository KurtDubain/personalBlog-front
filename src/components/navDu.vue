<!-- 导航栏的组件 -->
<template>
  <!-- 主要应用了element Plus提供的组件，不过后期会优化修改设计 -->
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
  <!-- <el-icon class="my-icon-class" :style="{fontSize: '20px'}" :font-size="20" style="margin-right: 10px;font-family: my-icon;"></el-icon> -->
  
    <el-image
      :src="require('@/assets/my-icon.svg')"
      mode="none"
      :style="{ width: '20px', height: '20px' }"
    ></el-image>
    <router-link to="/about"  style="text-decoration:none">
      <el-menu-item index="1">
        关于
      </el-menu-item>
    </router-link>
    <el-sub-menu index="2">
      <template #title>分类</template>
        <router-link to="/" style="text-decoration:none">
          <el-menu-item index="2-1" >
            首页
          </el-menu-item>
        </router-link>
        <router-link to="/pyhcials" style="text-decoration:none">
          <el-menu-item index="2-2">
            体育
          </el-menu-item>
        </router-link>
        <router-link to="/technology" style="text-decoration:none">
          <el-menu-item index="2-3">
            技术
          </el-menu-item>
        </router-link>
        <router-link to="/community" style="text-decoration:none">
          <el-menu-item index="2-4">
            社区
          </el-menu-item>
        </router-link>
      </el-sub-menu>
    <!-- <el-menu-item index="3" disabled>Info</el-menu-item> -->
    <router-link to="/chatMaker" style="text-decoration:none">
    <el-menu-item index="3">留言板</el-menu-item>
  </router-link>
    <div class="flex-grow" />
    <el-sub-menu index="4">
      <template #title>更多</template>

      <router-link to="/write" style="text-decoration:none">
        <el-menu-item index="4-1">嗖</el-menu-item>
      </router-link>
      <router-link to="/write" style="text-decoration:none">
        <el-menu-item index="4-2">订阅</el-menu-item>
      </router-link>
      <router-link to="/write" style="text-decoration:none">
        <el-menu-item index="4-3">实验室</el-menu-item>
      </router-link>
    </el-sub-menu>
      
    
  </el-menu>

</template>

<script>
export default {
    name:'navDu'
}
</script>

<style scoped>
.flex-grow{
    flex-grow: 1;
}
.my-icon-class{
    height: auto;
    width: auto;
}
@font-face {
  font-family: 'my-icon';
  src: url('../assets/my-icon.svg') format('svg');
}

</style>
