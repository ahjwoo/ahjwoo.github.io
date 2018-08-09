const API_KEY = 'a533c62811bedefecdcb6e47aba7ffe2';


function getPhotos(path, callback) {
  var flickrReq = new XMLHttpRequest();
  flickrReq.onreadystatechange = function() {
    if (flickrReq.readyState === 4 && flickrReq.status === 200) {
      var data = JSON.parse(flickrReq.responseText);
      if (callback) callback(data);
      var photos = data['photos'].photo;

      for(i = 0; i < photos.length; i++) {
        loadThumbnails(photos, i);
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

var apiURL = 'https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos&format=json&nojsoncallback=1&gallery_id=72157693718156901&api_key=a533c62811bedefecdcb6e47aba7ffe2';

window.onload = function() {
  getPhotos(apiURL);
}