<template>
  <section class="page-all page-image" v-loading = "loadingList">
    <section class="all-header">
      <el-button class="picBtn" :class="{com:picShow}" @click="allPic" v-show="selectData.length==0">全部图片</el-button>
      <el-button class="picBtn" :class="{com:!picShow}" @click="pic"  v-show="selectData.length==0">图片分组</el-button>
      <ButtonList
        :oprFiles = "selectData"
        @uploaded="uploaded"
        @rename="rename"
        :currentFolder="currentFolder"
        :picShow="picShow"
        @changeFolder = "closeTree"
        @grouping="grouping"
        :delShow = "delShow"
        ref="bList"
        @shareShow="shareShow"
        :renameFlag = "renameFlag"
      ></ButtonList>
      <section class="header-right">
        <p class="header-right-search"><input type="text" name="search" placeholder="搜索您的文件" v-model.trim="searchName" @keyup.enter="search" /><i class="icon icon-search" @click="search" ></i><i class="icon el-icon-close" @click="searchName=''" v-if="searchName"></i></p>
        <section class="header-right-sort">
          <Rank @changeSort="changeSort" />
        </section>
        <p class="header-right-layout"><i :class="['icon iconfont',this.styleFlag ? 'icon-tb':'icon-lb']" v-show="styleStatus" @click="changeStyle"></i></p>
      </section>
    </section>
    <!-- <Operation /> -->
    <Dialog :showDialog = "showDialog"  :files = "files" @close="showDialog = !showDialog" @uploaded="uploaded" :catId="queryData.id"  />
    <List
      v-if="!picShow"
      :params = "queryData"
      :url="url"
      :reload = "reload"
      @getSelectData = "getSelectData"
      @rename = "rename"
      @shareShow="shareShow"
      @moveOrCopy='moveOrCopy'
      :createFolderFlag.sync="createFolderFlag"
      :renameFlag="renameFlag"
      :styleFlag = "styleFlag"
      :sort = "sort"
      :searchName="querystring"
      ref="list"
    />
    <listCard
      v-else
      :reload = "reload"
      @getSelectData = "getSelectData"
      :createFolderFlag.sync="createFolderFlag"
      @shareShow="shareShow"
      @rename="rename"
      :renameFlag="renameFlag"
      :sort = "sort"
      @toAll="toAll"
      ref="list"
    ></listCard>
    <Tree :showtree = "showtree" @close = "closeTree" @getTreeData="getTreeData" @selectFolder="closeTree" ></Tree>
    <ShareDialog :shareDialog="shareDialog" :shareData="selectData"></ShareDialog>
    <el-dialog
      title="更改分组"
      :visible.sync="groupVisible"
      width="30%"
    >
      <section id="group">
        <div>
          <el-radio v-model="radio" :label="String(index+1)" border size="medium" v-for="(item,index) in picData" :key="index">
            <img src="http://120.79.193.155:8005/icon/folder.png" alt="" class="bgc">
            <span class="text">{{item.name}}</span>
          </el-radio>
        </div>
      </section>

      <span slot="footer" class="dialog-footer">
    <el-button  class="comBtns"  @click="groupVisible = false">取 消</el-button>
    <el-button  class="comBtn"  type="primary" @click="addGroup">确 定</el-button>
  </span>
    </el-dialog>
  </section>
