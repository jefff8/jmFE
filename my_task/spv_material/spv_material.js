	//根据对应工程查询任务
	a5_account = 0;
	function taskList5(pj_timestamp){
//		console.log(pj_timestamp);
		mui.ajax(url+'my_task/task_list.php',{
			data:{
				flag:"材料抽检",
				uid:uid,
				unitName:unitName,
				pj_timestamp:pj_timestamp,
				unit:unit
			},
			type:'post',
			dataType:'json',
			timeout:10000,
			success:function(data){
//				alert(data);
				length = data.length;
				for(i=0;i<length;i++){
					if(data[i].result==='success'){
						a5_account+= 1;
						id = data[i].卡项id;
						gcdzt = data[i].工程单状态;
						gcmc = data[i].工程名称;
						qylx = data[i].取样类型;
						gg = data[i].规格;
						sl = data[i].数量;
						sccj = data[i].生产厂家;
						qyr = data[i].取样人;
						qyrq = data[i].取样日期;
						sjc = data[i].时间戳;
						operation_supvision = data[i].监理操作单位;
						operation_detect = data[i].检测操作单位;
						//以下为我的工程表信息
						pj_Info=new Object();
						pj_Info.construction = data[0].施工单位;
						pj_Info.supvision = data[0].监理单位;
						pj_Info.detect = data[0].检测单位;
						my_spv_material(gcdzt,gcmc,id,qylx,gg,sl,sccj,qyr,qyrq,sjc,operation_supvision,operation_detect,pj_Info);
					}	
				}
				a5 = document.getElementById("a5");
				a5.innerHTML = "材料抽检("+a5_account+")";
			},
			error:function(xhr,type,errorThrown){
//				alert('ajax材料抽检错误'+type+'---'+errorThrown+"失败！");
			}
		});
		
	}
	//动态创建项目
	function my_spv_material(gcdzt,gcmc,id,qylx,gg,sl,sccj,qyr,qyrq,sjc,operation_supvision,operation_detect,pj_Info){
		gcdzt_c = encodeURI(encodeURI(gcdzt));
		gcmc_c = encodeURI(encodeURI(gcmc));
		detect_c = encodeURI(encodeURI(pj_Info.detect));
//		console.log(decodeURI(decodeURI(detect_c)));
		supvision_c = encodeURI(encodeURI(pj_Info.supvision));
//		console.log(pj_Info.detect);
		ul = document.createElement("ul");
		ul.className = "mui-table-view mui-card my_list my_marginbottom10px";
		pj_Info.id = id;
		pj_Info.gcdzt = gcdzt;
		pj_Info.timeStamp = sjc;
//		console.log(pj_Info.supvision);
		ul.id = JSON.stringify(pj_Info);
//		console.log(JSON.stringify(pj_Info))
		if(gcdzt=='新增复检'||gcdzt=='已取样复检'||gcdzt=='已委托复检'||gcdzt=='收样复检'||gcdzt=='复检不合格'){
			ul.style.borderColor = "red";
		}
		if(gcdzt=='不合格'||gcdzt=='复检不合格'){
			color = 'red';
		}else{
			color = 'blue2';
		}
		//通过判断工程单状态判断url
		if(gcdzt=='新增复检'){
			var url = "../my_spv_material/my_spv_material_review_detail.html?sjc="+sjc+"&gcid="+id+"&state="+gcdzt_c+"&gcmc="+gcmc_c+"&supvision="+supvision_c+"&mobile="+mobile+"&detect="+detect_c;
		}else{
			var url = "../my_spv_material/my_spv_material_detail.html?sjc="+sjc+"&gcid="+id+"&gcmc="+gcmc_c+"&state="+gcdzt_c+"&detect="+detect_c;
		}
		ul.innerHTML = '<li class="mui-table-view-cell my_backgroundcolor_'+color+'"><a class="a_color" href="'+url+'"><span class="mui-icon mui-icon-gear mui-pull-left my_fontweight my_color_white"></span><p class="mui-ellipsis my_style2">'+ qylx +'</p></a></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">规格,数量：'+gg+','+sl+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">生产厂家：'+sccj+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">取样人：'+ qyr +'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">取样日期：'+ qyrq +'</p></li>';
		supervision_material.appendChild(ul);
	}
	
	
	/*
	 * 预加载材料抽检详情页面(用于测试，未使用)
	 */
	function spv_mat_detailPrePage(){
		var spv_mat_detailPage = mui.preload({
			id:'spv_material-detail',
			url:'spv_material/spv_material_detail.html'
		});
		spv_mat_detailPage = plus.webview.getWebviewById('spv_material-detail');
		mui('#supervision_material').on('tap','ul',function(){
			console.log(spv_mat_detailPage);
			var did = this.getAttribute('id');
			if(!spv_mat_detailPage){
				spv_mat_detailPage = plus.webview.getWebviewById('spv_material-detail');
				console.log(spv_mat_detailPage);
			}
			//触发详情页面的自定义事件
			mui.fire(spv_mat_detailPage,'spv_material_Id',{
				did:did
			});
			
			//打开详情页面
			mui.openWindow({
				id:'spv_material-detail',
				url:'spv_material/spv_material_detail.html',
				extras:{
					did:did,
					name:'mui'
				}
			});	
		});
	}
	
	
