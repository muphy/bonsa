var Promise = require("bluebird");
var util = require('util');
var needle = require('needle');
var _ = require('underscore');
var fs = require('fs');
var Firebase = require("firebase");

function today() {
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
    return year + mm + dd;
    // this.hour = today.getHours()-10;
}

function URLs() {
    var PROGRAME_BASE_URL = 'http://tvguide.naver.com/program/multiChannel.nhn?';
    var urlFormatterList = [PROGRAME_BASE_URL + 'broadcastType=100&date=%s&hour=%s', PROGRAME_BASE_URL + 'broadcastType=500&channelGroup=46&date=%s'];
    var URLs = _.map(urlFormatterList, function(urlFormat) {
        return util.format(urlFormat, today());
    });
    return URLs;
}

function process() {
    Promise.promisifyAll(needle);
    var current = Promise.resolve();
    var options = {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36",
        }
    };
    Promise.map(URLs(), function(URL) {
        console.log(URL);
        current = current.then(function() {
            return needle.getAsync(URL, options);
        });
        return current;
    }).map(function(responseAndBody) {
        var b = responseAndBody[1].match(/PROGRAM_SCHEDULES=[\s\S]*?;/gm);
        var strSchedule = b[0].replace('PROGRAM_SCHEDULES=', '').replace(';', '');
        var result = JSON.parse(strSchedule);
        return result;
    }).then(function(results) {
        var myChannelList = _.values(results);
        var myProgramList = [];

        _.each(myChannelList, function(channel, i) {
            var channelList = channel.channelList;
            _.each(channelList, function(channel) {
                var channelInfo = {
                    broadcastName: channel.broadcastName,
                    channelName: channel.channelName
                };
                var programList = channel.programList;
                _.each(programList, function(program) {
                    var program = convertProgramDate(program);
                    program = _.extend(channelInfo, program);
                    myProgramList.push(program);
                });
            });

        });
        // console.log(myChannelList);
        fs.writeFile("result.json", JSON.stringify(myProgramList), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        return myProgramList;
    }).then(function(results) {
        // console.log(results);
        //TODO 
        console.log('All Needle requests saved');
    }).catch(function(e) {
        console.log(e);
    });
}
process();
module.exports.process = function() {
    process();
}

function writeFile() {
    fs.writeFile("./" + i + ".json", result, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}
module.exports.getFireBaseToken = function() {
    function getToken() {
        var AUTH_TOKEN = 'aN6e5tYi9pxsgYaF7relprBvdTxutjT35pGQz7BR';
        var FirebaseTokenGenerator = require("firebase-token-generator");
        var tokenGenerator = new FirebaseTokenGenerator(AUTH_TOKEN);
        var token = tokenGenerator.createToken({
            uid: "1204",
            role: "admin"
        }, {
            admin: true
        });
        return token;
    }

    // var token = getToken();
    // var ref = new Firebase("https://sizzling-heat-271.firebaseio.com/");
    // ref.authWithCustomToken(token, function(error, authData) {
    //     if (error) {
    //         console.log("Login Failed!", error);
    //     } else {
    //         console.log("Login Succeeded!", authData);
    //     }
    // });
};

var convertProgramDate = function(program) {
    var beginTime = util.format('%s %s', program.beginDate, program.beginTime);
    var endTime = util.format('%s %s', program.beginDate, program.endTime);
    beginTime = Date.parse(beginTime);
    endTime = Date.parse(endTime);
    // console.log(endTime);
    if (beginTime > endTime) {
        endTime = endTime + 1000 * 60 * 60 * 24;
    }
    program.beginTime = beginTime;
    program.endTime = endTime;
    return program;
};
module.exports.convertProgramDate = convertProgramDate;
