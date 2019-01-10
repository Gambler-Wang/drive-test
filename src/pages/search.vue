<template>
    <section class="page-all" v-loading = "loadingList">
        <section class="all-header">
            <Button value="上传文件" ref="uploadfiles" :nofiles="ieFlag" icon="icon-upload" btnClass="active" type="file" @change="getFiles"/>
            <!--<Button value="新建文件夹" icon="icon-newfolder" @click="createFolderFlag = !createFolderFlag" />-->
            <!--<Offline-->
              <!--@changeFolder="closeTree"-->
              <!--:currentFolder="currentFolder"-->
            <!--/>-->
            <ButtonList
                :oprFiles = "selectData"
                @uploaded="uploaded"
                @rename="rename"
                :currentFolder="currentFolder"
                @changeFolder = "closeTree" ref="bList"
                @shareShow="shareShow"
                :renameFlag = "renameFlag"
            ></ButtonList>
            <section class="header-right">
                <p class="header-right-search"><input type="text" name="search" placeholder="搜索您的文件"  v-model.trim="searchName" @keyup.enter="search" /><i class="icon icon-search" @click="search"></i><i class="icon el-icon-close" @click="searchName=''" v-if="searchName"></i></p>
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
            :searchName="querystring"
            ref="list"
        />
        <Tree :showtree = "showtree" @close = "closeTree" @getTreeData="getTreeData" @selectFolder="closeTree"></Tree>
      <ShareDialog :shareDialog="shareDialog" :shareData="selectData"></ShareDialog>
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
    name:'all',
    components:{
        Operation,List,Dialog,Button,Nodata,Offline,Tree,ButtonList,Rank,ShareDialog
    },
    data(){
        return {
            showDialog:false,
            files:[],
            queryData:{
                id:this.$route.query.id,
                fileType:this.$route.query.fileType!=1 ? this.$route.query.fileType :'',
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
            ieFlag:false,             //是否是ie浏览器
            selectData:[],
            currentFolder:{          //选择文件夹信息
                id:this.$route.query.id ? this.$route.query.id:'',
            },
            styleFlag:sessionStorage.getItem('styleFlag') == 'false' ? false :true,
            searchName:'',
            querystring: '',
            singleData:null,           //更多操作 移动复制
            singleAction:1,            //更多操作 移动复制
            sort:{sort:'2',rank:'1'},
            shareData:[]
        }
    },
    watch:{
      $route(newval,oldval){
        this.catId = newval.query.id;
        this.queryData = Object.assign({},this.queryData,{id:newval.query.id});
        this.uploaded()
      }
    },
    methods:{
        newLink(){},
        clearList(){},
        getList(){
            const params = Object.assign({},this.queryData);
            this.loadingList = true;
            this.$http({
                url:'/api/files/index',
                method:'post',
                data:params
            }).then((res)=>{
                this.loadingList = false;
                this.dataList =  res.data.data.data;
                // this.showNodata = this.dataList.length > 0 ? false : true;
            }).catch((err)=>{
                this.loadingList = false;
            })
        },
        search(){
          if(this.searchName.trim().length==0){
            return
          }else {
            this.$router.push({
              path: '/search',
              query: {id:this.$route.query.id, querystring: this.searchName,path:this.$route.query.path,fileType:this.$route.query.fileType}
            })
            this.queryData = Object.assign({}, this.queryData, {name: this.searchName})
            this.querystring = this.searchName;
            this.uploaded()
          }
        },
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
            this.selectData = [];
            this.reload += 1;
            if(type === "uploaded"){
                this.$refs.uploadfiles.clear();
            }
        },
        rename(){
            // this.renameFlag = !this.renameFlag;
          this.$refs.list.renameData();
        },
        getSelectData(data){
            this.selectData = data;
        },
        closeTree(){
            this.showtree = !this.showtree;
        },
        getTreeData(folder) {
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
        this.selectData =[]
        //action 1 move 2 copy

      },
      shareShow(v){
        this.shareDialog = true
      },
      changeSort(sort){
        this.sort = sort;
      }
    },
    created(){
        const ieVeriosn = this.IEVersion();
        if(ieVeriosn !== -1 ){
        this.ieFlag = true;
      }
      this.uploaded();
      b.$on('shareDialog',(val)=>{
        this.shareDialog = val
      })
     if(this.$route.query.querystring){
        this.searchName = this.$route.query.querystring
        this.search()
     }
    }
}
</script>


