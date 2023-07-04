<template>
  <div class="list_container">
    <el-timeline>
      <el-timeline-item v-for="comment in Object.values(comments)" :key="comment.id" center 
        :timestamp="comment.created_Date" placement="top">
        <el-card>
          <div class="headerChat">
            <h2>{{ comment.name }}</h2>
            <h3>{{ comment.contact }}</h3>
          </div>
          <p>{{ comment.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: "ComListDu",
  props: {
    comments: {
      type: Array,
      default: () => [],
      require:true
    }
  },
  setup(){

  }
}
</script>

<style scoped>
.list_container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  width: 80%;
  padding-top: 5%;
}
.headerChat {
  display: flex;
  align-items: baseline;
  justify-content: space-around;
}
</style>
