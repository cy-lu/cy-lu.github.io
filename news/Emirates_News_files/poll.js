function initPoll(pollId) {
  jQuery().ready(function() {
        $("#" + pollId).ajaxForm(function(data){
            fadeInResult(pollId, data)
        });
        jQuery("#" + pollId + " :radio").change(function() {
          checkOptionSelected(pollId);
        });
        checkOptionSelected(pollId);
    });
}

submitVote = function(element) {
	popupPollResultWindow('');
	element.form.submit();
	return false;
}

function showResult(pollId, link) {
  jQuery().ready(function() {
    jQuery.get(
      link,
      {showResult: true},
      function(data) {
        fadeInResult(pollId, data);
      },
      "html");
    });
}

function fadeInResult(pollId, data) {
  jQuery("#" + pollId).fadeTo("slow",0, function() {
    jQuery("#" + pollId).html(data);
    jQuery("#" + pollId).fadeTo("slow", 1);
  });
}

function checkOptionSelected(pollId) {
  var submit = jQuery("#" + pollId + " :submit");
  if(jQuery("#" + pollId + " :radio:checked").val()) {
    submit.removeClass("disabled");
    submit.removeAttr("disabled");
  }
  else {
      submit.addClass("disabled");
      submit.attr("disabled", "disabled");
    }
}