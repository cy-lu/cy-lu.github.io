(function (id) {
    function append(scriptid, url, async) {
        var d = document, sn = 'script', f = d.getElementsByTagName(sn)[0];
        if (!f) f = d.head;
        var s = d.createElement(sn);
        s.async = true;
        s.id = scriptid;
        s.src = url;
        f.parentNode.insertBefore(s, f);
    }

    function getRootDomain() {
        var parts = window.location.hostname.split('.');
        if (parts.length === 2) rootDomain = parts[0];
        else if (parts.length > 2) {
          // see if the next to last value is a common tld
          var part = parts[parts.length - 2];
          if (part === 'com' || part === 'co') {
            rootDomain = parts[parts.length - 3]; // go back one more
          }
          else {
            rootDomain = part;
          }
        }

      return rootDomain;
    }

    window.evidon = {};
    window.evidon.id = id;
    var cdn = '//c.evidon.com/', rootDomain = getRootDomain(), noticecdn = cdn + 'sitenotice/';
    append('evidon-notice', noticecdn + 'evidon-sitenotice-tag.js', false);
    append('evidon-location', cdn + 'geo/country.js', true);
    append('evidon-themes', noticecdn + id + '/snthemes.js', true);
    if (rootDomain) append('evidon-settings', noticecdn + id + '/' + rootDomain + '/settings.js', true);

    window.evidon.priorConsentCallback = function () {
        // add the tags which need to wait for prior consent
        // here.  This should be all your advertising tags and
        // probably most of your social and tracking tags.
    }

    window.evidon.closeCallback = function () {
        // this is executed if the user closed a UI element without either Accepting (providing consent)
        // or Declining (declining to provide consent).
    }

    window.evidon.consentWithdrawnCallback = function () {
        // this is exeucted if the user withdraws consent and elects to
        // no longer allow technologies to run on the site.
    }

    window.evidon.consentDeclinedCallback = function () {
        // this is executed if the user explicitly declines giving consent by
        // using a Decline button
    }
})(5406);