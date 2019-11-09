var isMobile = false; 
var cds = /Mobi|Android|Tablet/.test(navigator.userAgent) && screen.width < 737? 'Mobile':/Mobi|Android|Tablet/.test(navigator.userAgent) && screen.width > 767? 'Mobile':'Desktop';
if(cds == 'Mobile')
{
   isMobile  = true;
} 
 
if(signal.Page.ChannelLevel1!='Homepage' && cds == 'Mobile')
{
    jQuery('#MPU').remove();
    if(signal.Page.ChannelLevel2==null && signal.Content.ArticleId==null) {
        jQuery('.listing li:eq(2)').after('<li class=""><article><section><div id="MPU"></div></section></article></li>');
    }
    
      if(signal.Page.ChannelLevel2!=null && signal.Content.ArticleId==null) {
        jQuery('.listing li:eq(2)').after('<li class=""><article><section><div id="MPU"></div></section></article></li>');
    }
      
     
      if(signal.Content.ArticleId!=null) {
          jQuery('#articledetails p:eq(0)').after('<p style="height:auto; width:300px; margin:0 auto;" id="MPU"></p>');
      } 
      
       if(signal.Content.ArticleId!=null) {
          jQuery('#articledetails p>br:eq(0)').after('<p style="height:auto; width:300px; margin:0 auto;" id="MPU"></p>');
         /* var today = new Date();
           var offtheAd = today.setHours(today.getHours());
          if(offtheAd<='1546261124000'){
            jQuery('#articledetails p:last').after('<p style="height:auto; width:300px; margin:0 auto; padding-bottom:5px;"  id="MPU1"></p>');
          }*/
      } 
      
       if(signal.Page.ChannelLevel1=='SponsoredPage') {
          jQuery('.me-content-body p:eq(0)').after('<p style="height:auto; width:300px; margin:0 auto;" id="MPU"></p>');
      } 
      
}
var mviID = typeof urlParam('mvi') != null ? urlParam('mvi') : '';
signal.Paths = setPathsTargeting(window.location.host+window.location.pathname);
typeof signal.Page.ChannelLevel1!='undefined' && signal.Page.ChannelLevel1!=null?signal.Page.ChannelLevel1=signal.Page.ChannelLevel1.split(' ').join('_'):'';
typeof signal.Page.ChannelLevel2!='undefined' && signal.Page.ChannelLevel2!=null?signal.Page.ChannelLevel2=signal.Page.ChannelLevel2.split(' ').join('_'):'';
var ignore = new Array('ArticleVersion', 'ArticlePublishDate', 'ArticleId', 'Match', 'IsVideo','VideoLength', 'VideoTitle', 'path', 'pathlv1', 'pathlv2', 'pathlv3', 'pathlv4', 'isLoggedIn', 'Techtype', 'ContentType', 'EmailHash');
var  adStart = Date.now(),attachScriptAsync, targetingComplete, oxDone, initDone=false, gptCallIntiated = false, 
siteSetting =   {nid:'7229', pname:'E247'}, 
adUnitName  = (typeof signal.Page.ChannelLevel2!='undefined' && signal.Page.ChannelLevel2 !='' && signal.Page.ChannelLevel2 !=null)?'/'+signal.Page.ChannelLevel1+'/'+signal.Page.ChannelLevel2:(typeof signal.Page.ChannelLevel1!='undefined' && signal.Page.ChannelLevel1!=null)?'/'+signal.Page.ChannelLevel1.trim():'/General',_dm={}, fsa=[] , slots=[],lotamePid, 
Leaderboard = [[[1200, 200],[[728,90],[970, 90],[970, 250]]],[[768, 200],[[728, 90]]],[[0, 0],[[320, 50],[320, 100]]]];

