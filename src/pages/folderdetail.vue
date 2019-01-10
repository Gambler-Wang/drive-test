<template>
    <section class="page-all" v-loading = "loadingList">
        <section class="all-header">
            <Button value="上传文件" ref="uploadfiles" :nofiles="ieFlag" icon="icon-upload" btnClass="active" type="file" @change="getFiles"/>
            <Button value="新建文件夹" icon="icon-newfolder" @click="createFolder" />
            <Offline
              @changeFolder="closeTree"
              :savePath = 'offlineSavePath'
              :offlineDownFlag.sync = "offlineDownFlag"
              v-show="selectData.length==0"
            />
            <ButtonList
              :oprFiles = "selectData"
              @uploaded="uploaded"
              @rename="rename"
              @shareShow="shareShow"
              :currentFolder="currentFolder"
              @changeFolder = "closeTree" ref="bList"
              :renameFlag = "renameFlag"
            ></ButtonList>
            <section class="header-right">
                <p class="header-right-search"><input type="text" name="search" placeholder="搜索您的文件" v-model.trim="searchName" @keyup.enter="search" /><i class="icon icon-search" @click="search"></i><i class="icon el-icon-close" @click="searchName=''" v-if="searchName"></i></p>

                <section class="header-right-sort">
                    <Rank @changeSort="changeSort" />
                </section>
                <p class="header-right-layout" ><i :class="['icon iconfont',this.styleFlag ? 'icon-tb':'icon-lb']" @click="changeStyle"></i></p>
            </section>
        </section>

        <!-- <Operation /> -->
        <!-- <Dialog :showDialog = "showDialog" :files = "files" @close="showDialog = !showDialog" @uploaded="uploaded" :catId="catId"/> -->
        <List
            :params = "queryData"
            :reload = "reload"
            @getSelectData = "getSelectData"
            @rename = "rename"
            @shareShow="shareShow"
            @moveOrCopy='moveOrCopy'
            :renameFlag.sync="renameFlag"
            :styleFlag = "styleFlag"
            :sort = "sort"
            :searchName = "querystring"
            ref="list"
        />
        <Tree :showtree = "showtree" @close = "closeTree" @getTreeData="getTreeData" ></Tree>
      <ShareDialog :shareDialog="shareDialog" :shareData="selectData"></ShareDialog>
    <el-dialog
      title="提示"
      :visible.sync="ieversion"
      width="485px !important"
      class="ieversion"
    >
      <p>检测到您正在使用<strong>IE浏览器</strong>，可能会导致部分功能无法使用</p>
      <p>请下载<a href="https://www.google.cn/chrome/">Google Chrome浏览器</a>或<a href="javascript:;">掌云网盘客户端</a></p>
      <footer slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="ieversion = false">关 闭</el-button>
      </footer>
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
import Rank from '@/components/rank';
import ShareDialog from '@/components/shareDialog';
import b from '../util/newVue'
export default {
    name:'folderDetail',
    components:{
        Operation,List,Dialog,Button,Nodata,Offline,Tree,ButtonList,Rank,ShareDialog
    },
    data(){
        return {
            showDialog:false,
            files:[],
            queryData:{
                id:this.$route.query.id,
                name:''
            },
            catId:this.$route.query.id,
            reload:1,
            createFolderFlag:false,
            renameFlag:false,
            dataList:[],
            offlineList:[],
            loadingList:false,
            showNodata : false,
            dialogBt:false,
            showtree:false,
            shareDialog:false,
            ieversion:false,          //ie提示
            ieFlag:false,             //是否是ie浏览器
            selectData:[],
            currentFolder:{          //选择文件夹信息
                id:this.$route.query.id ? this.$route.query.id:'',
            },
            styleFlag:sessionStorage.getItem('styleFlag') == 'false' ? false :true,
            searchName:'',
            querystring:'',
            sort:{sort:'2',rank:'1'},
	          singleData:null,           //更多操作 移动复制
            singleAction:1,             //更多操作 移动复制
            offlineSavePath:{id:this.$route.query.id ? this.$route.query.id : '-1'},
            offlineDownFlag:false,     //是否正在离线下载
            shareData:[]
        }
    },
    watch:{
      "$route"(newval,oldval){
        this.catId = newval.query.id;
        this.queryData = Object.assign({},this.queryData,{id:newval.query.id});
        this.uploaded()
      }
    },
    methods:{
      search(){
        if(this.searchName.trim().length==0){
          return
        }else {
          this.queryData.name = this.searchName
          this.$refs.list.getList()
        }
      },
      // callGoogle() {
      //   /*
      //   创建ActiveXObject实例，只在IE下有效，才可以创建
      //   */
      //   var objShell= new ActiveXObject("WScript.Shell");
      //   /*
      //   命令参数说明
      //   cmd.exe /c dir 是执行完dir命令后关闭命令窗口。
      //   cmd.exe /k dir 是执行完dir命令后不关闭命令窗口。
      //   cmd.exe /c start dir 会打开一个新窗口后执行dir指令，原窗口会关闭。
      //   cmd.exe /k start dir 会打开一个新窗口后执行dir指令，原窗口不会关闭。
      //   这里的dir是start chrome www.baidu.com//用谷歌浏览器打开百度
      //   */
      //   objShell.Run("cmd.exe /c start chrome 120.79.193.155:8009",0,true);
      // },
      updated() {},
      changeStyle(){
        this.styleFlag = !this.styleFlag;
        sessionStorage.setItem('styleFlag',this.styleFlag)
          this.$previewRefresh()
      },
      //上传列表
      getFiles(files){
          if( files.length > 0 ){
              // this.showDialog = true;
              // this.files = files;
              this.$emit('uploadFiles',files)
          }
      },
      uploaded(type){
        this.searchName = ''
        this.queryData.name = this.searchName
        this.selectData = [];
        this.reload += 1;
        if(type === "uploaded"){
          this.$refs.uploadfiles.clear();
        }
      },
      rename() {
        // this.renameFlag = !this.renameFlag;
        this.$refs.list.renameData();
      },
      createFolder(){
        this.$refs.list.showCreateFolderBox();
      },
      getSelectData(data){
          this.selectData = data;
      },
      closeTree(type) {
        if(type){
          this.offlineDownFlag = true;
        }
        this.showtree = !this.showtree;
      },
      getTreeData(folder) {

        if(this.offlineDownFlag){
          //离线下载获取保存路径
          this.offlineSavePath = folder;
          return ;
        }
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
      // resetCurrentFolder(v) {
      //   let i = v ? v : '-1'
      //   this.currentFolder = {
      //     id: this.$route.query.id ? this.$route.query.id : i,
      //   }
      // },
      shareShow(v){
        this.shareDialog = true
      },
      changeSort(sort){
        this.sort = sort;
      }
    },
    created() {
      const ieVeriosn = this.IEVersion();
      if(ieVeriosn !== -1 ){
        this.ieFlag = true;
      }
      if( 5 < ieVeriosn && ieVeriosn < 10){
         this.ieversion=true;
      }
      this.uploaded();
      b.$on('shareDialog',(val)=>{
        this.shareDialog = val
      })
    }
}
</script>
<style lang="scss" scoped>
.page-all{
  & .ieversion{
    text-align:center;
    & p {line-height:36px;}
    & strong{ font-weight:normal; color:#fc4343;}
    & a{ text-decoration: none; color:#54b2eb;}
  }
}
</style>


