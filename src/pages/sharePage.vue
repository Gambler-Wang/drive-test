<template>
  <section class="page-sharePage page-all">
    <section class="title"><span>链接分享</span><span>（分享失败超过1年以上的链接记录将自动清理）</span></section>
    <List
      ref="child"
      :params = "queryData"
      :url="url"
      :iconShow= iconShow
      :tableHead="tableHead"
      @getSelectData = "getSelectData"
      @cancelShare="cancelShare"
      @copyUrl="copyUrl"
    >
    </List>
  </section>
</template>

<script>
  import List from '../components/listOther'
  export default {
    name: "sharePage",
    components:{
      List
    },
    data(){
      return{
        iconShow:"2",
        queryData:{
          name:'',
          type:'2',
          id:'-1',
        },
        url:'/api/files/share/list',
        tableHead:{
          name:'分享文件',
          time:'分享时间',
          outTime:'失效时间'
        }
      }
    },
    methods:{
      getSelectData(data){
        this.selectData = data;
      },
      cancelShare(data){
        if(!data.length){
          var tag = data.id
        }else {
          let str = ''
          data.forEach((v,i)=>{
            str=str+v.id+','
          })
          str= str.substring(0,str.length-1)
          var tag = str
        }
        const obj = '<div style="font-size: 14px;text-align: center">取消分享后，该条分享记录将被删除，</div>  <div style="font-size: 14px;text-align: center">好友将无法再访问此分享链接。</div>'
        this.$confirm(obj, '取消分享', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.loadingList = true;
          this.$http({
            url:'/api/files/share/cancel',
            method:'post',
            data:{
              shareIds:tag
            }
          }).then((res)=>{
            this.loadingList = false;
            this.$message({
              message: res.data.msg,
              type: 'success',
              duration:1000
            });
            $($('.shareUrl ')).parents('dd').siblings('dd').find('.shareUrl').removeClass('active')
            this.$refs.child.getList(1)
          }).catch((err)=>{
            console.log(err);})
        }).catch(() => {
          $($('.shareUrl ')).parents('dd').siblings('dd').find('.shareUrl').removeClass('active')
        });
      },
      copyUrl(data){
        this.$message({
          message: '分享链接已复制，快去分享给朋友吧！',
          type: 'success',
          duration:1000
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-sharePage{
    &>.title{
      position: relative;
      height: 56px;
      line-height: 56px;
      top: 0px;
      background: #fff;
      width: 100%;
      padding: 0px 20px 0 20px;
      &>span:first-child{
        font-size: 14px;
        color: #5a5a5a;
        font-weight: 600;
      }
      &>span:last-child{
        font-size: 12px;
        color: #acb4bb;
      }
    }
  }
</style>
