var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var util = require('util');
var async = require('async');

function Today() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var year = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    this.date = year + mm + dd;
    this.hour = today.getHours();
}
var FetchProgramInfo = {
    requestJSON: function(urlFormatter) {
        var today = new Today();
        var url = util.format(urlFormatter, today.date, today.hour);
        // console.log(url);
        var options = {
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36",
            }
        };
        var self = this;
        request(options, function(error, response, html) {
            if (error) {
                throw error;
            }
            var b = html.match(/PROGRAM_SCHEDULES=[\s\S]*?;/gm);
            // console.log(b);
            var strSchedule = b[0].replace('PROGRAM_SCHEDULES=', '').replace(';', '');
            var programJSONInfo = JSON.parse(strSchedule);
            self.requestResponseCallBack(strSchedule);
            // console.log(programJSONInfo);
            // return programJSONInfo;
        });
    },
    requestResponseCallBack: function(result) {

    }
};
function writeToFile(data) {
    console.log(data);
    fs.writeFile("./sample.json", data, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}
var urlFormatterList = ['http://tvguide.naver.com/program/multiChannel.nhn?broadcastType=100&date=%s&hour=%s', 'http://tvguide.naver.com/program/multiChannel.nhn?broadcastType=500&channelGroup=46&date=%s&hour=%s'];
FetchProgramInfo.requestResponseCallBack = function(result) {
    // console.log(result);
    writeToFile(result);
};
FetchProgramInfo.requestJSON(urlFormatterList[0]);


// async.waterfall([
//     function(callback) {
//         var result = FetchProgramInfo.requestJSON(urlFormatterList[0]);
//         console.log(result);
//         callback(null, result);
//     },
//     function(result,callback) {
//         console.log(result);
//         // console.log(b);
//         // writeToFile(result);
//         // callback(null, 'end');
//     }
// ], function(err,results) {

// });
// var fetchProgramInfo = new FetchProgramInfo();
// var result = FetchProgramInfo.requestJSON(urlFormatterList[0]);
// writeToFile(result);
// function process() {
//     var today = new Today();
//     var jisanpaUrl = util.format('http://tvguide.naver.com/program/multiChannel.nhn?broadcastType=100&date=%s&hour=%s', today.date, today.hour);
//     var jongpyunUrl = util.format('http://tvguide.naver.com/program/multiChannel.nhn?broadcastType=500&channelGroup=46&date=%s&hour=%s', today.date, today.hour);

//     var options = {
//         url: 'http://tvguide.naver.com',
//         headers: {
//             "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36",
//         }
//     };
//     request(options, function(error, response, html) {
//         if (error) {
//             throw error;
//         }
//         var b = html.match(/PROGRAM_SCHEDULES=[\s\S]*?;/gm);
//         var strSchedule = b[0].replace('PROGRAM_SCHEDULES=', '').replace(';', '');
//         var schedule = JSON.parse(strSchedule);
//         fs.writeFile("./sample.json", strSchedule, function(err) {
//             if (err) {
//                 return console.log(err);
//             }

//             console.log("The file was saved!");
//         });
//     });

// }



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
    // process();
