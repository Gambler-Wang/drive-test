<template>
    <section class="page-test">
        <h1>组件预览页面</h1>
        <!-- <section>
            <Buttons :oprFiles="selectData" 
                @getFiles = "getFiles"  
                @rename = "rename" 
                @newfolder= "createFolder"
            ></Buttons>
        </section> -->
         <!-- <Dialog :showDialog = "showDialog" :files = "files" @close="showDialog = !showDialog" /> -->
        <button @click="showtree=!showtree">树组件</button>
        <Tree :showtree = "showtree" @close = "closeTree" @getTreeData="getTreeData"></Tree>
       <!--<code-btn></code-btn> -->

        <section>
            <c-form :synctest.sync="test"  v-model="vmodel"/>
            <p>{{test}}</p>
            <c-form  v-model="vmodel"/>
            <p>{{vmodel}}</p>
        </section>
        <p style="{display:block; white-space:nowrap;width:100px;overflow:hidden; text-overflow:ellipsis;}">卡时间的恢复阿萨德付款哈萨克大姐夫阿会计师电话费卡时间的恢复阿萨德发</p>
        <!--<section style="margin-top:15px">
         <List 
        @getSelectData = "getSelectData" 
        @createFolder = "createFolder"
        @rename = "rename"
        :createFolderFlag="createFolderFlag" 
        :renameFlag="renameFlag" />
        
        </section> -->
        <p v-maxLength:8 = "max"></p>
        <section>
            <Copy text = "阿斯利康.jpg.jpg" />
        </section>
    </section>
</template>
<script>

/**
 * 组件预览页面
 *
 */
import Button from '@/components/button';
import Buttons from '@/components/buttons';
import Dialog from '@/components/dialog';
import Tree from '@/components/tree';
import CodeBtn from '@/components/codebtn';
import List from '@/components/list';
import Form from '@/components/form';
import Copy from '@/components/copytext'
export default {
    name:"textComponent",
    components:{Button,Buttons,Dialog,Tree,CodeBtn,List,'c-form':Form,Copy},
    data(){
        return {
            showDialog:false,
            files:{},
            showtree:false,
            selectData:[],
            renameFlag:false,
            createFolderFlag:false,
            test:'aaaa',
            vmodel:'bbbbbb',
            max:'框架爱华发商都开了房卡萨丁胡椒粉卡萨款到发货啊速度快解放哈'
        }
    },
    
    methods:{
        
        getFiles(files){
            if( files.length > 0 ){
                this.showDialog = true;
                // this.files = files;
                this.files = files;
            }
        },
        closeTree(){
            this.showtree = !this.showtree;
        },
        getTreeData(data){
            console.log(data);
        },
        getSelectData(data){
            this.selectData = data;
        },
        rename(){
            this.renameFlag = !this.renameFlag;
        },
        createFolder(){
            this.createFolderFlag = !this.createFolderFlag;
        }
    }
}
</script>
<style lang="scss" scoped>
.page-test{margin:0 auto;  padding:50px;
    & > h1{ font-size:18px; text-align:center;}
    & > section{ margin-top:20px;}
}
</style>
