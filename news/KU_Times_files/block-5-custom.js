(function ($) {
	"use strict";

	$(document).ready(function () {
		thim_sc_block5.init();
	});

	var thim_sc_block5 = window.thim_sc_block5 = {

		data: {},
		init: function () {
			this.carousel();
			this.nav_filter();
		},

		carousel: function () {
			$('.thim-sc-block5').each(function () {

				var items = $(this).attr('data-items'),
					rtlval = false;

				if ($('body').hasClass('rtl')) {
					var rtlval = true;
				}

				$(this).find('.owl-carousel').owlCarousel({
					rtl  : rtlval,
					dots : true,
					items: 1,
					responsive  : {
						0   : {
							items: 1,
							nav  : false
						},
						481 : {
							items: 2,
							margin: 15,
						},
						769: {
							items: 1,
						},
					}
				});
			});
		},

		/**
		 * Filter by category
		 */
		nav_filter: function () {
			var $sc = $('.thim-sc-block5');

			$sc.on('click', '.nav-filter a', function () {

				$sc = $(this).parents('.thim-sc-block5');

				var current_cat = $sc.find('.nav-filter .cat-item.current a').attr('data-cat'),
					current_down = $sc.find('.cat-dropdown');

				$sc.find('.nav-filter .cat-item').removeClass('current');

				$(this).parents('li').addClass('current');

				if (current_down.find('.pulldown-list .cat-item').hasClass('current')) {
					current_down.find('.cat-more').addClass('current');
				} else {
					current_down.find('.cat-more').removeClass('current');
				}

				var params = $sc.attr('data-params'),
					category = $(this).attr('data-cat'),
					sc_id = $sc.attr('id');

				var data = {
					action  : 'thim_sc_block5',
					category: category,
					params  : params
				};

				thim_sc_block5.data[sc_id + current_cat] = $sc.find('.loop-wrapper').html();

				$sc.find('.sc-loop').removeClass('fadeIn');

				if (thim_sc_block5.data[sc_id + category]) {
					setTimeout(function () {
						$sc.find('.loop-wrapper').html(thim_sc_block5.data[sc_id + category]);
						$sc.find('.sc-loop').addClass('fadeIn');
					}, 300);
				} else {
					$.ajax({
						type      : "POST",
						url       : ajaxurl,
						data      : data,
						beforeSend: function () {
							$sc.addClass('loading');
						},

						success: function (res) {
							if (res.success) {
								$sc.find('.loop-wrapper').html(res.data);
								$sc.find('.sc-loop').addClass('fadeIn');
							}
							$sc.removeClass('loading');
							

							$(document).on('click', '.thim-list-share', function () {
								$(this).find('.social-links').slideToggle(300);
							});

							$(document).on('click', '.thim-list-share', function (e) {
								e.stopPropagation();
								$(this).find('.share-title').toggleClass('open');
							});

						}
					});
				}

			});

			var filter_value = thim_sc_block5.nav_filter_value();
			$(window).resize(function () {
				thim_sc_block5.nav_filter_resize(filter_value);
			});

		},

		/**
		 * Responsive filter
		 */
		nav_filter_value: function () {
			var $sc = $('.thim-sc-block5');

			var $filter = $sc.find('.nav-filter');
			var filter_value = [];
			$filter.each(function (index, element) {
				var list = $(this).find('.cat-list').html();
				var pulldown = $(this).find('.pulldown-list').html();
				var filter = {
					'list'    : list,
					'pulldown': pulldown
				}
				filter_value.push(filter);
			});

			return filter_value;
		},

		/**
		 * Resize windown
		 * @param filter_value
		 */
		nav_filter_resize: function (filter_value) {
			var $sc = $('.thim-sc-block5');
			var windowW = $(window).width();

			var $filter = $sc.find('.nav-filter');

			$filter.each(function (index, element) {
				if (windowW <= 768) {
					$(this).find('.pulldown-list').html(filter_value[index].list + filter_value[index].pulldown);
					$(this).find('.cat-list').empty();
				} else {
					$(this).find('.pulldown-list').html(filter_value[index].pulldown);
					$(this).find('.cat-list').html(filter_value[index].list);
				}
			});
		},
	};

})(jQuery);
