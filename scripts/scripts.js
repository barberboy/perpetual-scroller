/**
 * perpetuity — A perpetual scrolling example.
 * -------------------------------------------
 */
(function(){

// Stream is our image container. We are storing some config data on it.
var stream = $(".album-images").data("perpetuity", {
  "startIndex" : 0,
  "itemsPerPage" : 3
});

// A function to get the next images
var next = function() {
  //console.log("Fetching next!");
  var data = stream.data('perpetuity'),
      start = data.startIndex,
      ipp = data.itemsPerPage,
      tpl = data.template,
      album = data.album,
      images = album.images;


  // This is a little sloppy, but it works.
  for (var i = start, max = start + ipp - 1; (i <= max); i++) {
    if (i >= images.length) {
      //console.log("Empty!");
      window.clearInterval(poll);
      // Bust out o' here!
      return;
    }
    var image = images[i];
    if (image) {
      var html = Mustache.render(tpl, image);
      stream.append($('<li />').append(html));
      data.startIndex = i + 1;
      //console.log(data.startIndex);
      stream.data('perpetuity', data);
    }
  }
};

// Get the album data and the image template file.
$.get("images/images.json", function(data) {
  $.get('templates/image.html', function(tpl){
    //console.log(tpl);
    //console.log(Mustache);
    var config = stream.data('perpetuity');
    config.template = tpl;
    config.album = data;
    stream.data('perpetuity', config);
    next();
  })
  //console.log(r.images);
});

// Check every second to see if we've scrolled close to the bottom.
var poll = window.setInterval(function() {
  var distanceFromBottom = $(document).height() - $(window).scrollTop() - $(window).height();
  if (distanceFromBottom < 500) {
    next();
  }
}, 1000);

})();
