<template>
<transition name = "fade">
    <section class="component-tree" v-show="showtree">
        <!-- <Dialog
            @close="close"
            title="树形菜单"
            position="center"
            :showDialog = "showDialog"
            header-class="headerBg"
        > -->
        <el-dialog
            :title="title"
            :visible.sync="showDialog"
            :before-close ="beforeClose"
        >
            <section class="tree-content">
                <el-tree
                    ref="tree"
                    empty-text = "暂无文件夹"
                    class="tree-box"
                    node-key="id"
                    :indent="8"
                    lazy
                    :data = "treeData"
                    :props = "defaultProps"
                    :highlight-current = "true"
                    :load="getFileDetail"
                    :default-expanded-keys="['-1']"
                    @node-click = "handleNodeClick"
                >
                    <section class="custom-tree-node selfItem" slot-scope="{node,data}">
                        <i class="icon icon-folder"></i>
                        <section class="addfoler" v-if="data.add">
                            <input type="text"  :value="data.name" ref="createFolderInput" @keyup.enter ="submitAppend(node,data)" >
                            <i class="icon icon-submit" @click.stop="submitAppend(node,data)"></i>
                            <i class="icon icon-cancel" @click.stop="cancelAppend(node,data)"></i>
                        </section>
                        <span v-maxLength ="data.name"></span>
                    </section>
                </el-tree>
                <footer>
                    <Button value="新建文件夹" icon="icon-newfolder" @click="append" />
                    <aside class="footer-right">
                        <Button value="确定" @click="submitData" btnClass="active" />
                        <Button value="取消"  @click="close" />
                    </aside>
                </footer>
            </section>
        </el-dialog>
    </section>
</transition>
</template>

<script>
    import Reg from '../util/reg';
    import Button from './button';
    export default {
        name:'Tree',
        components:{
            Button,
        },
        props:{
            showtree:{
                type:Boolean,
                default:false,
            },
            moveFlag:{
                type:Boolean,
                default:false
            },
            fileIds:Array, //被移动或者复制的数据
            title:{
                type:String,
                default:'全部文件'
            }
        },
        computed:{
            // showDialog(){
            //     return this.showtree;
            // }
        },
        data() {
            return {
                showDialog:false,
                treeData:[{
                   name:'全部文件',
                    id:'-1'
                }],
                currentData:null,
                defaultProps:{
                    children: 'children',
                    label: 'name',
                    isLeaf:'leaf',
                },
                addFolderFlag:false,
            }
        },
        watch:{
            showtree(newval,oldval){
                this.showDialog = newval;
                if(newval === false) return ;
                if(this.$refs['tree']){
                    //设置初始值
                    this.$refs['tree'].setCurrentKey('-1');
                    //初始化
                    const reqData = this.getData('-1');
                    reqData.then(res=>{
                        if(res.data.code === 100001){
                            this.$refs['tree'].updateKeyChildren('-1',res.data.data.dataList);
                        }
                    }).catch(err=>{
                        console.log(err);
                    })
                }
            }
        },
        methods: {
            getData( id ){
                const params = {
                    fileType:'1',
                    page:1,
                    perpage:1000,
                    sort:'1',
                    rank:'2',
                    id: id||'-1',
                    type:"2"
                }
                return this.$http({url:'/api/files/index',method:'post',data:params})
            },
            getFolder(id,setKey,cb){
                const params = {
                    fileType:'1',
                    page:1,
                    perpage:1000,
                    sort:'1',
                    rank:'2',
                    id: id||'-1',
                    type:"2"
                }
                this.$http({
                    url:'/api/files/index',
                    method:'post',
                    data:params,
                }).then(res=>{
                    if(res.data.code === 100001){
                        this.$refs['tree'].updateKeyChildren(id,res.data.data.dataList);
                        if(setKey){
                            this.$refs['tree'].setCurrentKey(setKey);
                            let currentData = this.$refs['tree'].getNode(setKey);
                            currentData.isLeaf = true;
                        }
                    }
                }).catch(err=>console.log(err))
            },
            handleNodeClick(data){
                // this.currentData = data;
               
            },
            newFolder(node,data){
                const params = {
                    name:this.$refs.createFolderInput.value,
                    parentId:node.parent.key,
                }
                this.$http({
                    url:'/api/files/create_folder',
                    method:'post',
                    data:params
                }).then(res=>{
                    this.addFolderFlag = false;
                    if(res.data.code === 100001){
                        // data.add = false;
                        // this.$refs['tree'].remove(node);
                        // const res = Object.assign(res.data.data,{isLeaf:false});
                        // this.appendData(res);
                        // this.$refs['tree'].setCurrentKey(res.data.data.id);
                        // console.log('node', this.$refs['tree'].getNode(res.data.data.id))
                        // console.log('cnode',this.$refs['tree'].getCurrentNode())
                        // return ;
                        this.getFolder(node.parent.key,res.data.data.id);
                        // if(currentData.id === 'newid'){
                        //     this.getFolder(node.parent.key,res.data.data.id);
                        // } else {
                        //     this.getFolder(node.parent.key);
                        // }
                        
                    }
                }).catch(err=>{
                    this.addFolderFlag = false; 
                    console.log(err)
                })
            },
            submitAppend(node,data){
                const value = this.$refs.createFolderInput.value;
                const reg = Reg.filename;
                if(!value || reg.test(value)){
                    this.$message({
                        type:'warning',
                        message:'文件名格式错误'
                    })
                    this.$refs.createFolderInput.setSelectionRange(0,value.length)
                    this.$refs.createFolderInput.focus();
                    return ;
                }
                this.newFolder(node,data);
            },
            cancelAppend(node) {
                this.addFolderFlag = false;
                if( node.key === 'newid'){
                    this.$refs['tree'].setCurrentKey(node.parent.key);
                }
                this.$refs['tree'].remove(node);
                const currentNode = this.$refs['tree'].getCurrentNode();
                let targetNode = this.$refs['tree'].getNode(currentNode.id);
                if(targetNode.childNodes && targetNode.childNodes.length === 0 ){
                    targetNode.isLeaf = true;
                }

                // this.$refs['tree'].setCurrentKey()
            },
            append(){
                const data = { name:'新建文件夹',add:true,leaf:true,id:'newid'};
                if(this.addFolderFlag){
                    const value = this.$refs.createFolderInput.value;
                    this.$refs.createFolderInput.setSelectionRange(0,value.length)
                    this.$refs.createFolderInput.focus();
                    return ;
                }
                this.addFolderFlag = true;
                this.appendData(data);
            },
            appendData(data){
                let currentNode = this.$refs['tree'].getCurrentNode();
                if(!currentNode || currentNode.id === "newid"){
                    currentNode = this.$refs['tree'].getNode('-1');
                }
                const targetNode = this.$refs['tree'].getNode(currentNode.id);
                targetNode.expanded = true;
                if(targetNode.childNodes && targetNode.childNodes.length > 0 ){
                    this.$refs['tree'].insertBefore(data,targetNode.childNodes[0])
                }else{
                    this.$refs['tree'].append(data,targetNode)
                }
            },
            close(){
                this.showDialog = false;
                if( this.addFolderFlag ){
                    this.addFolderFlag = false;
                    const folderNode = this.$refs.tree.getNode('newid');
                    this.$refs.tree.remove(folderNode)
                }
                this.$emit('close');
            },
            beforeClose(){
                if( this.addFolderFlag ){
                    this.addFolderFlag = false;
                    const folderNode = this.$refs.tree.getNode('newid');
                    this.$refs.tree.remove(folderNode)
                }
                this.$emit('close');
            },
            submitData(){
                if(this.addFolderFlag){
                    const value = this.$refs.createFolderInput.value;
                    this.$refs.createFolderInput.setSelectionRange(0,value.length)
                    this.$refs.createFolderInput.focus();
                    return ;
                }
                const currentData = this.$refs['tree'].getCurrentNode();
                if(!currentData || currentData.id === 'newid'){
                    this.$message({
                        type:'warning',
                        message:'请选择目标文件夹'
                    });
                    return ;
                }               
                this.$emit('getTreeData',currentData);
                this.$emit('close');
            },
            
            getFileDetail(node,resolve){
                /*每次点击树菜单都会运行这个方法*/
                if(node.level === 0){
                    /*添加初始数据*/
                    return resolve(this.treeData)
                } else {
                    const data = this.getData(node.key);
                    data.then(res=>{
                        if(res.data.code === 100001){
                            // resolve(res.data.data.dataList);
                            resolve(res.data.data.dataList);
                            if( !this.$refs['tree'].getCurrentNode() ){
                                this.$refs['tree'].setCurrentKey('-1');
                            }
                        }
                    }).catch(err=>{
                        console.log(err);
                        resolve();
                    })
                }

            }
        },
    }
