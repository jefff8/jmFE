//分部验收监理确认复检上传
mui.plusReady(function(){
	//上传图片框
	var newUpload1=document.getElementById('newUpload1');
	var newUpload2=document.getElementById('newUpload2');
	var newUpload3=document.getElementById('newUpload3');
	var newUpload4=document.getElementById('newUpload4');
	//上传图片框监听
	newUpload1.addEventListener('tap',function () {
		myactionSheet('ystz');
	});	
	newUpload2.addEventListener('tap',function(){
		myactionSheet('hyzp');
	});	
	newUpload3.addEventListener('tap',function(){
		myactionSheet('qdjl');
	});	
	newUpload4.addEventListener('tap',function(){
		myactionSheet('ysbg');
	});	
	//原生操作列表
	var myactionSheet=function(lx){
		var btnArray = [
		{title:"拍照"},
		{title:"相册"}
		];
		plus.nativeUI.actionSheet( {
			title:"操作",
			cancel:"取消",
			buttons:btnArray
		}, function(e){
			var index = e.index;
			var text = "你刚点击了\"";
			switch (index){
				case 0:
					text += "取消";
					break;
				case 1:
					getImage(lx);
					text += "拍照";
					break;
				case 2:
					galleryImgs(lx);
					text += "相册";
					break;
			}				
		} );
	};	
});

//定义变量
var i=1,gentry=null,w=null;
var hs=null,ep=null,de=null,ie=null;
var unv=true;	

// H5 plus事件处理
function plusReady_camera(){
	// 获取摄像头目录对象
	plus.io.resolveLocalFileSystemURL( "_doc/", function ( entry ) {
		entry.getDirectory( "camera/rwxj", {create:true}, function ( dir ) {
			gentry = dir;
			//updateHistory();
		}, function ( e ) {
			outSet( "Get directory \"camera\rwxj\" failed: "+e.message );
		} );
	}, function ( e ) {
		outSet( "Resolve \"_doc/\" failed: "+e.message );
	} );
}
if(window.plus){
	plusReady_camera();
}else{
	document.addEventListener("plusready",plusReady_camera,false);
}
// 监听DOMContentLoaded事件
document.addEventListener("DOMContentLoaded",function(){
	// 获取DOM元素对象
	//验收通知
	history_ys=document.getElementById("history_ys");
	empty_ys=document.getElementById("empty_ys");		
	//会议照片
	history_hy=document.getElementById("history_hy");
	empty_hy=document.getElementById("empty_hy");	
	//签到记录
	history_qdjl=document.getElementById("history_qdjl");
	empty_qdjl=document.getElementById("empty_qdjl");
	//验收报告
	history_ysbg=document.getElementById("history_ysbg");
	empty_ysbg=document.getElementById("empty_ysbg");
	
	de=document.getElementById("display");
	if(ie=document.getElementById("index")){
		ie.onchange=indexChanged;
	}
	// 判断是否支持video标签
	unv=!document.createElement('video').canPlayType;
},false );

// 拍照函数
function getImage(lx) {
	var cmr = plus.camera.getCamera();	//获取摄像头管理对象	
	cmr.captureImage(function(p){
		plus.io.resolveLocalFileSystemURL( p, function ( entry ) {
			var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径，例如file:///........之类的
			appendFile(localurl,entry,lx);
		}, function ( e ) {
//			outLine( "读取拍照文件错误："+e.message );
		} );
	}, function ( e ) {
//		outLine( "失败："+e.message );
	}, {filename:"_doc/camera/rwxj/",index:1} );
}

//相册多选照片
function galleryImgs(lx){
	// 从相册中选择图片
//	outSet("从相册中选择多张图片:");
    plus.gallery.pick( function(path){
		for(var i=0 in path.files){
			paths = path.files[i];
			plus.io.resolveLocalFileSystemURL( paths, function ( entry ) {
				appendFile(entry.toLocalURL(),entry,lx);
				
			}, function ( e ) {
				alert("读取拍照文件错误："+e.message);
	//			outLine( "读取拍照文件错误："+e.message );
			} );
		}
   }, function ( e ) {
//  	outSet( "取消选择图片" );
    },{filter:"image",multiple:true,system:false});
}

