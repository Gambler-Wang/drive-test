<template>
    <section class="component-form-item" :class="itemClass">
        <g-input />
        <section v-if="msg">
            <slot name="slot-tips">
                <ol v-if="!!(msg instanceof Array)">
                    <li v-for="(item, key) of msg" :key= "key" > {{item}} </li>
                </ol>
                <p v-else>{{msg}}</p>
            </slot>
        </section>
        <section v-if="errmsg">
            <slot name="slot-invalid">
                <p>{{errmsg}}</p>
            </slot>
        </section>
    </section>
</template>
<script>
import GInput from '@/components/input';
export default {
    name:'FormItem',
    components:{
        "g-input":GInput,
    },
    props:{        
    },
    data(){
        return {}
    }
}
</script>
