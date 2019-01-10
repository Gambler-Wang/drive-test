<template>
  <section class="component-buttons">
    <Button value="上传文件" icon="icon-upload" btnClass="active"
            type="file"
            @change="getFiles"/>
        <Button value="新建文件夹" icon="icon-newfolder" @click="newFolder" />
        <Button value="离线下载" icon="icon-download"  @click="offlineDownload" />
        <ButtonList v-show="oprFiles.length>0">
            <Button value="下载" icon="icon-download"  @click="download" />
            <Button value="删除" icon="icon-delete" @click="del" />
            <Button value="更多" icon="icon-more" :includes="includes" @click="more" />
        </ButtonList>
    </section>
</template>
<script>
  import Button from './button';
  import ButtonList from './buttonlist';
  import Dialog from './dialog';
  import b from '../util/newVue'

  export default {
    name: 'Buttons',
    components: {
      Button, ButtonList, Dialog
    },
    props: {
      oprFiles: {                      //被操作的文件（选中的文件）
        type: Array | Object,
        default: []
      },
      changeTable: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        newB: false,
        str: null,
        downloadUrl: ''
      }
    },
    computed: {
      includes() {
        if (this.oprFiles && this.oprFiles.length > 1) {
          return ['移动到', '复制到']
        } else {
          return ['移动到', '复制到', '重命名']
        }
      }
    },
    methods: {
      getList(params){
        this.$http({
          url:'/api/files/handle_file',
          method:'post',
          data:params || {}
        }).then((res)=>{
          if(res.data.code == 100001){
            this.getList()
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      getFiles(files) {
        this.$emit('getFiles', files);
      },
      newFolder() {
        this.$emit('len', true)
        b.$emit('list', true)
        this.$emit('newfolder')
      },
      offlineDownload() {
        this.$emit('offlineDownload')
      },
      more(type) {
        this.$emit('click', type);
         if (type =='重命名') {
           this.$emit('rename')
         }
         if(type = '更改分组'){
           this.$emit('grouping')
         }
      }
    },
    created() {
      if (this.$router.currentRoute.path == '/') {
        this.newB = true
      }
    },
  }
</script>
<style lang="scss" scoped>

</style>