</script>

<style lang="scss">

.component-tree{
    width:100%;height:100vh; position:fixed; z-index:9999;left: 0; top:0;margin-top:0;
    & > .opac{ width:100%; height:100%; position:absolute; left:0; top:0; background:rgba(0,0,0,0.6)}
    & header.headerBg{
        background-color:#eaf7ff;
    }
    & .tree-content{
       width:100%; padding:15px;
       & .tree-box{
           width:100%;
           border:1px solid #cbe6f6;
           overflow:auto;
           padding:0;
           padding:5px 0;
           font-size:0;
           height:240px;
           box-sizing: border-box;
           overflow:auto;
       }
       & .selfItem{width:100%; font-size:0; position:relative;
            height:30px; line-height:30px;
            & i.icon{ width:30px; height:30px;background-size:18px;}
            & > span { font-size:14px;display:inline-block; max-width:270px;vertical-align:top; overflow: hidden; text-overflow:ellipsis; white-space:nowrap;}
            & > section.addfoler{
                position:absolute;left:30px;top:0; height:30px; overflow:hidden; padding:3px 0; box-sizing:border-box;
            & > span{ font-size:14px; color:#5a5a5a;}
                & > input{
                    font-size:14px; color:#5a5a5a;height:24px; border:none; background-color:transparent; cursor: pointer;
                    border:1px solid #e1e1e1; padding-left:10px;line-height:24px;
                    background-color:#fff;

                }
                & > i.icon{height:24px; width:24px;
                background-size:10px 10px; background-position:center center;
                border:1px solid #e1e1e1;box-sizing:border-box; margin-left:8px;
                }

            }
       }
    }
    & footer{
        margin-top:15px; padding:10px 0;position:relative;
        & .footer-right{position:absolute; top:10px; right:0;}
    }
}
</style>
