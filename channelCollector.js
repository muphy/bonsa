var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

function process() {
        var options = {
            url: 'http://tvguide.naver.com',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36",
                //"Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
            }
        };
        request(options, function(error, response, html) {
            if (error) {
                throw error
            };
            //console.log(html);
            var b = html.match(/PROGRAM_SCHEDULES=[\s\S]*?;/gm);
            var strSchedule = b[0].replace('PROGRAM_SCHEDULES=','').replace(';','');
            console.log(strSchedule);
            var schedule = JSON.parse(strSchedule);
            console.log(schedule.channelList.length);
            fs.writeFile("./tmp.txt", strSchedule, function(err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
            //var PROGRAM_SCHEDULES = JSON.parse(b[1]);
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
