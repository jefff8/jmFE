	//根据对应工程查询任务
	a2_account = 0;
	function taskList2(pj_timestamp){
		mui.ajax(url+'my_task/task_list.php',{
			data:{
				flag:"材料自检",
				pj_timestamp:pj_timestamp,
				unit:unit
			},
			type:'post',
			dataType:'json',
			timeout:10000,
			success:function(data){
				var length = data.length;
				a2_account+= length;
				var a2 = document.getElementById("a2");
				for(var i=0;i<length;i++){
					a2.innerHTML = "材料自检("+a2_account+")";
					var id = data[i].id;
					var sjc = data[i].时间戳;
					var pj_name = data[i].工程名称;
					var type = data[i].自检自测类型;
					var part = data[i].检测部位;
					var quantity = data[i].数量;
					var inspector = data[i].检测人;
					var testDate = data[i].检测日期;
					var state = data[i].工程单状态;
					inspection1(sjc,id,pj_name,type,part,quantity,inspector,testDate,state);
				}
			},
			error:function(xhr,type,errorThrown){
//				alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});
	}
	//动态创建项目
	function inspection1(sjc,id,pj_name,type,part,quantity,inspector,testDate,state){
		if(state=='新增'||state=='提交见证'||state=='取样送检'||state=='取样送检提交见证'){
			color = 'blue2';
		}else if(state=='不合格'||state=='取样送检不合格'){
			color = 'red';
		}else{
			color = 'green2';
		}
		var ul = document.createElement("ul");
		ul.className = "mui-table-view mui-card my_list my_marginbottom10px";
		ul.id = id;
		if(state=='取样送检'||state=='取样送检准备材料'||state=='取样送检提交见证'||state=='取样送检确定自测'||state=='取样送检不合格'){
			ul.style.borderColor = "red";	
		}
		var self_inspection1 = document.getElementById("self_inspection1");
		if(state=='取样送检'){
			var my_href = "../my_insp_material/my_inspection_detailDetEdit.html?sjc="+sjc+"&gcid="+id+"";
		}else{
			var my_href = "../my_insp_material/my_inspection_detail.html?sjc="+sjc+"&gcid="+id+"";
		}
		ul.innerHTML = '<li class="mui-table-view-cell my_backgroundcolor_'+color+'"><a class="a_color" href="'+my_href+'"><span class="mui-icon mui-icon-gear mui-pull-left my_fontweight my_color_white"></span><p class="mui-ellipsis my_style2">工程名称：'+ pj_name +'</p></a></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">自检自测类型：'+type+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">检测部位/数量：'+part+'/'+quantity+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">检测人：'+inspector+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">检测日期：'+testDate+'</p></li>';
		self_inspection1.appendChild(ul);
	}
	//材料自检操作
	mui('#self_inspection1').on('longtap','ul',function(){
		var ulId = this.id;
		//异步获取当前卡项的“工程单状态”
		mui.ajax(url+'my_task/self_inspection1.php',{
			data:{
				flag:"获取状态",
				ulId:ulId
			},
			type:'post',
			dataType:'json',
			timeout:10000,
			success:function(data){
				var status = data.工程单状态;
				var pj_name = data.工程名称;
				var pj_id = data.id; //工程id
				if(status == "新增"||status == "取样送检"){
					var btnArray = [
					{title:"取样"},
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
							case 1://准备材料
							if(status=='新增'){
								mui.ajax(url+'my_task/self_inspection1.php',{
									data:{
										flag:"准备材料",
										ulId:ulId
									},
									type:'post',
									dataType:'json',
									timeout:10000,
									success:function(data){
//											alert("ajax success!");
										mui.toast(data.result,{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									},
									error:function(){
										mui.toast("取样成功",{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									}
								});
							}else if(status=='取样送检'){
								mui.ajax(url+'my_task/self_inspection1.php',{
									data:{
										flag:"取样送检",
										ulId:ulId
									},
									type:'post',
									dataType:'json',
									timeout:10000,
									success:function(data){
										mui.toast(data.result,{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									},
									error:function(){
//										alert('ajax错误!');
									}
								});
							}
								
								break;
							case 2://删除
								mui.ajax(url+'my_task/self_inspection1.php',{
									data:{
										flag:"删除",
										ulId:ulId
									},
									type:'post',
									dataType:'json',
									timeout:10000,
									success:function(data){
//											alert("ajax success!");
										mui.toast(data.result,{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									},
									error:function(){
										mui.toast("删除失败+ajax error!",{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									}
								});
								break;
						}	
					  }
					);
				}else if(status == "准备材料"||status == "取样送检准备材料"){
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
							case 1://提交见证
							if(status=='准备材料'){
								mui.ajax(url+'my_task/self_inspection1.php',{
									data:{
										flag:"提交见证",
										ulId:ulId
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
										mui.toast(data.result,{ duration:'long', type:'div' }) 
										location.reload();
									},
									error:function(xhr,type,errorThrown){
										alert('ajax错误'+type+'---'+errorThrown);
									}
								});
							}else if(status=='取样送检准备材料'){
								mui.ajax(url+'my_task/self_inspection1.php',{
									data:{
										flag:"取样送检准备材料",
										ulId:ulId
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
										mui.toast(data.result,{ duration:'long', type:'div' }) 
										location.reload();
									},
									error:function(xhr,type,errorThrown){
										alert('ajax错误'+type+'---'+errorThrown);
									}
								});
							}
								
								break;
							case 2://撤销准备材料
							if(status=='准备材料'){
								mui.ajax(url+'my_task/self_inspection1.php',{
									data:{
										flag:"撤销取样",
										ulId:ulId
									},
									type:'post',
									dataType:'json',
									timeout:10000,
									success:function(data){
//											alert("ajax success!");
										mui.toast(data.result,{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									},
									error:function(){
										mui.toast("撤销失败+ajax error!",{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									}
								});
							}else if(status=='取样送检准备材料'){
								mui.ajax(url+'my_task/self_inspection1.php',{
									data:{
										flag:"撤销取样送检准备材料",
										ulId:ulId
									},
									type:'post',
									dataType:'json',
									timeout:10000,
									success:function(data){
//											alert("ajax success!");
										mui.toast(data.result,{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									},
									error:function(){
										mui.toast("撤销失败+ajax error!",{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									}
								});
							}
								
								break;
						}	
					  }
					);
				}else if(status == "提交见证"||status=='取样送检提交见证'){
					var btnArray = [
						{title:"确定见证"},
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
							case 1://确定自测:输入验证码
								mui("#inspect1_code").popover("toggle");
								var but_id=document.getElementById("insConfirm1").getElementsByTagName('button')[0];
								but_id.id=ulId;
								break;
							case 2://拒收
								mui.openWindow({
									url:"../my_insp_material/my_rejection.html",
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
				}else if(status == "确定自测"||status == "取样送检确定自测"){
					var btnArray = [
						{title:"合格"},
						{title:"不合格"}
						];
						plus.nativeUI.actionSheet({
							title:"操作",
							cancel:"取消",
							buttons:btnArray
						},function(e){
							var index = e.index;	
							//var nextpage='';
							switch (index){
								case 1://合格
									mui.ajax(url+'my_task/self_inspection1.php',{
										data:{
											flag:"合格",
											ulId:ulId
										},
										type:'post',
										dataType:'json',
										success:function(data){
											mui.toast(data.result,{ duration:'long', type:'div' });
											location.reload();//刷新本页面
										},
										error:function(){
											mui.toast("ajax error!",{ duration:'long', type:'div' });
										}
									});
									break;
								case 2://不合格
								if(status=='确定自测'){
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
											task.addData("notice",pj_name+'——（材料自检）出现新的不合格项目！');
											task.addData("pj_id",pj_id);
											task.start();
											mui.openWindow({
												url:"insp1_fail.html",
												extras:{
													//传递参数
													ulId:ulId,
													status:"确定自测"
												},
												show: {
													aniShow:"pop-in"
												},
												waiting: {
													autoShow: false
												}
											});
											
										} else {
											
										}
									});
								}else if(status=='取样送检确定自测'){
									var btnArray = ['是', '否'];
									mui.confirm('确定将该送检鉴定为不合格？', '江门建筑管理系统', btnArray, function(e) {
										if (e.index == 0) {
											mui.openWindow({
												url:"insp1_fail.html",
												extras:{
													//传递参数
													ulId:ulId,
													status:"取样送检确定自测"
												},
												show: {
													aniShow:"pop-in"
												},
												waiting: {
													autoShow: false
												}
											});
											
										} else {
											
										}
									});
								}
									break;
							}	
						  }
						);
				}else if(status=='不合格'){
					mui.ajax(url+'check.php',{
					data:{
						ulId:ulId,
						mobile:mobile,
						flag:"self_inspection1"
					},
					dataType:'json',
					type:'post',
					timeout:10000,
					success:function(data){
						var units = data['单位']; //获取单位信息
						if(units=='监理单位'||units=='管理员'){
							var btnArray = [
							{title:"监理处理"},
							{title:"取样送检"}
							]; 
							plus.nativeUI.actionSheet({
								title:"操作", 
								cancel:"取消",
								buttons:btnArray
							},function(e){
								var index = e.index;	
								switch (index){
									case 1://监理处理
										mui.openWindow({
											url:"insp1_supvr.html",
											extras:{
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
									case 2://取样送检
										mui.ajax(url+'my_task/self_inspection1.php',{
											data:{
												flag:"取样送检操作",
												ulId:ulId
											},
											dataType:'json',
											type:'POST', 
											timeout:10000,
											success:function(data){
//																alert(data.结果);
												mui.toast('取样送检成功请回看',{ duration:'long', type:'div' });
												location.reload();//刷新本页面
											},
											error:function(xhr,type,errorThrown){
												alert('ajax错误'+type+'---'+errorThrown+"失败！");
											}
										});	
										break;
								}	
							 });
						}else{
							var btnArray = [
								{title:"抱歉，您没有操作权限"}
							]; 
							plus.nativeUI.actionSheet({
								title:"操作", 
								cancel:"取消",
								buttons:btnArray
							},function(e){
							});
						}
					},
					error:function(xhr,type,errorThrown){
//						alert('ajax错误'+type+'---'+errorThrown+"失败！");
					}
				});
				}else if(status=='取样送检不合格'){
					mui.ajax(url+'check.php',{
					data:{
						mobile:mobile
					},
					dataType:'json',
					type:'post',
					timeout:10000,
					success:function(data){
						var units = data[0]['单位']; //获取单位信息
						if(units=='监理单位'||units=='管理员'){
							var btnArray = [
							{title:"监理处理"}
							]; 
							plus.nativeUI.actionSheet({
								title:"操作", 
								cancel:"取消",
								buttons:btnArray
							},function(e){
								var index = e.index;	
								switch (index){
									case 1://监理处理
										mui.openWindow({
											url:"insp1_supvr.html",
											extras:{
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
						}else{
							var btnArray = [
								{title:"抱歉，您没有操作权限"}
							]; 
							plus.nativeUI.actionSheet({
								title:"操作", 
								cancel:"取消",
								buttons:btnArray
							},function(e){
							});
						}
					},
					error:function(xhr,type,errorThrown){
//						alert('ajax错误'+type+'---'+errorThrown+"失败！");
					}
				});
				}
			},
			error:function(){
//				mui.toast("获取工程单状态失败+ajax error!",{duration:'long',type:'div'});
			}
		});
	});
	
	
	//验证验证码
	function insp_code1(jzid){
		var code2 = document.getElementById("code2");
		var jzid = jzid.id;
		if(yzm.value==""){
			mui.toast('请先获取验证码',{ duration:'long', type:'div' }) 
		}else if(code2.value==""){
			mui.toast('请输入验证码',{ duration:'long', type:'div' }) 
		}else if(code2.value==yzm.value){
			mui.ajax(url+'my_plus/my_inspection_material.php',{
				data:{
					flag:"获取状态",
					ulid:jzid
				},
				type:'post',
				dataType:'json',
				timeout:10000,
				success:function(data){
//							alert(data);
					var timestamp_self = data.时间戳;
					mui.openWindow({
						url:'insp1_deliver.html',
						styles: {
							hardwareAccelerated:false
						},
						extras:{
							//传递参数
							ulId:jzid,
							my_name:my_name,
							timestamp_self:timestamp_self
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
				},
				error:function(xhr,type,errorThrown){
					alert("获取验证码失败！");
				}
			});
		}else{
			mui.toast('验证码不正确',{ duration:'long', type:'div' }) 
		}
	}
	
