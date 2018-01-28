	//根据对应工程查询任务
	a1_account = 0;
	function taskList1(pj_timestamp){
		mui.ajax(url+'my_task/task_list.php',{
			data:{
				flag:"材料送检",
				pj_timestamp:pj_timestamp,
				unit:unit,
				unitName:unitName
			},
			type:'post',
			dataType:'json',
			timeout:10000,
			success:function(data){
				var length = data.length;
				a1_account+= length;
				var a1 = document.getElementById("a1");
				for(var i=0;i<length;i++){
					a1.innerHTML = "材料送检("+a1_account+")";
					var id = data[i].id;
					var sjc = data[i].时间戳;
					var pj_name = data[i].工程名称;
					var type = data[i].取样类型;
					var scale = data[i].规格;
					var quantity = data[i].数量;
					var getGuy = data[i].取样人;
					var getDate = data[i].取样日期;
					var state = data[i].工程单状态;
					send(sjc,id,pj_name,type,scale,quantity,getGuy,getDate,state);
				}
			},
			error:function(xhr,type,errorThrown){
//				alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});
	}
	//动态创建项目
	function send(sjc,id,pj_name,type,scale,quantity,getGuy,getDate,state){
		var state_c = encodeURI(encodeURI(state));
		var pj_name_c = encodeURI(encodeURI(pj_name));
		if(state=='不合格'){
			color = 'red';
		}else{
			color = 'blue2';
		}
		var ul = document.createElement("ul");
		ul.className = "mui-table-view mui-card my_list my_marginbottom10px";
		ul.id = id;
		if(state=='新增复检'||state=='取样复检'||state=='未见证复检'||state=='收样复检'||state=='复检不合格'){
			ul.style.borderColor = "red";	
		}
		  
		var send = document.getElementById("send");
		if(state=='新增'||state=='取样'||state=='取样复检'||state=='未见证'||state=='未见证复检'||state=='已见证'||state=='已见证复检'){
			var my_href = "../my_material/my_material_samDet.html?sjc="+sjc+"&gcid="+id+"&gcmc="+pj_name_c+"";
		}else if(state=='新增复检'){
			var my_href = "../my_material/my_material_samDetEdit.html?sjc="+sjc+"&gcid="+id+"&gcmc="+pj_name_c+"";
		}else if(state=='收样'){
			var my_href = "../my_material/my_material_rcvdDet.html?sjc="+sjc+"&gcid="+id+"&gcmc="+pj_name_c+"&flag="+'task'+"&mobile="+mobile+"";
		}else if(state=='收样复检'||state=='复检不合格'){
			var my_href = "../my_material/my_material_recheckDet.html?sjc="+sjc+"&gcid="+id+"&gcmc="+pj_name_c+"&status="+state_c+"&mobile="+mobile+"&flag="+'task'+"";
		}else if(state=='待审批'){
			var my_href = "../my_material/my_material_resDet.html?sjc="+sjc+"&gcid="+id+"&state="+'processed'+"";
		}else if(state=='不合格'){
			var my_href = "../my_material/my_material_resDet.html?sjc="+sjc+"&gcid="+id+"&state="+'fail'+"";
		}
		ul.innerHTML = '<li class="mui-table-view-cell my_backgroundcolor_'+color+'"><a class="a_color" href="'+my_href+'"><span class="mui-icon mui-icon-gear mui-pull-left my_fontweight my_color_white"></span><p class="mui-ellipsis my_style2">工程名称：'+ pj_name +'</p></a></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">取样类型：'+type+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">规格数量：'+scale+'/'+quantity+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">取样人：'+getGuy+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">取样日期：'+getDate+'</p></li>';
		send.appendChild(ul);
		
	}
	
	//材料送检操作
	mui("#send").on('longtap','ul',function(){
		var ulId = this.id;//获取当前的卡项的id
		mui.ajax(url+'my_task/my_send.php',{
			data:{
				flag:"获取状态",
				ulId:ulId
			},
			type:'post',
			dataType:'json',
			success:function(data){
				var status = data.工程单状态;
				var pj_name = data.工程名称;
				var pj_id = data.id; //工程id
				if(status=='新增' || status=='新增复检'){
					var btnArray = [
					{title:"取样(施工单位)"},
					{title:"删除"}
					]; 
					plus.nativeUI.actionSheet({
						title:"操作", 
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						//var nextpage='';
						switch (index){
							case 1://取样
							if(status=='新增'){
								mui.ajax(url+'my_task/my_send.php',{
									data:{
										flag:"取样",
										ulId:ulId
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
//													alert(data.结果);
										mui.toast(data.结果,{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									},
									error:function(xhr,type,errorThrown){
										alert('ajax错误'+type+'---'+errorThrown+"失败！");
									}
								});
							}else if(status=='新增复检'){
								mui.ajax(url+'my_task/my_send.php',{
									data:{
										flag:"取样复检",
										ulId:ulId
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
//													alert('ajax错误'+type+'---'+errorThrown+"失败！");
									}
								});
							}
									
								break;
							case 2://删除
								mui.ajax(url+'my_task/my_send.php',{
									data:{
										flag:"删除",
										ulId:ulId
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
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
									}
								});
								break;
						}	
					 });
				}else if(status=='取样'||status=='取样复检'){
					var btnArray = [
					{title:"提交见证"},
					{title:"撤销取样"}
					];
					plus.nativeUI.actionSheet({
						title:"操作",
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						//var nextpage='';
						switch (index){
							case 1:
								//提交见证/*确定见证*/
								if(status=='取样'){
									mui.ajax(url+'my_task/my_send.php',{
										data:{
											flag:"提交见证",
											ulId:ulId
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
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
										}
									});
								}else if(status=='取样复检'){
									mui.ajax(url+'my_task/my_send.php',{
										data:{
											flag:"提交复检见证",
											ulId:ulId
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
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
										}
									});
								}
								
								break;
							case 2://撤销取样
							if(status=='取样'){
								mui.ajax(url+'my_task/my_send.php',{
									data:{
										flag:"撤销取样",
										ulId:ulId
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
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
									}
								});
							}else if(status=='取样复检'){
								mui.ajax(url+'my_task/my_send.php',{
									data:{
										flag:"撤销取样复检",
										ulId:ulId
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
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
									}
								});
							}
								
								break;
						}	
					  }
					);
				}else if(status=='未见证'||status=='未见证复检'){
					var btnArray = [
						{title:"确认见证"},
						{title:"拒收"}
					];
					plus.nativeUI.actionSheet({
						title:"操作",
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						//var nextpage='';
						switch (index){
							case 1://确认见证
								//执行验证码
								if(status=='未见证'){
									mui("#zuyPopover").popover("toggle");
									var but_id=document.getElementById("comfirm").getElementsByTagName('button')[0];
									but_id.id=ulId;
								}else if(status=='未见证复检'){
									mui("#recPopover").popover("toggle");
									var but_id=document.getElementById("recheck").getElementsByTagName('button')[0];
									but_id.id=ulId;
								}
								break;
							case 2:
								mui.openWindow({
									url:"../my_material/my_rejection.html",
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId,
										urlId:"my_task/task_list.html"
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
				}else if(status=='已见证'||status=='已见证复检'){
					var btnArray = [
						{title:"送样"}
					];
					plus.nativeUI.actionSheet({
						title:"操作",
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						switch (index){
							case 1://实测
							if(status=='已见证'){
								mui.openWindow({
									url:'deliver.html',
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId,
										my_name:my_name
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
							}else if(status=='已见证复检'){
								mui.openWindow({
									url:'send_recheckDeliver.html',
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId,
										my_name:my_name
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
							case 2://撤销
								break;
						}	
					  }
					);
				}else if(status=='收样'||status=='收样复检'){
					var btnArray = [
						{title:"结果(合格)"},
						{title:"不合格"},
						{title:"拒收"}
					];
					plus.nativeUI.actionSheet({
						title:"操作",
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						//var nextpage='';
						switch (index){
							case 1://结果
							if(status=='收样'){
								var btnArray = ['是', '否'];
								mui.confirm('确定将该送检鉴定为合格？', '江门建筑管理系统', btnArray, function(e) {
									if (e.index == 0) {
										//输入检测报告编号
										mui("#consigncode").popover("toggle");
										var but_id=document.getElementById("code_act").getElementsByTagName('button')[1];
										but_id.id=ulId;
									}	
								});
							}else if(status=='收样复检'){
								var btnArray = ['是', '否'];
								mui.confirm('确定将该送检鉴定为合格？', '江门建筑管理系统', btnArray, function(e) {
									if (e.index == 0) {
										//输入检测报告编号
										mui("#reinspection").popover("toggle");
										var but_id=document.getElementById("code_act1").getElementsByTagName('button')[1];
										but_id.id=ulId;
									}	
								});
							}
							
							break;
							case 2:
							if(status=='收样'){
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
										task.addData("notice",pj_name+'——（材料送检）出现新的不合格项目！');
										task.addData("pj_id",pj_id);
										task.start();
										mui.openWindow({
											url:'send_fail.html',
											styles: {
												hardwareAccelerated:false
											},
											extras:{
												//传递参数
												ulId:ulId
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
							}else if(status=='收样复检'){
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
										task.addData("notice",pj_name+'——（材料送检）出现新的不合格项目！');
										task.addData("pj_id",pj_id);
										task.start();
										mui.openWindow({
											url:'../my_material/my_material_fail.html',
											styles: {
												hardwareAccelerated:false
											},
											extras:{
												//传递参数
												ulId:ulId,
												state:'recheck',
												flag:'task'
											},
											show:{
												autoShow:true,//页面loaded事件发生后自动显示
												aniShow:'slide-in-right',//页面显示动画
												duration:'100'//页面动画持续时间
											},
											waiting:{
												autoShow:false//自动显示等待框 
											}
										});
									}	
								});
							}
							break;
							case 3:
								mui.openWindow({
									url:"../my_material/my_rejection.html",
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId,
										urlId:"my_task/task_list.html"
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
					  }
					);
				}else if(status=='不合格'){
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
						//var nextpage='';
						switch (index){
							case 1://复检
								mui.ajax(url+'my_task/my_send.php',{
									data:{
										flag:"复检",
										ulId:ulId
									},
									dataType:'json', 
									type:'POST', 
									timeout:10000,
									success:function(data){
//										alert(data); 
										mui.toast('复检提交成功请回看',{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									},
									error:function(xhr,type,errorThrown){
										mui.toast('复检提交成功请回看',{ duration:'long', type:'div' });
										location.reload();//刷新本页面
//										alert('ajax错误'+type+'---'+errorThrown+"失败！");
									}
								});	
								break;
							case 2://监理处理
								mui.openWindow({
									url:"send_supvr.html",
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId
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
				}else if(status=='待审批'){
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
								mui.ajax(url+'my_task/my_send.php',{
									data:{
										flag:"审批通过",
										ulId:ulId
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
									}
								});	
								break;
						}	
					 });
				}else if(status=='复检不合格'){
					var btnArray = [
					{title:"监理处理"}
					]; 
					plus.nativeUI.actionSheet({
						title:"操作", 
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	 
						//var nextpage='';
						switch (index){
							case 1://监理处理
								mui.openWindow({
									url:"send_supvr.html",
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId
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
				}
			},
			error:function(xhr,type,errorThrown){
				alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});
	});
	//材料送检操作
	
	
	//验证验证码
	function qdjz(jzid){
		var code1 = document.getElementById("code1");
		var jzid = jzid.id;
		if(yzm.value==""){
			mui.toast('请先获取验证码',{ duration:'long', type:'div' }) 
		}else if(code1.value==""){
			mui.toast('请输入验证码',{ duration:'long', type:'div' }) 
		}else if(code1.value==yzm.value){
			//确定见证
			mui.ajax(url+'my_task/my_send.php',{
				data:{
					flag:'已见证',
					ulId:jzid
				},
				dataType:'json',
				type:'POST', 
				timeout:10000,
				success:function(data){
					mui.toast('见证成功',{ duration:'long', type:'div' }) 
					location.reload();
				},
				error:function(xhr,type,errorThrown){
					alert('ajax错误'+type+'---'+errorThrown);
				}
			});
		}else{
			mui.toast('验证码不正确',{ duration:'long', type:'div' }) 
		}
	}
	//复检验证码
	function recheck(jzid){
		var jzid = jzid.id;
		var code_recheck = document.getElementById("code_recheck");
		if(yzm.value==""){
			mui.toast('请先获取验证码',{ duration:'long', type:'div' }) 
		}else if(code_recheck.value==""){
			mui.toast('请输入验证码',{ duration:'long', type:'div' }) 
		}else if(code_recheck.value==yzm.value){
			//确定见证
			mui.ajax(url+'my_task/my_send.php',{
				data:{
					flag:'已见证复检',
					ulId:jzid
				},
				dataType:'json',
				type:'POST', 
				timeout:10000,
				success:function(data){
					mui.toast('见证成功',{ duration:'long', type:'div' }) 
					location.reload();
				},
				error:function(xhr,type,errorThrown){
					alert('ajax错误'+type+'---'+errorThrown);
				}
			});
		}else{
			mui.toast('验证码不正确',{ duration:'long', type:'div' }) 
		}
	}
	//检测报告编号
	function inpcode(obj){
		var ulId = obj.id;
		var testNum = document.getElementById('testNum').value;
//				alert(code);
		mui.ajax(url+'my_task/my_send.php',{
			data:{
				flag:"合格",
				ulId:ulId,
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
	
	//复检检测报告编号
	function recheckNum(obj){
		var ulId = obj.id;
		var recheckNum = document.getElementById('recheckNum').value;
//				alert(code);
		mui.ajax(url+'my_task/my_send.php',{
			data:{
				flag:"复检合格",
				ulId:ulId,
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
	}