var isMobile  = false; var isFlag  = true; var topSpace; var isTablet = false;

var cds = /Mobi/.test(navigator.userAgent) && screen.width < 737? 'Mobile':/Mobi/.test(navigator.userAgent) && screen.width > 767? 'Tablet':'Desktop';

if(cds == 'Mobile'){
	/*desktop stikcy*/
	var stickyLeaderboard='.fixed-top-banner-ad {top:68px; background:#f8f7f8; position:fixed; z-index:3!important; width: 100%; margin: 0 auto;right: 0;} #fixed-top-ad-banner-close { display:none; background: #f8f7f8; position: absolute; text-align: right; cursor: pointer; z-index: 10; margin: 5px 5px; top: 0px; border: 1px solid #f2f2f2; right: 0px; -moz-border-radius: 10px;-khtml-border-radius: 10px;border-radius: 50%;border: 1px solid #666;width: 28px;text-align: center;height: 28px; font-size: 14px; padding-right: 1px} #fixed-Closed-Button {padding-top: 4px; padding-left: 1px;} .leaderboard{padding-top: 10px;}.bannerwrap1 {z-index:1000 !important} #articledetails iframe {min-height:auto !important;}';
	var headEl = document.getElementsByTagName('head')[0];
	var styleEl = document.createElement('style');
	var textnode = document.createTextNode(stickyLeaderboard);
	var bd= document.body;
	var docEl = document;
	styleEl.setAttribute("type", "text/css");
		if (styleEl.styleSheet) {   // for IE
			styleEl.styleSheet.cssText = stickyLeaderboard;
		} else {                // others
			styleEl.appendChild(textnode);
		}
	headEl.appendChild(styleEl);

	document.addEventListener("adsLoadCompleted", function(e) {	
		(function(){
			   setTimeout(function(){
			       
					var svt = document.getElementById('Leaderboard').getBoundingClientRect().top + 1;
						topSpace = 45;
				// 		console.log(svt);
						if(window.scrollY > topSpace && svt > -window.scrollY) {
						  //  console.log('...');
						    jQuery('#Leaderboard').before('<div id="noBounce" style="padding: 0px;"</div>');
						  //  console.log(jQuery('#Leaderboard')[0].getBoundingClientRect().height)
						    jQuery('#noBounce').css('height', jQuery('#Leaderboard')[0].getBoundingClientRect().height);
							document.getElementById('Leaderboard').classList.add("fixed-top-banner-ad");
							 jQuery('.bannerwrap').addClass('bannerwrap1');
						    setTimeout(function() {
							   document.getElementById('Leaderboard').classList.remove("fixed-top-banner-ad");
							   document.getElementById('noBounce')?document.getElementById('noBounce').remove():''; 
							    jQuery('.bannerwrap').removeClass('bannerwrap1');
							   isFlag  = false;
						    }, 3000);
						}

						window.addEventListener('scroll', function(){
							if (scrollY < topSpace) {				      	   
							   document.getElementById('Leaderboard').classList.remove("fixed-top-banner-ad");
							   document.getElementById('noBounce')?document.getElementById('noBounce').remove():''; 
							   isFlag  = false;
						    } else {
						      setTimeout(function() {
								document.getElementById('Leaderboard').classList.remove("fixed-top-banner-ad");
								document.getElementById('noBounce')?document.getElementById('noBounce').remove():''; 
							   	isFlag  = false;
							   }, 3000);
						    }
						});
					},2000);
			})();
	});
}