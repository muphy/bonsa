var Promise = require("bluebird");
var util = require('util');
var needle = require('needle');
var _ = require('underscore');
var fs = require('fs');

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
    this.hour = today.getHours() + 1;
}

function URLs() {
    var PROGRAME_BASE_URL = 'http://tvguide.naver.com/program/multiChannel.nhn?';
    var urlFormatterList = [PROGRAME_BASE_URL + 'broadcastType=100&date=%s&hour=%s', PROGRAME_BASE_URL + 'broadcastType=500&channelGroup=46&date=%s&hour=%s'];
    var URLs = _.map(urlFormatterList, function(urlFormat) {
        var today = new Today();
        return util.format(urlFormat, today.date, today.hour);
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
        // console.log(b);
        var strSchedule = b[0].replace('PROGRAM_SCHEDULES=', '').replace(';', '');
        // console.log(strSchedule);
        var result = JSON.parse(strSchedule);
        return strSchedule;
    }).then(function(results) {
        _.each(results, function(result) {
            var channelList = result.channelList
            fs.writeFile("./" + i + ".json", result, function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        });

    }).then(function() {
        console.log('All Needle requests saved');
    }).catch(function(e) {
        console.log(e);
    });
}

module.exports.convertProgramDate = function(program) {
    var beginTime = util.format('%s %s', program.beginDate, program.beginTime);
    var endTime = util.format('%s %s', program.beginDate, program.endTime);
    beginTime = Date.parse(beginTime);
    endTime = Date.parse(endTime);
    if (beginTime > endTime) {
        endTime = endTime + 1000 * 60 * 60 * 24;
    }
    var convertedBeginDate = new Date(beginTime);
    var convertedEndDate = new Date(endTime);
    program.beginTime = convertedBeginDate;
    program.endTime = convertedEndDate;
	console.log(program);
	return program;
}