// 显示文件
function displayFile( li ) {
	if ( w ) {
		outLine( "重复点击！" );
		return;
	}
	if ( !li || !li.entry ) {
		ouSet( "无效的媒体文件" );
		return;
	}
	var name = li.entry.name;
	var suffix = name.substr(name.lastIndexOf('.'));
	var url = "";
	if ( suffix==".mov" || suffix==".3gp" || suffix==".mp4" || suffix==".avi" ){
		//if(unv){plus.runtime.openFile("_doc/camera/"+name);return;}
		url = "camera_video.html";
	} else {
		url = "camera_image.html";
	}
	w=plus.webview.create(url,url,{hardwareAccelerated:true,scrollIndicator:'none',scalable:true,bounce:"all"});
	w.addEventListener( "loaded", function(){
		w.evalJS( "loadMedia('"+li.entry.toLocalURL()+"')" );
		//w.evalJS( "loadMedia(\""+"http://localhost:13131/_doc/camera/"+name+"\")" );
		}, false );
		w.addEventListener( "close", function() {
			w = null;
		}, false );
		w.show( "pop-in" );
}

// 添加文件
var f1Base64=[];
var f2Base64=[];
var f3Base64=[];
var f4Base64=[];

function appendFile(path,entry,lx){
	if(lx=='ystz'){
		var img = new Image();
		img.src = path; // 传过来的图片路径在这里用。                                              ///////////// 用canvas画布对照片像素进行处理
		img.onload = function () {
			var that = this;
			//生成比例 
			var w = that.width,
				h = that.height,
				scale = w / h;
				w = 700 || w; //480  你想压缩到多大，改这里
				h = w / scale;
			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.setAttribute("width",w);
			canvas.setAttribute("height",h);
			ctx.drawImage(that, 0, 0, w, h);
			var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8 );
			f1Base64.push(base64+"︴");
			createItem(base64,entry,lx);
		}
	}else if(lx=='hyzp'){
		var img = new Image();
		img.src = path; // 传过来的图片路径在这里用。                                              ///////////// 用canvas画布对照片像素进行处理
		img.onload = function () {
			var that = this;
			//生成比例 
			var w = that.width,
				h = that.height,
				scale = w / h;
				w = 700 || w; //480  你想压缩到多大，改这里
				h = w / scale;
			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.setAttribute("width",w);
			canvas.setAttribute("height",h);
			ctx.drawImage(that, 0, 0, w, h);
			var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8 );
			f2Base64.push(base64+"︴");
			createItem(base64,entry,lx);
		}
	}else if(lx=='qdjl'){
		var img = new Image();
		img.src = path; // 传过来的图片路径在这里用。                                              ///////////// 用canvas画布对照片像素进行处理
		img.onload = function () {
			var that = this;
			//生成比例 
			var w = that.width,
				h = that.height,
				scale = w / h;
				w = 700 || w; //480  你想压缩到多大，改这里
				h = w / scale;
			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.setAttribute("width",w);
			canvas.setAttribute("height",h);
			ctx.drawImage(that, 0, 0, w, h);
			var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8 );
			f3Base64.push(base64+"︴");
			createItem(base64,entry,lx);
		}
	}else if(lx=='ysbg'){
		var img = new Image();
		img.src = path; // 传过来的图片路径在这里用。                                              ///////////// 用canvas画布对照片像素进行处理
		img.onload = function () {
			var that = this;
			//生成比例 
			var w = that.width,
				h = that.height,
				scale = w / h;
				w = 700 || w; //480  你想压缩到多大，改这里
				h = w / scale;
			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.setAttribute("width",w);
			canvas.setAttribute("height",h);
			ctx.drawImage(that, 0, 0, w, h);
			var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8 );
			f4Base64.push(base64+"︴");
			createItem(base64,entry,lx);
		}
	}
}

