/**
 * 首页
 * author：Samve Duan
 * since: 2017-12-14
 */

/**
 * 卡口点位树配置
 */
		
var setting = {
    check: {
        enable: true,
        chkboxType: {
            "Y": "ps",
            "N": "ps"
        }
    },
    view: {
        dblClickExpand: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeClick: beforeClick,
        onCheck: onCheck
    }
};

function beforeClick(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}

function onCheck(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
    nodes = zTree.getCheckedNodes(true),
    v = "";
    home_deviceIds = "";//卡口节点树字符串集合
    for (var i = 0, l = nodes.length; i < l; i++) {
        if (nodes[i].isParent) {

        } else {
            v += nodes[i].name + ",";
            home_deviceIds += nodes[i].id + ",";
        }
    }
    if (v.length > 0){
    	v = v.substring(0, v.length - 1);
    }
    if (home_deviceIds.length > 0) {
    	home_deviceIds = home_deviceIds.substring(0, home_deviceIds.length - 1);
    }
    var cityObj = $("#home-deviceIds");
    cityObj.attr("value", v);
    console.log("==========获取到的卡口点位字符串集合为：==========");
    console.log(home_deviceIds);
}

function showMenu() {
    var cityObj = $("#home-deviceIds");
    var cityOffset = $("#home-deviceIds").offset();
    $("#menuContent").css({
        left: 0 + "px",
        top: (cityObj.outerHeight() + 5) + "px"
    }).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}

