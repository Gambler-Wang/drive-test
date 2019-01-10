<template>
    <div>
       <ul>
         <li v-for="(item,index) in arr" @click="add(index)">
           <span>{{item.name}}</span>
           <span >{{item.id}}</span>
         </li>
       </ul>
      <button @click="btn">dianji</button>
    </div>
</template>

<script>
    export default {
        name: "test",
      data(){
          return{
            arr:[
              {name:'x',id:12},
              {name:'a',id:3},
              {name:'v',id:16},
              {name:'c',id:22},
              {name:'d',id:55},
            ],
            obj:[]
          }
      },
      methods:{
        add(index){
        $(($('li')[index])).toggleClass('add')
          if( $(($('li')[index])).hasClass('add')){
               this.obj.push(index)
          }else {
            console.log(index);
          }
          console.log(this.obj);
        },
        btn(){
          let str = ''
         document.querySelectorAll('li').forEach(function (v,i) {
          if($(v).hasClass('add')){
            str = str+i+','
          }
         })
          console.log(str.substring(0,str.length-1));
        }
      }
    }
</script>

<style scoped>
  ul{
    margin: 200px;
  }
li{
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
}
  li:nth-of-type(2n+1){
    background: #efefef;
  }
  .add{
    background:skyblue!important;
  }
</style>
