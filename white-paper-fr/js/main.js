
$( document ).ready(function() {

	//LIRE LA SUITE
	$('.section').css({"height": "100vh", "overflow": "hidden"});

	$('.contenu').css({"height": "100%", "overflow": "hidden"});
	$('.contenu blockquote').css('display','none');
	$('.contenu img').css('display','none');

	$('.liresuite').on('click',function()
	{
		var section = $(this).parent().parent();
		
		if($(this).attr("data-state")=="open")
		{
			section.css('height', '100vh');
			section.find('.contenu').css({"height":"100%","overflow":"hidden"});
			section.find('.contenu blockquote').css("display","none");
			section.find('.contenu img').css("display","none");
			
			 $('html, body').animate({scrollTop: section.offset().top}, 1000);
			
			$(this).attr("data-state","closed");
			$(this).text('... Lire la suite');
			$(magnetique()); 

			
		}else{
			var contenu = $(this).parent().find('.contenu').css({"overflow":"visible","height":"auto"});
			
			section.css('height', 'auto');
			section.find('.colonne_60').css('height','auto');
			section.find('.contenu blockquote').css("display","block");
			section.find('.contenu img').css("display","inline");
			$(this).attr("data-state","open");
			$(this).text('... Lire moins');
			$.scrollify.update();

		}
		
	});

	
	//BIO Auteurs
	$('.auteurs_contain .auteur').mouseover(function(e)
	{
		$('.auteurs_contain .auteur').find('.bio').css('display','none');
		$(this).find('.bio').css('display','block');
	});

	
	//REDUCTION Menu
	$(document).on("scroll",function(){
		if($(document).scrollTop()>=$("#preface").offset().top){
			$("#sommaire").addClass("minimise");
			$("#sommaire").addClass("close");
			$("#couverture").css("marginBottom","100vh");
			
		} else{
			$("#sommaire").removeClass("minimise");
			 $("#couverture").css("marginBottom","0");
		};
	
	});
	
	//REDUCTION Menu mobile
	$(".menu_commande").click(function(){
			if($("#sommaire").hasClass("close") && $("#sommaire").hasClass("minimise") ){
				$("#sommaire").removeClass("close");
			} else{
				$("#sommaire").addClass("close");
			};
	});
	

	// NAVIGATION Articles
	var compteur = 1;
	
	$('.partie_item_contain').each(function()
	{
		$(this).attr("data-index",0);
		var conteneur = $(this)
		var nombre = conteneur.children().length;

		//Déclaration css
		if($(window).width() > 850) conteneur.css("width",$( window ).width()*nombre+"px");

		//Création des flèches
		$(this).parent().append('<div class="next"></div>');
		$(this).parent().append('<div class="previous"></div>');
				

		//Création pagination
		$(this).parent().append('<ul class="pagination"></ul>');
		for(var i=0; i<nombre; i++)
		{
				$(this).parent().find('.pagination').append('<li class="'+i+'">'+i+'</li>');
		}
		
		compteur++;

	});
	
	$('.titre_carousel').addClass("cacher");
	$('.next').css("display","none");
	$('.previous').css("display","none");
	$('.pagination').css("display","none");
	
	

	var cibler = function(e){
			//On neutralise le click le temps del'animation
			$('.pagination li').unbind('click');

			var section = $(this).parent().parent();
			var conteneur = $(this).parent().parent().find('.partie_item_contain');
			var index = conteneur.attr("data-index");
			var total = $(this).parent().parent().find('.partie_item_contain').children().length;
			var position = $(this).attr("class");

			if( position == 0 ) {
				section.find('.next').css("display","none"); section.find('.previous').css("display","none"); section.find('.titre_carousel').addClass("cacher"); section.find('.pagination').css("display","none");
			};

			animer($(this), position);

	};

	function animer(cible, index)
	{
			var section =  cible.parent().parent();
			var conteneur = cible.parent().parent().find('.partie_item_contain');
		 	var total = cible.parent().find('.partie_item_contain').children().length;
		 	cible.parent().parent().find('.partie_item_contain').animate({"marginLeft":0-$( window ).width()*index},1000, function()
			{

				marge = parseInt(cible.parent().parent().find('.partie_item_contain').css("marginLeft"));
				conteneur.attr("data-index", index);

				//Previous
				if( marge <= 0-$( window ).width()) { section.find('.previous').css("display","block"); }
				else { section.find('.previous').css("display","none");  section.find('.pagination').css("display","none");}

				//Next
				if( marge <= 0-$( window ).width() && marge <= 0-$( window ).width()*(total-1) ) { section.find('.next').css("display","block"); }
				else { section.find('.next').css("display","none"); }

				$('.previous').on("click", reculer );
				$('.next').on("click", avancer );
				$('.pagination li').on('click', cibler);

					$('.pagination li').each( function(){
							$(this).removeClass("actif");
							if($(this).hasClass(index.toString())) $(this).addClass("actif");
					} );

		});
	}

var reculer	= function(e)
	{
		$('.previous').unbind('click');
		var section = $(this).parent();
		var conteneur = $(this).parent().find('.partie_item_contain');
		var index = parseInt(conteneur.attr("data-index"));
		index--;
		var marge = parseInt($(this).parent().find('.partie_item_contain').css("marginLeft"));
		if( marge == 0-$( window ).width() ) { section.find('.next').css("display","none"); section.find('.previous').css("display","none"); section.find('.pagination').css("display","none");  section.find('.titre_carousel').addClass("cacher");  };
		marge += $( window ).width();
		$(this).parent().find('.partie_item_contain').animate({"marginLeft":marge},1000, function(){
			conteneur.attr("data-index", index);
			$('.previous').on("click", reculer);

			$('.pagination li').each( function(){
					$(this).removeClass("actif");
					if($(this).hasClass(index.toString())) $(this).addClass("actif");
			} );

			marge = parseInt($(this).parent().find('.partie_item_contain').css("marginLeft"));
		  if( marge >= 0-$( window ).width()*2 && marge <= 0-$( window ).width()) { section.find('.next').css("display","block"); };

		});
	};

	var avancer	= function(e)
	{
		$('.next').unbind('click');
		var section = $(this).parent();
		var conteneur = $(this).parent().find('.partie_item_contain');
		var index = parseInt(conteneur.attr("data-index"));
		index++;
		var total = conteneur.children().length;
		var marge = parseInt($(this).parent().find('.partie_item_contain').css("marginLeft"));
		marge -= $( window ).width();
		$(this).parent().find('.partie_item_contain').animate({"marginLeft":marge},1000, function(){
			conteneur.attr("data-index", index);
			$('.next').on("click", avancer );

			$('.pagination li').each( function(){
					$(this).removeClass("actif");
					if($(this).hasClass(index.toString())) $(this).addClass("actif");
			} );

			marge = parseInt($(this).parent().find('.partie_item_contain').css("marginLeft"));
			if( marge <= 0-($( window ).width()*(total-1)) ) { section.find('.next').css("display","none"); }
			else if( marge > 0-($( window ).width()*(total-1)) ) { section.find('.next').css("display","block"); };
		} );
	}



	$('.illustration').on('click', function(e)
	{
		var section = $(this).parent().parent().parent();
		var conteneur = $(this).parent().parent();
		conteneur.attr("data-index",1);
		var index = parseInt(conteneur.attr("data-index"));
		conteneur.animate({"marginLeft":0-$( window ).width()+"px"}, 1000, function(){

			$('.pagination li').each( function(){
					$(this).removeClass("actif");
					if($(this).hasClass(index.toString())) $(this).addClass("actif");
			} );

				section.find('.next').css("display","block");
				section.find('.previous').css("display","block");
				section.find('.titre_carousel').removeClass("cacher");
				section.find('.pagination').css("display","flex");
		} )
	});



	$('.previous').on("click", reculer );
	$('.next').on("click", avancer );
	$('.pagination li').on('click', cibler);


	/*
	$('.sommaire_entree a').on('click',function(e)
	{
		$(document).stop().animate('scrollTop', '500', 'swing', function() {});
		return false;
	});*/

	$(function() {
	
	  $('a[href*="#"]:not([href="#"])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
		  var target = $(this.hash);
		  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		  if (target.length) {
			if( $(window).width() <=600) { $('html, body').animate({ scrollTop: target.offset().top - 56}, 1000); }
			else { $('html, body').animate({ scrollTop: target.offset().top}, 1000); };
			return false;
		  }
		}
	  });
	});
	


function magnetique() { 

	if($(window).width() >= 740){

		$.scrollify({ section : ".magnetique", setHeights: false, 	interstitialSection : ".inter" });

		$("body").on("keydown", function(e){
			if(e.keyCode === 38) {
				// up
			   $.scrollify.previous();
			}else if(e.keyCode === 40) {
				// down
				 $.scrollify.next();
			}
		});
	};
	
};

$(magnetique()); 


});