function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if (! (event.target.id == "menuBtn" || event.target.id == "home-deviceIds" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}

/**
 * 功能：查询
 */
function Home_Query(){
    var Home_Type = $("#home-type").val();
    console.log("==========打印查询参数==========");
    console.log(JSON.stringify({deviceIds : home_deviceIds, type: Home_Type}));
    
    if(home_deviceIds === ""){
    	
    }else{
        //加载数据 begin
    	$.ajax("/DADS/Stat/DeviceData24H",
    			{
    				dataType : "json",
    				type : "post",
    				"contentType":"application/json", 
    				async:  true ,
    				data:JSON.stringify({deviceIds : home_deviceIds, type: Home_Type}),
    				success :function(data){
    					console.log("==========提交获取 24 小时点位数据成功后返回信息集合==========");
    					console.log(data);
    					var latitudeArr = [];
    					var longitudeArr = [];
    					for(var i = 0; i<data.result.length; i++){
    						//海量点绘制数据变量
    						ptMultiData += data.result[i].longitude + "," + data.result[i].latitude + ",";
    						latitudeArr.push(data.result[i].longitude);
    						longitudeArr.push(data.result[i].latitude);
    					}
    					var latitudeMax = Math.max.apply(null, latitudeArr);
    					var latitudeMin = Math.min.apply(null, latitudeArr);
    					var latitudeAverage = (latitudeMax+latitudeMin)/2;
    					var longitudeMax = Math.max.apply(null, longitudeArr);
    					var longitudeMin = Math.min.apply(null, longitudeArr);
    					var longitudeAverage = (longitudeMax+longitudeMin)/2;
    					//传参给iframe
    					$("#iframename").attr("src", "http://113.240.227.70:2450/baidumapv2/baiduMap.html?height=420&amp;lng=" + longitudeAverage + "&amp;lat=" + latitudeAverage + "&amp;zoom=14");
    					ptMultiData = ptMultiData.substring(0, ptMultiData.length-1);
    					//调用ptMulti方法
    					ptMulti(ptMultiData);
    				},
    				error:function(){
    					toastr.error("获取 24 小时点位数据信息集合失败");
    				}
    			});
        //加载数据 end
    }
}

/**
 * 功能：地图绘制函数集合
 */
//绘制折线
function ptline(point) {
	var ifw = $("#iframename")[0].contentWindow;
	/*var point = [];
	var opt1 = {
		'lng' : '112.981553',
		'lat' : '28.214111'
	};
	var opt2 = {
		'lng' : '112.977528',
		'lat' : '28.2108'
	};
	var opt3 = {
		'lng' : '112.964593',
		'lat' : '28.214875'
	};
	var opt4 = {
		'lng' : '112.964018',
		'lat' : '28.207872'
	};
	var opt5 = {
		'lng' : '112.960137',
		'lat' : '28.184823'
	};
	var opt6 = {
		'lng' : '112.951082',
		'lat' : '28.184695'
	};
	point.push(opt1);
	point.push(opt2);
	point.push(opt3);
	point.push(opt4);
	point.push(opt5);
	point.push(opt6);*/
	//console.log(point);
	//调用iframe子页面的公开的test接口, 子页面域名为http://localhost:8088
	Cross.call(ifw, "http://113.240.227.70:2450", "ptline", {
		"point" : point
	});
}

//描点
function ptmarker(){
	var ifw = $("#iframename")[0].contentWindow;
	var point={'lng':'113.017763','lat':'28.240757','zoom':'15','title':'标题','content':'测试点位'};
	Cross.call(ifw, "http://113.240.227.70:2450", "ptmarker", {
		"point" : point
	});
}

//轨迹运行
function ptLineRun(paths){
	var ifw = $("#iframename")[0].contentWindow;
	//var paths ='113.008358,28.24487,113.007801,28.244727,113.007675,28.245332,113.006256,28.244998,113.004837,28.244759,113.002088,28.244377,112.999249,28.244091,112.996752,28.243964,112.995279,28.244139,112.99377,28.242404,112.995746,28.242197,112.995656,28.240765,112.995459,28.239524,112.995405,28.237949,112.995225,28.235292,112.993428,28.234003,112.989584,28.232746,112.98493,28.232412,112.976181,28.232109,112.970378,28.231934,112.964701,28.231918,112.952951,28.231966,112.946878,28.231902,112.940931,28.231823,112.940913,28.228433,112.940824,28.226444,112.940913,28.224057,112.937769,28.224041,112.934859,28.224582,112.934428,28.222116,112.931841,28.222148,112.931733,28.222832,112.931212,28.222816';
	var point = [];
    arr = paths.split(",");
    for (var i = arr.length - 1; i >= 0; i--) {
		var pot = {'lng':arr[i-1], 'lat':arr[i]};
		point.push(pot);
		i = i - 1;
    }
	
	Cross.call(ifw, "http://113.240.227.70:2450", "ptlinerun", {
		"point" : point,"speed":400
	});
}

//海量点绘制
function ptMulti(ptMultiData){
	var ifw = $("#iframename")[0].contentWindow;
	//var paths ='113.008358,28.24487,113.007801,28.244727,113.007675,28.245332,113.006256,28.244998,113.004837,28.244759,113.002088,28.244377,112.999249,28.244091,112.996752,28.243964,112.995279,28.244139,112.99377,28.242404,112.995746,28.242197,112.995656,28.240765,112.995459,28.239524,112.995405,28.237949,112.995225,28.235292,112.993428,28.234003,112.989584,28.232746,112.98493,28.232412,112.976181,28.232109,112.970378,28.231934,112.964701,28.231918,112.952951,28.231966,112.946878,28.231902,112.940931,28.231823,112.940913,28.228433,112.940824,28.226444,112.940913,28.224057,112.937769,28.224041,112.934859,28.224582,112.934428,28.222116,112.931841,28.222148,112.931733,28.222832,112.931212,28.222816,112.901496,28.252173,113.079288,28.258028,113.064772,28.223405,113.091505,28.233971,113.111915,28.25561,112.905376,28.227988,112.899484,28.244918,112.92248,28.271263,112.968473,28.256119,112.997794,28.227224,112.990895,28.237663,112.985433,28.243009,112.95755,28.237281,112.960425,28.217039,112.942171,28.241609,112.972498,28.219203,112.971779,28.209909,112.968042,28.196666,112.9587,28.202396,112.987014,28.209272,113.010299,28.201887,113.022947,28.200614,112.994057,28.192846,113.031714,28.191954,112.939728,28.198067,113.034876,28.227224,113.054854,28.210928,112.996213,28.220604,112.949789,28.220095,113.019066,28.2411,113.06161,28.242627';
	var points = [],
    arr = ptMultiData.split(",");
    for (var i = arr.length - 1; i >= 0; i--) {
		var point = {'lng':arr[i-1], 'lat':arr[i]};
        points.push(point);
        i = i - 1;
    }
	Cross.call(ifw, "http://113.240.227.70:2450", "ptmulti", {
		"point" : points
	});
}

//定义地图数据变量
var ptlineData = [];
var ptmarkerData = "";
var ptLineRunData = "";
var ptMultiData = "";

//////$(document).ready(function(){}) begin
$(document).ready(function() {
	//自动加载卡口点位下拉树 begin
	$.ajax("/DADS/Tel/LoadDeviceTree", {
	    dataType: "json",
	    type: "post",
	    "contentType": "application/json",
	    async: true,
	    data: JSON.stringify({
	        id: ""
	    }),
	    success: function(data) {
	        var zNodes = data.result;
	        $.fn.zTree.init($("#treeDemo"), setting, zNodes);
	        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	        treeObj.expandAll(true);
	    },
	    error: function() {
	        console.log("testLoadDeviceTree Failed!");
	    }
	});
	
    //获取点位的经纬度集合 begin
	$.ajax("/DADS/Tel/LoadDevices",
			{
				dataType : "json",
				type : "post",
				"contentType":"application/json", 
				async:  true ,
				data:JSON.stringify({type: '', start : 1, end : 5000}),
				success :function(data){
					console.log("==========获取经纬度数据信息集合==========");
					console.log(data);			
					for(var i = 0; i<data.result.length; i++){
						if(data.result[i].id.substring(0, 4) === "4304"){
							//海量点绘制数据变量
							ptMultiData += data.result[i].longitude + "," + data.result[i].latitude + ",";
							//绘制折线数据变量
							ptlineData.push({
								'lng' : data.result[i].longitude,
								'lat' : data.result[i].latitude
							});
						}
					}
					ptMultiData = ptMultiData.substring(0, ptMultiData.length-1);
					console.log("==========打印衡阳的设备经纬度集合==========");
					console.log(ptMultiData);	
				},
				error:function(){
					console.log("==========获取经纬度数据信息集合失败==========");
				}
			});
    //获取点位的经纬度集合 end
	
	ptMulti(ptMultiData);
	
	$("#home-query").click(function(){
		Home_Query();
	});
	
	$("#ptline").click(function(){
		ptline(ptlineData);
	});
	
	$("#ptmarker").click(function(){
		ptmarker();
	});
	
	$("#ptLineRun").click(function(){
		ptLineRun(ptMultiData);
	});
	
	$("#baiduMap").click(function(){
		ptMulti(ptMultiData);
	});
	
	//自动加载，其它方式无效
	window.onload=function(){ 
		ptMulti(ptMultiData);
	} 
	
})//////$(document).ready(function(){}) end

