//分部验收监理确认复检上传
mui.plusReady(function(){
	//上传图片框
	var newUpload1=document.getElementById('newUpload1');
	//上传图片框监听
	newUpload1.addEventListener('tap',function () {
		myactionSheet('ysfa');
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
	history_ysfa=document.getElementById("history_ysfa");
	empty_ysfa=document.getElementById("empty_ysfa");		
	
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

function appendFile(path,entry,lx){
	if(lx=='ysfa'){
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
}

// 添加播放项
var index;
var index_ysfa=1;
function createItem( p,entry,lx ) {
	var li = document.createElement("li");
	li.className = "ditem";
	li.innerHTML = '<span class="iplay"><font class="aname"></font><br/><font class="ainf"></font></span>';
	li.setAttribute( "onclick", "displayFile(this);" );
	if (lx=='ysfa') {
		hs=history_ysfa;
		ep=empty_ysfa;
		files_ysfa.push({name:"upfile"+index_ysfa,path:p});
		index_ysfa++;
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
			if (lx=='ysfa') {				
				history_ysfa.innerHTML = '<li id="empty_ysfa" class="ditem-empty">无历史记录</li>';
				empty_ysfa=document.getElementById("empty_ysfa");	
				files_ysfa=[];
				index_ysfa=1;
			}
		} else {
			return;
		}
	});
}

////////////上传文件/////////////////////////////////////////////
var server=url+"my_household/household_upload3.php";
var files1=[];
var files_ysfa=[];
//上传函数
function upload(lx,clean){	
	files1=files_ysfa;
	var strs1=","+f1Base64.join();
	if(files1.length<=0){
		plus.nativeUI.alert("没有添加验收通知！");
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
			var button_clean1=document.getElementById("clean_ysfa");
			button_lx.disabled=true;
			button_clean1.disabled=true;
			button_lx.innerText="上传成功";				
		}else{
			outLine("上传失败："+status);
			wt.close();
		}
	});
	task.addData("Text1",Text1());
	task.addData("files1",strs1);
	task.addData("selfId",getId());	
	nub1=files1.length.toString();
	task.addData("nub1",nub1);
	
	for(var i=0;i<files1.length;i++){
		var f1=files1[i];
		task.addFile(f1.path,{key:f1.name});
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
function Text1(){
	var Text1 = document.getElementById("Text1").value;
	return Text1;
}


////////////上传文件/////////////////////////////////////////////