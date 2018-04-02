/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		//判断帐号密码的正确
		mui.ajax(url+'login.php',{
			data:{
				account:loginInfo.account,
				password:loginInfo.password
			},
			dataType:'json',
			type:'post',
			timeout:10000,
			success:function(data){
				if (data.result=='success') {
					document.getElementById('shji').value=data.shji;
					document.getElementById("my_name").value=data.my_name;
					document.getElementById("uid").value=data.uid;
					document.getElementById("unit").value=data.unit;
					document.getElementById("unitName").value=data.unitName;
					return callback();
				} else{					
					return callback('用户名或密码错误');				
				}
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				return callback('ajax错误'+type+errorThrown);
			}
		});
	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		regInfo.email = regInfo.email || '';
		regInfo.mobile = regInfo.mobile || '';
		regInfo.my_name = regInfo.my_name || '';
		regInfo.units = regInfo.units || '';
		regInfo.unitName = regInfo.unitName || '';
		regInfo.cid = regInfo.cid || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!regInfo.email) {
			return callback('邮箱地址不合法');
		}
		if(regInfo.mobile.length!=11){
			return callback('请输入正确的手机号');
		}
		if(!regInfo.my_name){
			return callback('请输入姓名');
		}
		if(!regInfo.units){
			return callback('请选择单位');
		}
		if(!regInfo.unitName){
			return callback('请填写单位名称');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

//	var checkEmail = function(email) {
//		email = email || '';
//		return (email.length > 3 && email.indexOf('@') > -1);
//	};

	/**
	 * 找回密码
	 **/
//	owner.forgetPassword = function(email, callback) {
//		callback = callback || $.noop;
//		if (!checkEmail(email)) {
//			return callback('邮箱地址不合法');
//		}
//		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
//	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取本地是否安装客户端
		 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));