<template>
    <section class="component-bread">
        <section v-if="$route.query.path">
            <a href="javascript:;" @click="goback">返回上一级 |</a>
            <router-link to="/share">全部文件</router-link>
            <ul>
                <li v-for="(item,key) of routes" :key="key" :style="{'max-width':maxwidth }">
                    <span v-if="key==(routes.length-1)">{{item.filename}}</span>
                    <!-- <router-link
                        v-else
                        :to="{name:'folderdetail',
                        query:{id:item.id,filename:item.filename,paht:routes.slice(0,key)}}"
                    >{{item.filename}}</router-link> -->
                    <a href="javascript:;" @click="godetail(item,key)" v-else>{{item.filename}}</a>

                </li>
            </ul>
        </section>
        <span v-else>全部文件</span>
    </section>
</template>
<script>
export default {
    name:'Bread',
    // props:{
    //     path:{
    //         type:String
    //     }
    // },
    data(){
        return {
            routes:[],
            maxwidth:'10%',
        }
    },
    watch:{
        $route(newval,oldval){
            this.pathFormat();
        }
    },
   mounted(){
       this.pathFormat();
   },
    methods:{
        goback(){
            if(window.history.length>0){
                this.$router.go(-1);
            }
        },
        pathFormat(){
            if(this.$route.query.path){
                const path = this.$route.query.path.split('|');
                this.routes = path.filter(item=>item).map(item=>JSON.parse(item));
                this.maxwidth = `${Number.parseInt(100 / this.routes.length)}%`;
            }

        },
        godetail(item,key){
            let path = this.routes.slice(0,++key);
            path = path.map(item=>JSON.stringify(item));
            path = path.join('|');
            this.$router.push({
                path:'/folderdetail',
                query:{id:item.id,filename:item.original_name,path}
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.component-bread{
    width:100%; padding:0;line-height:34px;padding-right:135px;
    & a{ display:inline-block;
    vertical-align:top;
     height:34px;
     line-height:34px;
     white-space:nowrap;
     text-overflow:ellipsis; overflow:hidden; color:#7DC7F5;}
    ul{ display: inline-block;vertical-align:top; font-size:0;width:80%;
        & >li{ display:inline-block;vertical-align: top; font-size:14px;position:relative;max-width:100%;
            & a,
            & span{ padding:0 10px; }
            & a{ display:block; width:100%;}
        }
        & >li:before{
            content:'>';
            display:block;
            color:#7DC7F5;
            position:absolute;
            left:0; top:0;

        }
        // & >li:last-child:before{
        //     content:'';
        // }
    }
}
</style>

