<template >
  <transition name = "fade">
    <section :class="['component-dialog',position]" v-show ="showDialog">
      <div class="opac"></div>
      <section class="dialog-content">
        <header  :class="[headerClass]">
          <span :class="[done ? '' : isVip]"><i class="icon icon-speed"></i>{{uploadTitle}}</span>
          <!-- <span>{{title}}</span> -->
          <p>
            <a href="javascript:;" @click="hideList" v-if="files"><i :class="['icon', hide ? 'icon-hide':'icon-showList']"></i></a>
            <a href="javascript:;" @click="close"><i class="icon icon-close"></i></a>
          </p>
        </header>
        <slot>
          <section v-if="done">
            <p class="tipBar uploadFail" v-if="failBar">
              <span>有{{failCount}}个文件上传失败</span>
              <i class="icon icon-close-w" @click="failBar = false"></i>
            </p>
            <p class="tipBar" v-if="successBar">
              <span>有{{successCount}}个文件上传成功</span>
              <i class="icon icon-close-w" @click="successBar = false"></i>
            </p>
          </section>
          <section class="upload-list" v-show="files && hide">
             <el-row tag="header" class="uploadHeader">
               <el-col tag="span" :span="11">文件(夹)名</el-col>
               <el-col tag="span" :span="4">上传目录</el-col>
               <el-col tag="span" :span="3">大小</el-col>
               <el-col tag="span" :span="4">状态</el-col>
               <el-col tag="span" :span="2">操作</el-col>
             </el-row>
            <UploadItem v-for="(item,key) in uploadList"
              :key="key"
              :index = "key"
              :propfile = "item"
              :status.sync = "item.status"
              :stopQueue = "stopQueue"
              :waitQueue = "waitQueue"
              :successCount.sync = 'successCount'
              :failCount.sync = "failCount"
              :done = "done"
              @fileDone="fileDone" />
          </section>
          <!-- <dl class="upload-list" v-show="files && hide">
            <dd v-for="(item,key) in uploadList" :key="key">
              <i :class="['icon',fileType(item)]"></i>
              <span>{{item.name}}</span>
              <b v-cloak>{{sizeFormat(item.size)}}</b>
              <strong>{{getFolderName(item.webkitRelativePath)}}</strong>
              <em v-if="!item.done" v-cloak>{{item.progress}}</em>
              <p v-else><i :class="['icon',item.error ? 'icon-error':'icon-right']"></i>{{item.message}}</p>
              <p v-show="!item.done" @click="stopUpload(item)">暂停上传</p>
              <div class="item-progress" :style="{width:item.progress}"></div>
              <div>{{upload(item)}}</div>
            </dd>
          </dl> -->
        </slot>
      </section>
    </section>
  </transition>