MPU = signal.Page.ChannelLevel1=='Homepage'?[[[728, 200],[[300, 250]]],[[0, 0],[300, 250]]]:[[[728, 200],[[300, 250],[300,600]]],[[0, 0],[300, 250]]];
MPU1 = signal.Page.page_type=='article'?[[[728, 200],[[300, 250]]],[[0, 0],[300, 250]]]:[[[728, 200],[[300, 250],[300,251]]],[[0, 0],[300, 250]]];
skinning = [[[1200, 200],[1, 1]],[[0, 0],[1, 1]]];
OOP = [[[1200, 200],[1, 1]],[[0, 0],[1, 1]]];
NativeHomepage = [ [[1200, 200], [2, 2]], [[0, 0], [2, 2]] ];
NativeSection = [ [[1200, 200], [[2, 2],'fluid']], [[0, 0], [[2, 2],'fluid']] ];
NativeSectionInner = [ [[1200, 200], [[2, 2],'fluid']], [[0, 0], [[2, 2],'fluid']] ];
NativeMostRead = [ [[1200, 200], [[2, 2],'fluid']], [[0, 0], [[2, 2],'fluid']] ];
Outstream = [ [[1200, 200], [[2, 2],'fluid']], [[0, 0], [[2, 2],'fluid']] ];
_dm.adMaps = { defaultslots: [[Leaderboard, "Leaderboard", '728, 90'],[MPU, "MPU", '300, 250'],[MPU1, "MPU1", '300, 250'],[skinning, "Skinning", '1, 1'],[OOP, 'OOP', '1, 1'],[NativeHomepage, 'NativeHomepage', '2,2'],[NativeSection, 'NativeSection', '2,2'],[NativeSectionInner, 'NativeSectionInner', '2,2'],[NativeMostRead, 'NativeMostRead', '2,2'],[Outstream, 'Outstream', '539,304']]};  
adUnitName = '/'+siteSetting.nid+'/'+siteSetting.pname+adUnitName;
adUnitName = adUnitName.substring(0, 99);
//adUnitName = '/7229/n7729.testsite/E247';
getPageType();
    
var completedTargeting = {},
gptApp = gptApp || {},
googletag = googletag || {},
targetingEvtResponseTime = [];
gptApp.ads = gptApp.ads || [];
googletag.cmd = googletag.cmd || [];

/*
 * add scripts dynamically to have asynchronous support
 */
attachScriptAsync = function(scriptInfo) {
	var tag = document.createElement("script"),
		p, node = document.getElementsByTagName("script")[0];
	tag.async = true;
	for (p in scriptInfo) {
		if (scriptInfo.hasOwnProperty(p) && p != "src") {
			tag[p] = scriptInfo[p];
		}
	}
	tag.src = scriptInfo.src;
   node.parentNode.insertBefore(tag, node);
}

// Google Publisher Tag
attachScriptAsync({
	src: "//securepubads.g.doubleclick.net/tag/js/gpt.js",
	id:'gpt',
	onload: function(){
	  targetingComplete("gpt");
	}
});

/*
 * Render ad slot display after all targeting pixels fired 
 * Invoke the Adslots pushed into gptApp array  on page
*/
gptApp.renderAds = function() {
  googletag.cmd.push(function() {
	 if (document.readyState === 'interactive') {
			defineDisplayAdSlots();        
	 }       
  });
 };

/*
 * Enable GPT services and render adcalls, that now all targeting finished
 * This method is invoked after each Bidder/Measurument pixel triggered
 * Additional Tracking attribute "perf" targeted here to track the pixel load time
*/

    targetingComplete = function(event) {

        completedTargeting[event] = true;

        if (!gptCallIntiated) {
                                 
            targetingEvtResponseTime.push(event + "|" + (Date.now() - adStart));
            
            if (completedTargeting.gpt) {
                gptCallIntiated = true;
                initDefaultAdSlots();
                if(initDone)
	              {     
                    var event = document.createEvent('Event');
                    event.initEvent('initPlayer', true, true);
                    document.dispatchEvent(event);
                    gptApp.renderAds(); // render ads or Register Display functionality                  
	              }
            }
        }
    }    
	
