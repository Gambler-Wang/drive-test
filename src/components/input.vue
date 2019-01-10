<template>
    <section class="component-input">
        <label>{{label}}</label>
        <input :type="type" :name="name" :placeholder="placeholder" />
    </section>
</template>
<script>
export default {
    name:'GInput',
    props:{
        type:{
            type:String,
            default:'text'
        },
        msg:{
            type:String | Array
        },
        errmsg:String,
        itemClass:String
    },
}
</script>
<style lang="scss" scoped>

.component-input{
    position:relative; margin-top:25px;
    & > section{ 
        display:none; position:absolute;top:0; left:510px;
        padding:12px;padding-left:20px;line-height: 22px; 
        background-size:16px 16px;
        & > ol{
            background-color:#eff3f8; border:1px solid #d3dbe1; padding:15px 25px;position:relative;
            & > li{ list-style:square;}
        }
        & > ol:after,
        & > ol:before{
            content:''; display:block; position:absolute; left:-16px; top:10px; border:8px solid transparent;
            border-right-color:#eff3f8;z-index:2;
        }
        & > ol:after{
            z-index:1; left:-17px; border-right-color:#d3dbe1;
        }
    }
    & > section.form-item-tip{
        color:#87949d;
    }
    & .form-item-valid{background:url(~@/assets/images/tips_icons_right1.png) left center no-repeat;}
    & .form-item-invalid{background:url(~@/assets/images/tips_icons_wrong1.png) left center no-repeat;color:#fc4343;}
    & label{ display:inline-block;vertical-align:top; width:80px;
        line-height:46px;text-align:right;color:#5a5a5a;margin-right:10px;}
    & input{ height:46px; width:406px; border:1px solid #d3dbe1; 
        padding:10px 5px; box-sizing:border-box; outline:none;}
    // & input:invalid{ border:1px solid #fc4343;}
    // & input:invalid ~ .form-item-invalid{display:block;}
    // & input:valid{ border-color:#67c23a;}
    // & input:valid ~ .form-item-valid{ display:block;}
    & input:focus{ border-color: #5cbbf4 !important;}
    // & input:focus ~ section{ display:none;}
    & input:focus ~ .form-item-tip{display:block;}
    & .large{width:406px; margin-left:95px;}
}
</style>