</template>
<script>
  import b from '../util/newVue';
  import UploadItem from './uploaditem';
  export default {
    name:"Dialog",
    components:{UploadItem},
    props:{
        uploadFail:{
            type:Array,   //上传失败的文件
            default:function(){
                return []
            }
        },
        files:{
            type: Array
        },
        showDialog:Boolean,         //是否显示dialog
        position:{
            type:String,
            default:'bottomRight'
        },
        title:{
            type:String,
            default:'上传列表'
        },
        nowrap:{                    //是否显示遮罩层
            type:Boolean,
            default:true
        },
        // catId:{
        //     type:String | Number,    //上传到目标文件夹id
        //     default:'-1',
        // },
        headerClass:String        //弹框title样式
    },
    computed: {
      isVip(){
        const vis = JSON.parse(sessionStorage.getItem('visit'))
        if( vis.vip.toString() === '1' || vis.isSpeedup.toString() === '1'){
          return 'isVip';
        } else {
          return '';
        }
      }
    },
    data(){
      return {
        // fileType:'icon-unknow',
        errMsg:"文件大小为0",
        done:false,            //上传是否完成
        hide:true,             //隐藏下载列表
        hideTipBar:false,
        key:0,                 //已上传完成个数
        failCount:0,           //上传失败的个数
        successCount:0,        //上传成功的个数
        failBar:false,
        successBar:false,
        uploadList:[],         //上传列表
        uploadingCount:0,      //正在上传的队列
        waitQueue:new Map(),          //等待上传的队列
        stopQueue:new Map(),          //暂停上传的队列
        max:1,                  //同时上传个数
        uploadMax:100,
        uploadTitle:'上传完成' 
      }
    },
    watch:{
      files(newval,oldval){
        if(this.uploadList.length + newval.length > this.uploadMax ){
          this.$message({
            type:'warning',
            message:'上传列表中的数据不能大于100'
          })
          return ;
        }
        newval.forEach((item,key)=>{
          const index = key + this.uploadList.length;
          const obj = { index:index,started:false,isParts:false }
          this.waitQueue.set(index,obj);
        })
        this.uploadList.push( ...newval );
        while( this.waitQueue.size > 0 ){
          if( this.uploadingCount >= this.max ){
            return;
          } else {
            const keys = [...this.waitQueue.keys()];
            const index = keys[this.uploadingCount];
            this.uploadList[index].status = 'uploading';
            this.uploadTitle = `正在上传${this.successCount}/${this.uploadList.length}`;
            this.done = false;
            this.uploadingCount += 1;
          }
        }
      }
    },
    mounted(){
    },
    methods:{
      close(){
        if(this.waitQueue.size > 0 || this.stopQueue.size > 0){
          //如果有正在上传或者暂停的
          this.$confirm('列表中有未上传完成的文件，确定要放弃上传吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('close');
            this.abortAll();
            this.abortDone = true;
            this.$nextTick(()=>{
              if(this.abortDone = true){
                this.uploadingCount = 0;
                this.uploadList = [];
                this.successCount = 0;
                this.failCount = 0;
                this.waitQueue.clear();
                this.stopQueue.clear();
              }
            })
          })
        }else{
          this.$emit('close');
          this.uploadingCount = 0;
          this.successCount = 0;
          this.failCount = 0;
          this.uploadList = [];
          this.waitQueue.clear();
          this.stopQueue.clear();
        }
      },
      abortAll(){
        if(this.waitQueue.size > 0){
          const keys = [ ...this.waitQueue.keys() ];
          let c = this.max;
          while( c > 0 ){
            c -= 1;
            const index = keys[c];
            this.uploadList[index].status = 'abort';
            this.uploadingCount -= 1;
          }
        }
      },
      hideList(){
        this.hide = !this.hide;
      },
      fileDone(obj){
        //当前文件上传成功或暂停后，从等待上传队列中移除
        if(obj.status === 'done'){
          //文件上传完成
          this.uploadingCount =  this.uploadingCount > 0 ? this.uploadingCount - 1 : 0;
          this.waitQueue.delete(obj.index);
        } else if(obj.status === 'stop' || obj.status === 'error'){
          //文件暂停 或 上传失败
          this.uploadingCount =  this.uploadingCount > 0 ? this.uploadingCount - 1 : 0;
          this.stopQueue.set(obj.index,obj.value)
          this.waitQueue.delete(obj.index);
        } else if( obj.status === 'del' ){
          this.uploadingCount =  this.uploadingCount > 0 ? this.uploadingCount - 1 : 0;
          this.waitQueue.has(obj.index) && this.waitQueue.delete(obj.index);
          this.stopQueue.has(obj.index) && this.stopQueue.delete(obj.index);
          this.uploadMax += 1;
          if(this.stopQueue.size + this.waitQueue.size + this.successCount + this.failCount === 0 ){
            this.close();
            return ;
          }
        } else {
          //断点续传
          this.waitQueue.set(obj.index,obj.value);
          this.stopQueue.delete(obj.index);
        }

        if(this.uploadingCount >= this.max){
          return;
        }
        if( this.waitQueue.size > 0 ){
          const keys = [ ...this.waitQueue.keys() ];
          const index = keys[this.uploadingCount];
          this.uploadList[index].status = 'uploading';
          // this.key += 1;
          this.uploadTitle = `正在上传${this.successCount}/${this.uploadList.length}`;
          this.done = false;
        } else {
          this.done = true;
          this.uploadTitle = "上传完成"
          this.successBar = true;
          this.failBar = this.failCount > 0;
          if(this.successCount === 0) return ;
          this.$emit('uploaded','uploaded')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .text-overflow{
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .component-dialog{
    position:fixed; left:0; top:0;
    // width:100%; height:100%;
    width:auto; width:auto;
    z-index:99;margin:0 !important;padding:0;
    &.center{left:50%; top:50%; transform:translate(-50%,-50%);}
    &.bottomRight{left:auto; right:20px; bottom:0;top:auto;}
    & > .opac{width:100vw; height:100vh; position:fixed; left:0; top:0; opacity: 0.6;display:none; background-color:#000;}
    & .dialog-content{position:relative;z-index:2; font-size:14px;
      min-width:650px;overflow:auto;background-color:#fff;
      box-shadow:0 0 10px #cac5c5 ;
      &>header{
        width:100%; height:45px;line-height:45px; padding-left:20px;color:#3d3d3d;position:relative;
        & > span > i{ display:none;}
        & > span.isVip{ display:inline-block;vertical-align:top; color:#FF9100; position:relative;
          & > i{ display:inline-block; width:20px; height:45px;}  
        }
        &>p{ position:absolute;top:0; right:0;font-size:0;
          & a{display:inline-block; width:30px; height:100%;text-align:center;
            & .icon{width:30px; height:45px;background-position:center;}
          }
        }
        // &.headerBg{background-color:#eaf7ff;}
      }

      & p.tipBar{ padding-left:20px;overflow:hidden;height:34px;position:relative; line-height:34px;color:#fff; background-color:#5cbbf4;padding-left:20px;
        & .icon{ width:30px; height:34px;cursor:pointer;position:absolute; right:0; top:0;
          background-position:center;
        }
        &.uploadFail{background-color:#fc4343;}
      }

      & .upload-list{
        width:100%;height:450px;overflow:auto;max-width:650px;
      }
      & .uploadHeader{display:block; width:100%; color:#333; height:45px; overflow:hidden; line-height:45px; padding:0 10px; box-sizing:border-box; background-color:#f5f5f5;}
    }


    // &.include-opac{
    //     width:100vw; height:100vh; position:fixed; left:0; top:0;background-color:#ccc;
    //     & .opac{ display:block; }
    //     & .dialog-content{
    //         position:absolute;
    //     }
    // }
  }
</style>
