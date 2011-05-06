function photoIDtoShortURL(id) {
  function intval (mixed_var, base) {
      // http://kevin.vanzonneveld.net
      // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: stensi
      // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   input by: Matteo
      // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
      // *     example 1: intval('Kevin van Zonneveld');
      // *     returns 1: 0
      // *     example 2: intval(4.2);
      // *     returns 2: 4
      // *     example 3: intval(42, 8);
      // *     returns 3: 42
      // *     example 4: intval('09');
      // *     returns 4: 9
      // *     example 5: intval('1e', 16);
      // *     returns 5: 30

      var tmp;

      var type = typeof( mixed_var );

      if (type === 'boolean') {
          return (mixed_var) ? 1 : 0;
      } else if (type === 'string') {
          tmp = parseInt(mixed_var, base || 10);
          return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
      } else if (type === 'number' && isFinite(mixed_var) ) {
          return Math.floor(mixed_var);
      } else {
          return 0;
      }
  }

  function base_encode(num, alphabet) {
  	// http://tylersticka.com/
  	// Based on the Flickr PHP snippet:
  	// http://www.flickr.com/groups/api/discuss/72157616713786392/
  	alphabet = alphabet || '123456789abcdefghijkmnopqrstuvwxyz' +
  	                       'ABCDEFGHJKLMNPQRSTUVWXYZ';
  	var base_count = alphabet.length;
  	var encoded = '';
  	while (num >= base_count) {
  		var div = num/base_count;
  		var mod = (num-(base_count*intval(div)));
  		encoded = alphabet.charAt(mod) + encoded;
  		num = intval(div);
  	}
  	if (num) encoded = alphabet.charAt(num) + encoded;
  	return encoded;
  }

  return 'http://flic.kr/p/' + base_encode(id);
};

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return null;
}

$(window).ready(function() {
  var photo_id = getQueryVariable("photo_id");
  if (!photo_id) {
    $("form").submit(function() {
      var re = /http:\/\/www.flickr.com\/photos\/.*\/([0-9]*)/;
      var match = $("input#url").val().match(re);
      if (match) {
        window.location = window.location.href + "?photo_id=" + match[1];
      } else {
        alert("I don't recognize that as a valid Flickr URL.");
      }
      return false;
    });
    $("form").fadeIn();
    return;
  }
  var url = "http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=e59b6a956fe1cdf4dad125cb3c1c1321&photo_id=" + photo_id + "&format=json&nojsoncallback=1";
  jQuery.getJSON(url, function(obj) {
    var photo = obj.photo;
    var photoURL = "http://farm" + photo.farm + ".static.flickr.com/" +
                   photo.server + "/" + photo.id + "_" + photo.secret + 
                   "_b.jpg";
    var title = photo.title._content;
    var desc = photo.description._content.replace(/\n/g, '<br>');
    var flickrURL = photo.urls.url[0]._content;
    var shortURL = photoIDtoShortURL(photo_id);
    $("div#header h1.title").text(title);
    $("div#body .description").html(desc);
    $("a#flickr_link").attr("href", flickrURL);
    $("a#shorturl").attr("href", shortURL).text(shortURL.slice(7));
    $("img#screenshot").attr("src", photoURL).load(function() {
      $("#container").fadeIn();
    });
  });
});
