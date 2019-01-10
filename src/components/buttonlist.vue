<template>
  <section class="component-buttonlist" v-show="oprFiles.length > 0">
    <slot>
      <Button value="下载" icon="icon-download"  v-if="delShow" @click="download"/>
      <Button value="分享" icon="icon-share"  v-if="delShow" @click="shareMore"/>
      <Button value="删除" icon="icon-delete" @click="del" />
      <Button value="更多" icon="icon-more" :includes="includes" @click="more" />
    </slot>
    <el-dialog
      :visible.sync="showdialog"
      :append-to-body = "true"
      :title = "title"
      custom-class = "file-replace"
    >
      <h3>{{title}}已包含同名文件，请选择您的操作</h3>
      <dl>
        <dt>已有文件</dt>
        <dd>
          <!--<img :src="move.icon">-->
          <div>
            <i class="img-size icon icon-folder" v-if="move.icon == 1 "></i>
            <i class="img-size icon icon-image " v-else-if="move.icon == 2 "></i>
            <i class="img-size icon icon-excel"  v-else-if="move.icon == 3 "></i>
            <i class="img-size icon icon-video"  v-else-if="move.icon == 4 "></i>
            <i class="img-size icon icon-music"  v-else-if="move.icon == 5 "></i>
            <i class="img-size icon icon-bts"     v-else-if="move.icon == 6 "></i>
            <i class="img-size icon icon-unknow" v-else-if="move.icon == 7 "></i>
            <i class="img-size icon icon-folder" v-else></i>
            <span class="name">{{moved.name}}</span>
          </div>
          <section>
            <p><span class="size" v-show="moved.icon != 1">大小：{{sizeFormat(move.fileSize)}}</span><span>修改日期：{{dataFormat(move.updateTime)}}</span></p>
          </section>
        </dd>
        <dt>正在{{type== 1 ? '移动':'复制'}}的文件</dt>
        <dd>
          <div>
            <i class="img-size icon icon-folder" v-if="moved.icon == 1 "></i>
            <i class="img-size icon icon-image " v-else-if="moved.icon == 2 "></i>
            <i class="img-size icon icon-excel"  v-else-if="moved.icon == 3 "></i>
            <i class="img-size icon icon-video"  v-else-if="moved.icon == 4 "></i>
            <i class="img-size icon icon-music"  v-else-if="moved.icon == 5 "></i>
            <i class="img-size icon icon-bts"     v-else-if="moved.icon == 6 "></i>
            <i class="img-size icon icon-unknow" v-else-if="moved.icon == 7 "></i>
            <i class="img-size icon icon-folder" v-else></i>
            <span class="name">{{moved.name}}</span>
          </div>
          <section>
            <p><span class="size" v-show="moved.icon != 1">大小：{{sizeFormat(moved.fileSize)}}</span><span>修改日期：{{dataFormat(moved.updateTime)}}</span></p>
          </section>
        </dd>
      </dl>
      <footer slot="footer" class="footer">
        <aside>
          <Button value="替换文件"   btnClass="active" @click="replace(1)" />
          <Button value="保留两个文件"   btnClass="active" @click="replace(2)" />
        </aside>
        <Button value="取消" @click="showdialog = false"/>
      </footer>
    </el-dialog>
    <Progress
      :operationTip="operationTip"
      :operationProgress="operationProgress"
    />
  </section>
