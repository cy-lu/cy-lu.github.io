(function ($) {
	"use strict";

	$(document).ready(function () {
		thim_comment_vote.ready();
	});

	var thim_comment_vote = window.$thim_comment_vote = {

		ready: function () {
			this.ajax_vote();
		},

		ajax_vote: function () {
			$('.thim-comment-vote').each(function (index, element) {
				$(element).on('click', '.vote', function () {
					var $this = $(this);
					if (!$this.hasClass('processing')) {
						$this.addClass('processing');
						$.ajax({
							type   : 'POST',
							url    : comment_vote.ajaxurl,
							data   : {
								action    : 'comment_vote_ajaxhandler',
								comment_id: $(this).parent().attr('data-id'),
								vote      : $(this).attr('data-vote'),
							},
							success: function (response) {
								$this.removeClass('processing');
								if (response.success) {
									$('.thim-comment-vote-stats[data-commentid=' + response.data.comment_id + '] .up .number').html(response.data.vote_count_up);
									$('.thim-comment-vote-stats[data-commentid=' + response.data.comment_id + '] .down .number').html(response.data.vote_count_down);
								}
							}
						});
					} else {
						console.log('processing');
					}
				});
			});
		},
	}

})(jQuery);