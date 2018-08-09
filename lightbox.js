const API_KEY = 'a533c62811bedefecdcb6e47aba7ffe2';

var lightboxPhotos;
var lightboxTitles;

// Find the lightbox overlay
var lightboxContainer = document.getElementById('lightbox-wrapper');

// Find navigation controls
var dismiss = document.getElementById('lightbox-dismiss');
var prev = document.getElementById('lightbox-prev');
var next = document.getElementById('lightbox-next');


function getPhotos(path, callback) {
  var flickrReq = new XMLHttpRequest();
  flickrReq.onreadystatechange = function() {
    if (flickrReq.readyState === 4 && flickrReq.status === 200) {
      var data = JSON.parse(flickrReq.responseText);
      if (callback) callback(data);
      var photos = data['photos'].photo;
      lightboxPhotos = [];
      lightboxTitles = [];
      for(i = 0; i < photos.length; i++) {
        loadThumbnails(photos, i);
        // add each to the array of lightbox images
        loadLightbox(photos, i);
        // after getPhotos() finishes, you can initialize the lightbox
        lightboxInit();
      };
    }
  };
  flickrReq.open('GET', path);
  flickrReq.send();
};

function buildURL(farm, server, id, secret, sizeFlag, title, index) {
  var flickrURL = '<img src="https://farm' + farm +'.staticflickr.com/' + server + '/'+ id + '_' + secret + sizeFlag + '.jpg" alt="'+ title +'" "data-id="' + i + '"/>';
  return flickrURL;
};

function loadThumbnails(data, index){
  var fURL = buildURL(data[index].farm, data[index].server, data[index].id, data[index].secret, '_q', data[index].title, i);
  var thumbNail = '<div class="image-thumbnail"><a href="#" class="thumbnail-target" data-index="'+ i +'" data-user="'+ data[index].owner +'" data-id="' + data[i].id + '"'+ '>'+ fURL +'</a></div>';
  document.getElementById('photogrid').innerHTML += thumbNail;
};

function loadLightbox(data, index){
  // set navigation buttons
  var flickrURL = buildURL(data[index].farm, data[index].server, data[index].id, data[index].secret, '', data[index].title, i);
  var flickrTitle = data[index].title;
  lightboxPhotos.push(flickrURL);
  lightboxTitles.push(flickrTitle);
};

function lightboxInit() {
  var thumbnails = document.getElementsByClassName('thumbnail-target');
  for (var i = 0; i < thumbnails.length; i++) {
    thumbnails[i].addEventListener('click', function(event){
      event.preventDefault();
      lightbox( this.getAttribute("data-index") );
    }, false);
  }
};

function lightbox(image) {
  var theImage = lightboxPhotos[image];
  var theTitle = lightboxTitles[image];

  lightboxContainer.setAttribute("class", "active");
  // append previous and next data to the controls
  prev.setAttribute("data-prev", parseInt(image)-1);
  // TODO: Don't let next increment on last image
  next.setAttribute("data-next",parseInt(image)+1);
  document.getElementById('lightbox-image_container').innerHTML = theImage;
  document.getElementById('lightbox-image_title').innerHTML = theTitle;
};

// Lightbox navigation controls
dismiss.onclick = function(event) {
  event.preventDefault();
  lightboxContainer.setAttribute("class", "inactive");
};
prev.onclick = function(event) {
  event.preventDefault();
  var prevImg = this.getAttribute("data-prev");
  if(prevImg >= 0) {
    // TODO: hide prev control if first image
    lightbox(prevImg);
  }
};
next.onclick = function(event) {
  event.preventDefault();
  var nextImg = this.getAttribute("data-next");
  // TODO: hide next control if last image, also prevent slideshow from advancing
  lightbox(nextImg);
};

// prev and next functionality so it works with the arrow keys
document.onkeydown = function (event) { 
  if (event.keyCode == '37'){
    event.preventDefault(); 
    var prevImg = prev.getAttribute("data-prev"); 
    if(prevImg >= 0) {
      // TODO: hide prev control if first image
      lightbox(prevImg);
    }
  } else if (event.keyCode == '39') {
    event.preventDefault(); 
    var nextImg = next.getAttribute("data-next"); 
    lightbox(nextImg); 
  }
};


var apiURL = 'https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos&format=json&nojsoncallback=1&gallery_id=72157693718156901&api_key=a533c62811bedefecdcb6e47aba7ffe2';

window.onload = function() {
  getPhotos(apiURL);
}