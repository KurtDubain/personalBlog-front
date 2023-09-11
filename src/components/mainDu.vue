<!-- 大背景色组件的应用 -->
<template>
  <div class="background-maker">
    <!-- 插槽的使用，方便插入不同内容 -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MainDu",
};
</script>

<style lang="scss" scoped>
.background-maker {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    to right,
    rgba(238, 223, 204, 0.8),
    rgba(222, 222, 222, 0.8)
  );
}
</style>