</template>
<script>
  import Operation from '@/components/operation';
  import List from '@/components/list';
  import Dialog from '@/components/dialog';
  import Button from '@/components/button';
  import Nodata from '@/components/nodata';
  import Offline from '@/components/offlinedown';
  import Tree from '@/components/tree';
  import ButtonList from '@/components/buttonlist';
  import newCard from '../components/newCard'
  import listCard from '../components/listCard'
  import ShareDialog from '@/components/shareDialog';
  import b from '../util/newVue'
  import Rank from '@/components/rank';
  export default {
    name:'all',
    components:{
      Operation,List,Dialog,Button,Nodata,Offline,Tree,ButtonList,newCard,ShareDialog,Rank,listCard
    },
    data(){
      return {
        radio:'1',
        delShow:true,
        groupVisible:false,
        styleStatus:true,
        picShow:sessionStorage.getItem('picFlag') == 'false' ? false :true,
        showDialog:false,
        files:[],
        queryData:{
          groupId:this.$route.query.id,
          name:''
        },
        url:"/api/img/get_img",
        picData:[],
        reload:1,
        createFolderFlag:false,
        renameFlag:false,
        dataList:[],
        offlineList:[],
        loadingList:false,
        // showNodata : false,
        dialogBt:false,
        showtree:false,
        shareDialog:false,
        selectData:[],
        currentFolder:{          //选择文件夹信息
          id:this.$route.query.id ? this.$route.query.id:''
        },
        styleFlag:sessionStorage.getItem('styleFlag') == 'false' ? false :true,
        searchName:'',
        sort:{sort:'2',rank:'1'},
        singleData:null,           //更多操作 移动复制
        singleAction:1,             //更多操作 移动复制
        shareData:[],
        querystring: '',
      }
    },
    computed:{
      // showNodata(){
      //     return this.dataList.length > 0 ? true : false;
      // }
    },
    methods:{
      search(){
        if (this.searchName.trim().length==0) {
          return
        } else {
            this.queryData.name = this.searchName
            this.$refs.list.getList()
        }
      },
      updated() {},
      changeStyle(){
        this.styleFlag = !this.styleFlag;
        sessionStorage.setItem('styleFlag',this.styleFlag)
        this.$previewRefresh()
      },
      //列表更新
      uploaded(type){
        this.selectData = [];
        this.reload += 1;
        if(type === "uploaded"){
          this.$refs.uploadfiles.clear();
        }
      },
      rename() {
        this.$refs.list.renameData();
      },
      //更改分组
      grouping(){
        this.$http({
          url:'./api/img/index',
          method:'post',
          data:{}
        }).then((res)=>{
          this.picData = res.data.data.dataList
          this.groupVisible = true
        }).catch((err)=>{
          console.log(err)
        })
      },
      addGroup(){
        this.groupVisible = false
        const params ={
          ids:this.selectData.map(item=>item.id).join(','),
          groupId:String(this.picData[Number(this.radio) - 1].id)
        }
        this.$http({
          url:"/api/img/set_group",
          method:'post',
          data:params
        }).then((res)=>{
          if(res.data.code==100001){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.$refs.list.getList(1)
            this.selectData=[]
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      createFolder(){
        this.$refs.list.showCreateFolderBox()
      },
      getSelectData(data){
        this.selectData = data;
      },
      offlineDownload(){},
      closeTree(){
        this.showtree = !this.showtree;
      },
      getTreeData(folder) {
        this.currentFolder = folder;
        // this.$emit('moveOrCopy');
        if(this.singleData){
          //判断是否是通过更多图标操作
          this.$refs.bList.moveOrCopy(folder,this.singleData,this.singleAction);this.singleData = null;
        }else{
          this.$refs.bList.moveOrCopy(folder);
        }
    },
      moveOrCopy(data,action){
        this.singleData = data;
        this.singleAction = action;
        this.closeTree();
        //action 1 move 2 copy
      },
      //图片分组
      pic(){
        sessionStorage.setItem('picFlag',false)
        this.$router.push({path:'/image'})
      },
      allPic(){
        this.$router.push({path:'/image'})
      },
      //card中全部跳转
      toAll(){
        this.picShow = true
        this.styleFlag  =false
        this.delShow = true
        this.$previewRefresh()
      },
      changList(){
        this.pic()
      },
      shareShow(v){
        this.shareDialog = true
      },
      changeSort(sort){
        this.sort = sort;
      }
    },
    created(){
      if(!sessionStorage.getItem('picFlag')){
        this.picShow  = false
      }
      this.uploaded();
      b.$on('shareDialog',(val)=>{
        this.shareDialog =  val
      })
    }
  }
</script>
<style  lang="scss" scoped>
  .page-image .picBtn {
    padding:10px 20px;
    border-color:#5cbbf4;
    &.com{
      background: #7fcfff;
      border-color:#5cbbf4;
      color: #fff;
    }
  }
  section#group {
    max-height: 210px;
    overflow-y: auto;
  }
</style>
