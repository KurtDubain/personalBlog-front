<template>
  <div class="background_maker">
    <slot></slot>
  </div>
</template>

<script>
export default {
    name:"mainDu"
}
</script>

<style scoped>
.background_maker{
  /* display: flex; */
  position: relative;
  width: 100%;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;  
  background-color: antiquewhite;
    /* border-radius: 5%; */
    /* background: linear-gradient(to right, transparent, transparent calc(50% - 50px), rgb(212, 209, 132) calc(50% - 50px), rgb(101, 161, 10) calc(50% + 50px), transparent calc(50% + 50px), transparent); */
}
</style>