detectedScreenWidth = function() {
	var b = 2049;
	xWidth = null;
	null != window.screen && (xWidth = screen.availWidth,
		0 < xWidth && xWidth < b && (b = xWidth));
	null != window.innerWidth && (xWidth = window.innerWidth,
		0 < xWidth && xWidth < b && (b = xWidth));
	null != document.body && (xWidth = document.body.clientWidth,
		0 < xWidth && xWidth < b && (b = xWidth));
	console.log("detected screen width \x3d " + b);
	return b
}();

  var osSizes;
        if(detectedScreenWidth < 415 && detectedScreenWidth > 375){
        osSizes = [320,180];
        }else 
        	if(detectedScreenWidth <= 375){
        	osSizes = [320,180];
        }else{
        	osSizes = [539,304]; //539x304 will change at last
        } 
    
    /*
     * default ad divisions on publisher website
     */
    function initDefaultAdSlots()
    {     
        cDynamicAdPlacement('OOP');   
       if(screen.width > 1360 && cds !='Mobile' && screen.width > 1025 && signal.Page.ChannelLevel1 != 'SponsoredPage') 
        {
         cDynamicAdPlacement('Skinning');
        }
        if(signal.Page.ChannelLevel1 == 'Homepage'){ 
            // console.log($('.pull-right:eq(0) .last-child'));
            $('.pull-right:eq(0) .last-child').after('<li class="el6 even"  id="NativeHomepage"  style="display:none"></li>')
        }
        
      if(signal.Page.ChannelLevel1 != 'Homepage' && signal.Page.ChannelLevel2 == null  && signal.Content.ArticleId == null){
          $('.listing .el1:eq(0)').after('<li class="el1 even"  id="NativeSection"  style="display:none"></li>')
        }
        
         if(signal.Page.ChannelLevel1 != 'Homepage' && signal.Page.ChannelLevel1 != null && signal.Page.ChannelLevel2 != null && signal.Content.ArticleId == null){
             $('.listing .el1:eq(0)').after('<li class="el1 even"  id="NativeSectionInner"  style="display:none"></li>')
        }
        
        if(typeof signal.Content.ArticleId != 'undefined' && signal.Content.ArticleId != null && signal.Page.ChannelLevel1 != 'SponsoredPage'){
            if(signal.Page.ChannelLevel1!='SponsoredPage') {
              $('#parsely-related').before('<div class="section grid two-columns-teaser listing"><ul><li id="NativeMostRead" class="el1 odd first-child" style="display:none"></li></ul></div>');
            googleOutStream(0,'#articledetails p');
			}
        }
        
        return initDone = true;
    }

    /*
     * Get Hot Slots - Active slots on current page
     */
    function defineDisplayAdSlots()
    {
    googletag.cmd.push(function() {
       var slot='', a=[], c, e, gm;
       var haystack = new Array('Leaderboard', 'MPU', 'MPU1');
        for (var d = 0; d <_dm.adMaps.defaultslots.length; d++) { 
            var s = document.getElementById(_dm.adMaps.defaultslots[d][1]); 
            if(s != null)  slot = s.getAttribute('id');
            
             if (s) 
                { 
               //console.log(slot);
                  fsa.push(slot);
                  var m = _dm.adMaps.defaultslots[d][0];
                
                 
                    var gMapping = googletag.sizeMapping();
                    
                    if(in_array(slot, haystack)) {
                      
                        for(b=0; b < m.length; b++) { 
                              c = m[b][0];
                              e = m[b][1];
                              gMapping.addSize(c, e)
                            }
                    }
                  
                    if (slot == 'Leaderboard') {
                        gslot = googletag.defineSlot(adUnitName, cds == 'Mobile'? [
                                [320, 100],
                                [320, 50]
                            ] : [728, 90], 'Leaderboard')
                            .defineSizeMapping(gMapping.build())
                            .addService(googletag.pubads());
                        	slots[d] = gslot;

                    }
                    
                    var nativeKV;
                    
                    if(signal.Page.page_type == 'homepage'){
                        nativeKV = 'N_W_Homepage';
                    }
                    
                    if(signal.Page.page_type == 'category' || signal.Page.page_type == 'sub-category'){
                        nativeKV = 'N_W_Section';
                    }
                    
                    if(signal.Page.page_type == 'article'){
                        nativeKV = 'N_W_Article';
                    }
                    
                    if(cds == 'Mobile'){
                        if (slot == 'MPU') {
                            gslot = googletag.defineSlot(adUnitName, [[300, 250],'fluid'], 'MPU')
                                .setTargeting('pos',nativeKV)
                                .addService(googletag.pubads());
                            slots[d] = gslot;
                        }
                    }else{
                        if (slot == 'MPU') {
                            gslot = googletag.defineSlot(adUnitName, [[300, 250],[300,600]], 'MPU')
                                .defineSizeMapping(gMapping.build())
                                .addService(googletag.pubads());
                            slots[d] = gslot;
                        }
                    }
                    
                     if (slot == 'MPU1') {
                        gslot = googletag.defineSlot(adUnitName, [[300, 250],[300,600]], 'MPU1')
                            .defineSizeMapping(gMapping.build())
                            .addService(googletag.pubads());
                        slots[d] = gslot;
                    }
/*
					if(slot == 'Outstream' && signal.Page.ChannelLevel1 != 'SponsoredPage'){  
						if(urlParam('type')) {
                            adUnitName = '/7229/n7729.testsite/googleoutstream';
                        } 
						googletag.defineSlot(adUnitName, osSizes, 'Outstream')
						.setCollapseEmptyDiv(true).setTargeting("pos", ["Outstream"]).addService(googletag.pubads());
					}*/
                    //NativeHomepage
                    if (slot == 'NativeHomepage') {
                        gslot = googletag.defineSlot(adUnitName,[2, 2], 'NativeHomepage')
                            .setTargeting("pos", 'N_W_Homepage')
                            .addService(googletag.pubads());
                    }

                    //NativeSection
                    if (slot == 'NativeSection') {
                        gslot = googletag.defineSlot(adUnitName, [2, 2], 'NativeSection')                           
                            .setTargeting("pos", 'N_W_Section')
                            .addService(googletag.pubads());
                    }    
                    
                      if (slot == 'NativeMostRead') {
                        gslot = googletag.defineSlot(adUnitName, [2, 2], 'NativeMostRead')                           
                            .setTargeting("pos", 'N_W_Article')
                            .addService(googletag.pubads());
                    } 
                    
                     if (slot == 'NativeSectionInner') {
                        gslot = googletag.defineSlot(adUnitName, [2, 2], 'NativeSectionInner')                           
                            .setTargeting("MVPlacementKey", 'innersection').setTargeting("pos", 'N_W_Section')
                            .addService(googletag.pubads());
                    } 
                    
                    if (slot == 'Skinning' && screen.width > 1025) {
                        gslot = googletag.defineSlot(adUnitName, [1, 1], 'Skinning').addService(googletag.pubads());
                    }
                      
                      //OOP
                      if(slot == 'OOP'){
                          gslot= googletag.defineOutOfPageSlot(adUnitName, 'OOP').addService(googletag.pubads());
                      }
                    
                  
                }
          }
    });
         googletag.cmd.push(function() {
          googletag.pubads().setTargeting("pt", signal.Page.page_type);
          
          if (typeof signal.Content.platform != 'undefined' && signal.Content.platform) {
                 (typeof signal.Content.platform != 'undefined' && signal.Content.platform) ? googletag.pubads().setTargeting("platform", signal.Content.platform): '';
             }
           //append targeting params
             if (typeof signal.Content.ArticleId != 'undefined' && signal.Content.ArticleId) {
                 (typeof signal.Content.ArticleId != 'undefined' && signal.Content.ArticleId) ? googletag.pubads().setTargeting("articleID", signal.Content.ArticleId): '';
             }

             if (typeof signal.Content.Keywords != 'undefined' && signal.Content.Keywords != null)
                 (typeof signal.Content.Keywords != 'undefined' && Array.isArray(signal.Content.Keywords)) ? googletag.pubads().setTargeting("keywords", signal.Content.Keywords) : googletag.pubads().setTargeting("keywords", signal.Content.Keywords);

           if (typeof signal.Content.ContentCategoryLevel1 != 'undefined' && signal.Content.ContentCategoryLevel1) {
                 (typeof signal.Content.ContentCategoryLevel1 != 'undefined' && signal.Content.ContentCategoryLevel1) ? googletag.pubads().setTargeting("Topic", signal.Content.ContentCategoryLevel1): '';
             }
             
             
           if (typeof signal.Content.ContentCategoryLevel2 != 'undefined' && signal.Content.ContentCategoryLevel2) {
                 (typeof signal.Content.ContentCategoryLevel2 != 'undefined' && signal.Content.ContentCategoryLevel2) ? googletag.pubads().setTargeting("sTopic", signal.Content.ContentCategoryLevel2): '';
             }
             
             
        
           //native sponsored page
          if (window.location.pathname.indexOf("Sponsored") >= 0 && window.location.search.indexOf("mvi") >= 0) {
              if (slots.length > 0) {
                  slots.forEach(function(v, i) {
                      slots[i].setTargeting('mvi', mviID.trim());
                  });
              }
          }    
          
           
           
          googletag.pubads().setCentering(true);
          googletag.pubads().enableSingleRequest();
          googletag.pubads().collapseEmptyDivs(true, true);
          googletag.enableServices();
          //display ads
          fsa.forEach(function(v, i){
            googletag.display(v);
          });
            
          });
         
         var popup = 0;
         //dispatch event for sticky leaderboard
         googletag.pubads().addEventListener('slotRenderEnded', function(event) {
            var advertiserID;
          $('.sidebar_inner').css('will-change','unset');
             
            // console.log(event.slot.getSlotElementId());
           
                 if (event.slot.getSlotElementId() == 'NativeHomepage') {
                     if (event.creativeId) {
                        jQuery('#NativeHomepage').prev().remove();
                     }
                 }
                 
            

             var e = new CustomEvent("adsLoadCompleted", { 'detail': {'size': event.slot.getSlotElementId() == 'Leaderboard'?event.size[0]:'', 'count':popup == 0?0:1} });
             popup = 1;
             document.dispatchEvent(e);
         });

            googletag.pubads().addEventListener('slotOnload', function(event) {                
                jQuery('#Leaderboard div[id^=creative_]').css('margin','auto');
                jQuery('#MPU div[id^=creative_]').css('margin','auto').css('width','300px');
            });  
    }
    
  //creative divisions 
    function cDynamicAdPlacement(adp)
    {
      jQuery('<div id='+adp+'></div>').prependTo( "body" );
    }
    function in_array(needle, haystack) {
        for(var i in haystack) {
            if(haystack[i] == needle) return true;
        }
        return false;
    }
    
    
  //paste below code at end of the sctript
  //set paths in data layer
  function setPathsTargeting(vpp) {
      // take path part without parameters.
  
      var pathKeys, pathKey1, pathKey2, webpaths = [];
      pathKeys = vpp.split('?');
      pathKeys = getCleanURL(pathKeys[0]);
      webpaths['path'] = pathKeys; //console.log(pathKeys);
      // get 5 path levels parts, if some level is not available then use "notset" value.
      var pathLevels = pathKeys.split('/');
     
      var maxI = 6,val2;
      for (i = 1; i < maxI; i++) {
          val = pathLevels[i];
          webpaths['pathlv' + i] = val?val:null;
      }
      return webpaths;
  }

  function getCleanURL(pathKey) {
      // remove ending slash / if exists
      pathKey = pathKey.replace(/\/$/, "");
      // remove any space if exists
      pathKey = pathKey.replace(/ /g, "");
      // Remove Invalid Characters
      pathKey = pathKey.replace(/["'=!+#*~;,.^()<>&%?\[\]\\]/g, '');
      // Encode URI , but keep / - _ but convert non-english to Hex (%)
      pathKey = encodeURI(pathKey);
      // Remove percentage Signs from encoded value..
      pathKey = pathKey.replace(/%/g, "");
      return pathKey;
  }
  //get page type and fill signal data layer page_type:'homepage' or 'category' or 'sub-category' or article

var dms_collection = {page_type:signal.Page.page_type,
page_title:signal.Content.ArticleTitle,
page_category:signal.Content.ContentCategoryLevel1?signal.Content.ContentCategoryLevel1:null,
page_sub_category1:signal.Content.ContentCategoryLevel2?signal.Content.ContentCategoryLevel2:null,
search_term:signal.Content.SearchTerm?signal.Content.SearchTerm:null,
article_id:signal.Content.ArticleId?signal.Content.ArticleId:null,
keyword:signal.Content.Keywords?signal.Content.Keywords:null,
day_of_week: getWeekDay(new Date()),
time_of_day: getTimeofTheDay()};

window.bk_async = function() {
	// ALLOW MULTIPLE CALLS/SINGLE PAGE APPS
	bk_allow_multiple_calls = true;
	bk_use_multiple_iframes = true;
	// <optional> PHINTS : Declare variables about this page (or user)
	Object.keys(dms_collection).forEach(function(key) {
		dms_collection[key]?bk_addPageCtx(key, dms_collection[key]):'';
	});
	// Send Data to BlueKai
	BKTAG.doTag(66450, 4); // Change 12345 to your CONTAINER ID and
};
(function() {
	var scripts = document.getElementsByTagName('script')[0];
	var s = document.createElement('script');
	s.async = true;
	s.src = '//tags.bkrtx.com/js/bk-coretag.js';
	scripts.parentNode.insertBefore(s, scripts);
}());
//page type
function getPageType()
{
	if(signal.Page.ChannelLevel1=='SponsoredPage')
	{
		signal.Content.ContentCategoryLevel1='SponsoredPage';
		signal.Content.ArticleId=mviID;
	}
	signal.Page.page_type = signal.Content.ArticleId!=null?'article':signal.Page.ChannelLevel1!=null && signal.Page.ChannelLevel2!=null?'sub-category':signal.Page.ChannelLevel1!=null && signal.Page.ChannelLevel1!='Homepage'?'category':'homepage';
	return signal.Page.page_type;
}  
function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return decodeURI(results[1]) || 0;
    }
}
/**
 * Function takes in a Date object and returns the day of the week in a text format.
 */
