/* SocialShare */
(function ($) {
    function get_class_list(elem){
        if(elem.classList){
            return elem.classList;
        }else{
            return $(elem).attr('class').match(/\S+/gi);
        }
    }
    $.fn.ShareLink = function(options){
        var defaults = {
            title: '',
            text: '',
            image: '',
            url: window.location.href,
            class_prefix: 's_'
        };
        var options = $.extend({}, defaults, options);
        var class_prefix_length = options.class_prefix.length;
        var templates = {
            twitter: 'https://twitter.com/intent/tweet?url={url}&text={title}',
            pinterest: 'https://www.pinterest.com/pin/create/button/?media={image}&url={url}&description={text}',
            facebook: 'https://www.facebook.com/sharer.php?&u={url}&t={title}&src=sp',
            linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={text}&source={url}',
            plus: 'https://plus.google.com/share?url={url}',
            whatsapp: 'whatsapp://send?text={url} {title}'
        }
        function link(network){
            var url = templates[network];
            url = url.replace(/{url}/g, encodeURIComponent(options.url));
            url = url.replace(/{title}/g, encodeURIComponent(options.title));
            url = url.replace(/{text}/g, encodeURIComponent(options.text));
            url = url.replace(/{image}/g, encodeURIComponent(options.image));
            return url;
        }
        return this.each(function(i, elem){
            var classlist = get_class_list(elem);
            for(var i = 0; i < classlist.length; i++){
                var cls = classlist[i];
                if(cls.substr(0, class_prefix_length) == options.class_prefix && templates[cls.substr(class_prefix_length)]){
                    var final_link = link(cls.substr(class_prefix_length));
                    $(elem).attr('href', final_link).click(function(){
                        if($(this).attr('href').indexOf('http://') === -1 && $(this).attr('href').indexOf('https://') === -1){
                            return window.open($(this).attr('href')) && false;
                        }
                        var screen_width = screen.width;
                        var screen_height = screen.height;
                        var popup_width = options.width ? options.width : (screen_width - (screen_width*0.2));
                        var popup_height = options.height ? options.height : (screen_height - (screen_height*0.2));
                        var left = (screen_width/2)-(popup_width/2);
                        var top = (screen_height/2)-(popup_height/2);
                        var parameters = 'toolbar=0,status=0,width=' + 550 + ',height=' + 400 + ',top=' + top + ',left=' + left;
                        return window.open($(this).attr('href'), '', parameters) && false;
                    });
                }
            }
        });
    }
    $.fn.ShareCounter = function(options){
        var defaults = {
            url: window.location.href,
            class_prefix: 'c_',
            display_counter_from: 0
        };
        var options = $.extend({}, defaults, options);
        var class_prefix_length = options.class_prefix.length
        var social = {
           'facebook': facebook,
           'linkedin': linkedin,
		   'twitter': twitter,
           'pinterest': pinterest,		  
           'plus': plus
        }
        return this.each(function(i, elem){
            var classlist = get_class_list(elem);
            for(var i = 0; i < classlist.length; i++){
                var cls = classlist[i];
                if(cls.substr(0, class_prefix_length) == options.class_prefix && social[cls.substr(class_prefix_length)]){
                    social[cls.substr(class_prefix_length)](options.url, function(count){
                        if (count >= options.display_counter_from){
                            $(elem).text(count);
                        }
                    })
                }
            }
        });
        function facebook(url, callback){
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://api.facebook.com/restserver.php',
                data: {'method': 'links.getStats', 'urls': [url], 'format': 'json'}
            })
           /*.done(function (data){
                if(data.length !== 0){
                    callback(data[0].share_count)
                }else{
                    callback(0)
                }
            })
            .fail(function(){callback(0);}) */
        }
		function twitter(url, callback){
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://twitter.com/count/',
                data: {'url': url, 'format': 'jsonp'}
            })
            //.done(function(data){callback(data.count)})
            //.fail(function(){callback(0)})
        }
        function linkedin(url, callback){
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://www.linkedin.com/countserv/count/share',
                data: {'url': url, 'format': 'jsonp'}
            })
            //.done(function(data){callback(data.count)})
            //.fail(function(){callback(0)})
        }
        function pinterest(url, callback){
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://api.pinterest.com/v1/urls/count.json',
                data: {'url': url}
            })
            //.done(function(data){callback(data.count)})
            //.fail(function(){callback(0)})
        }

        function plus(url, callback){
            $.ajax({
                type: 'POST',
                url: 'https://clients6.google.com/rpc',
                processData: true,
                contentType: 'application/json',
                data: JSON.stringify({
                    'method': 'pos.plusones.get',
                    'id': location.href,
                    'params': {
                        'nolog': true,
                        'id': url,
                        'source': 'widget',
                        'userId': '@viewer',
                        'groupId': '@self'
                    },
                    'jsonrpc': '2.0',
                    'key': 'p',
                    'apiVersion': 'v1'
                })
            })
            //.done(function(data){callback(data.result.metadata.globalCounts.count)})
            //.fail(function(){callback(0)})
        }
    }
})(jQuery);
