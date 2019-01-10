<template>
    <section class="component-nodata" id="component-nodata">
        <!--网盘没有数据-->
        <img src="../assets/images/homepage_inset.png" alt="">
        <p >{{text}}</p>
        <!-- <Button value="上传文件"  icon="icon-upload" btnClass="active" type="file" @change="getFiles" :nofiles = "true" /> -->
    </section>
</template>
<script>
import Button from './button';
export default {
    name:'nodata',
    components:{Button},
    props:{
      flg: {
        type: Boolean,
        default:false
      },
    },
    data(){
        return {
          text:'您还没上传过文件，点击上传按钮～',
        }
    },
    methods:{
        getFiles(files){
            this.$emit('getFile',files)
        },
    },
  created(){
    if(this.$route.name == 'sharePage'){
      this.text = '您还没有分享过文件／文件夹～'
    }
    if(this.$route.name == 'recovery'){
      this.text = '您的回收站为空噢～'
    }
    if(this.$route.name == 'share'){
      this.text = '没有数据...'
    }
    if(
      ((this.$route.name == 'folderdetail' || this.$route.name == 'imgdetail') && this.flg)
      ||  this.$route.name == 'search'
    ){
      this.text = '你的网盘中，没有找到相应内容...'
    }
  }
}
</script>
<style lang="scss" scoped>
.component-nodata{
  width: 260px;
  height: 260px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -130px;
  margin-top: -130px;
    & p{color: #5cbbf4;font-size: 16px;margin-top: 20px; margin-bottom:20px;}
}
</style>

