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
		var before_ph4=document.getElementById('before_ph4');
		before_ph4.addEventListener('tap',function () {
			myactionSheet('rwfj5');
		});	
		
		
		//原生操作列表
		var myactionSheet=function(lx){
			var btnArray = [
			{title:"拍照"},
			//{title:"录像"},录像函数getVideo()
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
						galleryImg(lx);
						text += "相册";
						break;
				}				
			} );
		};	
	});
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
	//任务附件
	hl_rwfj=document.getElementById("history_rwfj");
	le_rwfj=document.getElementById("empty_rwfj");		
	
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
//	outSet( "开始拍照：" );
	var cmr = plus.camera.getCamera();	//获取摄像头管理对象	
	//进行拍照操作cmr.captureImage( successCB, errorCB, option );
	cmr.captureImage(function(p){
//		outLine( "成功："+p );
		// resolveLocalFileSystemURL(url,succesCB,errorCB )通过URL参数获取目录对象或文件对象
		plus.io.resolveLocalFileSystemURL( p, function ( entry ) {
			var pic=document.getElementById("my_img_id");
		  	var before_ph=document.getElementById("before_ph4");
			pic.classList.remove('my_none');
			taphoto.classList.remove('my_none');
			before_ph.classList.add('my_none');
			createItem(p,lx);
		}, function ( e ) {
//			outLine( "读取拍照文件错误："+e.message );
		} );
	}, function ( e ) {
//		outLine( "失败："+e.message );
	}, {filename:"_doc/camera/rwxj/",index:1} );
}

// 从相册中选择图片
function galleryImg(lx) {
	// 从相册中选择图片
	plus.gallery.pick(function(p){
	  // 从相册返回的路径不需要转换可以直接使用
	  if(lx=='rwfj5'){
	  	var pic=document.getElementById("my_img_id");
	  	var before_ph=document.getElementById("before_ph4");
		pic.classList.remove('my_none');
		before_ph.classList.add('my_none');
		pic.src=p;
		pic.realUrl=pic.src;
		createItem(p,'rwfj5');
	  }
		
	});	
}


// 创建上传数组
var index;
var index_rwfj5=1;
function createItem( p,lx ) {
	if (lx=='rwfj5') {
		files_rwfj5.push({name:"upfile"+index_rwfj5,path:p});
		index_rwfj5++;
	}
}
////////////上传文件/////////////////////////////////////////////
//上传
var server=url+"my_plus/fileupload.php";
//var server="http://demo.dcloud.net.cn/helloh5/uploader/upload.php";
var files5=[];
var files_rwfj5=[];
function upload(lx,clean){	
	//alert(typeof(lx));
	if (lx=='rwfj5') {		
		files5=files_rwfj5;	
	}
	if(files5.length<=0){
		plus.nativeUI.alert("没有添加上传文件！");
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
			var button_clean=document.getElementById(clean);
			button_lx.disabled=true;
//			button_clean.disabled=true;
			button_lx.innerText="上传成功";	
		}else{
			outLine("上传失败："+status);
			wt.close();
		}
	});
	task.addData("gcmc",'电子科技大学中山学院');
	task.addData("lx",lx);
	task.addData("uid",getUid());	
	nub5=files5.length.toString();
	task.addData("nub5",nub5);
	task.addData("mchen",mchen());
	for(var i=0;i<files5.length;i++){
		var f=files5[i];
		task.addFile(f.path,{key:f.name});
	}
	task.start();
	files5=[];
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
////////////上传文件/////////////////////////////////////////////