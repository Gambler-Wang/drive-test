<template>
    <el-popover
        placement="top-start"
        width="100"
        trigger="hover"
        popper-class="popper-sort-box"
        >
        <ul class="sort-type">
            <li :class="[sort=='2' ? 'active' : '' ]" @click="changeRank('2','1')">文件名</li>
            <li :class="[sort=='3' ? 'active' : '' ]" @click="changeRank('3','2')">大小</li>
            <li :class="[sort=='1' ? 'active' : '' ]" @click="changeRank('1','2')">时间</li>
        </ul>
        <i slot="reference" class="icon icon-sort"></i>
    </el-popover>
</template>
<script>
export default {
    name:'Rank',
    data(){
        return {
            sort:'2'
        }
    },
    methods:{
        changeRank(sort,rank){
            this.sort = sort;
            const data = {rank,sort}
            this.$emit('changeSort',data)
        }
    }
}
</script>
