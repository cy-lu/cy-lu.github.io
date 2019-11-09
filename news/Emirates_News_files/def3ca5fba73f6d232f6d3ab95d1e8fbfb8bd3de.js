var isMobile22  = false; var isFlag  = true; var topSpace; var isTablet = false, duration = 4000;

var cds = /Mobi/.test(navigator.userAgent) && screen.width < 737? 'Mobile':/Mobi/.test(navigator.userAgent) && screen.width > 767? 'Tablet':'Desktop';

if(cds == 'Mobile'){
    isMobile22 = true;    
}

var pdstyle = '#paidmr {width: 100%; text-align: center; margin: 0 auto;}.mrblock {width: 25%; -webkit-box-flex: 0; max-width: 25%; flex: 0 0 25%;} @media screen and (max-width: 414px){ .mrblock {padding:5px; width: 100%;} }@media screen and (max-width: 400px){ .mrblock {padding:5px; width:100%;} } @media screen and (max-width: 360px){ .mrblock {padding:5px; width: 100%;} } @media screen and (max-width: 320px){ .mrblock {padding:5px; width: 100%;} }';    
var headEl1 = document.getElementsByTagName('head')[0];
var styleEl1 = document.createElement('style');
var textnode1 = document.createTextNode(pdstyle);
var bd1 = document.body;
var docEl1 = document;

styleEl1.setAttribute("type", "text/css");
if (styleEl1.styleSheet) { // for IE
    styleEl1.styleSheet.cssText = pdstyle;
} else { // others
    styleEl1.appendChild(textnode1);
}

headEl1.appendChild(styleEl1);

if(signal.Content.ArticleId =='1.684160' && signal.Page.ChannelLevel1 != 'SponsoredPage'){            
    jQuery('#parsely-recommended').before('<div id="paidmr" style="margin-bottom: 20px;" class="section grid grid_4 related-articles"><ul></ul></div>');
    jQuery('#paidmr').before('<h2 class="title"><span>MyRelated</span></h2>');
    if(cds == 'Mobile'){jQuery('#paidmr').after('<hr>');}
    jQuery('#paidmr ul').append('<li><article id="pdmr1"></article></li>');
    jQuery('#paidmr ul').append('<li><article id="pdmr2"></article></li>');
    jQuery('#paidmr ul').append('<li><article id="pdmr3"></article></li>');
    jQuery('#paidmr ul').append('<li><article id="pdmr4"></article></li>');
    jQuery('#paidmr').css('direction','rtl');
    var adschecker2311 = setInterval(function(){ 
        if(jQuery('#MPU iframe').length > 0){  
    	   myRelatedInit();
    	   clearInterval(adschecker2311);
        }
    }, 50);       
}      
// });    
 
function myRelatedInit(){   
    var isShow = false, mr1, mr2, mr3, mr4, adUnitName = '/7229/n7729.testsite/E247';
    googletag.cmd.push(function() { 
        if(isMobile22){ 
            // jQuery('.mrblock').css('width','47%')
            mr1 = googletag.defineSlot(adUnitName, ['fluid'], 'pdmr1').setTargeting("pos", ["mr1", "myrelated"]).setTargeting("adType","grid").addService(googletag.pubads());  
            mr2 = googletag.defineSlot(adUnitName, ['fluid'], 'pdmr2').setTargeting("pos", ["mr2", "myrelated"]).setTargeting("adType","grid").addService(googletag.pubads());  
        
            mr3 = googletag.defineSlot(adUnitName, ['fluid'], 'pdmr3').setTargeting("pos", ["mr3", "myrelated"]).setTargeting("adType","grid").addService(googletag.pubads());
            
            mr4 = googletag.defineSlot(adUnitName, ['fluid'], 'pdmr4').setTargeting("pos", ["mr4", "myrelated"]).setTargeting("adType","grid").addService(googletag.pubads());
        }else{ 
            // jQuery('.mrblock').css('margin-left','2%').css('padding','0px'); 
            // jQuery('#paidmr').prev().css('padding-left','2%');
            mr1 = googletag.defineSlot(adUnitName, ['fluid'], 'pdmr1').setTargeting("pos", ["mr1", "myrelated"]).setTargeting("adType","grid").addService(googletag.pubads());  
            
            mr2 = googletag.defineSlot(adUnitName, ['fluid'], 'pdmr2').setTargeting("pos", ["mr2", "myrelated"]).setTargeting("adType","grid").addService(googletag.pubads());  
            
            mr3 = googletag.defineSlot(adUnitName, ['fluid'], 'pdmr3').setTargeting("pos", ["mr3", "myrelated"]).setTargeting("adType","grid").addService(googletag.pubads());
            
            mr4 = googletag.defineSlot(adUnitName, ['fluid'], 'pdmr4').setTargeting("pos", ["mr4", "myrelated"]).setTargeting("adType","grid").addService(googletag.pubads());
        }
        
        googletag.pubads().disableInitialLoad();
        
        window.addEventListener('scroll', function(){ 
            var height = jQuery(window).height();
            var scrollTop = jQuery(window).scrollTop();
            var obj = jQuery("#paidmr")
            var pos = obj.position();
            if (height + scrollTop > pos.top && !isShow) {
                isShow = true; 
                googletag.pubads().refresh([mr1, mr2, mr3, mr4]);
            }
        });	        
    });    
}