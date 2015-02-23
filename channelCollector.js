var cheerio = require('cheerio');
var request = require('request');


function process() {
    var url = 'http://movie.daum.net/tv/guide/ranking/programRanking.do?type=3&page=1';
    request(url, function(error, response, html) {
      if (error) {
        throw error
      };
      // console.log(html);
      var $ = cheerio.load(html);

      $('#popularProgram tbody tr').each(function(idx) {
        var $tr = $(this);
        var $thumbnailImg = $tr.find('img.poster');
        if ($thumbnailImg.length > 0) {
          var thumbnailImgUrl = $thumbnailImg.attr('src').replace('C38x55', 'C198x288');
          var title = $thumbnailImg.attr('alt');
          console.log(title);
          var castName = $tr.find('td.td3 span.cast').text();
          console.log(castName);
          var roomInfo = {
            id: idx,
            thumbnailImgUrl: thumbnailImgUrl,
            title: title,
            castName: castName
          };
          insertRoomInfo(roomInfo);
        }

      })
    });

  }
  // var SECRET_KEY = 'aN6e5tYi9pxsgYaF7relprBvdTxutjT35pGQz7BR';
  // var urls = ['http://movie.daum.net/tv/guide/ranking/programRanking.do?type=3&page=1'];


function insertRoomInfo(roomInfo) {
  var options = {
    uri: 'https://sizzling-heat-271.firebaseio.com/rooms.json',
    method: 'POST',
    json: roomInfo
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body.id) // Print the shortened url.
    }
  });
}

function deleteRoomInfo() {
  var options = {
    uri: 'https://sizzling-heat-271.firebaseio.com/rooms.json',
    method: 'DELETE'
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body.id) // Print the shortened url.
    }
  });
}
// deleteRoomInfo();
process();
// console.log('test replace'.replace('test','text'));
// deleteRoomInfo();
