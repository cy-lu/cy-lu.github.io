(function ($) {
	"use strict";

	$(document).ready(function () {
		thim_sc_personal_news.ready();
	});

	var thim_sc_personal_news = window.thim_sc_personal_news = {

		ready: function () {
			//view 5s, run update tag,cat,author
			var $time_view = 5000;

			setTimeout(function () {
				thim_sc_personal_news.local_storage();
			}, $time_view);

		},

		/**
		 * Save data to local data
		 */
		local_storage: function () {
			if (typeof(Storage) !== "undefined") {
				if (thim_personal_news.is_single || thim_personal_news.is_category) {
					var lifetime = '';
					if (typeof localStorage.magwp_lifetime != 'undefined') {
						lifetime = localStorage.magwp_lifetime;
					}

					var data = {
						action    : 'thim_personal_news_store',
						data      : thim_personal_news,
						lifetime  : lifetime,
						posts     : localStorage.magwp_posts,
						tags      : localStorage.magwp_tags,
						categories: localStorage.magwp_categories,
					};

					$.ajax({
						type   : "POST",
						url    : ajaxurl,
						data   : data,
						success: function (res) {
							if (typeof res != 'string') {
								localStorage.magwp_lifetime = res.data.lifetime;
								localStorage.magwp_posts = res.data.posts;
								localStorage.magwp_tags = res.data.tags;
								localStorage.magwp_categories = res.data.categories;
							}
						}
					});
				}
			} else {
				console.log("Creative Mag: Sorry, your browser does not support web storage...");
			}
		},


	};

})(jQuery);