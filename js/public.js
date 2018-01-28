(function(w) {

	/**
	 * 调用雪花框
	 * @param {Object} message 		雪花框文本
	 * @param {Object} Millisecond  维持时间(毫秒)
	 */
	waitload = function(message,Millisecond=2500) {
		plus.nativeUI.showWaiting(message);//调用雪花框
		setTimeout( function(){
			plus.nativeUI.closeWaiting();
		}, Millisecond );
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
	/*
	 * 日期选择器
	 * 使用时，需要增加'name="Selection-date"'以供.on方法批量绑定事件
	 */
	mui(".mui-content").on('tap','input[name="Selection-date"]',function(){
		o = this;
		plus.nativeUI.pickDate( function(e){
			d=e.date;
			o.value = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
		});
	})




















}(window));