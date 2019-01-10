<template>
    <section class="component-operation">
        <Buttons 
            :oprFiles="selectData"
            @getFiles = "getFiles"
            @offlineDownload="offlineDownload"
            @rename = "rename"
            @newfolder= "createFolder"
            @click="clickType"
        >
        </Buttons>
        <Button value="新建文件夹" icon="icon-newfolder" @click="newFolder" />
    </section>
</template>
<script>
import Buttons from './buttons';
export default {
    name:'operation',
    components:{ Buttons },
    data(){
        return {
            selectData:[],
        }
    },
    methods:{

        //上传组件获取上传列表
        getFiles(files){
            // if( files.length > 0 ){
            //     this.showDialog = true;
            //     this.files = files;
            // }
        },
        // 离线下载
        offlineDownload(){
            // this.dialogBt = true;
            // this.getofflineList();
        },
        //重命名
        rename(){
            // this.renameFlag = !this.renameFlag;
        },
        // 新建文件夹
        createFolder(){
            // this.createFolderFlag = !this.createFolderFlag;
        },
        clickType(e){
        // 1表示移动，2表示复制
            // this.showtree =true
            if(e=='移动到'){
                // this.clickName = '1'
            }
            if(e=='复制到'){
                // this.clickName = '2'
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.component-operation{
    width:100%; padding:10px 20px; box-sizing:border-box;
}
</style>


