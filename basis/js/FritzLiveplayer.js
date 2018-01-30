
define(['FritzLiveplayer'], function() {

	var timerNOALiveplayer = false;
	
	var FritzLiveplayer = function(dom_element, options) {
		
		
		this.initializeNOA();
		
		this.initLivestreamOpenerLinks('.layoutnowonair_reload_active a, .layoutlivestream_info a, .layoutnewsticker_newsteaser a, a.logo');	
		
	};

	jsb.registerHandler("FritzLiveplayer", FritzLiveplayer);
	
	
	FritzLiveplayer.prototype.initializeNOA = function(){
		
		var that = this;
		 
		jQuery('.layoutnowonair.doctypeteaser').prepend(jQuery('<div>',{'class':'layoutnowonair_reload_active'}));
	
		jQuery('.layoutnowonair_reload_active').append(jQuery('.layoutnowonair_reload').html());
		
		// Reload nach Aufruf der Seite sofort ausführen
		if (jQuery(".layoutnowonair_reload").length) {
			this.liveplayer_setNOAImage();
		}
		
		// Liveplayer: Now on Air Bild laden
		jQuery('.layoutnowonair_reload').bind('DOMSubtreeModified', function(e) {
			//if (timerNOALiveplayer) clearTimeout(timerNOALiveplayer);
			
			if(! timerNOALiveplayer){
			timerNOALiveplayer = setTimeout(function() { 
				that.liveplayer_setNOAImage();
			}, 100);
			}
		});

	}
	
	
	FritzLiveplayer.prototype.liveplayer_setNOAImage = function(){
		
		var that = this;
		
		//console.log('NOW reload');
	
	
		//JSON Datei mit Now on Air laden
		jQuery.ajax({
			url: nowonairJSONUrl,
			success: function(result)
	    	{
			
			
				if (nowonairJSONUrl.indexOf("://") > -1) {
		        	domain = nowonairJSONUrl.split('/')[2];
		    	} else {
					domain = nowonairJSONUrl.split('/')[0];
		    	}
		    	
		    	//domain = 'frz-t0.w3.rbb-online.de';
		        
				//var hostname = jQuery(nowonairJSONUrl).attr('hostname');
				
				
				if(result.type == "m" && result.img){
					var fullImage = '//' + domain + '/content/dam/rbb/frz' + result.img.lnk + '/size=320x180.jpg';
					//console.log(fullImage);
					
					var newImageDiv = jQuery('<div>',{'class':'manualteaserpicture'}).append(jQuery('<img>',{id:'nowonaircastImage',src:fullImage}));
					
					var newTextDiv =  jQuery('<div>',{'class':'teasercontent'})
						.append(jQuery('<div>',{'class':'teasertext'})
						.append(jQuery('<h3>')
						.append(jQuery('<a>',{'href':result.lnk + '.html'})
						.append(jQuery('<span>',{'class': 'manualteasertitle', text: result.artist})))
						.append(jQuery('<h3>')
						.append(jQuery('<span>',{'class': 'manualteasertitle', text: result.title})))
						)
						);
					
					jQuery('.layoutnowonair_reload_active #nowonaircast').empty();
					jQuery('.layoutnowonair_reload_active #nowonaircast').append(newImageDiv);
					jQuery('.layoutnowonair_reload_active #nowonaircast').append(newTextDiv);
					
					jQuery('.layoutnowonair_reload_active #nowonaircast').show();
					jQuery('.layoutnowonair_reload_active #nowonaircastfallback').hide();
					
					that.initLivestreamOpenerLinks('.layoutnowonair_reload_active a');
					
				} else {
					jQuery('.layoutnowonair_reload_active #nowonaircastfallback').html(jQuery('.layoutnowonair_reload #nowonaircastfallback').html());
					
					jQuery('.layoutnowonair_reload_active #nowonaircast').hide();
					jQuery('.layoutnowonair_reload_active #nowonaircastfallback').show();
				}
		
				
				//NOAReloadTrigger();
				clearTimeout(timerNOALiveplayer);
				timerNOALiveplayer = false;
		
	
	        },
	        error: function (request, status, error)
	        {
	         	console.log('Laden der URL ' + nowonairJSONUrl + ' nicht möglich.');
	         	//console.log(error);
	         	
	         	jQuery('.layoutnowonair_reload_active #nowonaircastfallback').html(jQuery('.layoutnowonair_reload #nowonaircastfallback').html());
					
				jQuery('.layoutnowonair_reload_active #nowonaircast').hide();
				jQuery('.layoutnowonair_reload_active #nowonaircastfallback').show();
					
	         	clearTimeout(timerNOALiveplayer);
			 	timerNOALiveplayer = false;
		
	        }
		});	

	}

	// Funktion zum Öffnen der Links aus dem Liveplayer Fenster
	FritzLiveplayer.prototype.initLivestreamOpenerLinks = function(element){
	
		jQuery(element).click(function() {
		
			var url = jQuery(this).attr('href');
			
			//console.log('url: ' + url);
			
			if(window.opener){
				
				window.opener.location.href = url; 
				return false;
				
			} else {
				var NWin = window.open(url, '', 'height=' + screen.height + ',width=' + screen.width + ',toolbar=yes,location=yes,scrollbars=yes,status=yes,resizable=yes');
				
				if (window.focus){
					NWin.focus();
				}
		     
				return false;
			}
		});


	}
	
   
});
