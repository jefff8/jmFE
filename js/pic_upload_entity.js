mui.init({
	swipeBack:true //启用右滑关闭功能
	});
	(function($) {
		$('#scroll').scroll({
			indicators: true //是否显示滚动条
			});
	})(mui);
// H5 plus事件处理
mui.plusReady(function(){
	//监听upload_camera,打开原生操作列表
	var newUpload1=document.getElementById('newUpload1');
	var newUpload2=document.getElementById('newUpload2');
	var newUpload3=document.getElementById('newUpload3');
	newUpload1.addEventListener('tap',function () {
		getImage('cjzp');
	});
	newUpload2.addEventListener('tap',function () {
		getImage('ypzp');
	});
	newUpload3.addEventListener('tap',function () {
		getImage('sbzp');
	});
	
});

//定义变量
var i=1,gentry=null,w=null;
var hs=null,ep=null,de=null,ie=null;
var unv=true;

if(window.plus){
	plusReady_camera();
}else{
	document.addEventListener("plusready",plusReady_camera,false);
}
// 监听DOMContentLoaded事件
document.addEventListener("DOMContentLoaded",function(){
	// 获取DOM元素对象
	//检测前照片
	hs_cj=document.getElementById("history_cj");
	ep_cj=document.getElementById("empty_cj");		
	//检测实施过程照片
	hs_yp=document.getElementById("history_yp");
	ep_yp=document.getElementById("empty_yp");	
    //检测设备照片
	hs_sb=document.getElementById("history_sb");
	ep_sb=document.getElementById("empty_sb");

	de=document.getElementById("display");
	if(ie=document.getElementById("index")){
		ie.onchange=indexChanged;
	}
	// 判断是否支持video标签
	unv=!document.createElement('video').canPlayType;
},false );


//选择前后摄像头
function changeIndex() {
//	outSet( "选择摄像头：" );
	ie.focus();
}
function indexChanged() {
	de.innerText = ie.options[ie.selectedIndex].innerText;
	i = parseInt( ie.value );
	outLine( de.innerText );
}

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

// H5 plus事件处理
function plusReady_camera(){
	// 获取摄像头目录对象
	plus.io.resolveLocalFileSystemURL( "_doc/", function ( entry ) {
		entry.getDirectory( "camera/rwxj", {create:true}, function ( dir ) {
			gentry = dir;
			//updateHistory();
		}, function ( e ) {
//			outSet( "Get directory \"camera\rwxj\" failed: "+e.message );
		} );
	}, function ( e ) {
//		outSet( "Resolve \"_doc/\" failed: "+e.message );
	} );
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
	if(lx=='cjzp'){
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
	}else if(lx=='ypzp'){
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
	}else if(lx=='sbzp'){
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
	}
	
}

// 添加播放项
var index;
var index_cjzp=1;
var index_ypzp=1;
var index_sbzp=1;
function createItem( p,entry,lx ) {
	var li = document.createElement("li");
	li.className = "ditem";
	li.innerHTML = '<span class="iplay"><font class="aname"></font><br/><font class="ainf"></font></span>';
	li.setAttribute( "onclick", "displayFile(this);" );
	if (lx=='cjzp') {
		hs=hs_cj;
		ep=ep_cj;
		files_cjzp.push({name:"upfile"+index_cjzp,path:p});
		index_cjzp++;
	}else if (lx=='ypzp') {
		hs=hs_yp;
		ep=ep_yp;
		files_ypzp.push({name:"upfile"+index_ypzp,path:p});
		index_ypzp++;
	}else if (lx=='sbzp') {
		hs=hs_sb;
		ep=ep_sb;
		files_sbzp.push({name:"upfile"+index_sbzp,path:p});
		index_sbzp++;
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
			if (lx=='cjzp') {				
				hs_cj.innerHTML = '<li id="empty_cj" class="ditem-empty">无历史记录</li>';
				ep_cj=document.getElementById("empty_cj");	
				files_cjzp=[];
				index_cjzp=1;
			}else if(lx=='ypzp'){
				hs_yp.innerHTML = '<li id="empty_yp" class="ditem-empty">无历史记录</li>';
				ep_yp=document.getElementById("empty_yp");	
				files_ypzp=[];
				index_ypzp=1;
			}else if(lx=='sbzp'){
				hs_sb.innerHTML = '<li id="empty_sb" class="ditem-empty">无历史记录</li>';
				ep_sb=document.getElementById("empty_sb");	
				files_sbzp=[];
				index_sbzp=1;
			}
			// 删除音频文件
//			outSet( "清空拍照录像历史记录：ok" );
		} else {
			return;
		}
	});
}

////////////上传文件/////////////////////////////////////////////
//上传
var server=url+"my_plus/pic_upload_entity.php";
//var server="http://demo.dcloud.net.cn/helloh5/uploader/upload.php";
var files1=[];
var files2=[];
var files3=[];
var files_cjzp=[];
var files_ypzp=[];
var files_sbzp=[];
////////////上传文件/////////////////////////////////////////////
////////////上传文件/////////////////////////////////////////////
//upload()函数在HTML中用
function upload(lx,clean){
	files1=files_cjzp;	
	var strs1=","+f1Base64.join();
	files2=files_ypzp;
	var strs2=","+f2Base64.join();
	files3=files_sbzp;
	var strs3=","+f3Base64.join();
	
	if(files1.length<=0){
		plus.nativeUI.alert("没有添加场景照片！");
		return;
	}else if(files2.length<=0){
		plus.nativeUI.alert("没有添加检测实施过程照片！");
		return;
	}else if(files3.length<=0){
		plus.nativeUI.alert("没有添加检测设备照片！");
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
			var button_clean1=document.getElementById("clean_cj");
			var button_clean2=document.getElementById("clean_yp");
			var button_clean3=document.getElementById("clean_sb");
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
	task.addData("gcmc",getName());
	task.addData("Text1",text1());
	task.addData("Text2",text2());
	task.addData("Text3",text3());
	task.addData("lx",lx);
	task.addData("files1",strs1);
	task.addData("files2",strs2);
	task.addData("files3",strs3);
	task.addData("uid",getUid());
	nub1=files1.length.toString();
	nub2=files2.length.toString();
	nub3=files3.length.toString();
	task.addData("nub1",nub1);
	task.addData("nub2",nub2);
	task.addData("nub3",nub3);
	task.addData("mchen",mchen());
	task.addData("myInfo",saveInfo());
	task.addData("pj_name",project_name);
	task.addData("pj_timestamp",timestamp);
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

// 产生一个随机数
function getUid(){
	return Math.floor(Math.random()*100000000+10000000).toString();
}
// 获取时间戳
function mchen(){	
	var sjc=document.getElementById('sjc').value;
	return sjc;
}
//获取工程名称
function getName(){
	var gcmc = document.getElementById("gcmc");
	return gcmc;
}
//场景照片说明
function text1(){
	var  Text1 = document.getElementById("Text1").value;
	return Text1;
}
//检测实施过程照片说明
function text2(){
	var Text2 = document.getElementById("Text2").value;
	return Text2;
}
//检测设备照片说明
function text3(){
	var Text3 = document.getElementById("Text3").value;
	return Text3;
}
//信息保存
function saveInfo(){
	var myform=document.getElementById('myform');
	var F_input = myform.getElementsByTagName("input");
	var Str = "";
	var unit = document.getElementById("operation_unit").value;
	for(i=0;i<7;i++){
		Str = Str + F_input[i].value + "|";
	}
	Str= Str+unit;
	return Str;
}
////////////上传文件/////////////////////////////////////////////
