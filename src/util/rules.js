import reg from './reg';
const num = (rule,value,callback)=>{
    if(/^[\d]+$/.test(value)){
        callback(new Error('掌云ID不能为纯数字'))
    }else{
        callback();
    }
}
function strLen(rule,value,callback) {
  ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    let realLength = 0, len = value.length, charCode = -1;
    for (let i = 0; i < len; i++) {
        charCode = value.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    if(realLength < 4 || realLength > 14 ){
        callback(new Error('昵称不合法'))
    }else {
      callback();
    }
};
const rules = {
    phone:[
        {required:true,message:'手机号不能为空',trigger:'blur'},
        {pattern:reg.phone,message:'请输入正确的手机号',trigger:'blur'},

    ],
  text:[
    {required:true,message:'反馈信息不能为空',trigger:'blur'},
  ],
    code:{required:true,pattern:/^\d{6}$/,message:'请输入6位数字验证码',trigger:'blur'},
    userName:[
        {required:true,message:'掌云ID不能为空',trigger:'blur'},
        {validator:num,message:'掌云ID不能为纯数字',trigger:'blur'},
        {pattern:reg.userId,message:'掌云ID由6-20位数字、字母、下划线、中划线组成',trigger:'blur'},
    ],
    val:[
        {required:true,message:'昵称不能为空',trigger:'blur'},
        {validator:strLen,message:'昵称不合法',trigger:'blur'},
        {pattern:reg.userName,message:'昵称不合法',trigger:'blur'},
    ],
    pwd:[
        {required:true,message:'密码不能为空',trigger:'blur'},
        {pattern:reg.pwd,message:"密码由6-14位数字、字母以及符号组成",trigger:'blur'},
    ],

}
export default rules;
