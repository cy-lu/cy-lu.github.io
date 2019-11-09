var isMobile  = false; var topSpace; var isTablet = false;
var cds = /Mobi|Android|Tablet/.test(navigator.userAgent) && screen.width < 737? 'Mobile':/Mobi|Android|Tablet/.test(navigator.userAgent) && screen.width > 767? 'Tablet':'Desktop';

if(cds != 'Mobile'){

	/*desktop stikcy*/
	var stickyLeaderboard='.fixed-top-banner-ad {padding:10px; top:0px; background:#f8f7f8; -moz-box-shadow: 0 5px 5px 2px rgba(0,0,0,.3); -webkit-box-shadow: 0 5px 5px 2px rgba(0,0,0,.3); box-shadow: 0 5px 5px 2px rgba(0,0,0,.3); position: fixed; z-index: 25 !important; height:auto !important; width: 100% !important; margin: 0 auto !important;right: 0; } #fixed-top-ad-banner-close { display:none; background: #f8f7f8; position: absolute; text-align: right; cursor: pointer; z-index: 10; margin: 5px 5px; top: 0px; border: 1px solid #f2f2f2; right: 0px; -moz-border-radius: 10px;-khtml-border-radius: 10px;border-radius: 50%;border: 1px solid #666;width: 28px;text-align: center;height: 28px; font-size: 14px; padding-right: 1px} #fixed-Closed-Button {padding-top: 4px; padding-left: 1px;} #imgids{display:none;} .bannerwrap1 {z-index:25 !important}';
	var headEl = document.getElementsByTagName('head')[0];
	var styleEl = document.createElement('style');
	var textnode = document.createTextNode(stickyLeaderboard);
	var bd = document.body;
	var docEl = document;
	styleEl.setAttribute("type", "text/css");
	if (styleEl.styleSheet) { // for IE
	    styleEl.styleSheet.cssText = stickyLeaderboard;
	} else { // others
	    styleEl.appendChild(textnode);
	}
	headEl.appendChild(styleEl);

	document.addEventListener("adsLoadCompleted", function(e) {
	    if (e.detail.size == 728 && e.detail.count == 0) {
	        stickyLB();
	    }
	});

	function stickyLB() {
	    (function() {
	        document.getElementById('Leaderboard').addEventListener('click', function() {
	            document.getElementById('Leaderboard').classList.remove("fixed-top-banner-ad");
	            document.getElementById("fixed-top-ad-banner-close") ? document.getElementById("fixed-top-ad-banner-close").style.display = 'none' : '';
	            document.getElementById('noBounce') ? document.getElementById('noBounce').remove() : '';
	        }, false);
	    })();

	    var closeButtonDiv = document.createElement('div');
	    closeButtonDiv.id = 'fixed-top-ad-banner-close';
	    closeButtonDiv.innerHTML = '<div id="fixed-Closed-Button">x</div>';
	    document.getElementById('Leaderboard').appendChild(closeButtonDiv);

	    (function() {
	        setTimeout(function() {
	            var svt = document.getElementById('Leaderboard').getBoundingClientRect().top;
	            if (signal.Page.ChannelLevel2 != null && signal.Content.ArticleId == null || signal.Page.ChannelLevel1 == 'SponsoredPage') {
	                topSpace = 245;
	            } else {
	                topSpace = 225;
	            }

	            if (window.scrollY > topSpace && svt > -window.scrollY) {
	                jQuery('#Leaderboard').before('<div id="noBounce" style="height: 90px;"</div>');
	                document.getElementById('Leaderboard').classList.add("fixed-top-banner-ad");
	                document.getElementById("fixed-top-ad-banner-close") ? document.getElementById("fixed-top-ad-banner-close").style.display = 'block' : '';
                    jQuery('.bannerwrap').addClass('bannerwrap1');
	                setTimeout(function() {
	                    document.getElementById('Leaderboard').classList.remove("fixed-top-banner-ad");
	                    document.getElementById("fixed-top-ad-banner-close") ? document.getElementById("fixed-top-ad-banner-close").style.display = 'none' : '';
	                    jQuery('.bannerwrap').removeClass('bannerwrap1');
	                    document.getElementById('noBounce') ? document.getElementById('noBounce').remove() : '';
	                }, 4000);
	            }

	            window.addEventListener('scroll', function() {
	                if (scrollY < topSpace) {
	                    document.getElementById('Leaderboard').classList.remove("fixed-top-banner-ad");
	                    document.getElementById("fixed-top-ad-banner-close") ? document.getElementById("fixed-top-ad-banner-close").style.display = 'none' : '';
	                    document.getElementById('noBounce') ? document.getElementById('noBounce').remove() : '';
	                } else {
	                    setTimeout(function() {
	                        document.getElementById('Leaderboard').classList.remove("fixed-top-banner-ad");
	                        document.getElementById("fixed-top-ad-banner-close") ? document.getElementById("fixed-top-ad-banner-close").style.display = 'none' : '';
	                        document.getElementById('noBounce') ? document.getElementById('noBounce').remove() : '';
	                    }, 4000);
	                }
	            });
	        }, 2000);
	    })();
	}
}