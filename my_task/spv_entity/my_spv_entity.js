	//根据对应工程查询任务
	a6_account = 0;
	function taskList6(pj_timestamp){
//		console.log(pj_timestamp);
		mui.ajax(url+'my_task/task_list.php',{
			data:{
				flag:"实体抽检",
				uid:uid,
				unitName:unitName,
				pj_timestamp:pj_timestamp,
				unit:unit
			},
			type:'post',
			dataType:'json',
			timeout:10000,
			success:function(data){
//				alert(data)
				length = data.length;
				for(i=0;i<length;i++){
					if(data[i].result==='success'){
						a6_account+= 1;
						id = data[i].卡项id;
						owtsp = data[i].时间戳;
						gcmc = data[i].工程名称;
						proatt = data[i].工程单状态;
						ttype = data[i].检测类型;
						jcbw = data[i].检测部位;
						num=data[i].委托编号;
						jcr=data[i].检测人;	
						jcrq=data[i].检测日期;
						rmark=data[i].备注;
						test_dpm=data[i].检测单位;
						operation_supvision = data[i].监理操作单位;
						operation_detect = data[i].检测操作单位;
						//以下为我的工程表信息
						pj_Info=new Object();
						pj_Info.construction = data[0].施工单位;
						pj_Info.supvision = data[0].监理单位;
						pj_Info.detect = data[0].检测单位;
//						alert(pj_Info.detect)
//						my_spv_entity(gcdzt,gcmc,id,qylx,jcbw,sl,sccj,qyr,qyrq,sjc,operation_supvision,operation_detect,pj_Info);
						my_spv_entity(proatt,id,gcmc,ttype,num,jcbw,jcr,test_dpm,owtsp,operation_supvision,operation_detect,pj_Info)
					}	
				}
				a6 = document.getElementById("a6");
				a6.innerHTML = "实体抽检("+a6_account+")";
			},
			error:function(xhr,type,errorThrown){
//				alert('ajax实体抽检错误'+type+'---'+errorThrown+"失败！");
			}
		});
		
	}
	//动态创建项目
	function my_spv_entity(proatt,id,gcmc,ttype,num,jcbw,jcr,test_dpm,owtsp,operation_supvision,operation_detect,pj_Info){
		proatt_c = encodeURI(encodeURI(proatt));
		gcmc_c = encodeURI(encodeURI(gcmc));
		ttype_c = encodeURI(encodeURI(ttype));
		tepe_c = encodeURI(encodeURI(jcr));
		detect_c = encodeURI(encodeURI(pj_Info.detect));
		supvision_c = encodeURI(encodeURI(pj_Info.supvision));
//		console.log(pj_Info.detect);
//		console.log(proatt);
		ul = document.createElement("ul");
		ul.className = "mui-table-view mui-card my_list my_marginbottom10px";
		pj_Info.id = id;//实体监督抽检id
		pj_Info.proatt = proatt;//工程单状态
		pj_Info.timeStamp = owtsp;//实体监督抽检时间戳
//		console.log(pj_Info.supvision);
		ul.id = JSON.stringify(pj_Info);
//		console.log(JSON.stringify(pj_Info))
		if(proatt=='扩大抽检'||proatt=='扩大抽检准备'||proatt=='扩大抽检检测'){
			ul.style.borderColor = "red";
		}
		if(proatt=='不合格'){
			color = 'red';
		}else{
			color = 'blue2';
		}
		//通过判断工程单状态判断url
		if(proatt=='扩大抽检'){
			var url = "../my_spv_entity/my_spv_entity_review_readmessage.html?owtsp="+owtsp+"&gcid="+id+"&gcmc="+gcmc_c+"&mobile="+mobile+"&detect="+detect_c+"&supvision="+supvision_c;
		}else{
			var url = "../my_spv_entity/my_spv_entity_readmessage.html?owtsp="+owtsp+"&gcid="+id+"&gcmc="+gcmc_c+"&flag="+"task";
		}
		ul.innerHTML = '<li class="mui-table-view-cell my_backgroundcolor_'+color+'"><a class="a_color" href="'+url+'"><span class="mui-icon mui-icon-gear mui-pull-left my_fontweight my_color_white"></span><p class="mui-ellipsis my_style2">'+ ttype +'</p></a></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">委托编号：'+num+'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">监督员：'+ jcr +'</p></li><li class="mui-table-view-cell"><p class="mui-ellipsis my_style1">检测单位：'+ test_dpm +'</p></li>';
		supervision_entity.appendChild(ul);
	}

	
	
	
	mui('#supervision_entity').on('longtap','ul',function(){
//		console.log(this.getAttribute('id'))
		var pj_Info = JSON.parse(this.getAttribute('id'));
		var ulId = pj_Info.id;
		mui.ajax(url+'my_task/spv_entity.php',{
			data:{
				flag:"获取状态",
				ulId:ulId
			},
			dataType:'json',
			type:'POST', 
			timeout:10000,
			success:function(data){
//				alert(data.工程单状态);
				var status = data.工程单状态;
//				var pj_name = data.工程名称;
				var gcmc = data.工程名称;
				var pj_id = data.id; //工程id
				var gcdzt_pd = data.工程单状态;
				var pj_timestamp = data.工程时间戳;
				if(gcdzt_pd=='新建'||gcdzt_pd=='扩大抽检'){
					var btnArray = [
					{title:"提交"},
					{title:"删除"}
					]; 
					plus.nativeUI.actionSheet({
						title:"操作", 
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						switch (index){
							case 1://准备
								mui.ajax(url+'my_plus/my_spv_entity_list.php',{
									data:{
										flag:"提交",
										gcdzt:gcdzt_pd,
										gcdId:ulId
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
										mui.toast(data.结果,{ duration:'long', type:'div' })
										location.reload();
									},
									error:function(xhr,type,errorThrown){
//										alert('ajax准备错误'+type+'---'+errorThrown);
									}
								});
							break;
							case 2://删除
								mui.ajax(url+'my_plus/my_spv_entity_list.php',{
									data:{
										flag:"删除",
										ulid:ulId,
										gcmc:gcmc,
										timestamp:pj_timestamp
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
				}else if(gcdzt_pd=='准备'||gcdzt_pd=='扩大抽检准备'){
					var btnArray = [
					{title:"提交检测"},
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
							case 1://提交检测
								mui.ajax(url+'my_plus/my_spv_entity_list.php',{
									data:{
										flag:"提交检测",
										gcdzt:gcdzt_pd,
										gcdId:ulId
									},
									dataType:'json',
									type:'POST', 
									timeout:10000,
									success:function(data){
										mui.toast(data.结果,{ duration:'long', type:'div' })
										location.reload();
									},
									error:function(xhr,type,errorThrown){
//										alert('ajax准备错误'+type+'---'+errorThrown);
									}
								});
							break;
							case 2://撤销准备
								mui.ajax(url+'my_plus/my_spv_entity_list.php',{
									data:{
										flag:"撤销准备",
										ulid:ulId,
										gcmc:gcmc,
										gcdzt:gcdzt_pd,
										timestamp:pj_timestamp
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
				}else if(gcdzt_pd=='提交检测'||gcdzt_pd=='扩大抽检检测'){
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
						switch (index){
							case 1://合格
								var btnArray = ['是', '否'];
								mui.confirm('确定将该送检鉴定为合格？', '江门建筑管理系统', btnArray, function(e) {
									if (e.index == 0) {
										if(gcdzt_pd=='提交检测'){
										//输入检测报告编号
										mui("#spventityconsigncode").popover("toggle");
										var but1_id=document.getElementById("spv_entity_code_act1").getElementsByTagName('button')[1];
										but1_id.id=ulId;
										}else if(gcdzt_pd=='扩大抽检检测'){
//																		alert(gcdzt_pd);
											mui("#spventityreinspection").popover("toggle");
											var but_id=document.getElementById("spv_entity_code_act2").getElementsByTagName('button')[1];
											but_id.id=ulId;
										}
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
								task.addData("notice",gcmc+'——（实体检测）出现新的不合格项目！');
								task.addData("pj_id",pj_id);
								task.start();
								mui.openWindow({
									url:'../my_spv_entity/my_spv_entity_fail.html',
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId,
										gcdzt:gcdzt_pd,
										flag:"task"
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
				}if(gcdzt_pd=='不合格'){
					var btnArray = [{title:"扩大抽检"},{title:"监理处理"}]; 
					plus.nativeUI.actionSheet({
						title:"操作", 
						cancel:"取消",
						buttons:btnArray
					},function(e){
						var index = e.index;	
						switch (index){
							case 1://扩大抽检
								mui.openWindow({
									url:"../my_spv_entity/my_spv_entity_supvr.html",
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId,
										flag:"扩大抽检",
										flag2:"task",
										pj_id:pj_id,
										gcmc:gcmc
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
							case 2://监理处理
								mui.openWindow({
									url:"../my_spv_entity/my_spv_entity_supvr.html",
									styles: {
										hardwareAccelerated:false
									},
									extras:{
										//传递参数
										ulId:ulId,
										flag:"监理处理",
										flag2:"task",
										pj_id:pj_id,
										gcmc:gcmc
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
				}//End of if
			},//End of muiajax success
			error:function(xhr,type,errorThrown){
//				alert('ajax获取状态错误'+type+'---'+errorThrown+"失败！");
			}
		});

	});
	//操作
	
	//检测报告编号
	function spv_entity_inpcode1(obj){
		var ulId = obj.id;
		var testNum = document.getElementById('spv_entity_testNum').value;
		mui.ajax(url+'my_plus/my_spv_entity_list.php',{
			data:{
				flag:"合格",
				ulid:ulId,
				gcmc:gcmc,
				testNum:testNum
//						gcdzt:gcdzt_pd
			},
			dataType:'json',
			type:'POST', 
			timeout:10000,
			success:function(data){
//						alert(data.结果);
				mui.toast('操作成功',{ duration:'long', type:'div' }) 
				location.reload();
			},
			error:function(xhr,type,errorThrown){
//											alert('ajax错误'+type+'---'+errorThrown+"失败！");
			}
		});	
	}
