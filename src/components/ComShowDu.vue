<template>
  <div class="midForm">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" >
      <el-form-item label="你的昵称" class="little_text">
        <el-input v-model="formInline.name" placeholder="昵称" clearable />
      </el-form-item>
      <el-form-item label="联系方式" class="little_text">
        <el-input v-model="formInline.contact" placeholder="邮箱、微信都可" clearable />
      </el-form-item>
      <el-form-item class="big_text">
        <el-input v-model="formInline.content" type="textarea" placeholder="想说点什么呢" clearable />
      </el-form-item>
      <el-form-item class="button_row">
        <el-button type="primary" @click="onSubmit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import{reactive} from 'vue'
  import axios from 'axios'
  import EventBus from '../utils/eventBus'
  export default {
  name:'ComShowDu',
  props:{
      articleId:{
        type:String,
        required:true
      },
      loadComment:{
        type:Function,
        required:true
      }
  },
  setup(props){
    const formInline = reactive({
      name:'',
      contact:'',
      content:''
    })
    const onSubmit = async()=>{
      try{
        const formData={
          articleId:props.articleId,
          content:formInline.content,
          name:formInline.name,
          contact:formInline.contact
        }
        const res = await axios.post('http://localhost:3000/comments/form',formData)
        console.log('表单数据成功提交',res.data)
        formInline.content = ''
        formInline.name = ''
        formInline.contact = ''
        EventBus.emit('NeedRefresh')
       
        
        
      }catch(err){
        console.error('表单数据提交失败',err)
      }
    }
    
    return{
      onSubmit,
      formInline
    }
  }
}
</script>

<style scoped>
.midForm{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: fixed;
}
.button_row{
  display: flex;
  justify-content:center;
 /* margin-top: 10px;  */
}
.big_text{
  width:81%
}
.little_text{
  text-align: center;
  justify-content: center;
} 
</style>
