<template>
    <section class="component-button">
        <p v-if="type==='file'" :class="btnClass">
            <input type="file" multiple  @change="change"  ref="file1"><i :class="['icon',icon ? icon:'']">
            </i><span>{{value}}</span>
        </p>
        <p v-else-if="includes"><i :class="['icon',icon ? icon:'']"></i><span>{{value}}</span></p>
        <button :class="btnClass" @click="click" v-else><i :class="['icon',icon ? icon:'']" v-if="icon"></i>{{value}}</button>
        <slot>
            <ul v-if="type==='file' && !nofiles">
                <li><input type="file" multiple title="" @change="change" :value="uploadfiles" ref="file2" /><span>上传文件</span></li>
                <li><input type="file" multiple webkitdirectory title="" @change="change" :value="uploadfiles" ref="file3" /><span>上传文件夹</span></li>
            </ul>
            <ul v-if="includes && !type" id="box">
                <li v-for="(item,key) of includes" :key="key" @click="tipItem(item)">{{item}}</li>
            </ul>
        </slot>
    </section>
</template>
<script>
export default {
    name:"Button",
    props:{
        value:{
            type:String,        //按钮名称
            required:true,
        },
        includes:{              //按钮hover显示列表
            type:Array
        },

        icon:String,            //按钮中包含的图标class
        type:String,            //type="file"  上传文件以及文件夹
        btnClass:String,        //重定义按钮样式
        nofiles:{               //是否可以上传文件夹
            type:Boolean,
            type:false,
        }

    },
    data(){
        return {
            uploadfiles:'',
        }
    },
    methods:{
        click(){
            this.$emit('click');
        },
        change( event ){
            // console.log('options', this.$options );
            // return ;
            const ie = this.IEVersion();
            if( 5 < ie && ie < 10){
                this.$message({
                    message:'当前IE浏览器版本过低，请升级到最新的浏览器',
                    type:'warning'
                });
                return ;
            }
            let { files, value:webkitRelativePath } = event.target;
            let fileList = Array.from(files).map(item=>{
                return {
                    file:item,
                    name:item.name,
                    size:item.size,
                    type:item.type,
                    webkitRelativePath:item.webkitRelativePath,
                    lastModified:item.lastModified,
                    targetId:this.$route.query.id ? this.$route.query.id :'-1',
                    targetFolder:this.$route.query.filename ? this.$route.query.filename:'全部文件',
                    status:'wait',   //是否正在上传
                    done:false,        //上传是否完成
                    progress:'等待上传',        //上传进度条
                    error:false,       //是否上传失败
                    message:'',        //失败信息
                }
            });
            const singleTotalSize = fileList.map(item=>item.size).reduce((tot,num)=>{
                return tot+num;
            })
            if(singleTotalSize > 1024*1024*1024){
                this.$message({
                    type:'warning',
                    message:'文件超过1G,请选择客户端上传'
                })
                return;
            }
            if(fileList.length > 100){
                this.$message({
                    type:'warning',
                    message:'上传列表中的数据不能大于100'
                })
                return ;
            }
            this.$emit('change',fileList);
            this.clear();
        },
        clear(){
            this.$refs.file1.value = '';
            this.$refs.file2.value = '';
            this.$refs.file3.value = '';
        },
        tipItem( item ){
            this.$emit('click',item);
        }
    }
}
</script>
<style lang="scss" scoped>
.component-button{
    display:inline-block;vertical-align:top; border-radius:5px;position:relative;font-size:14px;
    z-index:2;border:1px solid #5cbbf4;box-sizing:content-box; height:100%; max-height:34px; margin-right:8px;
    & > button,
    & > p{ display:block;background-color:#fff; border:none; height:34px; line-height:34px; color:#5cbbf4;position:relative;
    padding:0 15px;outline:none; z-index:3;border-radius:4px;font-size:14px !important;
    cursor:pointer;
        & > i.icon{
            width:12px; height:100%;
            background-size:12px;
            margin-right:5px;
        }
        &.active{background-color:#7fcfff; color:#fff;overflow: hidden}
    }
    & > p{

        &>input{-webkit-appearance:none;width:100%; height:100%;font-size:100px; cursor:pointer;
        position:absolute; z-index:2;opacity:0;left:0;top:0;}
    }

    &>ul{border:1px solid #5cbbf4; display:none; box-sizing:content-box; left:-1px;border-radius:0 0 5px 5px; overflow:hidden;
        width:100%;text-align:center; line-height:34px;position:absolute;top:28px; padding-top:5px;background-color:#fff;
        & > li{cursor:pointer;color:#5cbbf4;position:relative;left:0;top:0;height:34px;overflow:hidden;
            & > span{ display:block; width:100%; height:34px;}
            & > input[type="file"]{display:block; width:100%; height:34px;font-size:100px; cursor:pointer; opacity: 0; position:absolute;z-index:2;cursor:pointer;left:0;top:0;}

        }
        & > li:hover{ background-color:#eaf7ff;}
    }

    &:hover > ul{display:block;}
}
</style>

