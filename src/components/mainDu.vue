<template>
  <div class="background-maker">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MainDu",
};
</script>

<style scoped>
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
