<template>
    <section class="component-offlinedown">
        <Button value="离线下载" icon="icon-download"  @click="offlineDownload" />
         <!--新建BT任务弹框-->
        <el-dialog
            id="bt"
            title="离线下载任务列表"
            :visible.sync="dialogBt"
            :before-close = "listCloseBefore"
            width="37%"
        >
        <!-- <section style="width:100%; height:100%; position:absolute; left:0; top:0;"> -->
            <div class="dialog-top">
                <!-- <el-button class="comBtn" type="primary" @click="changeFile">新建BT任务</el-button> -->

                <p class="input-btn"><input type="file" name="" value="新建BT任务" @change="uploadBtfile" accept=".torrent"  /><span>新建BT任务</span></p>
                <el-button class="comBtns" @click="createUrlDownload">新建链接任务</el-button>
                <!-- <span>输入磁力链即可离线下载</span> -->
                <el-button class="comBtns last"  @click="clearList">全部清除</el-button>
            </div>
            <div class="dialog-center" v-loading="dataListLoading">
                <el-table
                    :data="dataList.dataList"
                    class="contentBox"
                    row-class-name = "table-item"
                    style="width: 100%">
                    <el-table-column
                    prop="fileName"
                    label="文件名"
                    class-name="table-item"
                    min-width="30%">
                    </el-table-column>
                    <el-table-column
                    prop="fileSize"
                    label="大小"
                    width="100">
                    <template slot-scope="scope">
                        <!-- <p>{{JSON.stringify(scope)}}</p> -->
                        {{sizeFormat(scope.row.fileSize)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                      prop="progress"
                      label="进度"
                      width="80"
                    >
                      <template slot-scope="scope">
                        <!-- <p>{{JSON.stringify(scope)}}</p> -->
                        {{progress(scope.row)}}
                      </template>
                    </el-table-column>
                    <el-table-column
                    label="状态" width="100">
                    <template slot-scope="scope">
                        <!-- <p>{{JSON.stringify(scope)}}</p> -->
                        {{fileStatus(scope.row.status)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="操作" width="100">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="small" v-if="scope.row.status === 5 && scope.row.fileType == '4'"><router-link tag="span" :to="{path:'/player',query:{id:scope.row.fileId}}" >播放</router-link></el-button> -->
                        <el-button type="text" size="small" v-if="scope.row.status === 5 && scope.row.fileType == '4'" @click="goPlay(scope.row)">播放</el-button>
                        <el-button tag="a" type="text" size="small" style="color: #5a5a5a" @click.prevent="delOfflineItem(scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <footer  class="dataListFooter" slot="footer"  v-if="dataList.totalPageCount > 1">
                  <el-pagination
                    background
                    layout="total,prev, pager, next"
                    :total="dataList.totalRowsCount"
                    :current-page="currentPage"
                    @current-change="getList"
                    :page-size = "6"
                    :page-count="dataList.totalPageCount">
                  </el-pagination>
                </footer>
            </div>
            <!-- <div class="dialog-bottom"></div>
            <span slot="footer" class="dialog-footer"></span> -->
        </el-dialog>
         <!--新建链接任务列表弹框-->
        <!--新建链接任务列表弹框-->
        <el-dialog
            id="linkList"
            title="离线下载任务列表"
            :visible.sync="dialoglinkList"

            width="30%"
            >
            <div class="dialog-top">
                <i class="icon icon-bts"></i>
                <div>
                    <p class="text" style="max-width:440px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">
                        {{btFiles.folderName}}</p>
                    <p class="size">大小：{{sizeFormat(btFiles.fileSize)}}</p>
                </div>
            </div>
            <div class="dialog-center">
                <el-table
                    :data="btFiles.list"
                    @selection-change="handleSelectionChange"
                    ref = "torrentList"
                    height="282"
                >
                    <el-table-column  type="selection" fixed></el-table-column>
                    <el-table-column prop="name" label="文件名称" width="390"></el-table-column>
                    <el-table-column prop="fileSize" label="文件大小">
                        <template slot-scope="scope">
                        <!-- <p>{{JSON.stringify(scope)}}</p> -->
                        {{sizeFormat(scope.row.fileSize)}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="dialog-bottom">
                <p>保存到:{{fullPath}}</p><el-button class="pathBtn" @click="changeFolder">更改</el-button>
            </div>
            <footer slot="footer" class="dialog-footer" >
                <el-button class="comBtn" type="primary" @click="startUp">开始下载</el-button>
                <el-button  class="comBtns" @click="dialoglinkList = false">取 消</el-button>
            </footer>
        </el-dialog>

        <!-- </section> -->
        <!--    开始    -->
        <el-dialog
            id="link"
            title="新建离线下载链接任务"
            :visible.sync="dialoglink"
            width="30%"
        >
            <div class="dialog-top">填写要下载的文件链接</div>
            <div class="dialog-center">
                <el-form label-position="top" label-width="80px">
                    <el-form-item label="文件链接">
                      <el-input v-model="btUrl"></el-input>
                    </el-form-item>
                </el-form>
                <!-- <p style="color: #5a5a5a;font-size: 12px">支持http/https/ftp/电驴/磁力链协议</p> -->
                <p style="color: #5a5a5a;font-size: 12px">支持http/https/ftp协议</p>
            </div>
            <div class="dialog-bottom">
                <p>保存到:{{fullPath}}</p><el-button class="pathBtn" @click="changeFolder">更改</el-button>
            </div>
            <footer slot="footer" class="dialog-footer">
                <el-button class="comBtn" type="primary" @click="parseUrl">确 定</el-button>
                <el-button  class="comBtns" @click="dialoglink = false">关 闭</el-button>
            </footer>
        </el-dialog>
        <section v-if="parseBtLoading" class="loading-box">
          <loading :message="parseBtTitle" />
        </section>
    </section>
</template>
<script>
import Button from "./button";
import Loading from './loading';
export default {
  name: "Offlinedown",
  components: { Button,Loading },
  props:{
    savePath:{
      type:Object,
      default:()=>({id:'-1'})
    },
    offlineDownFlag:Boolean
  },
  data() {
    return {
      dialogBt: false,
      dialoglinkList: false,
      dialoglink:false,
      dataListLoading:false,
      parseBtLoading:false,
      parseBtTitle:'种子文件解析中...',
      dataList: [],
      btFiles: {
        folderName: "",
        fileSize: 0
      },
      btUrl:'',
      selectBtData: [],
      initSavePath:{id:'-1'},
      fullPath:'全部文件',
      currentPage:1
    };
  },
  watch: {
    savePath(newval,oldval){
      this.getSavePath(newval.id)
    }
  },
  mounted(){
      this.getSavePath();
  },
  beforeDestroy(){
    clearInterval(this.polling);
  },
  methods: {
    listCloseBefore(done){
      clearInterval(this.polling);
      done();
    },
    goPlay(item){
      this.$router.push({path:'/player',query:{id:item.fileId}})
    },
    offlineDownload() {
      this.dialogBt = true;
      this.getList(1);
      // this.polling = setInterval(this.checkListStatus.bind(this),3000);
    },
    getList(page){
      if(typeof(page) === "number"){
        this.dataListLoading = true;
        this.currentPage = page;
      }
      clearInterval( this.polling );
      this.$http({
        url: "/api/offline/task_list",
        method: "post",
        data:{
          page:this.currentPage,
          perpage:6
        }
      }).then(res=>{
        this.dataListLoading = false;
        if(res.data.code === 100001 ){
          this.dataList = res.data.data;
          this.polling = setInterval(this.checkListStatus.bind(this),3000);
        }
      }).catch(err=>{
        this.dataListLoading = false;
      })
    },
    checkListStatus(){
      const items = this.dataList.dataList.filter(item => Number.parseInt(item.status) < 5 ),
            ids = items.map(item => item.id);
      if(ids.length === 0) {
        clearInterval(this.polling);
        return ;
      };
      this.$http({
        url: "/api/offline/check_progress",
        method: "post",
        data:{
          downloadTaskIds:ids.join(',')
        }
      }).then(res=>{
        if(res.data.code === 100001 ){
          const result = res.data.data.tasks;
          console.log( result );
          this.dataList.dataList.map(item => {
              result.forEach(i=>{
                if(item.id === i.downloadTaskId ){
                  item = Object.assign(item,i)
                }
              })
              return item;
          })
        }
      }).catch(err=>{
        console.log(err)
        clearInterval(this.polling);
      })
    },
    fileStatus(status){
      const state = Number.parseInt(status);
      switch( state ){
        case -1:
          return '下载失败';
        case 1:
          return '等待下载';
        case 4:
          return '保存中';
        case 5:
          return '已完成';
        default:
          return '正在下载';
      }
    },
    progress(data){
      const status = Number.parseInt(data.status);
      switch( status ){
        case -1:
          return '-';
        case 1:
        case 2:
        case 4:
          return data.progress === null ? '0.00%' : data.progress+'%';
        case 3:
          return data.progress === null ? '100.00%' : data.progress+'%';
        case 5:
          return '100.00%';
        default:
          return '0%';
      }
    },
    clearList() {
      this.$http({
        url: "/api/offline/task/clear",
        method: "post",
        data: {}
      }).then(res=>{
        if (res.data.code === 100001) {
          this.getList(1);
        }
      }).catch(err=>console.log(err))
    },
    delOfflineItem(item){
      this.$http({
        url: "/api/offline/task/del",
        method: "post",
        data: {
          downloadTaskIds:item.id
        }
      }).then(res=>{
        if (res.data.code === 100001) {
          this.getList(1);
        }
      }).catch(err=>console.log(err))
    },
    //改变保存文件夹
    changeFolder() {
      // this.closeTree();
      this.$emit('update:offlineDownFlag',true);
      this.$emit('changeFolder')
    },
    getSavePath(id){
      this.$emit('update:offlineDownFlag',false);
      const saveFileId = id ? id : (this.$route.query.id ?　this.$route.query.id:'-1');

      if(saveFileId === '-1'){
        this.fullPath = "/我的网盘";
        this.initSavePath = {id:'-1'}
        return ;
      }
      if(this.initSavePath.id === id ){
        return ;
      }
      this.$http({
        url: "/api/files/detail",
        method: "post",
        data: { id:saveFileId }
      }).then(res=>{
        if(res.data.code === 100001){
          this.fullPath = `${res.data.data.path}${res.data.data.name}`;
          this.initSavePath = res.data.data;
        }
      }).catch(err=>reject(err));
    },
    //获取种子解析文件列表
    getTorrentFiles(md5,fileObj){
      const files = this.$http({
        url: "/zuul/api/offline/analysis/torrent",
        headers: { "Content-Type": "multipart/form-data" },
        method: "post",
        data: {
          md5,
          torrentFile: fileObj
        }
      });
      return files;
    },
    async parseTorrent(file){
      const fileMD5 = await this.getFileMD5(file);
      const torrentFiles = await this.getTorrentFiles(fileMD5,file);
      return torrentFiles;
    },
    //上传bt种子文件，获取下载列表
    parseUrl(){

      if(this.btUrl.trim().length === 0 ){
        this.$message({
          type:'warning',
          message:'请输入下载地址'
        });
        return ;
      }
      this.dialoglink = false;
      const ftp = this.btUrl;
      this.btUrl = '';
      this.$http({
        url: "/api/offline/download/url",
        method: "post",
        data: {
          url:ftp,
          parentId:this.initSavePath.id
        }
      }).then(res=>{

        if (res.data.code === 100001) {
          this.getList(this.currentPage)
        }
      }).catch(err=>console.log(err))
    },
    uploadBtfile(e) {
      const file = e.target.files[0];
      const ext = file.name.slice(file.name.lastIndexOf('.'),file.name.length);
      if( ext !== '.torrent'){
        this.$message({
          type:'warning',
          message:'请选择正确的种子文件'
        })
        return;
      }
      if ( file.size > 0) {
          this.parseBtLoading = true;
          this.getSavePath();
          this.btFiles.folderName = file.name;
          this.parseTorrent(file).then(res=>{
            this.parseBtLoading = false;
            e.target.value = '';
            if(res.data.code === 100001){
              this.dialoglinkList = true; //显示弹框

              this.btFiles.list = res.data.data.files;
              this.btFiles.torrentId = res.data.data.torrentId;
              this.$nextTick(()=>{
                this.$refs.torrentList.toggleAllSelection();
              })
            }
          }).catch(err=>{
            this.parseBtLoading = false;
            this.btFiles.list = [];
            e.target.value = '';
            console.log('解析种子文件错误',err)
          });
      } else {
        this.$message({
          type: "error",
          message: "种子文件错误"
        });
        e.target.value = '';
      }
    },
    //获取选择下载种子文件的大小
    handleSelectionChange(data) {
      let size = 0;
      this.selectBtData = data;
      data.forEach(item => (size = size + Number.parseInt(item.fileSize)));
      this.btFiles = Object.assign({}, this.btFiles, { fileSize: size });
    },
    // 新建链接
    createUrlDownload() {
      // this.dialogBt = false
      this.dialoglink = true;
      this.getSavePath();
    },
    startUp() {
      if (this.selectBtData.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择下载的文件"
        });
        return ;
      }
      this.dialoglinkList = false;
      const params = {
        torrentId:this.btFiles.torrentId,
        parentId:this.initSavePath.id,
        selectIds:this.selectBtData.map(item=>item.id).join(',')
      };
      this.$http({
        url: "/api/offline/download/torrent",
        method: "post",
        data: params
      }).then(res => {
        if (res.data.code === 100001) {
          this.getList(this.currentPage)
        }
      }).catch(err => {
        console.log('离线下载失败',err)
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.component-offlinedown {
  display: inline-block;
  vertical-align: top;
  & .loading-box{width:100%; height:100%; position:fixed; z-index:20001;top:0;left:0;
   padding-top:80px;text-align:center; box-sizing:border-box;}
  & .icon-bts {
    width: 70px;
    height: 80px;
    background-size: 100%;
    // vertical-align: middle;
  }

  #link > .el-dialog {
    & .dialog-bottom,
    & .dialog-top,
    & .dialog-center{
      padding:0 20px; box-sizing:border-box; border-top:none;
    }
    & .dialog-top {
      line-height: 1;
      color: #acb4bb;
      font-size: 12px;
      padding-top:20px;
      // padding:15px 20px; box-sizing:border-box;
    }
    & .dialog-bottom {
      margin: 10px 0;
      & > p {
        font-size: 12px;
        color: #5a5a5a;
        line-height: 26px;
        display: inline-block;
        vertical-align:top;
        margin-right: 6px;
        text-overflow:ellipsis;
        overflow:hidden;
        white-space:nowrap;
        max-width:80%;
      }
    }
  }

  #linkList > .el-dialog {
    & .dialog-top {
      line-height: 1; padding:15px 20px; box-sizing:border-box;
      & > img {
        width: 70px;
        height: 80px;
        vertical-align: middle;
      }
      & > div {
        display: inline-block;
        height: 80px;
        vertical-align: middle;
        padding: 20px 0;
        box-sizing: border-box;
        & > .text {
          font-size: 14px;
          color: #212121;
          margin-bottom: 20px;
        }
        & > .size {
          font-size: 12px;
          color: #212121;
        }
      }
    }
    & .dialog-bottom {
      margin: 10px 0;
      & > p {
        font-size: 12px;
        color: #5a5a5a;
        line-height: 26px;
        display: inline-block;
        vertical-align: top;
        margin-right: 6px;
        max-width:80%;
        overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
      }
    }
  }
  #bt > .el-dialog {
    & .dialog-top {
      position: relative; padding:15px 20px; box-sizing:border-box;
      & > .last {
        position: absolute;
        right: 20px;
      }
      & > span {
        position: absolute;
        right: 150px;
        top: 9px;
        display: inline-block;
        color: #fc4343;
        font-size: 12px;
      }
    }
    & th {
      height: 38px;
    }
  }
  & .a-btn,
  & .input-btn {
    display: inline-block;
    vertical-align: top;
    line-height: 34px;
    padding: 0 35px;
    color: #fff;
    background-color: #54b2eb;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
  }
  & .input-btn {
    & > input {
      font-size: 0;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 34px;
      opacity: 0;
    }
  }
  & .dialog-center{
    // min-height:320px; overflow:auto;
    border-top:1px solid #cbe6f6;
    & .contentBox{ min-height:282px;overflow:auto;}
    & .table-item{ padding-left:20px !important;}
  }
  & .dialog-bottom{ padding:0 20px;}

}
.dataListFooter{
  width:100%; margin-top:10px; text-align:right; padding-bottom:20px;
}
</style>

