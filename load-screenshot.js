$(window).ready(function() {
  var photo_id = '5644398032';
  var url = "http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=e59b6a956fe1cdf4dad125cb3c1c1321&photo_id=" + photo_id + "&format=json&nojsoncallback=1";
  jQuery.getJSON(url, function(obj) {
    var photo = obj.photo;
    var photoURL = "http://farm" + photo.farm + ".static.flickr.com/" +
                   photo.server + "/" + photo.id + "_" + photo.secret + 
                   "_b.jpg";
    var title = photo.title._content;
    var desc = photo.description._content.replace(/\n/g, '<br>');
    var flickrURL = photo.urls.url[0]._content;
    $("div#header h1.title").text(title);
    $("div#body .description").html(desc);
    $("a#flickr_link").attr("href", flickrURL);
    $("img#screenshot").attr("src", photoURL).load(function() {
      $("#container").fadeIn();
    });
  });
});
