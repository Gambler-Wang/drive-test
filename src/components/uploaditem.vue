<template>
    <section class="component-uploaditem" v-if="!deleteFlag">
        <el-row tag="ul" class="item">
            <el-col tag="li" :span="1"><em :class="['icon',fileType(file)]"></em></el-col>
            <el-col tag="li" :span="10" class="item-name">{{file.name}}</el-col>
            <el-col tag="li" :span="4" >{{file.targetFolder}}</el-col>
            <el-col tag="li" :span="3" >{{sizeFormat(file.size)}}</el-col>
            <el-col tag="li" :span="4">
                <b v-if="file.error">{{file.message}}</b>
                <span v-else>{{file.progress}}</span>
            </el-col>
            <el-col tag="li" :span="2">
                <!-- <i :class="['icon',file.error ? 'icon-fail':'icon-succeed']" v-if="file.done"></i> -->
                <i :class="['icon',file.error ? 'icon-fail':'icon-right']" v-if="file.done"></i>
                
                <section v-else>
                    <i class="icon icon-refresh" v-if="status=='error'" @click="reload"></i>
                    <i class="icon icon-pause" v-if="status=='uploading'" @click="abortUploadPart"></i>
                    <i class="icon icon-pause" v-if="status=='wait'" @click="abortUploadPart"></i>
                    <i class="icon icon-pause" v-if="status=='continue'" @click="abortUploadPart"></i>
                    <i class="icon icon-play"  v-if="status=='stop'" @click="continueUpload"></i>
                    <i class="icon icon-del"   v-if="status!='break'" @click="breakUpload"></i>
                </section>
            </el-col>
        </el-row>
        <div class="item-progress" :style="{width:file.progress}"></div>
    </section>
