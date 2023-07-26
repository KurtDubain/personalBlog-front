<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    background-color="#333" 
    text-color="#fff" 
  >
    <router-link to="/about" style="text-decoration:none">
      <el-menu-item index="1">
        <el-image
          :src="require('@/assets/my-icon.svg')"
          mode="none"
          :style="{ width: '20px', height: '20px', marginRight: '5px' }"
        ></el-image>
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
  name: 'navDu',
};
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
.my-icon-class {
  height: auto;
  width: auto;
}
@font-face {
  font-family: 'my-icon';
  src: url('../assets/my-icon.svg') format('svg');
}
.el-submenu__title {
  padding: 0 15px; 
}
.el-menu-item {
  padding: 0 15px;
}
</style>
