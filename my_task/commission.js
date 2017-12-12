	//根据对应工程查询任务
	a4_account = 0;
	function taskList4(pj_timestamp){
		mui.ajax(url+'my_task/task_list.php',{
			data:{
				flag:"实体检测",
				pj_timestamp:pj_timestamp,
				unit:unit
			},
			type:'post',
			dataType:'json',
			timeout:10000,
			success:function(data){
				var length = data.length;
				a4_account+= length;
				var a4 = document.getElementById("a4");
				for(var i=0;i<length;i++){
					a4.innerHTML = "实体检测("+a4_account+")";
					var id = data[i].id;
					var sjc = data[i].时间戳;
					var pj_name = data[i].工程名称;
					var type = data[i].检测类型;
					var part = data[i].检测部位;
					var quantity = data[i].数量;
					var inspector = data[i].检测人;
					var testDate = data[i].检测日期;
					var state = data[i].工程单状态;
					commission(sjc,id,pj_name,type,part,quantity,inspector,testDate,state);
				}
			},
			error:function(xhr,type,errorThrown){
//				alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});
	}
	//动态创建项目
	function commission(sjc,id,pj_name,type,part,quantity,inspector,testDate,state){
		if(state=='新建'||state=='待确认'||state=='待审批'){
			color = 'blue2';
		}else if(state=='不合格'){
			color = 'red';
		}else{
			color = 'green2';
		}
		var ul = document.createElement("ul");
		ul.className = "mui-table-view mui-card my_list my_marginbottom10px";
		ul.id = id;
		if(state=='提交结果'){
			ul.style.borderColor = "greenyellow";	
		}
		var commission = document.getElementById("commission"); 
		ul.innerHTML = '<li class="mui-table-view-cell my_backgroundcolor_'+color+'"><a class="a_color" href="../my_commission/my_entity_readmessage.html?owtsp='+sjc+'&gcid='+id+'"><span class="mui-icon mui-icon-gear mui-pull-left my_fontweight my_color_white"></span><p class="mui-ellipsis my_style2">工程名称：'+ pj_name +'</p></a></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">自检自测类型：'+type+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">检测部位/数量：'+part+'/'+quantity+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">检测人：'+inspector+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">检测日期：'+testDate+'</p></li>';
		commission.appendChild(ul);
	}
	//实体自检操作
	mui('#commission').on('longtap','ul',function(){
		var ulId = this.id;//获取当前的卡项的id
		mui.ajax(url+'my_task/commission.php',{
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
				//判断状态并根据状态执行改变状态的任务
				if(status=='新建'){
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
							case 1://准备
								//输入委托编号
								mui("#commissionNum").popover("toggle");
								var but_id=document.getElementById("code_act2").getElementsByTagName('button')[1];
								but_id.id=ulId;
								break;
							case 2://删除
								mui.ajax(url+'my_task/commission.php',{
									data:{
										flag:"删除",
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
								break;
						}	
					 });
				}else if(status=='准备'){
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
						switch (index){
							case 1://提交见证
								mui.ajax(url+'my_task/commission.php',{
									data:{
										flag:'提交见证',
										ulId:ulId
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
		   								mui.toast('操作成功',{ duration:'long', type:'div' }) 
										location.reload();
									},
									error:function(xhr,type,errorThrown){
										alert('ajax错误'+type+'---'+errorThrown);
									}
								});
								break;
							case 2://撤销准备
								mui.ajax(url+'my_task/commission.php',{
									data:{
										flag:"撤销准备",
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
								break;
						}	
					  }
					);
				}else if(status=='待确认'){
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
								mui("#commission_code").popover("toggle");
								var but_id=document.getElementById("comConfirm").getElementsByTagName('button')[0];
								but_id.id=ulId;
								break;
							case 2://拒收
								mui.openWindow({
									url:"../my_commission/my_rejection.html",
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
				}else if(status=='已确认'){
					var btnArray = [
						{title:"提交结果"}
					];
					plus.nativeUI.actionSheet({
						title:"操作",
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						switch (index){
							case 1://提交结果
								mui.ajax(url+'my_task/commission.php',{
									data:{
										flag:"提交结果",
										ulId:ulId
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
										mui.toast('提交成功',{ duration:'long', type:'div' })
										location.reload();//刷新本页面
									},
									error:function(xhr,type,errorThrown){
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
									}
								});
								break;
						}	
					  }
					);
				}else if(status=='提交结果'){
					var btnArray = [
						{title:"合格"},
						{title:"不合格"},
						{title:"拒收"}
					];
					plus.nativeUI.actionSheet({
						title:"操作",
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						switch (index){
							case 1://合格
								var btnArray = ['是', '否'];
									mui.confirm('确定将该送检鉴定为合格？', '江门建筑管理系统', btnArray, function(e) {
										if (e.index == 0) {
											//输入检测报告编号
											mui("#commissionNum2").popover("toggle");
											var but_id=document.getElementById("frame").getElementsByTagName('button')[1];
											but_id.id=ulId;
										}	
									});
								break;
							case 2://不合格
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
								task.addData("notice",pj_name+'——（实体检测）出现新的不合格项目！');
								task.addData("pj_id",pj_id);
								task.start();
								mui.openWindow({
									url:'commission_fail.html',
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
							case 3:
								mui.openWindow({
									url:"../my_commission/my_rejection.html",
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
					{title:"扩大检测"},
					{title:"验证检测"},
					{title:"设计复核"},
					{title:"返工"},
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
							case 1://扩大检测
								mui.openWindow({
									url:'commission_supvr.html',
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
							case 2://验证检测
								mui.openWindow({
									url:'commission_supvr.html',
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
							case 3://设计复核
								mui.openWindow({
									url:'commission_supvr.html',
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
							case 4://返工
								mui.openWindow({
									url:'commission_supvr.html',
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
							case 5://拒收 
								mui.openWindow({
									url:"my_rejection.html",
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId,
										flag:"commission"
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
								mui.ajax(url+'my_plus/my_entity_result.php',{
									data:{
										flag:"审批通过",
										ulId:ulId
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
//										alert(data);
										mui.toast('操作完成！',{ duration:'long', type:'div' });
										location.reload();//刷新本页面
									},
									error:function(xhr,type,errorThrown){
										alert('ajax错误'+type+'---'+errorThrown+"失败！");
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
	
	//委托编号
	function comcode(obj){
		var ulId = obj.id;
		var code = document.getElementById('code_input').value;
		mui.ajax(url+'my_plus/my_commission_list.php',{
			data:{
				flag:"准备",
				code:code,
				ulid:ulId
			},
//			dataType:'json',
			type:'POST', 
			timeout:10000,
			success:function(data){
				mui.toast('操作成功',{ duration:'long', type:'div' }) 
				location.reload();
			},
			error:function(xhr,type,errorThrown){
//				alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});	
	}
	
	//验证验证码
	function comyzm(jzid){
		var ulId = jzid.id;
		var code4 = document.getElementById("code4");
		if(yzm.value==""){
			mui.toast('请先获取验证码',{ duration:'long', type:'div' }) 
		}else if(code4.value==""){
			mui.toast('请输入验证码',{ duration:'long', type:'div' }) 
		}else if(code4.value==yzm.value){
			//确定见证
			mui.ajax(url+'my_plus/my_entity_detail.php',{
				data:{
					flag:"获取信息",
					myid:ulId
				},
				type:'post',
				dataType:'json',
				timeout:10000,
				success:function(data){
					var timestamp = data[0].工程时间戳;
					mui.openWindow({
						url:'witness.html',
						styles: {
							hardwareAccelerated:false
						},
						extras:{
							//传递参数
							ulId:ulId,
							my_name:my_name,
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
					});
				},
				error:function(xhr,type,errorThrown){
					alert("ajax错误："+type+"----"+errorThrown);
				}
			});
			
		}else{
			mui.toast('验证码不正确',{ duration:'long', type:'div' }) 
		}
	}
	
	function testcode(obj){
		var ulId = obj.id;
		var comNum = document.getElementById('comNum').value;
		mui.ajax(url+'my_task/commission.php',{
			data:{
				flag:"合格",
				ulId:ulId,
				comNum:comNum
			},
			dataType:'json',
			type:'POST', 
			timeout:10000,
			success:function(data){
//				alert(data.结果);
				mui.toast('操作成功',{ duration:'long', type:'div' }) 
				location.reload();
			},
			error:function(xhr,type,errorThrown){
//				alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});	
	}