function navslide(small){
	if(($("#head").offset().top-$(document).scrollTop())<-$(window).height()/2){
		$("#nav").animate({
			height:'70px'
		});
		console.log("1");
	}
	if(($("#head").offset().top-$(document).scrollTop())>=-$(window).height()/2){
		$("#nav").animate({
		    height:'100px'
	    });
	    console.log("2");
	}	
}
