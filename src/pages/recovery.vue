<template>
  <section class="page-recovery page-all" v-loading = "loadingList">
    <section class="title"><span>提示</span>
      <span>( 回收站不占用网盘空间，文件保存{{maxDate}}天后将被自动清除 )</span>
      <el-button class="comBtns" @click="clearAll">
        <i class="icon icon-delete" style="display: inline-block;width: 14px;height: 14px;"></i>
        清空回收站
      </el-button>
    </section>
    <List
      ref="child"
      :params = "queryData"
      :url="url"
      :reload = "reload"
      :iconShow=iconShow
      :tableHead="tableHead"
      @getSelectData = "getSelectData"
      @deleting="deleting"
      @recover="recover"
    >
    </List>
    <Progress
      :operationTip="operationTip"
      :operationProgress="operationProgress"
    />
  </section>
</template>

<script>
  import List from '../components/listOther'
  import Progress from '../components/progress'
  import bb  from  '../util/newVue'
  export default {
    name: "recovery",
    components:{
      List,
      Progress
    },
    data(){
      return{
        loadingList:false,
        iconShow:"3",
        reload:2,
        queryData:{
          name:'',
          type:'2',
          id:'-1',
        },
        url:'/api/files/recycle',
        tableHead:{
          name:'文件名',
          time:'大小',
          outTime:'删除时间',
          inTime:'有效期'
        },
        selectData:[],
        operationProgress:{
          title:'还原进度',
          percenter:0,
          sum:0,
          sucNum:1
        },
        operationTip:false,
        fn:{},
        delFn:{},
        delGenRes:{},
      }
    },
    computed: {
      maxDate(){
        let vip = JSON.parse(sessionStorage.getItem('visit')).vip;
        if( vip.toString() === '1' ){
          return '15'
        } else {
          return '10'
        }
      }
    },
    methods:{
      getList(e,data){
        const params = {
          ids:data.id,
          action:e
        }
        this.operationTip = true
        this.$http({
          url:'/api/files/update_status',
          method:'post',
          data:params
        }).then((res)=>{
          if(res.data.code == 100001){
            this.operationProgress.sucNum++;
            this.operationProgress.percenter=Math.ceil((this.operationProgress.sucNum/this.operationProgress.sum)*100);
            this.delGenRes = this.delFn.next();
            if(this.delGenRes.done){
              this.operationTip = false
              this.$refs.child.getList(1)
              //ydh 处理上传内存空间变化
              localStorage.setItem('usedSpace',res.data.data.usedSpace);
              bb.$emit('size',res.data.data.usedSpace)
              // ------end------
              this.$message({
                message: res.data.msg,
                type: 'success',
                duration:1000
              });
            }
          }else if(res.data.code === 100301){
            this.operationTip = false;
          }else{
            this.operationTip = false;
          }
        }).catch((err)=>{
          this.loadingList = false;
          this.operationTip = false;
          console.log(err);})
      },
      clearData(){
        this.$http({
          url:'/api/files/recycle/clear',
          method:"post",
          data:{}
        }).then((res)=>{
          if(res.data.code == 100001){
              this.$refs.child.getList(1)
              this.$message({
                message: res.data.msg,
                type: 'success',
                duration:1000
              });
          }
        }).catch(err=>{
          console.log(err);
        })
      },
      getSelectData(data){
        this.selectData = data
      },
      * delGen(c){
        //删除还原
        for(let item of this.selectData){
          yield this.getList(c,item)
        }
      },
      recover(data){
        const _this = this
       if(!data.length){
         this.selectData = [data]
       }
        this.$confirm('确认还原选中的文件？', '确认还原', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.initPregressAttr("还原进度");
          _this.delFn = _this.delGen(2);
          _this.delGenRes = _this.delFn.next();
        }).catch(() => {});
      },
      deleting(data){
        const _this = this
        this.selectData =data
         this.$confirm('文件删除后将无法恢复，您确认要彻底删除所选文件吗？', '彻底删除', {
           confirmButtonText: '确定',
           cancelButtonText: '取消'
         }).then(() => {
           this.initPregressAttr("删除进度");
           _this.delFn = _this.delGen(3);
           _this.delGenRes = _this.delFn.next();
         }).catch(() => {});
      },
      clearAll(){
       if(this.$refs.child.dataList.length==0){
         return
       }
        const _this = this
        this.selectData =this.$refs.child.dataList
        this.$confirm('确认清空回收站？', '清空回收站', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.clearData();
        }).catch(() => {});
      },
      initPregressAttr(title){
        this.operationTip=true;
        this.operationProgress.sucNum=0;
        this.operationProgress.sum=this.selectData.length
        this.operationProgress.title=title;
        this.operationProgress.percenter=Math.ceil((this.operationProgress.sucNum/this.operationProgress.sum)*100);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .page-recovery{
    &>.title{
      position: relative;
      height: 56px;
      line-height: 56px;
      top: 0px;
      background: #fff;
      color: #acb4bb;
      font-size: 12px;
      width: 100%;
      padding: 0px 20px 0 20px;
      & .comBtns{
        position: absolute;
        top: 12px;
        right: 20px;
      }
      &>span:first-child{
        font-size: 14px;
        color: #5a5a5a;
        font-weight: 600;
      }
      &>span:last-child{
        font-size: 12px;
        color: #acb4bb;
      }
      & img{
        vertical-align: bottom;
      }
    }
  }
</style>
<style>
  .page-recovery  .component-list   dt > span{
    width: 17%!important;
  }
  .page-recovery  .component-list   dd > span{
    width: 17%!important;
  }

  .page-recovery #cc{
    width: 49%!important;
  }
  .page-recovery  .component-list   dd > section{
    width: 49%!important;
  }
</style>
