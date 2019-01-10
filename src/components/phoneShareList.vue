<template>
  <section class="component-phoneShareList">
    <ul>
      <li 
        v-for="(item,index) in fileList" 
        :key="index" 
        @click="$emit('clickItems', {id:item.id,type:item.fileType,index:index,name:item.name});">
        <img src="../assets/images/folder.png" v-if="item.fileType=='1'">
        <img :src="(item.previewPath)? item.previewPath.jpg : require('../assets/images/image.png')" v-if="item.fileType=='2'">
        <img src="../assets/images/fw.png" alt="" v-if="item.fileType=='3'">
        <img src="../assets/images/video.png" v-if="item.fileType=='4'"/>
        <img src="../assets/images/music.png" alt="" v-if="item.fileType=='5'">
        <img src="../assets/images/bt.png" alt="" v-if="item.fileType=='6'">
        <img src="../assets/images/unknow.png" v-if="item.fileType=='7'">
        <div>
          <div>
            <span>{{item.name}}</span>
          </div>
          <div>
            <span>{{dataFormat(item.createTime)}}</span>
            <span v-if="item.shareType!='1'">{{sizeFormat(item.fileSize)}}</span>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
<script>
// 文件类型：1表示文件夹，2表示图片，3表示文档，4表示视频，5表示音乐，6表示种子，7表示其他
export default {
  name: "phoneShareList",
  props: {
    fileList:{
      type:Array
    },

  },
  data() {
    return {
      newFileList:null,
    };
  },
  created(){
      
  },
  methods: { 
    
  }
}
</script>
<style lang="scss" scoped>
  .text-overflow{
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .component-phoneShareList{
   &>ul{
     width: 100%;    
     min-height: 210px;
     &>li{
       @extend .text-overflow;
       display: flex;
       flex-wrap: nowrap;
       border-bottom: 1px solid #EDEDED;
       padding: 6px 10px;
       width: 100%;

       &>img{
         width: 37px;
         min-width: 37px;
         height: 40px;
         margin-right: 6px;
       }
       &>div{
        @extend .text-overflow;
         font-size: 14px;
         line-height: 20px;
          width: 100%;
          &>div>span{
            @extend .text-overflow;
            max-width: 100%;
            display: block;
          }
         &>div:nth-of-type(2){
           display: flex;
            flex-wrap: nowrap;
            justify-content:space-between;
            font-size: 12px;
            color: #B2B2B2;
         }
       }
     }
   }
  }
</style>


