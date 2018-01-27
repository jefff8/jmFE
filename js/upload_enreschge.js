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
		newUpload1.addEventListener('tap',function () {
			getImage('wtjc');
		});	
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
	//实测
	hs_cj=document.getElementById("history_cj");
	ep_cj=document.getElementById("empty_cj");		

	
	de=document.getElementById("display");
	if(ie=document.getElementById("index")){
		ie.onchange=indexChanged;
	}
	// 判断是否支持video标签
	unv=!document.createElement('video').canPlayType;
},false );

//选择前后摄像头
function changeIndex() {
	outSet( "选择摄像头：" );
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
function appendFile(path,entry,lx){
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
}

// 添加播放项
var index;
var index_wtjc=1;
function createItem( p,entry,lx ) {
	var li = document.createElement("li");
	li.className = "ditem";
	li.innerHTML = '<span class="iplay"><font class="aname"></font><br/><font class="ainf"></font></span>';
	li.setAttribute( "onclick", "displayFile(this);" );
	if (lx=='wtjc') {
		hs=hs_cj;
		ep=ep_cj;
		files_wtjc.push({name:"upfile"+index_wtjc,path:p});
		index_wtjc++;
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
			if (lx=='wtjc') {
				hs_cj.innerHTML = '<li id="empty_cj" class="ditem-empty">无历史记录</li>';
				ep_cj=document.getElementById("empty_cj");	
				files_wtjc=[];
				index_wtjc=1;
			}
			// 删除音频文件
			outSet( "清空拍照录像历史记录：ok" );
		} else {
			return;
		}
	});
}


////////////上传文件/////////////////////////////////////////////
//上传
var server=url+"my_plus/entity_upload.php";
//var server="http://demo.dcloud.net.cn/helloh5/uploader/upload.php";
var files=[];
var files_wtjc=[];
function upload(lx,clean){	
	var strs=","+f1Base64.join();
	if (lx=='wtjc') {		
		files=files_wtjc;	
	}
	if(files.length<=0){
		plus.nativeUI.alert("没有添加上传文件！");
		return;
	}
//	outSet("开始上传：")
	var wt=plus.nativeUI.showWaiting();
	var task=plus.uploader.createUpload(server,{method:"POST"},	function(t,status){ 
		//上传完成
		if(status==200){
//			alert(mchen()+'/'+tpart()+lx);
//			outLine("上传成功："+t.responseText);
			wt.close();
			var button_lx=document.getElementById(lx);
			var button_clean=document.getElementById(clean);
			button_lx.disabled=true;
			button_clean.disabled=true;
			button_lx.innerText="上传成功";				
		}else{
			outLine("上传失败："+status);
			wt.close();
		}
	});
	task.addData("gcmc",getName());
	task.addData("Text6",text6());
	task.addData("lx",lx);
	task.addData("process_type",process_type());
	task.addData("files1",strs);
	task.addData("uid",getUid());
	task.addData("id",getid());
	nub=files.length.toString();
	task.addData("nub1",nub);
	task.addData("mchen",mchen());
	task.addData("tresult",getreport());
	for(var i=0;i<files.length;i++){
		var f=files[i];
		task.addFile(f.path,{key:f.name});
	}
	task.start();
	files=[];
}

// 产生一个随机数
function getUid(){
	return Math.floor(Math.random()*100000000+10000000).toString();
}
// 获取ULid
function getid(){
	var ulid=document.getElementById('ulid').value;
//	alert(sjc);
	return ulid;
}
//获取工程时间戳
function mchen(){
	var sjc=document.getElementById('sjc').value;
//	alert(sjc);
	return sjc;
}
//获取工程名
function getName(){
	var gcmc = document.getElementById("gcmc").value;
	return gcmc;
}
//获取不合格报告
function getreport(){
	var ttxt = document.getElementById('test_txt').value;
	return ttxt;
}
//处理照片说明
function text6(){
	var Text6 = document.getElementById("Text6").value;
	return Text6;
}
//处理类型
function process_type(){
	var process_type = document.getElementById("type").value;
	return process_type;
}
////////////上传文件/////////////////////////////////////////////