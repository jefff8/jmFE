(function(w) {

	/**
	 * 调用雪花框
	 * @param {Object} message 		雪花框文本
	 * @param {Object} Millisecond  维持时间(毫秒)
	 */
//	waitload = function(message,Millisecond=2500) {
//		plus.nativeUI.showWaiting(message);//调用雪花框
//		setTimeout( function(){
//			plus.nativeUI.closeWaiting();
//		}, Millisecond );
//	};
	
	/**
	 * 设置localStorage缓存
	 * @param {Object} Key   键
	 * @param {Object} Value 值
	 */
	setlocalStorage  = function(Key,Value) {
		Value = Value || {};
		localStorage.setItem(Key, JSON.stringify(Value));
	};
	
	/**
	 * 获取localStorage缓存
	 * @param {Object} Key 键
	 */
	getlocalStorage  = function(Key) {
		return JSON.parse(localStorage.getItem(Key))
	};
	
	/**
	 * 获取当前时间戳
	 */
	getsjc = function (){
		var myDate=new Date();
		var mytime=myDate.getTime();
		return mytime;
	}
	
	/**
	 * 获取url参数值
	 * @param {Object} name 需要解析的参数
	 */
	geturl = function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]);
		return null;
	}

	




















}(window));