</template>
<script>
import b from '@/util/newVue';
import icontype from '@/util/icontype';
// const AWS = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');
export default {
    name:'UploadItem',
    props:{
        //是否正在下载
        status:{
            type:String,
            default:'wait'
        },
        //当前文件在上传列表中的序数
        index:{
            type:Number,
        },
        //父文件夹id
        // catId:{
        //     type:String,
        //     default:'-1'
        // },
        //上传的当前文件
        propfile:{
            type:Object,
            required:true,
        },
        //暂停上传
        stopQueue:{
            type:Map,
        },
        waitQueue:{
            type:Map,
        },
        successCount:Number,
        failCount:Number,
        //文件是否上传完毕
        // fileDone:{
        //     type:Function,
        //     default:false
        // }
    },
    data(){
        return {
            currentPartNum: 0,
            currentPart:{},       //当前上传的分片
            aws:{},               //s3对象
            fileparts:[],         //文件切片列表
            // status:'wait',     //上传文件状态
            listParams:{},        //获取分片列表参数,
            loadedParts:[],        //已上传的分片
            awsConfig:{},          //aws配置参数
            // started:false,        //是否已开始上传
            // isParts:false,         //是否分片
            stopFlag:false,
            deleteFlag:false,        //是否已删除
            md5:'',

            /**
             * wait         等待上传
             * start      文件开始上传，处于文件解析md5过程中
             * uploadPart   正在上传分片
             *     
             */
            uploadStatus:'wait'
        }
    },
    computed:{
        file(){
            return this.propfile;
        }
    },
    watch:{
        status(n,o){
            if(n === 'uploading'){
                const continueFile = this.waitQueue.get(this.index);
                switch(continueFile.uploadStatus){
                    case 'wait':
                        this.fileupload();
                        break;
                    case 'start':
                        // this.completeMultipartUpload(this.file);
                        this.preUpload(this.file);
                        break;
                    case 'started':
                        this.completeMultipartUpload(this.file);
                        break;
                    case 'uploadPart':
                        this.sendPart(this.aws,this.fileparts);
                        break;
                    default:
                       this.fileupload();      
                }
                // if(!continueFile.started){
                //     //如果文件未开始前被暂停，重新执行下载程序
                //     this.fileupload();
                // } else {
                //     if(continueFile.isParts){
                //         //如果文件已分片后被暂停,直接上传剩余分片
                //         this.sendPart(this.aws,this.fileparts);
                //     } else {
                //         //重新分片上传
                //         this.completeMultipartUpload(this.file);
                //     }
                // }
            } else if( n ==='abort' ){
                if(this.currentPart.abort){
                    this.currentPart.abort();
                    this.aws.abortMultipartUpload(this.listParams,(err,data)=>{
                        if(err){
                            console.log('终止文件上传失败',err)
                        }
                    })
                }
                // this.currentPart.abort();
            }
        }
    },
    mounted(){
        if(this.status === 'uploading'){
            this.fileupload();
        }
    },
    methods:{
        uploaded(params,file){
            this.$http({
                url:'/api/ceph/complete_upload',
                method:'post',
                data:params,
            }).then(res=>{
                if(res.data.code === 100001){
                    //ydh 处理上传内存空间变化
                    // localStorage.setItem('usedSpace',res.data.data.usedSpace);
                    // b.$emit('size',res.data.data.usedSpace)
                    // ------end------                    
                    this.fileUploaded(file,res)
                }
            }).catch(err=>console.log(err))
        },

        //上传续航
        renewal(){
             this.$http({
                url:'/api/ceph/renewal_keys',
                method:'post',
                data:{},
            }).then(res=>{
                if(res.data.code === 100001){
                    this.aws = this.createAws(res.data.data);
                    this.file.error = false;
                    this.actionType('continue'); 
                }
            }).catch(err=>console.log(err))
            
        },
        //文件上传结束
        fileUploaded(file,res){
            file.done = true;
            file.progress = '100%';
            const Count = this.successCount + 1;
            this.$emit('update:successCount',Count);
            this.actionType('done');
            localStorage.setItem('usedSpace',res.data.data.usedSpace);
            b.$emit('size',res.data.data.usedSpace)
        },
        getStatus(){
            if( this.uploadStatus === 'started'){
                this.completeMultipartUpload(this.file);
            }else{
                setTimeout(this.getStatus.bind(this),1000);
            }
        },
        createAws( config ){
            const {accessKey,endPoint,secretKey} = config;
            const params = {
                accessKeyId:accessKey,
                endpoint:endPoint,
                secretAccessKey:secretKey
            }
            let aws = new S3(params);
            return aws;
        },
        actionType(status){
            this.$emit('update:status',status);
            if(status === 'del'){
                this.deleteFlag = true;
            }
            let value = {}
            if(status === 'error'){
                value = {index:this.index, uploadStatus:'wait' };
            }else{
                value = {index:this.index, uploadStatus:this.uploadStatus };
            }
            const fileStatus = {
                status:status,
                index:this.index,
                value
            }
            this.$emit('fileDone',fileStatus);
        },
        uploadFail(msg){
            const file = this.file;
            file.error = true;
            // file.done = true;
            file.message = msg;
            const Count = this.failCount + 1;
            this.$emit('update:failCount',Count);
            this.actionType('error');
            console.log('上传失败原因',msg);
        },
        sliceFile(file){
            let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                chunkSize = 5*1024*1024,
                chunks = Math.ceil(file.size / chunkSize),
                start = 0,
                arr = [];
                for( let i = 0; i < chunks; i++){
                    let end = (start + chunkSize) > file.size ? file.size : start + chunkSize;
                    arr.push(blobSlice.call(file,start,end));
                    start = end;
                }
            return  arr;
        },
        completeMultipartUpload(file){
            this.uploadStatus = 'started';
            const multipartParmas = {Bucket:this.awsConfig.bucketName,Key:this.awsConfig.objectName};
            if(this.stopFlag) return;
            this.aws.createMultipartUpload(multipartParmas,(err,data)=>{
                if(err){
                    //如果失败了重新获取id；
                    this.completeMultipartUpload(file);
                } else {
                    this.listParams = Object.assign({},data);
                    this.fileparts = this.sliceFile(file.file).map((item,key)=>{
                        return Object.assign({},data,{Body:item,PartNumber:key + 1})
                    });
                    this.sendPart(this.aws,this.fileparts);
                }
            })
        },
        upload(aws,config,file){
            const _this = this;
            const params = {
                Body:file.file,
                Key:config.objectName,
                ContentType:file.file.type,
                Bucket:config.bucketName
            }
            const uploadManage = aws.upload(params,{partSize:5*1024*1024,queueSize:1},(err,data)=>{
              if(err){
                console.log('上传文件错误',err)
              } else {
                //上传成功
                if(data){
                    const didParams = {preuploadId:config.id,objectName:config.objectName}
                    this.uploaded(didParams,file);
                }
              }
            });
            uploadManage.on('httpUploadProgress',function(e){
              //进度条事件
              file.progress = `${(Number(e.loaded/e.total)*100).toFixed(2)}%`;
            });
        },
        preUpload(file,md5){
            if(!this.md5){
                this.fileupload();
                return;
            }
            // const id = this.$route.query.id ? this.$route.query.id: '-1';
            const params = {
                name:file.name,
                fileSize:file.size,
                md5:md5 ? md5 :this.md5,
                parentId:file.targetId,
                // parentId:this.catId,
                path:file.webkitRelativePath
            }
            const sendAjax = this.$http({
                url:'/api/ceph/preupload',
                method:'post',
                data:params
            }).then(res=>{
            //在文件解析的过程中，暂停上传
                if(res.data.code === 100001){
                    this.awsConfig = res.data.data;
                    this.aws = this.createAws(this.awsConfig);
                    // this.completeMultipartUpload(file);
                    //正常情况，返回aws所需要的参数
                    if( file.size > 5*1024*1024 ){
                        //文件大于5m分段上传
                        this.completeMultipartUpload(file);
                    } else {
                        //正常上传
                        this.upload(this.aws,this.awsConfig,file);
                    }
                } else if(res.data.code === 100201){
                    //秒传
                    this.fileUploaded(file,res);
                    // this.successCount += 1;
                } else if(res.data.code === 100301) {
                    //内存空间不足
                    this.uploadFail('空间不足');
                } else {
                    this.$message({
                        type:'warning',
                        message:res.data.msg
                    })
                }
            }).catch(err=>{
                this.uploadStatus = 'wait';
                console.log('文件md5加密失败',err)
            });
        },
        fileupload(){
            const file = this.file;
            // file.status = 'uploading';
            if(file.size == "0"){
                this.uploadFail("文件大小为0");
                return false;
            }
            //文件已开始上传
            file.progress = '0%';
            this.getFileMD5(file).then(res=>{
                this.uploadStatus = 'start';
                this.md5 = res;
                //在文件解析的过程中，暂停上传
                if(this.stopFlag) return;
                this.preUpload(file,res);
            }).catch(err=>{
                this.uploadStatus = 'wait';
                console.log('文件md5加密失败',err)
            });
        },
        sendPart(aws,fileparts){
            const _this = this;
            let file = this.propfile;
            let timeout;
            this.uploadStatus = 'uploadPart';
            if(this.stopFlag) return ;
            this.currentPart = aws.uploadPart(fileparts[this.currentPartNum]);
            this.currentPart.on('httpUploadProgress',function(e){
                //进度条事件
                if( this.stopFlag ) return;
                const loaded = e.loaded + _this.currentPartNum*5*1024*1024;
                const current = (Number(loaded/file.size)*100).toFixed(2);
                const currentProgress = Number.parseFloat(file.progress );
                if(current >= currentProgress ) {
                    file.progress = `${current}%`;
                }
            });
            
            this.currentPart.send((err,data)=>{
                if(err){
                    if(err.message.includes('aborted')){
                        console.log('暂停',err.message)
                    }else{
                        this.uploadFail('上传失败')
                    }
                } else {
                    _this.currentPartNum += 1;
                    if( _this.currentPartNum >= fileparts.length){
                        _this.aws.listParts(_this.listParams,(err,data)=>{
                            if(err){
                                console.log('获取分片列表失败',err)
                            } else {
                                const Parts = data.Parts.map(item=>{
                                    return {ETag:item.ETag,PartNumber:item.PartNumber}
                                })
                                const params = Object.assign({},_this.listParams,{
                                    MultipartUpload:{Parts}
                                })
                                _this.aws.completeMultipartUpload(params,(err,data)=>{
                                    if(err){
                                        this.uploadFail('合并失败');
                                    } else {
                                        //合并分片上传成功
                                        const didParams = {preuploadId:this.awsConfig.id,objectName:this.awsConfig.objectName}
                                        _this.uploaded(didParams,this.propfile);
                                    }
                                })
                            }
                        })
                        return ;
                    }
                    _this.sendPart(_this.aws,_this.fileparts);
                }
            });
        },
        //中断后重新上传
        reload(){
            const count = this.failCount - 1;
            this.$emit('update:failCount',count);
            this.renewal();
            // this.actionType('continue');
        },
        //暂停后继续上传
        continueUpload(){

            this.stopFlag = false;
            this.actionType('continue');

        },
        //暂停上传
        abortUploadPart(){
            if(this.uploadStatus != 'wait' && this.file.size < 5*1024*1024){
                //如果文件小于5m,禁止暂停
                return ;
            }
            //将当前文件放到暂停队列中

            //更改操作图标
            this.stopFlag = true;
            // this.file.progress = '暂停';
            //通知上传列表上传列表上传下一个任务
            if( this.status ==='uploading' && this.currentPart.abort){
                //如果当前任务正在上传中，终止上传
                this.currentPart.abort();
            }
            this.actionType('stop');
        },
        //终止上传
        breakUpload(){
            this.stopFlag = true;
            if(this.currentPart.abort){
                this.currentPart.abort();
                this.aws.abortMultipartUpload(this.listParams,(err,data)=>{
                    if(err){
                        console.log('终止文件上传失败',err)
                    }
                })
            }
            this.actionType('del');
        },
        //根据名称获取icon
        fileType(fileinfo){
            const name = fileinfo.name.split('.'),
            type = fileinfo.type,
            ext = name[name.length-1].toLowerCase();
            if(icontype[ext]){
                return icontype[ext];
            } else if(type.includes('video')) {
                return 'icon-video'
            } else if(type.includes('audio')){
                return 'icon-music'
            } else {
                return 'icon-unknow'
            }
        },
        getFolderName(path){
            // path = path ? path ：
            if(path){
            const folderName = path.split('/');
            return folderName[folderName.length - 2];
            } else {
            return '新建文件夹'
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.text-overflow{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
.component-uploaditem{
    width:100%;max-width:650px;position:relative;
    & .icon{height:43px; width:18px; background-size:18px auto; background-position:center; font-size:16px; line-height:43px; cursor: pointer;}
    & i.icon{background-size:16px 16px;}
    & .item-err{ color:#fc4343;}
    & .item-success{ color:#5cbbf4}
    & .item{
        width:100%;position:relative; left:0; top:0; height:45px;line-height: 45px; overflow: hidden; border-bottom:1px solid #e1e1e1;
        padding:0 10px; box-sizing:border-box;color:#3d3d3d;
        & > li{ overflow:hidden; @extend .text-overflow; text-align:left;
            &.item-name { box-sizing:border-box; text-align:left;}
            & b{ font-weight:normal; color:#fc4343}
        }
    }
    & .item-progress{position:absolute; left:0; top:0; width:auto; height:44px; background-color:#C4FFE8;background-color:#5cbbf4; opacity: .2; z-index:-1;}
}
</style>