//	mui('#supervision_material').on('tap','ul',function(){
//		var pj_Info = this.getAttribute('id');
//		
//		var pj_Info = JSON.parse(pj_Info);
//		console.log(pj_Info.detect)
//		if(pj_Info.gcdzt==='新增复检'){
//			url = 'spv_material/spv_material_review_detail.html';
//		}else{
//			url = 'spv_material/spv_material_detail.html';
//		}
////		console.log(url)
//		//打开详情页面
//		mui.openWindow({
//			id:'spv_material-detail',
//			url:url,
//			extras:{
//				did:pj_Info.id,
//				pj_Info:pj_Info
//			}
//		});	
//	});
	
	
	
	mui('#supervision_material').on('longtap','ul',function(){
//		console.log(this.getAttribute('id'))
		var pj_Info = JSON.parse(this.getAttribute('id'));
		var ulId = pj_Info.id;
		var supvision = pj_Info.supvision;
		mui.ajax(url+'my_task/spv_material.php',{
			data:{
				flag:"获取状态",
				ulId:ulId
			},
			dataType:'json',
			type:'POST', 
			timeout:10000,
			success:function(data){
//				alert(data);
				var status = data.工程单状态;
//				var pj_name = data.工程名称;
				var gcmc = data.工程名称;
				var pj_id = data.id; //工程id
				var gcdzt_pd = data.工程单状态;
				var pj_timestamp = data.工程时间戳;
				if(gcdzt_pd=='新增'){
					var btnArray = [
					{title:"委托检测"},
					{title:"删除"}
					]; 
					plus.nativeUI.actionSheet({
						title:"操作", 
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						switch (index){
							case 1://取样
								mui.ajax(url+'my_plus/my_spv_material_list.php',{
									data:{
										flag:"改新增状态",
										ulid:ulId,
										gcmc:gcmc,
										gcdzt:gcdzt_pd
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
										mui.toast(data.结果,{ duration:'long', type:'div' })
										location.reload();//刷新本页面
									},
									error:function(xhr,type,errorThrown){
//																alert('ajax取样错误'+type+'---'+errorThrown+"失败！");
									}
								});
							break;
							case 2://删除
								mui.ajax(url+'my_plus/my_spv_material_list.php',{
									data:{
										flag:"删除",
										ulid:ulId,
										gcmc:gcmc
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
//													alert(data.结果);
										mui.toast(data.结果,{ duration:'long', type:'div' })
										location.reload();//刷新本页面
									},
									error:function(xhr,type,errorThrown){
//																alert('ajax错误'+type+'---'+errorThrown+"失败！");
									}
								});
							break;
						}//End of switch	
					});//End of actionSheet
				}else if(gcdzt_pd=='已取样'||gcdzt_pd=='已取样复检'){
					var btnArray = [{title:"收样信息"}];
					plus.nativeUI.actionSheet({
						title:"操作",
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						switch (index){
							case 1://确认见证
								//执行验证码
								if(gcdzt_pd=='已取样'){
//									alert('已取样')
									//确定见证
									mui.openWindow({
										url:'../my_spv_material/my_spv_material_deliver.html',
										styles: {
											hardwareAccelerated:false
										},
										extras:{
											//传递参数
											ulId:ulId,
											flag:'task',
											my_name:getlocalStorage('username'),
											gcdzt:gcdzt_pd,
											pj_timestamp:pj_timestamp,
											supvision:supvision
										},
										show:{
											autoShow:true,//页面loaded事件发生后自动显示
											aniShow:'slide-in-right',//页面显示动画
											duration:'100'//页面动画持续时间
										},
										waiting:{
											autoShow:false,//自动显示等待框
										}
									})
								}else if(gcdzt_pd=='已取样复检'){
									mui.openWindow({
										url:'../my_spv_material/my_spv_material_deliver.html',
										styles: {
											hardwareAccelerated:false
										},
										extras:{
											//传递参数
											ulId:ulId,
											pj_Info:pj_Info,
											gcdzt:gcdzt_pd,
											flag:'task',
											my_name:getlocalStorage('username'),
											pj_timestamp:pj_timestamp,
											supvision:supvision,
										},
										show:{
											autoShow:true,//页面loaded事件发生后自动显示
											aniShow:'slide-in-right',//页面显示动画
											duration:'100'//页面动画持续时间
										},
										waiting:{
											autoShow:false,//自动显示等待框
										}
									})
								}
								break;
							case 2:
							break;
						}//End of switch	
					});//End of actionSheet
				}else if(gcdzt_pd=='收样'||gcdzt_pd=='收样复检'){
					var btnArray = [
					{title:"结果(合格)"},
					{title:"不合格"}
					];
					plus.nativeUI.actionSheet({
						title:"操作",
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						switch (index){
							case 1://结果(合格)
							if(gcdzt_pd=='收样'){
								var btnArray = ['是', '否'];
								mui.confirm('确定将该送检鉴定为合格？', '江门建筑管理系统', btnArray, function(e) {
									if (e.index == 0) {
										//输入检测报告编号
										mui("#spvmaterialconsigncode").popover("toggle");
										var but_id=document.getElementById("spv_material_code_act").getElementsByTagName('button')[1];
										but_id.id=ulId;
									}	
								});
							}else if(gcdzt_pd=='收样复检'){
								var btnArray = ['是', '否'];
								mui.confirm('确定将该送检鉴定为合格？', '江门建筑管理系统', btnArray, function(e) {
									if (e.index == 0) {
										//输入检测报告编号
										mui("#spvmaterialreinspection").popover("toggle");
										var but_id=document.getElementById("spv_material_code_act1").getElementsByTagName('button')[1];
										but_id.id=ulId;
									}	
								});
							}
							
							break;
							case 2://不合格
							if(gcdzt_pd=='收样'){
								var btnArray = ['是', '否'];
								mui.confirm('确定将该送检鉴定为不合格？', '江门建筑管理系统', btnArray, function(e) {
									if (e.index == 0) {
										//不合格推送通知
										var server=url+"push/push.php";
										var task=plus.uploader.createUpload(server,{method:"POST"},	function(t,status){ 
											//推送完成
											if(status==200){
												alert("不合格出现!将通知各单位");
											}else{
												alert("失败");
											}
										});
										task.addData("title",'江门市建设工程施工质量管理系统');
										task.addData("notice",gcmc+'——（材料送检）出现新的不合格项目！');
										task.addData("pj_id",pj_id);
										task.start();
										mui.openWindow({
											url:'../my_spv_material/my_spv_material_fail.html',
											styles: {
												hardwareAccelerated:false
											},
											extras:{
												//传递参数
												ulId:ulId,
												flag:'task',
												timestamp:pj_timestamp
											},
											show:{
												autoShow:true,//页面loaded事件发生后自动显示
												aniShow:'slide-in-right',//页面显示动画
												duration:'100'//页面动画持续时间
											},
											waiting:{
												autoShow:false,//自动显示等待框
											}
										})
									} else {
										
									}
								});
							}else if(gcdzt_pd=='收样复检'){
								var btnArray = ['是', '否'];
								mui.confirm('确定将该复检项目鉴定为不合格？', '江门建筑管理系统', btnArray, function(e) {
									if (e.index == 0) {
										//不合格推送通知
										var server=url+"push/push.php";
										var task=plus.uploader.createUpload(server,{method:"POST"},	function(t,status){ 
											//推送完成
											if(status==200){
												alert("不合格出现!将通知各单位");
											}else{
												alert("失败");
											}
										});
										task.addData("title",'江门市建设工程施工质量管理系统');
										task.addData("notice",gcmc+'——（材料送检）出现新的不合格项目！');
										task.addData("pj_id",pj_id);
										task.start();
										mui.openWindow({
											url:'../my_spv_material/my_spv_material_fail.html',
											styles: {
												hardwareAccelerated:false
											},
											extras:{
												//传递参数
												ulId:ulId,
												timestamp:pj_timestamp,
												state:'recheck',
												flag:'task'
											},
											show:{
												autoShow:true,//页面loaded事件发生后自动显示
												aniShow:'slide-in-right',//页面显示动画
												duration:'100'//页面动画持续时间
											},
											waiting:{
												autoShow:false,//自动显示等待框
											}
										});
									}
								});
							}
							break;
						}//End of switch	
					});//End of actionSheet
				}else if(gcdzt_pd=='不合格'){
					var btnArray = [
					{title:"复检"},
					{title:"监理处理"}
					]; 
					plus.nativeUI.actionSheet({
						title:"操作", 
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						switch (index){
							case 1://复检
								mui.ajax(url+'my_plus/my_spv_material_list.php',{
									data:{
										flag:"复检",
										ulid:ulId,
										gcmc:gcmc
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
										mui.toast('复检提交成功请回看',{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									},
									error:function(xhr,type,errorThrown){
			//							alert('ajax错误'+type+'---'+errorThrown+"失败！");
									}
								});	
								break;
							case 2://监理处理
								mui.openWindow({
									url:"../my_spv_material/my_spv_material_supvr.html",
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId,
										flag:'task'
									},
									show:{
										autoShow:true,//页面loaded事件发生后自动显示
										aniShow:'slide-in-right',//页面显示动画
										duration:'100'//页面动画持续时间
									},
									waiting:{
										autoShow:false,//自动显示等待框
									}
								})
								break;
						}	
					 });
				}else if(gcdzt_pd=='待审批'){
					var btnArray = [
					{title:"确认(监督机构)"}
					]; 
					plus.nativeUI.actionSheet({
						title:"操作", 
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						//var nextpage='';
						switch (index){
							case 1://审批通过
								mui.ajax(url+'my_plus/my_spv_material_list.php',{
									data:{
										flag:"审批通过",
										ulid:ulId,
										gcmc:gcmc
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
			//													alert(data.结果);
										mui.toast('操作完成！',{ duration:'long', type:'div' })
										location.reload();//刷新本页面
									},
									error:function(xhr,type,errorThrown){
			//													alert('ajax错误'+type+'---'+errorThrown+"失败！");
										mui.toast('操作完成！',{ duration:'long', type:'div' })
										location.reload();//刷新本页面
									}
								});	
								break;
						}	
					 });
				}else if(gcdzt_pd=='复检不合格'){
					var btnArray = [{title:"监理处理"}]; 
					plus.nativeUI.actionSheet({
						title:"操作", 
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						switch (index){
							case 1://监理处理
								mui.openWindow({
									url:"../my_spv_material/my_spv_material_supvr.html",
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId,
										flag:'task'
									},
									show:{
										autoShow:true,//页面loaded事件发生后自动显示
										aniShow:'slide-in-right',//页面显示动画
										duration:'100'//页面动画持续时间
									},
									waiting:{
										autoShow:false,//自动显示等待框
									}
								});
								break;
						}	
					 });
				}//End of if
			},//End of success
			error:function(xhr,type,errorThrown){
//				alert('ajax获取状态错误'+type+'---'+errorThrown+"失败！");
			}
		});

	});
	//操作
	
	//检测报告编号
	function spv_material_inpcode(obj){
		var ulId = obj.id;
		testNum = document.getElementById('spv_material_testNum').value;
		mui.ajax(url+'my_plus/my_spv_material_list.php',{
			data:{
				flag:"合格",
				ulid:ulId,
				gcmc:gcmc,
//				timestamp:pj_timestamp,
				testNum:testNum
			},
			dataType:'json',
			type:'POST', 
			timeout:10000,
			success:function(data){
				mui.toast(data.结果,{ duration:'long', type:'div' })
				location.reload();//刷新本页面
			},
			error:function(xhr,type,errorThrown){
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});	
	}
	
	
	
	
	
	
	
	
	function spv_material_recheckNum(obj){
		var ulId = obj.id;
		recheckNum = document.getElementById('spv_material_recheckNum').value;
//				alert(code);
		mui.ajax(url+'my_plus/my_spv_material_list.php',{
			data:{
				flag:"复检合格",
				ulid:ulId,
				gcmc:gcmc,
//				timestamp:pj_timestamp,
				recheckNum:recheckNum
			},
			dataType:'json',
			type:'POST', 
			timeout:10000,
			success:function(data){
				mui.toast(data.结果,{ duration:'long', type:'div' })
				location.reload();//刷新本页面
			},
			error:function(xhr,type,errorThrown){
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});	
	};
	
	
	
	
