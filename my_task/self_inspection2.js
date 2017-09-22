	//根据对应工程查询任务
	a3_account = 0;
	function taskList3(pj_timestamp){
		mui.ajax(url+'my_task/task_list.php',{
			data:{
				flag:"实体自检",
				pj_timestamp:pj_timestamp,
				unit:unit
			},
			type:'post',
			dataType:'json',
			timeout:10000,
			success:function(data){
				var length = data.length;
				a3_account+= length;
				var a3 = document.getElementById("a3");
				for(var i=0;i<length;i++){
					a3.innerHTML = "实体自检("+a3_account+")";
					var id = data[i].id;
					var sjc = data[i].时间戳;
					var pj_name = data[i].工程名称;
					var type = data[i].自检自测类型;
					var part = data[i].检测部位;
					var quantity = data[i].数量;
					var inspector = data[i].检测人;
					var testDate = data[i].检测日期;
					var state = data[i].工程单状态;
					inspection2(sjc,id,pj_name,type,part,quantity,inspector,testDate,state);
				}
			},
			error:function(xhr,type,errorThrown){
//				alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});
	}
	//动态创建项目
	function inspection2(sjc,id,pj_name,type,part,quantity,inspector,testDate,state){
		if(state=='新增'||state=='未检测'){
			color = 'blue2';
		}else if(state=='不合格'){
			color = 'red';
		}else{
			color = 'green2';
		}
		if(state=='新增'||state=='准备材料'){
			var my_href = "../my_insp_entity/my_inspection_entitydetail.html?sjc="+sjc+"&gcid="+id+"";
		}else if(state=='未检测'||state=='确定检测'){
			var my_href = "../my_insp_entity/my_inspection_entitydetail_full.html?sjc="+sjc+"&gcid="+id+"";
		}else if(state=='不合格'){
			var my_href = "../my_insp_entity/my_inspection_entitydetail_bresult.html?sjc="+sjc+"&gcid="+id+"";
		}
		var ul = document.createElement("ul");
		ul.className = "mui-table-view mui-card my_list my_marginbottom10px";
		ul.id = id;
		var self_inspection2 = document.getElementById("self_inspection2");
		ul.innerHTML = '<li class="mui-table-view-cell my_backgroundcolor_'+color+'"><a class="a_color" href="'+my_href+'"><span class="mui-icon mui-icon-gear mui-pull-left my_fontweight my_color_white"></span><p class="mui-ellipsis my_style2">工程名称：'+ pj_name +'</p></a></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">自检自测类型：'+type+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">检测部位/数量：'+part+'/'+quantity+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">检测人：'+inspector+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">检测日期：'+testDate+'</p></li>';
		self_inspection2.appendChild(ul);
	}
	
	//实体自检操作
	mui('#self_inspection2').on('longtap','ul',function(){
		var ulId = this.id;//获取当前的卡项的id
		mui.ajax(url+'my_task/self_inspection2.php',{
			data:{
				flag:"获取状态",
				ulId:ulId
			},
			dataType:'json',
			type:'POST', 
			timeout:10000,
			success:function(data){
				var status = data.工程单状态;
				var pj_name = data.工程名称;
				var pj_id = data.id; //工程id
				if(status=='新增'){
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
							case 1:
							mui.ajax(url+'my_task/self_inspection2.php',{
								data:{
									flag:"准备材料",
									ulId:ulId
								},
								dataType:'json',
								type:'POST',
								timeout:10000,
								success:function(data){
									mui.toast(data.结果,{ duration:'long',type:'div'})
									location.reload();
								},
								error:function(xhr,type,errorThrown){
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
								}
							});
								break;
							case 2://删除
								mui.ajax(url+'my_task/self_inspection2.php',{
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
				}else if(status=='准备材料'){
					var btnArray=[
					{title:"提交见证"},
					{title:"撤销取样"}
					];
					plus.nativeUI.actionSheet({
						title:"操作",
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;
						switch(index){
								case 1:
								mui.ajax(url+'my_task/self_inspection2.php',{
									data:{
										flag:'提交见证',
										ulId:ulId
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
										mui.toast("提交成功!",{duration:'long',type:'div'});
										location.reload();//刷新本页面
									},
									error:function(xhr,type,errorThrown){
										alert('ajax错误'+type+'---'+errorThrown);
									}
								});
								break;
							case 2:
							mui.ajax(url+'my_task/self_inspection2.php',{
								data:{
									flag:"撤销准备",
									ulId:ulId
								},
								dataType:'json',
								type:'POST',
								timeout:10000,
								success:function(data){
									mui.toast(data.结果,{ duration:'long',type:'div'})
									location.reload();
								},
								error:function(xhr,type,errorThrown){
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
								}
							});
								break;
						}
					  }
					);
				}else if(status=='未检测'){
					var btnArray = [
						{title:"确定见证"}
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
								mui("#inspect2_code").popover("toggle");
								var but_id=document.getElementById("insConfirm2").getElementsByTagName('button')[0];
								but_id.id=ulId;
								break;
						}	
					  }
					);
				}else if(status=='确定检测'){
					var btnArray = [
						{title:"合格"},
						{title:"不合格"}
					];
					plus.nativeUI.actionSheet({
						title:"操作",
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index =e.index;
						switch(index){
							case 1://合格
							var btnArray =['是', '否'];
							mui.confirm('确定将该送检鉴定为合格？', '江门建筑管理系统', btnArray, function(e) 								{
						if (e.index == 0) {
							mui.ajax(url+'my_task/self_inspection2.php',{
								data:{
									flag:"合格",
									ulId:ulId
								},
								dataType:'json',
								type:'POST', 
								timeout:10000,
								success:function(data){
									mui.toast(data.结果,{ duration:'long', type:'div' })
									location.reload();//刷新本页面
								},
								error:function(xhr,type,errorThrown){
											alert('ajax错误'+type+'---'+errorThrown+"失败！");
								}
							});	
						}	
					});
					break;
					case 2:
							var btnArray =['是', '否'];
							mui.confirm('确定将该送检鉴定为不合格？', '江门建筑管理系统', btnArray, function(e){
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
								task.addData("notice",pj_name+'——（实体自检）出现新的不合格项目！');
								task.addData("pj_id",pj_id);
								task.start();
								if (e.index == 0) {
									mui.openWindow({
										url:'insp2_fail.html',
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
								}
							});
							break;
						}
					  }
					);
				}else if(status=='不合格'){
					mui.ajax(url+'check.php',{
					data:{
						mobile:mobile,
						ulId:"",
						flag:"self_inspection2"
					},
					dataType:'json',
					type:'post',
					timeout:10000,
					success:function(data){
						var units = data['单位']; //获取单位信息
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
											url:"insp2_supvr.html",
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
						alert('ajax错误'+type+'---'+errorThrown+"失败！");
					}
				});
				}
			},
			error:function(){
				alert("获取工程单状态失败+ajax error!",{duration:'long',type:'div'});
			}
		});	
	});
	
	//验证验证码
	function insp_code2(jzid){
		var jzid = jzid.id;
		var code3 = document.getElementById("code3");
		if(yzm.value==""){
			mui.toast('请先获取验证码',{ duration:'long', type:'div' }) 
		}else if(code3.value==""){
			mui.toast('请输入验证码',{ duration:'long', type:'div' }) 
		}else if(code3.value==yzm.value){
			mui.ajax(url+'my_plus/my_inspection_entity.php',{
				data:{
					flag:"获取状态",
					ulid:jzid
				},
				dataType:'json',
				type:'POST', 
				timeout:10000,
				success:function(data){
					var timestamp_self = data.时间戳;
					mui.openWindow({
						url:'insp2_deliver.html',
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
					alert('ajax错误'+type+'---'+errorThrown+"失败！");
				}
			});
		}else{
			mui.toast('验证码不正确',{ duration:'long', type:'div' }) 
		}
	}
