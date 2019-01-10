/*正则表达式*/
const reg = {
    pwd:/^[0-9a-zA-Z!_@#$=+%^&*]{6,14}$/, //密码包含特殊符号的密码正则
    // userName:/^[0-9a-zA-Z!_@#$=\(\)+%^&*\u4e00-\u9fa5]{4,14}$/,//用户名包含汉字以及特殊符号
    userName:/^[0-9a-zA-Z-_\u4e00-\u9fa5]{2,14}$/,//用户名包含汉字以及特殊符号
    phone:/^(1[3-9])\d{9}$/,//手机号
    userId:/^[0-9a-zA-Z-_]{6,20}$/,//掌云id
    filename:/([\s\|\\/*:'"\?<>\ud83c\[\udc00-\udfff\]\ud83d\[\udc00-\udfff\]\u2600-\u27ff]+)|(^\.+$)/, //文件夹命名规则
}
export default reg;