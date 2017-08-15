

var pushServer = "http://sdk.open.api.igexin.com/apiex.htm";
var message = null;
// 监听plusready事件  
document.addEventListener( "plusready", function(){
	message = document.getElementById("message");
	// 监听点击消息事件
	plus.push.addEventListener( "click", function( msg ) {
		// 判断是从本地创建还是离线推送的消息
		switch( msg.payload ) {
			case "LocalMSG":
				outSet( "点击本地创建消息启动：" );
			break;
			default:
				outSet( "点击离线推送消息启动：");
			break;
		}
		// 提示点击的内容
		plus.nativeUI.alert( msg.content );
		// 处理其它数据
		logoutPushMsg( msg );
	}, false );
	// 监听在线消息事件
	plus.push.addEventListener( "receive", function( msg ) {
		if ( msg.aps ) {  // Apple APNS message
			outSet( "接收到在线APNS消息：" );
		} else {
			outSet( "接收到在线透传消息：" );
		}
		logoutPushMsg( msg );
	}, false );
}, false );


/**
 * 本地创建一条推动消息
 */
function createLocalPushMsg(){
	var options = {cover:false};
	var str = dateToStr(new Date());
	str += ": 今晚开会，请准时参加！";
	plus.push.createMessage( str, "LocalMSG", options );
//	outSet( "创建本地消息成功！" );
//	outLine( "请到系统消息中心查看！" );
//	if(plus.os.name=="iOS"){
//		outLine('*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!');
//	}
}