// 添加播放项
var index;
var index_ystz=1;
var index_hyzp=1;
var index_qdjl=1;
var index_ysbg=1;
function createItem( p,entry,lx ) {
	var li = document.createElement("li");
	li.className = "ditem";
	li.innerHTML = '<span class="iplay"><font class="aname"></font><br/><font class="ainf"></font></span>';
	li.setAttribute( "onclick", "displayFile(this);" );
	if (lx=='ystz') {
		hs=history_ys;
		ep=empty_ys;
		files_ystz.push({name:"upfile"+index_ystz,path:p});
		index_ystz++;
	}
	if (lx=='hyzp') {
		hs=history_hy;
		ep=empty_hy;
		files_hyzp.push({name:"upfile"+index_hyzp,path:p});
		index_hyzp++;
	}
	if (lx=='qdjl') {
		hs=history_qdjl;
		ep=empty_qdjl;
		files_qdjl.push({name:"upfile"+index_qdjl,path:p});
		index_qdjl++;
	}
	if (lx=='ysbg') {
		hs=history_ysbg;
		ep=empty_ysbg;
		files_ysbg.push({name:"upfile"+index_ysbg,path:p});
		index_ysbg++;
	}
	hs.insertBefore( li, ep.nextSibling );
	li.querySelector(".aname").innerText = entry.name;
//	li.querySelector(".ainf").innerText = "...";
	li.entry = entry;
	// 设置空项不可见
	ep.style.display = "none";
}

// 清除历史记录
function cleanHistory(lx) {	
	var btnArray = ['确定', '取消'];
	mui.confirm('您确定要清空记录吗？', '警告:', btnArray, function(e) {
		if (e.index == 0) {
			if (lx=='ystz') {				
				history_ys.innerHTML = '<li id="empty_ys" class="ditem-empty">无历史记录</li>';
				empty_ys=document.getElementById("empty_ys");	
				files_ystz=[];
				index_ystz=1;
			}else if(lx=='hyzp'){
				history_hy.innerHTML = '<li id="empty_hy" class="ditem-empty">无历史记录</li>';
				empty_hy=document.getElementById("empty_hy");	
				files_hyzp=[];
				index_hyzp=1;
			}else if(lx=='qdjl'){
				history_qdjl.innerHTML = '<li id="empty_qdjl" class="ditem-empty">无历史记录</li>';
				empty_qdjl=document.getElementById("empty_qdjl");	
				files_qdjl=[];
				index_qdjl=1;
			}else if(lx=='ysbg'){
				history_ysbg.innerHTML = '<li id="empty_ysbg" class="ditem-empty">无历史记录</li>';
				empty_ysbg=document.getElementById("empty_ysbg");	
				files_ysbg=[];
				index_ysbg=1;
			}
		} else {
			return;
		}
	});
}

