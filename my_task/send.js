	//根据对应工程查询任务
	function taskList1(pj_timestamp){
		mui.ajax(url+'my_task/task_list.php',{
			data:{
				flag:"材料送检",
				pj_timestamp:pj_timestamp,
				unit:unit
			},
			type:'post',
			dataType:'json',
			timeout:10000,
			success:function(data){
				var length = data.length;
				for(var i=0;i<length;i++){
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
		if(state=='新增'||state=='新增复检'||state=='未见证'){
			color = 'blue2';
		}else{
			color = 'green2';
		}
		var ul = document.createElement("ul");
		ul.className = "mui-table-view mui-card my_list my_marginbottom10px";
		ul.id = id;
		if(state=='新增复检'||state=='取样复检'){
			ul.style.borderColor = "red";	
		}
		var send = document.getElementById("send");
		ul.innerHTML = '<li class="mui-table-view-cell my_backgroundcolor_'+color+'"><a class="a_color" href="../my_material/my_material_samDet.html?sjc='+sjc+'&gcid='+id+'&gcmc='+pj_name+'"><span class="mui-icon mui-icon-gear mui-pull-left my_fontweight my_color_white"></span><p class="mui-ellipsis my_style2">工程名称：'+ pj_name +'</p></a></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">取样类型：'+type+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">规格数量：'+scale+'/'+quantity+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">取样人：'+getGuy+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">取样日期：'+getDate+'</p></li>';
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
//							alert(data);
				var status = data.工程单状态;
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
						{title:"确认见证"}
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
									url:'../my_material/my_material_recheckDeliver.html',
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
							case 2://不合格
							if(gcdzt_pd=='收样'){
								var btnArray = ['是', '否'];
								mui.confirm('确定将该送检鉴定为不合格？', '江门建筑管理系统', btnArray, function(e) {
									if (e.index == 0) {
										mui.ajax(url+'my_task/my_send.php',{
											data:{
												flag:"不合格",
												ulId:ulId
											},
											dataType:'json',
											type:'POST', 
											timeout:10000,
											success:function(data){
											},
											error:function(xhr,type,errorThrown){
	//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
											}
										});	
										//不合格推送通知
										var server=url+"push/fail_push.php";
										var task=plus.uploader.createUpload(server,{method:"POST"},	function(t,status){ 
											//推送完成
											if(status==200){
		//										alert("发送成功");
											}else{
												alert("失败");
											}
										});
										task.addData("title",'江门市建设工程施工质量管理系统');
										task.addData("notice",'出现新的不合格项目,请注意查收！');
										task.start();
										mui.openWindow({
											url:'../my_material/my_material_fail.html',
											styles: {
												hardwareAccelerated:false
											},
											extras:{
												//传递参数
												ulId:ulId,
												timestamp:timestamp
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
										mui.ajax(url+'my_task/my_send.php',{
											data:{
												flag:"复检不合格",
												ulId:ulId,
												recheckNum:""
											},
											dataType:'json',
											type:'POST', 
											timeout:10000,
											success:function(data){
												if(data.result=='success'){
													mui.openWindow({
														url:'../my_material/my_material_fail.html',
														styles: {
															hardwareAccelerated:false
														},
														extras:{
															//传递参数
															ulId:ulId,
															timestamp:timestamp,
															state:'recheck'
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
											},
											error:function(xhr,type,errorThrown){
												alert('ajax错误'+type+'---'+errorThrown+"失败！");
											}
										});	
										
									} 
								});
							}
							break;
						}	
					  }
					);
				}
			},
			error:function(xhr,type,errorThrown){
				alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});
	});
	//材料送检操作
	
	//验证码监听
	var wait = 60;
	function time(o){
		 if (wait == 0) {  
            o.removeAttribute("disabled");            
            o.innerHTML="获取验证码";  
            wait = 60;  
        }else{
        	if(wait == 60){
        		//短信发送
				var sendMsg = document.getElementById("sendMsg");
				var CorpID = document.getElementById("CorpID");
				var LoginName = document.getElementById("LoginName");
				var pwd = document.getElementById("pwd");
				var serverIP = document.getElementById("serverIP");
				var mobPhone = document.getElementById("mobPhone");
				var smsContent = document.getElementById("smsContent");
				mobPhone.value = mobile;
				yzm = document.getElementById("yzm");
				mui.ajax(url+'send_Sms/SendSms.php',{
					data:{
						CorpID:CorpID.value,
						LoginName:LoginName.value,
						pwd:pwd.value,
						serverIP:serverIP.value,
						mobPhone:mobPhone.value,
						smsContent:smsContent.value
					},
					dataType:'json',
					type:'POST', 
					timeout:10000,
					success:function(data){
						if(data.result=='success'){
//									alert(data.smsContent);
							yzm.value = data.yzm; //获取验证码数字
						}
					},
					error:function(xhr,type,errorThrown){
						alert('ajax错误'+type+'---'+errorThrown);
					}
				});
        	}
            o.setAttribute("disabled", true);  
            o.innerHTML="重新发送(" + wait + ")";  
            wait--;  
            setTimeout(function() {  
                time(o)  
            },1000)  
        }  
	}
	//验证验证码
	function qdjz(jzid){
		var jzid = jzid.id;
		if(yzm.value==""){
			mui.toast('请先获取验证码',{ duration:'long', type:'div' }) 
		}else if(code.value==""){
			mui.toast('请输入验证码',{ duration:'long', type:'div' }) 
		}else if(code.value==yzm.value){
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
					if(data.result=='success'){
						mui.toast('见证成功',{ duration:'long', type:'div' }) 
						location.reload();
					}
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
					if(data.result=='success'){
						mui.toast('见证成功',{ duration:'long', type:'div' }) 
						location.reload();
					}
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
	function recheck(obj){
		var ulId = obj.id;
		var recheckNum = document.getElementById('recheckNum').value;
//				alert(code);
		mui.ajax(url+'my_task/my_send.php',{
			data:{
				flag:"复检合格",
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
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});	
	}