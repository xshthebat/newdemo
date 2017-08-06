$(function() {
	setInterval(function() {
		var hours = new Date().getHours();
		var minutes = new Date().getMinutes();
		var seconds = new Date().getSeconds();
		if(hours < 10) {
			hours = "0" + hours;
		}
		if(minutes < 10) {
			minutes = '0' + minutes;
		}
		if(seconds < 10) {
			seconds = "0" + seconds;
		}
		$("#time").text(hours + ":" + minutes + ":" + seconds);
	}, 1000)
})
//手撕jsonp格式的jquery
//obj参数列表， fn返回值函数,name请求到的window全局变量名  fn回掉函数
$.fn.extend({
	newjsonp: function(url, obj, name, fn) {
		var newurl = url;
		for(var key in obj) {
			if(obj.hasOwnProperty(key)) {
				newurl += ('&' + key + '=' + obj[key]);
			}
		}
		$.ajax({
			type: 'get',
			async: true,
			url: newurl,
			dataType: 'jsonp',
			jsonp: 'callback',
			success: function(json) {
				if(name) {
					window[name] = json;
				}
				if(fn) {
					fn();
				}
				console.log(json);
			},
			error: function() {
				console.log('error');
			}
		})
	},
	tianqi: {
		getcity: function(fn) {
			$.fn.newjsonp("http://api.jisuapi.com/weather/city?appkey=135bb18481932b78", {}, "citys", fn);
		},
		getValue: function($j) {
			$j.submit(function() {
				window.cityvalue = $("#city").val();
				if(window.cityvalue != "") {
					$("#postcity_s").addClass("disabled");
					$.fn.tianqi.postValue();
					$j.unbind();
				}
			})
		},
		postValue: function(fn) {
			$.fn.tianqi.getcity(function() {
				for(var i = 0, len = window.citys.result.length; i < len; i++) {
					if(window.citys.result[i].city == window.cityvalue) {
						$.fn.newjsonp("http://api.jisuapi.com/weather/query?appkey=135bb18481932b78", {
							city: window.cityvalue
						}, "thecity", function() {
							//							$.fn.tianqi.rescree();
							$.fn.tianqi.setDom();
							//成功后的回调函数
						});
						return;
					}
				}
				alert("您输入的城市有误!");
				$("#postcity_s").removeClass("disabled"); //初始化input框
				$.fn.tianqi.getValue($("#postcity"));
			});
		},
		setDom: function() {
			$("#weathernow").show("normal", function() {
				($("#weathernow")).append($("<span></span>").addClass("weatherback glyphicon glyphicon-remove"));
				$.fn.tianqi.back();
				//添加dom 
				$.fn.tianqi.slideDom();
			})
		},
		slideDom: function() {
			var $bs = $(".b"); //获取所有的b
			var obj = {
				width: "9.8vw"
			};
			if(document.body.clientWidth < 1200) {
				obj.width = "19.4vw";
			}
			if(document.body.clientWidth < 720) {
				obj = {
					height: "10vh"
				}
			}
			$($bs.get(0)).animate(obj, 400, function() {
				$($bs.get(1)).animate(obj, 350, function() {
					$($bs.get(2)).animate(obj, 300, function() {
						$($bs.get(3)).animate(obj, 250, function() {
							$($bs.get(4)).animate(obj, 200, function() {
								$($bs.get(5)).animate(obj, 150, function() {
									$($bs.get(6)).animate(obj, 100,
										function() {
											$($bs.get(7)).animate(obj, 100, function() {
												//												dom加载完毕 开始写内容
												var $thecity = $("<p></p>").addClass("thecity");
												$thecity.text(window.thecity.result.city);
												var $theweather = $("<p></p>").addClass("theweather");
												$theweather.text(window.thecity.result.weather);
												var $thetemp = $("<p></p>").addClass("thetemp");
												$thetemp.text(window.thecity.result.temp + "℃");
												$($bs.get(0)).append($thecity);
												$($bs.get(0)).append($theweather);
												$($bs.get(0)).append($thetemp);
												for(var i = 1; i < 8; i++) {
													var $containt = $($bs.get(i)); //获取每一个小容器
													var $day = $("<p></p>").addClass("day");
													$day.text(window.thecity.result.daily[i - 1].date.split("2017-")[1]);
													if(document.body.clientWidth < 720) {
														$day.text(window.thecity.result.daily[i - 1].date.split("-")[1] + " " + window.thecity.result.daily[i - 1].date.split("-")[2]);
													}
													$containt.append($day);
													var $week = $("<p></p>").addClass("week");
													$week.text(window.thecity.result.daily[i - 1].week);
													$containt.append($week);
													var $sun = $("<div></div>").addClass("sun");
													var $sunweather = $("<p></p>").addClass("sunweather");
													$sunweather.text(window.thecity.result.daily[i - 1].day.weather);
													var $suntemp = $("<p></p>").addClass("suntemp");
													$suntemp.text(window.thecity.result.daily[i - 1].day.temphigh + "℃");
													var $sunwind = $("<p></p>").addClass("sunwind");
													$sunwind.text(window.thecity.result.daily[i - 1].day.winddirect);
													$sun.append($sunweather).append($suntemp).append($sunwind);
													$containt.append($sun);
													var $night = $("<div></div>").addClass("night black");
													var $nightweather = $("<p></p>").addClass("sunweather");
													$nightweather.text(window.thecity.result.daily[i - 1].night.weather);
													var $nighttemp = $("<p></p>").addClass("suntemp");
													$nighttemp.text(window.thecity.result.daily[i - 1].night.templow + "℃");
													var $nightwind = $("<p></p>").addClass("sunwind");
													$nightwind.text(window.thecity.result.daily[i - 1].night.winddirect);
													$night.append($nightweather).append($nighttemp).append($nightwind);
													$containt.append($night);
												}
												$.fn.tianqi.rescree();
											})
										})
								})
							})
						})

					})
				})
			})
		},
		resetDom: function(fn) {
			//			$("#postcity_s").removeClass("disabled"); //初始化input框
			$.fn.tianqi.getValue($("#postcity")); //重新绑定事件
			for(var i = 0; i < 8; i++) {
				$($(".b").get(i)).removeAttr("style");
				$($(".b").get(i)).empty();
			}
			$("#weathernow").hide("normal", function() {
				$(".weatherback").remove();
			})
			if(fn) {
				fn();
			}
		},
		rescree: function() {
			$(window).resize(function() {
				$.fn.tianqi.resetDom(function() {
					$(window).unbind("resize");
					$.fn.tianqi.setDom();
				});
			})
		},
		back: function() {
			$(".weatherback").click(function() {
				$.fn.tianqi.resetDom(null);
				$("#postcity_s").removeClass("disabled");
				$(window).unbind("resize");
			})
		}
	}
});
$(document).ready(function() {
	$.fn.tianqi.getValue($("#postcity"));
});