////////////上传文件/////////////////////////////////////////////
var server=url+"my_division/division_upload.php";
var files1=[];
var files2=[];
var files3=[];
var files4=[];
var files_ystz=[];
var files_hyzp=[];
var files_qdjl=[];
var files_ysbg=[];
//上传函数
function upload(lx,clean){
	switch(lx){
		case "save1"://验收通知
			files1=files_ystz;
			if(files1.length<=0){
				plus.nativeUI.alert("没有添加验收通知附件!");
				return;
			}
			var strs1=","+f1Base64.join();
			var wt=plus.nativeUI.showWaiting();
			var task=plus.uploader.createUpload(server,{method:"POST"},	function(t,status){ 
				//上传完成
				if(status==200){
					wt.close();
					var button_lx=document.getElementById(lx);
					var button_clean1=document.getElementById("clean_ystz");
					button_lx.disabled=true;
					button_clean1.disabled=true;
					button_lx.innerText="上传成功";				
				}else{
					alert("上传失败："+status);
					wt.close();
				}
			});
			task.addData("acceptText",text1());
			task.addData("files1",strs1);
			task.addData("selfId",getId());
			task.addData("flag",'save1');
			task.addData("acceptanceTime",get_AcceptanceTime());
			nub1=files1.length.toString();
			task.addData("nub1",nub1);
			for(var i=0;i<files1.length;i++){
				var f1=files1[i];
				task.addFile(f1.path,{key:f1.name});
			}
			task.start();
			break;
		case "save2":
			files2=files_hyzp;
			if(files2.length<=0){
				plus.nativeUI.alert("没有添加会议照片！");
				return;
			}
			var strs2=","+f2Base64.join();
			var wt=plus.nativeUI.showWaiting();
			var task=plus.uploader.createUpload(server,{method:"POST"},	function(t,status){ 
				//上传完成
				if(status==200){
					wt.close();
					var button_lx=document.getElementById(lx);
					var button_clean1=document.getElementById("clean_hyzp");
					button_lx.disabled=true;
					button_clean1.disabled=true;
					button_lx.innerText="上传成功";				
				}else{
					alert("上传失败："+status);
					wt.close();
				}
			});
			task.addData("meetingText",text2());
			task.addData("files2",strs2);
			task.addData("selfId",getId());	
			task.addData("flag",'save2');
			nub2=files2.length.toString();
			task.addData("nub2",nub2);
			for(var i=0;i<files2.length;i++){
				var f2=files2[i];
				task.addFile(f2.path,{key:f2.name});
			}
			task.start();
			break;
		case "save3":
			files3=files_qdjl;
			if(files3.length<=0){
				plus.nativeUI.alert("没有添加签到记录表附件！");
				return;
			}
			var strs3=","+f3Base64.join();
			var wt=plus.nativeUI.showWaiting();
			var task=plus.uploader.createUpload(server,{method:"POST"},	function(t,status){ 
				//上传完成
				if(status==200){
					wt.close();
					var button_lx=document.getElementById(lx);
					var button_clean1=document.getElementById("clean_qdjl");
					button_lx.disabled=true;
					button_clean1.disabled=true;
					button_lx.innerText="上传成功";				
				}else{
					alert("上传失败："+status);
					wt.close();
				}
			});
			task.addData("signinText",text3());
			task.addData("files3",strs3);
			task.addData("selfId",getId());	
			task.addData("flag",'save3');
			nub3=files3.length.toString();
			task.addData("nub3",nub3);
			for(var i=0;i<files3.length;i++){
				var f3=files3[i];
				task.addFile(f3.path,{key:f3.name});
			}
			task.start();
			break;
		case "save4":
			files4=files_ysbg;
			if(files4.length<=0){
				plus.nativeUI.alert("没有添加验收报告附件！");
				return;
			}
			var strs4=","+f4Base64.join();
			var wt=plus.nativeUI.showWaiting();
			var task=plus.uploader.createUpload(server,{method:"POST"},	function(t,status){ 
				//上传完成
				if(status==200){
					wt.close();
					var button_lx=document.getElementById(lx);
					var button_clean1=document.getElementById("clean_ysbg");
					button_lx.disabled=true;
					button_clean1.disabled=true;
					button_lx.innerText="上传成功";				
				}else{
					alert("上传失败："+status);
					wt.close();
				}
			});
			task.addData("reportText",text4());
			task.addData("files4",strs4);
			task.addData("selfId",getId());	
			task.addData("flag",'save4');
			nub4=files4.length.toString();
			task.addData("nub4",nub4);
			for(var i=0;i<files4.length;i++){
				var f4=files4[i];
				task.addFile(f4.path,{key:f4.name});
			}
			task.start();
			break;
	}
}

//获取项目id
function getId(){
	var selfId = document.getElementById("selfId").value;
	return selfId;
}
//验收时间
function get_AcceptanceTime(){
	var acceptanceTime = document.getElementById("acceptanceTime").value;
	return acceptanceTime;
}
//验收通知说明
function text1(){
	var acceptText = document.getElementById("acceptText").value;
	return acceptText;
}

//会议照片说明
function text2(){
	var meetingText = document.getElementById("meetingText").value;
	return meetingText;
}

//签到记录表说明
function text3(){
	var signinText = document.getElementById("signinText").value;
	return signinText;
}

//验收报告说明
function text4(){
	var reportText = document.getElementById("reportText").value;
	return reportText;
}

////////////上传文件/////////////////////////////////////////////