</template>
<script>
  import Button from './button'
  import b from '../util/newVue'
  import Progress from '../components/progress'
  export default {
    name:'ButtonList',
    components:{ Button,Progress},
    props:{
      oprFiles:{
        type:Array
      },
      currentFolder:Object,
      picShow:{
        type:Boolean
      },
      delShow:{
        type:Boolean,
        default:true
      },
      renameFlag:Boolean
    },
    data(){
      return {
        type:1,                //操作类型  1移动 2复制
        showdialog:false,
        title:'移动文件',
        move:{},
        genRes:{},
        moved:{},
        retain:'',
        fn:{},
        delFn:{},
        delGenRes:{},
        operationTip:false,
        operationProgress:{
          title:'',
          percenter:0,
          sum:0,
          sucNum:1
        },
        operationFlag:false,
      }
    },
    // watch:{
    //     oprFiles(newval,oldval){
    //         console.log('watch newval',newval)
    //         console.log('watch oldval',oldval)
    //     }
    // },
    computed: {
      includes() {
        if(this.$router.currentRoute.name == 'image' &&  sessionStorage.getItem('picFlag')=='false'){
          if (this.oprFiles && this.oprFiles.length > 1) {
            return []
          } else {
            return ['重命名']
          }
        }
        else if(this.$router.currentRoute.name == 'image' &&  sessionStorage.getItem('picFlag')!='false'){
          if (this.oprFiles && this.oprFiles.length > 1) {
            return ['移动到', '复制到','更改分组']
          } else {
            return ['移动到', '复制到', '重命名','更改分组']
          }
        }
        else if(this.$router.currentRoute.name == 'imgdetail' && this.picShow == false){
          if (this.oprFiles && this.oprFiles.length > 1) {
            return ['更改分组']
          } else {
            return [ '重命名','更改分组']
          }
        }
        else if(this.$router.currentRoute.name != 'image'&& this.picShow == false) {
          if (this.oprFiles && this.oprFiles.length > 1) {
            return ['移动到', '复制到',]
          } else {
            return ['移动到', '复制到', '重命名']
          }
        }else {
          if (this.oprFiles && this.oprFiles.length > 1) {
            return []
          } else {
            return [ '重命名']
          }
        }
      }
    },
    mounted(){
      // this.$on('moveOrCopy',this.moveOrCopy)
    },
    methods:{
      download(){
        if(this.oprFiles.length>1){
          this.clientApp('web暂不支持多文件下载，建议使用客户端下载')
          return ;
        }
        this.createDownUrl(this.oprFiles)
      },

      delItemReq(ids){
        let c = ''
        if(sessionStorage.getItem('picFlag') == 'false'){
         c = '/api/img/del_group'
        }
        if(this.$route.name=='imgdetail'){
         c ='/api/img/del_group_img'
        }
        const params ={
          action:'1',
          ids:ids,
        }
        const par ={
          groupId:ids,
          ids:ids
        }
        this.$http({
          //ydh  a处理分组删除
          url:c ? c: '/api/files/update_status',
          method:'post',
          data:c ? par:params
        }).then(res=>{
          if(res.data.code === 100001){
            this.operationProgress.sucNum++;
            this.operationProgress.percenter=Math.ceil((this.operationProgress.sucNum/this.operationProgress.sum)*100);
            this.delGenRes = this.delFn.next();
            if(this.delGenRes.done){
              this.$emit('uploaded');
              this.operationTip=false;
              //ydh 删除内存空间变化
              if(!c){
                localStorage.setItem('usedSpace',res.data.data.usedSpace)
                b.$emit('size',res.data.data.usedSpace)
              }
              // ------end------
              this.$message({
                type:'success',
                message:'删除成功',
                duration:1000
              })
            }
          }
          else{
            this.operationTip=false;
          }
        }).catch(err=>{
          console.log(err)
          this.operationTip=false;
        })
      },

      createReq(targetid,obj,action){
        this.type = action ? action : this.type;
        if( (obj.parentId == targetid || targetid == obj.id) && this.type == "1" ){
          this.operationTip=false;
          this.$message({
            message: '不能将文件移动到自身或其子目录下',
            type: 'error',
            duration:1000
          });
          return;
        }
        const params = {
          action:this.type,
          catalogId:targetid,    //目标目录id
          retain:this.retain,
          id:obj.id            //文件id
        }
        this.$http({
          url:'/api/files/operate',
          method:'post',
          data:params
        }).then(res=>{
          if(res.data.code === 100001){
            if(this.operationFlag){
              this.initPregressAttr();
              this.operationFlag=false;
            }
            //ydh 处理上传内存空间变化
            localStorage.setItem('usedSpace',res.data.data.usedSpace);
            b.$emit('size',res.data.data.usedSpace)
            // --------------end----------------
            //没有重名，直接通过
            this.operationProgress.sucNum++;
            this.operationProgress.percenter=Math.ceil((this.operationProgress.sucNum/this.operationProgress.sum)*100);
            this.genRes = this.fn.next();
            if(this.genRes.done){
              //多文件移动复制结束
              this.retain = '';
              this.$emit('uploaded');
              this.operationTip=false;
              let title=(params.action==1)? "移动成功":"复制成功"
              this.$message({
                type:'success',
                message:title,
                duration:1000
              })
            }
          }else if(res.data.code === 100081 && !this.retain ){
            //有同名文件
            this.showdialog = true;
            this.operationTip=false;
            this.sameFile = params;
            this.move = Object.assign({},res.data.data.exister)
            this.moved = Object.assign({},res.data.data.source)
          } else if(res.data.code === 110003){
            //不能移动到自己目录或者自己的子目录
            this.operationTip = false;
          }else if(res.data.code === 100301){
            this.operationTip = false;
          }
          else{
            this.operationTip=false;
          }
        }).catch(err=>{
          console.log(err);
          this.operationTip=false;
          // this.$emit('resetCurrentFolder',data.id)
        });
      },
      * delGen(){
        // 20个分组删除
        // const arr=[];
        // if(this.oprFiles.length>20){
        //   for(let i=0;i<this.oprFiles.length;i+=20){
        //     arr.push(this.oprFiles.slice(i,i+20).map(item=>item.id).join(','));
        //   }
        //   for(let i=0;i<arr.length;i++){
        //     yield this.delItemReq(arr[i]);
        //   }
        // }else{
        //   yield this.delItemReq(this.oprFiles.map(item=>item.id).join(','));
        // }
        // 单文件删除
        for(let item of this.oprFiles){
          yield this.delItemReq(item.id);
        }
      },
      * gen(folder,data,action){
        if(data){
          yield this.createReq(folder.id,data,action);
          return ;
        }
        for(let item of this.oprFiles){
          yield this.createReq(folder.id,item)
        }
      },
      del(){
        //如果文件正在被重命名，禁止其他操作；
        if(this.renameFlag) return ;
        const _this=this;
        //ydh 添加删除弹框 this.$confirm
        const h = '<div>确认要把所选文件放入回收站吗？</div><div>删除的文件可以在十天内通过回收站还原</div>'
        this.$confirm(h, '文件删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.initPregressAttr();
          this.operationProgress.title="删除进度";
          _this.delFn = _this.delGen();
          _this.delGenRes = _this.delFn.next();
        }).catch(() => {
        });

      },
      moveOrCopy(folder,data,action){
        //如果文件正在被重命名，禁止其他操作；
        if(this.renameFlag) return ;
        this.operationFlag=true;
        let title=(action)? ((action==1)? "移动进度":"复制进度"):((this.type==1)? "移动进度":"复制进度");
        this.operationProgress.title=title;
        this.fn = this.gen(folder,data,action);
        this.genRes = this.fn.next();
      },
      replace(retain){
        const _this = this;
        this.showdialog = false;
        this.retain = retain;
        this.$http({
          url:'/api/files/operate',
          method:'post',
          data:Object.assign({},this.sameFile,{retain})
        }).then( res =>{
          if(res.data.code === 100001){
            if(this.operationFlag){
              this.initPregressAttr();
              this.operationFlag=false;
            }
            //ydh 处理上传内存空间变化
            localStorage.setItem('usedSpace',res.data.data.usedSpace);
            b.$emit('size',res.data.data.usedSpace)
            // --------------end----------------
            this.genRes = this.fn.next();
            this.operationProgress.sucNum++;
            this.operationProgress.percenter=Math.ceil((this.operationProgress.sucNum/this.operationProgress.sum)*100);
            if(this.genRes.done){
              //多文件移动复制结束
              this.retain = '';
              this.$emit('uploaded');
              this.operationTip=false;
              this.$message({
                type:'success',
                message:'操作成功',
                duration:1000
              })
            }
          }else if(res.data.code === 100301){
            this.operationTip = false;
          }
        }).catch(err=>{
          console.log(err);
          this.operationTip=false;
        })
        // this.genRes = this.fn.next();
        // while(true){
        //   if(this.genRes.done){
        //     //多文件移动复制结束
        //     _this.$emit('resetCurrentFolder');
        //     _this.retain = ''
        //     return ;
        //   }
        // }
      },
      initPregressAttr(){
        this.operationTip=true;
        this.operationProgress.sucNum=0;
        this.operationProgress.sum=(this.oprFiles.length)? this.oprFiles.length : 1;
        this.operationProgress.percenter=Math.ceil((this.operationProgress.sucNum/this.operationProgress.sum)*100);
      },
      more(type){
        switch(type){
          case "重命名":
            if(this.$route.name == 'image' && this.v){
              this.$emit('rename');
            }else {
              this.$emit('rename');
              this.requestName = ''
            }
            break;
          case "移动到":
            //如果文件正在被重命名，禁止其他操作；
            if(this.renameFlag) return ;
            this.type = 1;
            this.title = "移动文件"
            this.$emit('changeFolder')
            break;
          case "复制到":
            if(this.renameFlag) return ;
            this.type = 2;
            this.title = "复制文件"
            this.$emit('changeFolder')
            break;
          case "更改分组":
            // this.type = 3;
            // this.title = "更改分组"
            if(this.renameFlag) return ;
            this.$emit('grouping')
            break;
          default:
            this.$emit('click');
        }
      },
      shareMore(){
        this.$emit('shareShow')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .component-buttonlist{
    font-size:0;
    display:inline-block;   vertical-align:top;position:relative; height:36px; border:1px solid #5cbbf4;border-radius:5px;
    & .component-button{border:none; border-radius:0; margin-right:0; font-size:14px;}
    & .component-button + .component-button{border-left:1px solid #5cbbf4;font-size:14px;}

  }
  .file-replace{
    & h3{line-height:22px; width:100%; text-align:center; color: #5a5a5a;}
    & dl{
      width:100%; padding:15px;margin-top:10px;background-color:#eaf7ff; box-sizing:border-box;
      & dd,
      & dt{margin:0; padding:0;}
      & dd{position:relative; font-size:0; padding:8px 0;
        & .name{
          font-size: 14px;line-height: 36px;display: inline-block;margin-left: 10px;max-width:470px; white-space:nowrap; overflow:hidden;
          text-overflow:ellipsis;
        }
        & i,
        & section{display:inline-block;vertical-align:top;}
        & i{border:none; border-radius:4px; overflow:hidden; width:30px; height:34px;}
        & section{font-size:14px;height:34px; overflow:hidden; line-height:20px; }
        & .size{
          margin-right: 10px;
        }
      }
      & dt ~ dt{ margin-top:15px;}
    }
    & .footer{ width:100%;position:relative;
      & .component-button{ margin-right:15px; border:1px solid #5cbbf4;border-radius:5px;}
      & aside{position:absolute; left:0; top:0;
        & .component-button{ border:none;}
      }

    }
  }

</style>



