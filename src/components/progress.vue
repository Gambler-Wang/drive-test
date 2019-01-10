<template>
  <section class="component-progress">
    <el-dialog
        :visible.sync="operationTip"
        :show-close="false"
        :top="'15vh'"
        custom-class="operationTip"
        :append-to-body="true"
        :closeOnClickModal="false"
        :closeOnPressEscape="false"
      >
        <section class="operationProgress">
          <span>{{operationProgress.title}}</span>
          <div>
            <el-progress :percentage="operationProgress.percenter" :stroke-width ="8" color="#7adb59"></el-progress>
          </div>
        </section>
      </el-dialog>
  </section>
</template>
<script>
// 文件类型：1表示文件夹，2表示图片，3表示文档，4表示视频，5表示音乐，6表示种子，7表示其他
export default {
  name: "comsProgress",
  props: {
    operationTip:{
      type:Boolean
    },
    operationProgress:{
      type:Object
    }

  },
  data() {
    return {
      
    };
  },
  created(){
      
  },
  methods: { 
    
  }
}
</script>
<style lang="scss" scoped>
  .operationTip{
      & .operationProgress{
        padding: 17px 37px;
        background-color: #5cbbf4;
        display: flex;
        border-radius:5px; 
        & >span{
          flex:1;
          text-align: right;
          font-size: 14px;
          color: #fff;
        }
        & >div{
          flex: 0 0 220px;
          margin-left: 14px;
          padding: 2px 0;
        }
      }
    }
  
</style>
<style>
.operationTip.el-dialog{
  margin-top: 15vh!important;
  width: 376px!important;
  background-color: transparent;
}
.operationTip .el-dialog__header{
    display: none;
}
.operationTip .el-dialog__body{
  padding: 0;
}
.operationTip .el-progress__text{
  color: #ffffff;
}
</style>

