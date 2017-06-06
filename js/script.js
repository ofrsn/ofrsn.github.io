$(document).ready(function(){
	$(document).on('click','.show_login',function(e){
		if (!$(e.target).is('.login,.login input,.login a,.login label')) {
            $('.login').fadeOut(200);
			$('body').removeClass('show_login');
        }
	});
	$('#link_login,#link_responsive_login').on('click',function(e){
		if($('body').hasClass('show_login')){
			$('.login').fadeOut(200);
			$('body').removeClass('show_login');
		}else{
			$('.login').fadeIn(500);
			$('body').addClass('show_login');
			e.stopPropagation();
		}
	});
	$('#downarrow').click(function(){
    	$('html, body').animate({
	        scrollTop: $(".body-values").offset().top
	    }, 1000);
	});
});
