//分部验收监理确认复检上传
mui.plusReady(function(){
	//上传图片框
	var newUpload1=document.getElementById('newUpload1');
	var newUpload2=document.getElementById('newUpload2');
	var newUpload3=document.getElementById('newUpload3');
	//上传图片框监听
	newUpload1.addEventListener('tap',function () {
		myactionSheet('ysjl');
	});	
	newUpload2.addEventListener('tap',function(){
		myactionSheet('yszp');
	});	
	newUpload3.addEventListener('tap',function(){
		myactionSheet('yshz');
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
	//验收记录表
	history_ysjl=document.getElementById("history_ysjl");
	empty_ysjl=document.getElementById("empty_ysjl");		
	//验收照片
	history_yszp=document.getElementById("history_yszp");
	empty_yszp=document.getElementById("empty_yszp");	
	//验收汇总表
	history_yshz=document.getElementById("history_yshz");
	empty_yshz=document.getElementById("empty_yshz");
	
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

function appendFile(path,entry,lx){
	if(lx=='ysjl'){
		var img = new Image();
		img.src = path; // 传过来的图片路径在这里用。                                              ///////////// 用canvas画布对照片像素进行处理
		img.onload = function () {
			var that = this;
			//生成比例 
			var w = that.width,
				h = that.height,
				scale = w / h;
				w = 360 || w; //480  你想压缩到多大，改这里
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
	}else if(lx=='yszp'){
		var img = new Image();
		img.src = path; // 传过来的图片路径在这里用。                                              ///////////// 用canvas画布对照片像素进行处理
		img.onload = function () {
			var that = this;
			//生成比例 
			var w = that.width,
				h = that.height,
				scale = w / h;
				w = 360 || w; //480  你想压缩到多大，改这里
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
	}else if(lx=='yshz'){
		var img = new Image();
		img.src = path; // 传过来的图片路径在这里用。                                              ///////////// 用canvas画布对照片像素进行处理
		img.onload = function () {
			var that = this;
			//生成比例 
			var w = that.width,
				h = that.height,
				scale = w / h;
				w = 360 || w; //480  你想压缩到多大，改这里
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
	}
}

// 添加播放项
var index;
var index_ysjl=1;
var index_yszp=1;
var index_yshz=1;
function createItem( p,entry,lx ) {
	var li = document.createElement("li");
	li.className = "ditem";
	li.innerHTML = '<span class="iplay"><font class="aname"></font><br/><font class="ainf"></font></span>';
	li.setAttribute( "onclick", "displayFile(this);" );
	if (lx=='ysjl') {
		hs=history_ysjl;
		ep=empty_ysjl;
		files_ysjl.push({name:"upfile"+index_ysjl,path:p});
		index_ysjl++;
	}
	if (lx=='yszp') {
		hs=history_yszp;
		ep=empty_yszp;
		files_yszp.push({name:"upfile"+index_yszp,path:p});
		index_yszp++;
	}
	if (lx=='yshz') {
		hs=history_yshz;
		ep=empty_yshz;
		files_yshz.push({name:"upfile"+index_yshz,path:p});
		index_yshz++;
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
			if (lx=='ysjl') {				
				history_ysjl.innerHTML = '<li id="empty_ysjl" class="ditem-empty">无历史记录</li>';
				empty_ysjl=document.getElementById("empty_ysjl");	
				files_ysjl=[];
				index_ysjl=1;
			}else if(lx=='yszp'){
				history_yszp.innerHTML = '<li id="empty_yszp" class="ditem-empty">无历史记录</li>';
				empty_yszp=document.getElementById("empty_yszp");	
				files_yszp=[];
				index_yszp=1;
			}else if(lx=='yshz'){
				history_yshz.innerHTML = '<li id="empty_yshz" class="ditem-empty">无历史记录</li>';
				empty_yshz=document.getElementById("empty_yshz");	
				files_yshz=[];
				index_yshz=1;
			}
		} else {
			return;
		}
	});
}

////////////上传文件/////////////////////////////////////////////
var server=url+"my_household/household_upload1.php";
var files1=[];
var files2=[];
var files3=[];
var files_ysjl=[];
var files_yszp=[];
var files_yshz=[];
//上传函数
function upload(lx,clean){	
	files1=files_ysjl;
	var strs1=","+f1Base64.join();
	files2=files_yszp;
	var strs2=","+f2Base64.join();
	files3=files_yshz;
	var strs3=","+f3Base64.join();
	if(files1.length<=0){
		plus.nativeUI.alert("没有添加验收通知！");
		return;
	}else if(files2.length<=0){
		plus.nativeUI.alert("没有添加会议照片！");
		return;
	}else if(files3.length<=0){
		plus.nativeUI.alert("没有添加签到记录表！");
		return;
	}
//	outSet("开始上传：")
	var wt=plus.nativeUI.showWaiting();
	var task=plus.uploader.createUpload(server,{method:"POST"},	function(t,status){ 
		//上传完成
		if(status==200){
//			outLine("上传成功："+t.responseText);
			wt.close();
			var button_lx=document.getElementById(lx);
			var button_clean1=document.getElementById("clean_ysjl");
			var button_clean2=document.getElementById("clean_yszp");
			var button_clean3=document.getElementById("clean_yshz");
			button_lx.disabled=true;
			button_clean1.disabled=true;
			button_clean2.disabled=true;
			button_clean3.disabled=true;
			button_lx.innerText="上传成功";				
		}else{
			outLine("上传失败："+status);
			wt.close();
		}
	});
	task.addData("recordText",text1());
	task.addData("acceptText",text2());
	task.addData("summaryText",text3());
	task.addData("files1",strs1);
	task.addData("files2",strs2);
	task.addData("files3",strs3);
	task.addData("selfId",getId());	
	nub1=files1.length.toString();
	nub2=files2.length.toString();
	nub3=files3.length.toString();
	task.addData("nub1",nub1);
	task.addData("nub2",nub2);
	task.addData("nub3",nub3);
	
	for(var i=0;i<files1.length;i++){
		var f1=files1[i];
		task.addFile(f1.path,{key:f1.name});
	}
	for(var i=0;i<files2.length;i++){
		var f2=files2[i];
		task.addFile(f2.path,{key:f2.name});
	}
	for(var i=0;i<files3.length;i++){
		var f3=files3[i];
		task.addFile(f3.path,{key:f3.name});
	}
	task.start();
//	files=[];
}

//获取项目id
function getId(){
	var selfId = document.getElementById("selfId").value;
	return selfId;
}
//验收记录表说明
function text1(){
	var recordText = document.getElementById("recordText").value;
	return recordText;
}

//验收照片说明
function text2(){
	var acceptText = document.getElementById("acceptText").value;
	return acceptText;
}

//验收汇总表说明
function text3(){
	var summaryText = document.getElementById("summaryText").value;
	return summaryText;
}


////////////上传文件/////////////////////////////////////////////