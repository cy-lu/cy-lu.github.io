(function ($) {
	"use strict";

	$.extend($.lazyLoadXT, {
		edgeY: 600,
	});

	$.lazyLoadXT.onload.addClass = 'lazy-loaded fadeIn';

	$(window).on('ajaxComplete', function () {
		setTimeout(function () {
			$('.lazy-hidden').lazyLoadXT();
		}, 50);
	});

	$(document).ready(function () {
		thim_magazette.ready();
	});

	$(window).load(function () {
		thim_magazette.load();
	});

	var thim_magazette = window.thim_magazette = {

		data: {},

		/**
		 * Call functions when document ready
		 */
		ready: function () {
			this.header_menu_mobile();
			this.back_to_top();
			this.feature_preloading();
			this.contactform7();
			this.article_infinity();
			this.article_load_comment();
			this.social_share();
			this.search_box();
			this.ajax_search();
			this.search_trending_keys();
			this.blog_layout_grid();
			this.disqus_comments();
			this.home_masonry();
			this.related_video_carousel();
			this.rtl_support();
			this.comingsoon();
			this.post_gallery();
			this.blog_masonry_loadmore();
			this.sticky_sidebar();
			this.check_number_contact();

			//sportpress
			this.page_scores();

			//lazyload
			this.lazyload();
		},

		/**
		 * Call functions when window load.
		 */
		load: function () {
			this.header_menu();
			this.parallax();
			this.sc_layout_masonry();
			this.carousel();
			this.single_photoswipe();
			this.related_post_popup();
			this.home_masonry();
			this.blog_layout_masonry();
			this.vc_rtl();
		},

		// CUSTOM FUNCTION IN BELOW

		carousel: function () {
			if (jQuery().owlCarousel) {
				$('.thim-carousel-wrapper').each(function () {
					var item_visible = $(this).data('visible') ? parseInt($(this).data('visible')) : 6,
						item_desktopsmall = $(this).data('desktopsmall') ? parseInt($(this).data('desktopsmall')) : 5,
						itemsTablet = $(this).data('itemtablet') ? parseInt($(this).data('itemtablet')) : 4,
						itemsMobile = $(this).data('itemmobile') ? parseInt($(this).data('itemmobile')) : 1,
						autoPlay = $(this).data('autoplay') ? parseInt($(this).data('autoplay')) : true;

					$(this).owlCarousel({
						nav       : true,
						dots      : false,
						autoplay  : autoPlay,
						navText   : [
							"<i class=\'fa fa-caret-left \'></i>",
							"<i class=\'fa fa-caret-right \'></i>"
						],
						responsive: {
							480 : {
								items: itemsMobile
							},
							768 : {
								items: itemsTablet
							},
							1024: {
								items: item_desktopsmall
							},
							1200: {
								items: item_visible
							}
						}
					})
					;
				});
			}
		},

		header_menu_mobile: function () {

			$(document).on('click', '.menu-mobile-effect', function (e) {
				e.preventDefault();
				$('.responsive').toggleClass('mobile-menu-open');
			});

			$(document).on('click', '.menu-mobile-effect-close', function () {
				$('.responsive').removeClass('mobile-menu-open');
			});

			$(document).on('click', '.mobile-menu-open .content-pusher', function (event) {
				event.preventDefault();
				$('.responsive').removeClass('mobile-menu-open');
			});

			$('header li.menu-item-has-children >a, header li.tc-menu-layout-builder >a, header li.menu-item-has-children >span').after('<span class="icon-toggle"><i class="fa fa-caret-down"></i></span>');

			$('.mobile-menu-container .navbar-nav>li.menu-item-has-children >a,.mobile-menu-container .mega-menu>li.menu-item-has-children >a, .mobile-menu-container .tc-menu-layout-column > a').after('<span class="icon-toggle"><i class="fa fa-caret-down"></i></span>');

			$('.mobile-menu-container .navbar-nav>li.menu-item-has-children > a,.mobile-menu-container .mega-menu>li.menu-item-has-children > a, .mobile-menu-container .tc-menu-layout-column > a').on('click', function (event) {
				var href = $(this).attr('href');

				if ($(window).width() <= 768) {
					event.preventDefault();
				} else {
					if (href === '#') {
						event.preventDefault();
					}
				}

				var $this = $(this).parent();

				if ($this.find('> ul.sub-menu,> .tc-megamenu-holder').is(':hidden')) {
					$this.find('> ul.sub-menu,> .tc-megamenu-holder').slideDown(200, 'linear');
					$this.find('.icon-toggle').html('<i class="fa fa-caret-up"></i>');
				} else {
					$this.find('> ul.sub-menu,> .tc-megamenu-holder').slideUp(200, 'linear');
					$this.find('.icon-toggle').html('<i class="fa fa-caret-down"></i>');
				}

			});

			$('#masthead').removeClass('no-js').addClass('js-active');
		},

		header_menu: function () {
			var $header = $('.sticky-header .navigation'),
				off_Top = ( $('.content-pusher').length > 0 ) ? $('.content-pusher').offset().top : 0,
				menuH = $header.outerHeight(),
				latestScroll = 0,
				$topbar = $('#thim-header-topbar'),
				$topbarf = $('#thim-header-topbar-featured'),
				$topbarfH = $('#thim-header-topbar-featured').outerHeight(),
				$main = $('#main-content'),
				$header_main = $('.header-main'),
				$masthead = $('#masthead:not(.header_v4,.header_v5)'),
				$mastheadH = $masthead.outerHeight(),
				target_top = 0;
			if ($header.length) {
				if ($('#masthead').hasClass('header_v3')) {
					$('.inner-header-main').css({
						'padding-top': menuH,
					});
				} else {
					$main.css({
						'padding-top': menuH,
					});
				}


				$header.addClass('menu-show');

				if ($topbar.length) {
					target_top += $topbar.outerHeight();
				}
				if ($topbarf.length) {
					target_top += $topbarf.outerHeight();
				}
			}


			if ($('#masthead').hasClass('header_v3')) {
				if ($(window).width() <= 768) {
					target_top += off_Top;
				} else {
					target_top += 0;
				}
			} else if ($header_main.length) {
				if ($(window).width() <= 768) {
					target_top += off_Top;
				} else {
					target_top += $header_main.outerHeight();
				}
			}

			if ($(window).width() <= 768) {
				$('html').addClass('thim');
				$(document).bind('touchmove', function (e) {
					if ($('body').hasClass('thim-active-search')) {
						e.preventDefault();
					}
				});

				if ($masthead.length) {
					if ($('#masthead').hasClass('header_v3')) {
						$('.inner-header-main').css({
							'padding-top': 0,
						});
						$main.css({
							'padding-top': $mastheadH,
						});
					} else {
						$main.css({
							'padding-top': $mastheadH,
						});
					}
					$masthead.addClass('menu-show');
				}
			}

			$(window).scroll(function () {

				var current = $(this).scrollTop(),
					$wrapper = $('body.single'),
					maxWpadmin = 0,
					maxHeight = 0;

				if (current > latestScroll) {
					//scroll down
					if ($('.sticky-sidebar,.like-sidebar').length && current < $('.sticky-sidebar,.like-sidebar').offset().top - menuH) {
						$('.theiaStickySidebar').css({
							'margin-top': '0px'
						});
					}
					$header.css({
						top: target_top,
					});

					if ($(window).width() <= 600) {
						$masthead.css({
							top: 0,
						});
					} else if ($(window).width() <= 768) {
						$masthead.css({
							top: target_top,
						});
					}


					if (current > target_top + menuH) {
						$header.removeClass('affix-top').addClass('affix').removeClass('menu-show').addClass('menu-hidden');
						$header.css({
							top: off_Top,
						});
						$wrapper.each(function () {
							if (maxHeight < $(this).find('.navigation.affix').height()) {
								maxHeight = $(this).find('.navigation.affix').height();
							}
						});
						if (maxHeight > 0 && $(window).width() > 768) {
							$wrapper.each(function () {
								if ($("#wpadminbar").length) {
									maxWpadmin = $("#wpadminbar").height();
								}
								var mobile_top = $header.height() + maxWpadmin;
								$(this).find('.mobile-menu-container').css('top', mobile_top);

							});
						}
						if ($(window).width() <= 600) {
							$masthead.css({
								top: 0,
							});
						} else if ($(window).width() <= 768) {
							$masthead.css({
								top: off_Top,
							});
						}
					} else {
						$header.addClass('no-transition');
					}

				} else {
					// scroll up
					if (current <= target_top) {
						$header.removeClass('affix').addClass('affix-top').addClass('no-transition');
						$header.css({
							top: target_top,
						});
					} else {
						$header.removeClass('no-transition');
						$('body').removeClass('mobile-menu-open');
						$header.css({
							top: off_Top,
						});
					}

					$header.removeClass('menu-hidden').addClass('menu-show');

					if ($(window).width() <= 600) {
						if (current <= target_top) {
							$masthead.css({
								top: off_Top,
							});
						} else {
							$masthead.css({
								top: 0,
							});
						}
					} else if ($(window).width() <= 768) {
						if (current <= target_top) {
							$masthead.css({
								top: target_top,
							});
						} else {
							$masthead.css({
								top: off_Top,
							});
						}
					}
					if ($header) {
						if ($('.sticky-sidebar,.like-sidebar').length && current >= $('.sticky-sidebar,.like-sidebar').offset().top) {
							$('.theiaStickySidebar,.like-sidebar').css({
								'margin-top': $(".sticky-sidebar,.like-sidebar").outerHeight() + 'px'
							});

						} else if ($('.sticky-sidebar,.like-sidebar').length && current < $('.sticky-sidebar,.like-sidebar').offset().top - menuH) {
							$('.theiaStickySidebar,.like-sidebar').css({
								'margin-top': '0px'
							});
						}
					}
				}

				latestScroll = current;
			});

			$('body:not(.mobile-menu-open) .site-header .navbar >li, body:not(.mobile-menu-open) .site-header .navbar li,.site-header .navbar li ul li').on({
				'mouseenter': function () {
					var $parent = $(this).parents('.tc-megamenu-wrapper');
					if ($parent.length > 0) {

					} else {
						$(this).children('.sub-menu').stop(true, false).fadeIn(250);
					}
				},
				'mouseleave': function () {
					var $parent = $(this).parents('.tc-megamenu-wrapper');
					if ($parent.length > 0) {

					} else {
						$(this).children('.sub-menu').stop(true, false).fadeOut(250);
					}
				}
			});


		},

		/**
		 * Back to top.
		 */
		back_to_top: function () {
			var $element = $('#back-to-top');
			$(window).scroll(function () {
				if ($(this).scrollTop() > 100) {
					$element.addClass('scrolldown').removeClass('scrollup');
				} else {
					$element.addClass('scrollup').removeClass('scrolldown');
				}
			});

			$element.on('click', function () {
				$('html,body').animate({scrollTop: '0px'}, 800);
				return false;
			});
		},


		/**
		 * Sticky sidebar
		 */
		sticky_sidebar: function (parent) {
			var parent = parent ? parent : 'body';

			var offsetTop = 30;

			if ($(window).width() < 1025) {
				return false;
			}

			if ($("#wpadminbar").length) {
				offsetTop += $("#wpadminbar").outerHeight();
			}
			if ($("#masthead.sticky-header").length) {
				offsetTop += $("#masthead.sticky-header .navigation").outerHeight();
			}

			$(parent).find(".sticky-sidebar,.like-sidebar").theiaStickySidebar({
				"containerSelector"     : "",
				"additionalMarginTop"   : offsetTop,
				"additionalMarginBottom": "0",
				"updateSidebarHeight"   : false,
				"minWidth"              : "768",
				"sidebarBehavior"       : "modern"
			});
		},

		check_number_contact: function () {
			$("input[type='number']").keydown(function (event) {
				if (event.which == 69 || event.which == 190) {
					return false;
				} else {
					return true;
				}
			});
		},


		/**
		 * Effect parallax.
		 */
		parallax: function () {
			$(window).stellar({
				horizontalOffset: 0,
				verticalOffset  : 0
			});
		},

		/**
		 * Feature: Preloading
		 */
		feature_preloading: function () {
			var $preload = $('#thim-preloading');
			if ($preload.length > 0) {
				$preload.fadeOut(1000, function () {
					$preload.remove();
				});
			}
		},

		/**
		 * Post gallery
		 */
		post_gallery: function () {
			// The slider being synced must be initialized first
			$('#single-carousel').flexslider({
				animation    : "slide",
				controlNav   : false,
				animationLoop: false,
				slideshow    : false,
				itemWidth    : 232,
				itemMargin   : 5,
				asNavFor     : '#single-slider'
			});

			$('#single-slider').flexslider({
				animation    : "slide",
				controlNav   : false,
				animationLoop: false,
				slideshow    : false,
				sync         : "#single-carousel"
			});

			$('#post-gallery .slides').owlCarousel({
				loop         : true,
				nav          : true,
				dots         : true,
				autoplay     : false,
				autoPlaySpeed: 5000,
				margin       : 0,
				items        : 1,
				navText      : [
					"<i class=\'ion-ios-arrow-left\'></i>",
					"<i class=\'ion-ios-arrow-right\'></i>"
				],

			});
		},

		/**
		 * Custom effect and UX for contact form.
		 */
		contactform7: function () {
			$(".wpcf7-submit").on('click', function () {
				$(this).css("opacity", 0.2);
				$(this).parents('.wpcf7-form').addClass('processing');
				$('input:not([type=submit]), textarea').attr('style', '');
			});

			$(document).on('spam.wpcf7', function () {
				$(".wpcf7-submit").css("opacity", 1);
				$('.wpcf7-form').removeClass('processing');
			});


			$(document).on('invalid.wpcf7', function () {
				$(".wpcf7-submit").css("opacity", 1);
				$('.wpcf7-form').removeClass('processing');
			});

			$(document).on('mailsent.wpcf7', function () {
				$(".wpcf7-submit").css("opacity", 1);
				$('.wpcf7-form').removeClass('processing');
			});

			$(document).on('mailfailed.wpcf7', function () {
				$(".wpcf7-submit").css("opacity", 1);
				$('.wpcf7-form').removeClass('processing');
			});

			$('body').on('click', 'input:not([type=submit]).wpcf7-not-valid, textarea.wpcf7-not-valid', function () {
				$(this).removeClass('wpcf7-not-valid');
			});
		},


		/**
		 * Blog layout grid
		 */
		blog_layout_grid: function () {

			var $blog = $('.blog .grid-layout article:not(.masonry), .archive .grid-layout article:not(.masonry)'),
				max_height_content = 0;

			// Get max height content of all items.
			$blog.each(function () {
				if (max_height_content < $(this).find('.entry-content').height()) {
					max_height_content = $(this).find('.entry-content').height();
				}
			});

			// Set height content for all items.
			if (max_height_content > 0) {
				$blog.each(function () {
					$(this).find('.entry-content').css('height', max_height_content);
				});

			}

		},

		/**
		 * Blog layout masonry
		 */
		sc_layout_masonry: function () {
			$(".thim-sc-masonry-posts").isotope({
				itemSelector   : '.type-post',
				percentPosition: true,
				masonry        : {
					columnWidth: '.type-post',
					fitWidth   : true
				}
			});
		},

		/**
		 * Blog layout masonry
		 */
		blog_layout_masonry: function () {
			$(".masonry-layout").imagesLoaded(function () {
				$(".masonry-layout").isotope({
					itemSelector   : '.masonry',
					percentPosition: true,
					masonry        : {
						columnWidth: '.masonry',
						fitWidth   : true,
					}
				});
			});
			$(".blog-travel").imagesLoaded(function () {
				$(".blog-travel").isotope({
					itemSelector   : '.masonry',
					percentPosition: true,
					masonry        : {
						columnWidth: '.masonry-small',
						fitWidth   : true,
					}
				});
			});
		},

		/**
		 * Blog layout masonry
		 */
		blog_masonry_loadmore: function () {

			var $shortcodes = $('.masonry-layout');
			$('.masonry-loadmore').on('click', function (event) {
				event.preventDefault();

				var $count = $('.masonry-layout .masonry').length;
				var button = $(this),
					data = {
						'action': 'thim_masonry_loadmore',
						'query' : thim_loadmore_params.posts, // that's how we get params from wp_localize_script() function
						'page'  : thim_loadmore_params.current_page,
						'offset': $count,
					};
				$.ajax({
					url       : thim_loadmore_params.ajaxurl, // AJAX handler
					data      : data,
					type      : 'POST',
					beforeSend: function (xhr) {
						button.addClass('loading');
					},
					success   : function (res) {
						if (res.success) {
							$shortcodes.append(res.data);
							thim_loadmore_params.current_page++;

							if (thim_loadmore_params.current_page == thim_loadmore_params.max_page) {
								// if last page, remove the button
								button.addClass('last-page');
							}

						} else {
							// if no data, remove the button as well
							button.addClass('no-data');
						}
						button.removeClass('loading');


						setTimeout(function () {
							$(".masonry-layout").imagesLoaded(function () {
								$(".masonry-layout").isotope('reloadItems').isotope({sortBy: 'original-order'});
							});
						}, 150);
					}
				});
			});
		},

		/**
		 * RTL
		 */
		rtl_support: function () {

			setTimeout(function () {
				$(window).trigger('resize');
			}, 150);

			$(window).resize(function () {
				var $rtl = $('body.class-rtl #wrapper-container ');
				var get_padding1 = $rtl.find('.vc_row-has-fill').css('left');
				var get_padding2 = $rtl.find('.vc_row-no-padding').css('left');

				if (get_padding1 != null) {
					var right = 0 - parseInt(get_padding1.replace('px', '')) + 15;
					$rtl.find('.vc_row-has-fill').css('right', get_padding1);
				}
				if (get_padding2 != null) {
					$rtl.find('.vc_row-no-padding').css('right', get_padding2);
				}

			});
		},

		/**
		 * Search widget
		 */
		search_box: function () {
			$('#masthead .thim-search-box').on('click', '.toggle-form', function (e) {
				e.preventDefault();
				$('body').toggleClass('thim-active-search');
				var $search = $(this).parent();
				$search.find('.search-default').slideDown();
				$search.find('.search-found').slideUp();
				setTimeout(function () {
					$search.find('.search-field').focus().val('');
				}, 400);
			});

			$(window).scroll(function () {
				if ($(window).width() > 768) {
					if ($('body').hasClass('thim-active-search')) {
						$('body').removeClass('thim-active-search');
						var $search = $('#masthead .thim-search-box');
						$search.each(function (index, form) {
							$(form).find('.search-default').slideDown();
							$(form).find('.search-found').slideUp();
						});
					}
				}
			});

			$('#main-content').on('click', function () {
				if ($('body').hasClass('thim-active-search')) {
					$('body').removeClass('thim-active-search');
					var $search = $('#masthead .thim-search-box');
					$search.each(function (index, form) {
						$(form).find('.search-default').slideDown();
						$(form).find('.search-found').slideUp();
					});
				}
			});

			//disable enter submit form
			$('#masthead .thim-search-box form').on('keyup keypress', function (e) {
				var keyCode = e.keyCode || e.which;

				if (keyCode === 13) {
					//e.preventDefault();
					//return false;
				} else if (keyCode === 27) {
					if ($('body').hasClass('thim-active-search')) {
						$('body').removeClass('thim-active-search');
					}
				}

			});

			//disable click submit form
			$('#masthead .thim-search-box form').on('click', 'button[type=submit]', function (e) {
				//e.preventDefault();
				//return false;
			});

		},

		/**
		 * Click to trending keys
		 * @author Khoapq
		 */
		search_trending_keys: function () {
			$('.thim-search-box').on('click', '.keys a', function (event) {
				event.preventDefault();

				var $searchbox = $(this).parents('.thim-search-box'),
					key = $(this).text();

				$searchbox.find('input[name=s]').val(key).trigger('keyup');

			});
		},

		/**
		 * Article Infinity
		 */
		article_infinity: function () {
			if ($('#masthead .sticky-title').length) {
				var $header = $('#masthead'),
					current_title = $('.page-content article.active .article_info').data('title'),
					sticky_title = $('#masthead .sticky-title'),
					win = $(window),
					winH = win.height(),
					load_more = true,
					old_step = 0,
					lastest_scroll = 0,
					step = 30,
					headerH = $header.height();


				var sticky_advanced = false;
				if ($('body').hasClass('sticky-advanced')) {
					sticky_advanced = true;
				}

				if (sticky_advanced) {
					$('body.single-post #masthead .navigation').append('<div class="article-percent"><span class="value"></span></div>');
					sticky_title.html(current_title);
				}

				win.scroll(function () {
					var winTop = win.scrollTop(),
						elem = $('.page-content article.active'),
						elemH = elem.innerHeight(),
						elemTop = 0;

					if (elem.length) {
						elemTop = elem.offset().top;
					}

					var elemVisible = ( winH + winTop - elemTop > 0 && winTop > elemTop - headerH) ? winTop + headerH - elemTop : 0,
						percent = Math.round(elemVisible * 100 / elemH),
						nav = elem.find('.infinity-next-post'),
						nav_url = nav.attr('data-url');

					if (sticky_advanced) {
						$('.article-percent .value').css('width', percent + '%');
					}

					//Scroll up event
					if (winTop < old_step - step) {

						if (percent < 5) {
							var prev_item = elem.prev();
							if (prev_item.length > 0) {
								var prev_url = $(prev_item).find('.article_info').data('url'),
									prev_title = $(prev_item).find('.article_info').data('title');

								elem.removeClass('active');
								prev_item.addClass('active');

								if (sticky_advanced) {
									sticky_title.html(prev_title);
								}

								window.history.pushState(null, prev_title, prev_url);
								document.title = prev_title;

								// infinity scroll tracking google analytics
								if (typeof ga != 'undefined') {
									ga('send', 'pageview', location.pathname);
								}
								$(document).trigger('thim_article_infinity_scroll_up', [prev_item]);
							}
						}

						old_step = winTop;
					}

					//Scroll down event


					if (winTop > old_step + step) {

						thim_magazette.line_after_title();

						if (!elem.hasClass('loaded')) {
							if (winTop > elemTop && load_more === true && $('.page-content.infinity').length) {
								// Read post 1, load post 2
								if (nav_url && nav_url !== '') {
									load_more = false;
									$.ajax({
										url       : nav_url,
										dataType  : "html",
										beforeSend: function () {
											$('body').addClass('loadmore');
										},
										success   : function (data) {
											$('body').removeClass('loadmore');
											var article_html = $(data).find('article.active').removeClass('active');
											if (article_html.length > 0) {
												$('.page-content.infinity').append(article_html);
												thim_magazette.DOM_refresh();

											}
											elem.addClass('loaded');
											load_more = true;
										},

										error: function () {

										}
									});
								}
							}
						} else {
							if (percent > 95) {
								var next_item = elem.next();
								if (next_item.length > 0) {
									var next_url = $(next_item).find('.article_info').data('url'),
										next_title = $(next_item).find('.article_info').data('title');

									elem.removeClass('active');
									next_item.addClass('active');

									if (sticky_advanced) {
										sticky_title.html(next_title);
									}

									window.history.pushState(null, next_title, next_url);
									document.title = next_title;

									// infinity scroll tracking google analytics
									if (typeof ga != 'undefined') {
										ga('send', 'pageview', location.pathname);
									}

									$(document).trigger('thim_article_infinity_scroll_down', [next_item]);
								}
							}
						}

						old_step = winTop;
					}
					lastest_scroll = winTop;

				});
			}
		},

		/**
		 * Refresh DOM after append
		 */
		DOM_refresh: function () {
			this.sticky_sidebar('article:last-child');
			this.single_photoswipe();
			this.support_adrotate_group();
			if ($('.kk-star-ratings').length) {
				$('.kk-star-ratings').kkstarratings();
			}
		},


		/**
		 * Load all comment
		 */
		article_load_comment: function () {
			$(document).on('click', '#comments .load-all', function () {
				var $comments = $(this).parent();
				if ($comments.hasClass('active')) {
					$(this).text($(this).attr('data-open'));
				} else {
					$(this).text($(this).attr('data-close'));
				}

				$comments.toggleClass('active');
				$(this).prev().slideToggle('slow');
			});
		},

		/**
		 * Popup when click on share social icon.
		 */
		social_share: function () {
			$(document).on('click', '.thim-social-share.popup a', function (event) {
				event.preventDefault();
				var shareurl = $(this).attr('href');
				if ($(this).hasClass('comments')) {
					var $article = $(this).parents('article'),
						$comment = $article.find('#comments, .disqus-comment'),
						commentTop = $comment.offset().top;

					$('html, body').animate({
						scrollTop: commentTop - 100
					}, 'slow', function () {
						if (!$comment.find('.inner-comments').is(':visible')) {
							$comment.find('.load-all, #dcl_comment_btn').trigger('click');
						}
					});

				} else if ($(this).hasClass('more-icon')) {
					$(this).parents('.thim-social-share').toggleClass('open');
				} else if ($(this).hasClass('no-popup')) {
					//nothing
				} else {
					var top = (screen.availHeight - 500) / 2;
					var left = (screen.availWidth - 500) / 2;
					var popup = window.open(shareurl, 'social sharing', 'width=650,height=520,left=' + left + ',top=' + top + ',location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1');
					return false;
				}
			});

			$(document).on('click', '.thim-list-share .share-title', function (event) {
				event.stopPropagation();
				$(this).parents('.thim-list-share').toggleClass('open');
			});

			$('.thim-social-share').on({
				'mouseenter': function () {
					//nothing
				},
				'mouseleave': function () {
					$(this).removeClass('open');
				}
			});

			$('.thim-list-share .social-links').on({
				'mouseenter': function () {
					//nothing
				},
				'mouseleave': function () {
					$(this).parent().removeClass('open');
				}
			});

		},

		/**
		 * Ajax search
		 * Author: Khoapq
		 */
		ajax_search: function () {
			var timer;
			var template = wp.template('thim-search-results');

			$("#masthead .thim-search-box input[name=s], .error-404 .thim-search-box input[name=s]").keyup(function () {
				var $parent = $(this).parents('.thim-search-box');
				clearTimeout(timer);
				var ms = 500;
				var s = $(this).val();

				timer = setTimeout(function () {
					if (s.length) {
						var data = {
							action: 'thim_search',
							s     : s
						};
						$.ajax({
							type      : "POST",
							url       : ajaxurl,
							data      : data,
							beforeSend: function () {
								$parent.find('.results .search-default').slideUp();
								$parent.addClass('loadmore');
								$parent.find('.results .search-found').html('').slideDown();
							},
							success   : function (response) {
								$('.search-found').html(template(response.data));
								$parent.removeClass('loadmore');
							}
						});
					}
				}, ms);
			});
		},

		/**
		 * Khoapq
		 *
		 * Home Masonry with sidebar
		 */
		home_masonry: function () {
			var $home_masonry = $(".home-masonry");

			var options = {
				percentPosition: true,
				itemSelector   : '.grid-item',
				masonry        : {
					columnWidth: '.grid-sizer',
				},
				stamp          : '#sidebar-masonry',
			};

			var $grid = $home_masonry.find('> .sc-loop').isotope(options);


			var max_page = $home_masonry.attr('data-max_page'),
				msgText = $home_masonry.attr('data-msgText'),
				finishedMsg = $home_masonry.attr('data-finishedMsg'),
				img = $home_masonry.attr('data-img');

			$(".home-masonry > .sc-loop").infinitescroll(
				{
					nextSelector: ".next.page-numbers",
					navSelector : ".page-numbers",
					itemSelector: '.home-masonry .sc-loop > div',
					dataType    : 'html',
					maxPage     : max_page,
					loading     : {
						msgText    : msgText,
						finishedMsg: finishedMsg,
						img        : img
					}
				},
				// call Isotope as a callback
				function (newElements) {
					$home_masonry.find('> .sc-loop').isotope(
						'appended',
						$(newElements)
					);
					//
					// $(window).lazyLoadXT({
					// 	oncomplete: function () {
					// 		setTimeout(function () {
					// 			$home_masonry.find('> .sc-loop').isotope('layout');
					// 		}, 50);
					// 	}
					// });

					setTimeout(function () {
						$home_masonry.find('> .sc-loop').isotope('layout');
					}, 50);

				}
			);

		},


		/**
		 * Post single gallery popup
		 * @author khoapq
		 */
		single_photoswipe: function () {

			$('.post .the-content').each(function () {
				var $pswp = $('.pswp')[0];
				var image = [];
				var $pic = $(this),
					getItems = function () {
						var items = [];
						$pic.find('figure img').each(function () {

							var $img = $(this);

							var src = $img.attr('src'),
								width = $img.attr('width'),
								height = $img.attr('height');

							var item = {
								src: src,
								w  : width,
								h  : height
							}

							items.push(item);

						});
						return items;
					}

				var items = getItems();

				$.each(items, function (index, value) {
					image[index] = new Image();
					image[index].src = value['src'];
				});

				$pic.on('click', 'figure img', function (event) {

					var $img = $(this);
					if (!$img.parents('figure').hasClass('gallery-item')) {

						event.stopImmediatePropagation();
						event.preventDefault();

						var src = $img.attr('src'),
							width = $img.attr('width'),
							height = $img.attr('height'),
							index = 0;

						var item = {
							src: src,
							w  : width,
							h  : height
						}

						$.each(items, function (i, value) {
							if (value.src == item.src) {
								index = i;
							}
						});

						var options = {
							index          : index,
							showHideOpacity: true,
						}

						var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
						lightBox.init();

						// scroll to position before fullscreen
						var wTop = $(document).scrollTop();
						lightBox.listen('destroy', function () {
							$('html,body').animate({scrollTop: wTop}, 1);
						});

					}

				});

			});
		},

		/**
		 * Feature: Related post popup.
		 */
		related_post_popup: function () {
			var $popup = $('#thim-related-post-popup'),
				openClass = 'popup-open',
				openPoint,
				closePoint,
				scrollTop;

			if (!$popup.length) {
				return;
			}

			// Open popup.
			var popupClose = function ($el) {
				$el.removeClass(openClass);
			};

			// Close popup.
			var popupOpen = function ($el) {
				$el.addClass(openClass);
			};

			// Hide popup button.
			$popup.find('.close').on('click', function (e) {
				e.preventDefault();

				$popup.hide();
			});

			var popupInit = function (post_elem) {
				var popup_post_elem = post_elem.find('.popup-post');

				if (!popup_post_elem.length) {
					return;
				}

				setTimeout(function () {
					$popup.find('.popup-post').remove();
					$popup.find('.popup-content').append(popup_post_elem.clone().show());
				}, 500);

				openPoint = post_elem.offset().top + 600;
				closePoint = post_elem.offset().top + post_elem.height();

				$(window).on('scroll', function () {
					scrollTop = $(window).scrollTop();

					if (scrollTop >= openPoint && scrollTop < closePoint) {
						popupOpen($popup);
					} else {
						popupClose($popup);
					}
				});
			}

			// Init for first article.
			popupInit($('#main-content > .page-content > .post:first-of-type'));

			// When scroll to other post.
			$(document).on('thim_article_infinity_scroll_down', function (e, next_post) {
				popupInit(next_post);
			});

			$(document).on('thim_article_infinity_scroll_up', function (e, prev_post) {
				popupInit(prev_post);
			});
		},

		/**
		 * Disqus comment system
		 * @author khoapq
		 */
		disqus_comments: function () {
			$(document).on('click', '.disqus-comment button', function () {
				var $comments = $(this).parents('.disqus-comment');

				var identifier = $(this).attr('data-identifier'),
					url = $(this).attr('data-url'),
					title = $(this).attr('data-title'),
					disqus_shortname = $comments.attr('data-shortname'),
					lang = $comments.attr('data-lang'),
					form = '<div id="disqus_thread"></div>';

				$('#disqus_thread').remove();

				$(this).fadeOut();
				$('.comments button').show();

				$comments.find('.comment-form').append(form);

				if (typeof DISQUS == 'undefined') {
					var dsq = document.createElement('script');
					dsq.type = 'text/javascript';
					dsq.async = true;
					dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
					(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
					thim_magazette.disqus_reset(identifier, url, title, lang);
				} else {
					thim_magazette.disqus_reset(identifier, url, title, lang);
				}
			});
		},

		/**
		 * Disqus reset
		 * @author khoapq
		 *
		 * @param identifier
		 * @param url
		 * @param title
		 * @param lang
		 */
		disqus_reset: function (identifier, url, title, lang) {
			DISQUS.reset({
				reload: true,
				config: function () {
					this.page.identifier = identifier;
					this.page.url = url;
					this.page.title = title;
					this.language = lang;
				}
			});
		},

		/**
		 * support plugin Adrotate in infinity scroll
		 * @author khoapq
		 */
		support_adrotate_group: function () {
			if (typeof thim_js_adrotate != 'undefined') {
				$.each(thim_js_adrotate, function (index, group) {
					var slider = '.g-' + group.id;
					$(slider).each(function (sl) {
						if ($(sl).find(' > div').attr('style')) {
							//nothing
						} else {
							if (jQuery.fn.gslider) {
								jQuery(sl).gslider({
									groupid: group.id,
									speed  : group.adspeed
								});
							}
						}
					});
				});
			}
		},

		/**
		 *
		 * @param post_id
		 * @param time_start
		 */
		ajax_countviews: function (post_id, time_start) {
			time_start = time_start ? time_start : 5000;

			setTimeout(function () {
				var data = {
					action : 'thim_ajax_countviews',
					post_id: post_id
				};
				$.ajax({
					type   : "POST",
					url    : ajaxurl,
					data   : data,
					success: function (response) {
						//nothing
					}
				});
			}, time_start);

		},


		/**
		 * single video, next/prev video related
		 * @author khoapq
		 */
		related_video_carousel: function () {
			$('.related-videos').each(function () {

				var rtlval = false;
				if ($('body').hasClass('rtl')) {
					rtlval = true;
				}

				$(this).owlCarousel({
					rtl       : rtlval,
					nav       : true,
					dots      : false,
					margin    : 25,
					navText   : [
						"<i class=\'ion-ios-arrow-left \'></i>",
						"<i class=\'ion-ios-arrow-right \'></i>"
					],
					responsive: {
						0   : {
							items: 1
						},
						376 : {
							items: 2
						},
						1024: {
							items: 3
						},
						1200: {
							items: 4
						},
						1400: {
							items: 5
						}
					}
				});
			});
		},

		/**
		 * Page comming soon
		 */
		comingsoon: function () {
			if ($('.page-template-comingsoon').length > 0) {

				$(".thim-countdown .count-down").mbComingsoon({
					expiryDate: new Date($(".thim-countdown").data('date')),
					speed     : 100
				});

				$('.comingsoon-wrapper .background').flexslider({
					slideshow     : true,
					animation     : 'fade',
					animationSpeed: 400,
					controlNav    : true,
					directionNav  : false
				});
			}
		},

		/**
		 * Js for page template: Scores
		 * @author Khoapq
		 */
		page_scores: function () {
			$('.calendar-toggle').on('click', function (e) {
				e.preventDefault();

				$('.filter-calendar').slideToggle();
			});


			$('.filter-competitions').on('change', function () {
				var id = $(this).val();
				var offsetTop = $('#' + id).offset().top;
				$('html,body').animate({scrollTop: offsetTop - 50}, 800, function () {
					$('#' + id).addClass('highlight');
					setTimeout(function () {
						$('#' + id).removeClass('highlight');
					}, 300);
				});
			});


			if ($(".filter-calendar").length) {
				$(".filter-calendar").datepicker({
					defaultDate: $(this).attr('data-default_date'),
					gotoCurrent: true,
					firstDay   : 0,
					onSelect   : function (value, date) {
						var newDate = '?d=' + value;
						window.location.search = newDate;
					}
				});
			}

		},


		/**
		 * RTL supported for row full width
		 * @author Khoapq
		 */
		vc_rtl: function () {
			if ($('html').attr('dir') == 'rtl') {
				$('[data-vc-full-width="true"]').each(function (i, v) {
					$(this).css('right', $(this).css('left')).css('left', 'auto');
				});
			}
		},


		lazyload: function () {
			$('.lazy-hidden').lazyLoadXT();
		},

	};

})(jQuery);