function getWeekDay(date){
    //Create an array containing each day, starting with Sunday.
    var weekdays = new Array(
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    );
    //Use the getDay() method to get the day.
    var day = date.getDay();
    //Return the element that corresponds to that index.
    return weekdays[day];
}

/**
 * function to retunn time of day
 */
 function getTimeofTheDay()
 {
    var now  = new Date(),
    hour = now.getHours();

      var shift;
   if (hour >= 6  && hour <= 12) shift= "morning";
    if (hour >= 12 && hour <= 17) shift= "afternoon";
    if (hour >= 17 && hour <= 20) shift= "evening";
    if (hour >= 21 || hour <= 6) shift=  "night";
    
    return shift;
 }
 //Google outstream Locator
function googleOutStream(index, CSSselector, param = 'no param'){              
	var s = $(CSSselector);
	var ele = document.createElement('div');
	if(index == 0){
		ele.setAttribute('id','Outstream');   
	}
	var sLen = s.length -1;

	if($(CSSselector).length == 0 || param > $(CSSselector).length){
		param = null;
	}

	switch (true) {
		case (param == 'no param'):
			sLen = Math.floor(sLen/2);
			var ref = s[sLen];
			typeof ref.parentNode.insertBefore(ele, ref.nextSibling)!='undefined'?ref.parentNode.insertBefore(ele, ref.nextSibling):'';
			// console.log('case 0: Counts the paragraph in the content and put TEADS in the middle');                    
			break;
		case (typeof param && param != null && sLen > param):
			var ref = s[param];
			typeof ref.parentNode.insertBefore(ele, ref.nextSibling)!='undefined'?ref.parentNode.insertBefore(ele, ref.nextSibling):''; 
			// console.log('case 1: Put TEADS at the given index');
			break;                    
		default:
			var a = CSSselector.split(' ');
			a = a[0];
			// console.log(a);
			var ref = $(a)[0];
			typeof ref.parentNode.insertBefore(ele, ref.nextSibling)!='undefined'?ref.parentNode.insertBefore(ele, ref.nextSibling):'';
			var teadsChecker = setInterval(function(){
				if(jQuery('.teads-inread').length > 0){
					// console.log('teads inread found');
					jQuery('.teads-inread').addClass('articles');
					clearInterval(teadsChecker);
				}                
			}, 50); 
			// console.log('default case: Put TEADS at the end of article');
			break;
	}
}