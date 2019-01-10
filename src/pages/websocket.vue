<template>
    <section>
        
        <p>websocket</p>


    </section>
</template>
<script>
export default {
    name:'websocket',
    data(){
        return {
            msg:'',
        }
    },
    created(){
        this.wsk();
    },
    methods:{
        wsk(){
            let ws = new WebSocket("ws://120.79.193.155:6800/jsonrpc");
            ws.onopen = function()
               {
                  // Web Socket 已连接上，使用 send() 方法发送数据
                  const params = {
                        'jsonrpc' : 2.0,
                        'id' : 'test',
                        'method' : 'aria2.addTorrent',
                        'params' : ['b16f917072e58959']
                  }
                  ws.send(JSON.stringify(params));
                  console.log("数据发送中...");
               };
                
               ws.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;
                  console.log(received_msg);
               };
        }
    }
}
</script>
